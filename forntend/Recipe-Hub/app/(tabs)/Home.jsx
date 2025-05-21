import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
  Keyboard,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  Avatar,
  Card,
  IconButton,
  Menu,
  Icon,
  Dialog,
  Button,
  Portal,
} from "react-native-paper";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return "ثواني";
  if (diff < 3600) return `${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} يوم`;
  return date.toLocaleDateString("ar-EG");
}

const Home = () => {
  const bottomSheetRef = useRef(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [comments, setComments] = useState({});
  const [favorites, setFavorites] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      const { data: algorithmData } = await axios.get(
        `http://recipe-hub.runasp.net/api/Algorithm/Home?UserId=${userData.id}`
      );

      // Map recipes and users from the new response
      const recipesData = algorithmData.map((item) => {
        const recipe = item.recipe;
        const user = item.user;
        return {
          ...recipe,
          backgroundImage: recipe.backgroundImage
            ? `data:image/jpeg;base64,${recipe.backgroundImage}`
            : "https://source.unsplash.com/400x300/?food",
          author: user.userName,
          avatar: user.userImage
            ? `data:image/jpeg;base64,${user.userImage}`
            : "https://randomuser.me/api/portraits/men/1.jpg",
          userID: user.id,
          description: recipe.description,
          persons: recipe.persons,
          rate: recipe.rate,
          createdAt: recipe.createdAt,
          categories: item.categories,
          ingredients: item.ingredients,
          steps: item.steps,
          suggestions: item.suggestions,
          commenters: item.commenters,
        };
      });

      // Map users for quick access
      const usersMap = {};
      algorithmData.forEach((item) => {
        usersMap[item.user.id] = item.user;
      });

      // Map comments by recipe
      const commentsByRecipe = {};
      algorithmData.forEach((item) => {
        const recipeId = item.recipe.id.toString();
        commentsByRecipe[recipeId] = (item.commenters || []).map((c) => ({
          id: c.comment.id.toString(),
          text: c.comment.description,
          timestamp: getRelativeTime(c.comment.createdAt), // <-- update here
          user: {
            userName: c.user.userName,
            userImage: c.user.userImage
              ? `data:image/jpeg;base64,${c.user.userImage}`
              : "https://randomuser.me/api/portraits/men/1.jpg",
          },
        }));
      });

      setRecipes(recipesData);
      setUsers(usersMap);
      setComments(commentsByRecipe);
      setLastUpdated(new Date());

      setLikesCount(
        recipesData.reduce((acc, recipe) => {
          acc[recipe.id] = recipe.rate || 0;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    fetchData();
  }, []);

  const handleCommentPress = async (recipeId) => {
    try {
      setSelectedRecipeId(recipeId);

      if (!comments[recipeId]) {
        const response = await axios.get(
          `http://recipe-hub.runasp.net/api/Comments/GetById/${recipeId}`
        );
        const commentsData = await Promise.all(
          response.data.map(async (comment) => {
            let user = comment.user;
            if (!user && comment.userID) {
              try {
                const userResponse = await axios.get(
                  `http://recipe-hub.runasp.net/api/users/GetById/${comment.userID}`
                );
                user = userResponse.data;
              } catch (error) {
                console.error("Error fetching user for comment:", error);
                user = {
                  userName: "مستخدم مجهول",
                  userImage: "https://randomuser.me/api/portraits/men/1.jpg",
                };
              }
            }

            return {
              id: comment.id.toString(),
              text: comment.description,
              timestamp: getRelativeTime(comment.createdAt), // <-- update here
              user: user || {
                userName: "مستخدم مجهول",
                userImage: "https://randomuser.me/api/portraits/men/1.jpg",
              },
            };
          })
        );

        setComments((prev) => ({
          ...prev,
          [recipeId]: commentsData,
        }));
      }

      bottomSheetRef.current?.expand();
    } catch (error) {
      console.error(
        "Error fetching comments:",
        error.response?.data || error.message
      );
    }
  };

  const handleSendComment = async (commentText) => {
    if (commentText.trim() && selectedRecipeId) {
      try {
        const userData = JSON.parse(await AsyncStorage.getItem("userData"));

        const response = await axios.post(
          "http://recipe-hub.runasp.net/api/Comments/Add",
          {
            recipeID: parseInt(selectedRecipeId),
            userID: userData.id,
            description: commentText,
            rate: 0,
          }
        );

        if (response.status === 200) {
          const newComment = {
            id: Date.now().toString(),
            text: commentText,
            timestamp: getRelativeTime(new Date()), // <-- update here
            user: {
              id: userData.id,
              userName: userData.userName,
              userImage: userData.userImage,
            },
          };

          setComments((prev) => ({
            ...prev,
            [selectedRecipeId]: [...(prev[selectedRecipeId] || []), newComment],
          }));
        }
      } catch (error) {
        console.error(
          "Error posting comment:",
          error.response?.data || error.message
        );
      }
    }
  };

  const toggleFavorite = async (recipeId) => {
    setFavorites((prevFavorites) => {
      const isLiked = prevFavorites[recipeId] === "heart";
      const newIcon = isLiked ? "heart-outline" : "heart";

      setLikesCount((prevLikes) => ({
        ...prevLikes,
        [recipeId]: prevLikes[recipeId] + (isLiked ? -1 : 1),
      }));

      return {
        ...prevFavorites,
        [recipeId]: newIcon,
      };
    });

    try {
      const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      await axios.put("http://recipe-hub.runasp.net/api/Recipes/UpdateRate", {
        userid: userData.id,
        subjectid: recipeId,
      });
    } catch (error) {
      console.error("Failed to update recipe rate", error);
    }
  };

  const renderRecipeCard = ({ item }) => {
    const user = users[item.userID] || {};

    const recipeItem = {
      id: item.id.toString(),
      author: user.userName || "مستخدم مجهول",
      avatar: user.userImage || "https://randomuser.me/api/portraits/men/1.jpg",
      image: item.backgroundImage,
      title: item.title,
      description: item.description,
      time: formatTime(item.createdAt),
      initialLikes: item.rate || 0,
      serves: item.persons,
      difficulty: "متوسط",
      ...item,
    };

    return (
      <RecipeCard
        item={{ ...recipeItem, lastUpdated }}
        onCommentPress={() => handleCommentPress(item.id)}
        onFavoritePress={() => toggleFavorite(item.id)}
        isFavorite={favorites[item.id] === "heart"}
        likesCount={likesCount[item.id] || 0}
        commentsCount={comments[item.id]?.length || 0}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipeCard}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B6B"]}
            tintColor="#FF6B6B"
          />
        }
        ListHeaderComponent={
          <Text style={styles.lastUpdateText}>
            آخر تحديث: {lastUpdated.toLocaleTimeString()}
          </Text>
        }
      />
      <Comment
        bottomSheetRef={bottomSheetRef}
        selectedRecipeId={selectedRecipeId}
        comments={comments[selectedRecipeId] || []}
        onSendComment={handleSendComment}
      />
    </GestureHandlerRootView>
  );
};

function formatTime(recipe) {
  const dateString = recipe.createdAt || recipe.updatedAt;
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffMinutes < 60) return `${diffMinutes} دقيقة مضت`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} ساعة مضت`;
  return `${Math.floor(diffMinutes / 1440)} يوم مضى`;
}

const RecipeCard = ({
  item,
  onCommentPress,
  onFavoritePress,
  isFavorite,
  likesCount,
  commentsCount,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleReport = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("userData"));
      await axios.post("http://recipe-hub.runasp.net/api/users/AddReport", {
        id: 0,
        fromUserID: userData.id,
        atUserID: item.userID,
        type: "recipe",
        description: `الإبلاغ عن وصفة: ${item.title}`,
        solved: false,
      });
      setShowDialog(false);
      setMenuVisible(false);
      Alert.alert("تم الإبلاغ", "تم إرسال الإبلاغ بنجاح.");
    } catch (error) {
      setShowDialog(false);
      setMenuVisible(false);
      Alert.alert("خطأ", "حدث خطأ أثناء إرسال الإبلاغ.");
      console.error("Report error:", error);
    }
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity
        onPress={async () => {
          try {
            await axios.put(
              `http://recipe-hub.runasp.net/api/Recipes/UpdateView/${item.id}`
            );
          } catch (e) {
            console.error("Failed to update view count", e);
          }
          router.replace(`/Components/Recipe/RecipeDetails?id=${item.id}`);
        }}
        activeOpacity={0.93}
      >
        <View style={styles.imageContainer}>
          <Card.Cover
            source={{
              uri: imageError
                ? "https://source.unsplash.com/400x300/?food"
                : item.image,
            }}
            style={styles.coverImage}
            onError={() => setImageError(true)}
          />
          {/* Remove overlayTop user info here */}
        </View>
      </TouchableOpacity>

      <Card.Content style={styles.recipeContent}>
        <View style={styles.titleRow}>
          <Text style={styles.recipeTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.userInfoRow}>
            <Text style={styles.authorNameSmall}>{item.author}</Text>
            <Avatar.Image
              size={28}
              source={{ uri: item.avatar }}
              style={styles.avatarSmall}
            />
          </View>
        </View>
        <Text style={styles.recipeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.recipeMetaRow}>
          <View style={styles.metaItem}>
            <IconButton icon="account-group" size={18} color="#6B5B95" />
            <Text style={styles.metaText}>{item.persons} أشخاص</Text>
          </View>
          <View style={styles.metaItem}>
            <IconButton icon="eye" size={18} color="#6B5B95" />
            <Text style={styles.metaText}>{item.view || 0}</Text>
          </View>
        </View>
      </Card.Content>

      <Card.Actions style={styles.actionsRow}>
        <View style={styles.actionContainer}>
          <IconButton
            icon={isFavorite ? "heart" : "heart-outline"}
            iconColor="#FF6B6B"
            onPress={onFavoritePress}
          />
          <Text style={styles.countText}>{likesCount}</Text>
        </View>
        <View style={styles.actionContainer}>
          <IconButton icon="comment-outline" onPress={onCommentPress} />
          <Text style={styles.countText}>{commentsCount}</Text>
        </View>
        <View style={styles.actionContainer}>
          <IconButton
            icon="dots-vertical"
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
                style={{ opacity: 0 }}
              />
            }
            anchorPosition="bottom"
            contentStyle={styles.menuContent}
          >
            <Menu.Item
              leadingIcon={() => <Icon source="flag" color="red" size={24} />}
              titleStyle={styles.menuItemText}
              onPress={() => {
                setMenuVisible(false);
                setShowDialog(true);
              }}
              title="الإبلاغ"
            />
          </Menu>
        </View>
      </Card.Actions>

      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
          style={styles.dialogContainer}
        >
          <View style={styles.dialogContent}>
            <Dialog.Title>تأكيد الإبلاغ</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText}>
                هل أنت متأكد أنك تريد الإبلاغ عن هذه الوصفة؟
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                mode="outlined"
                onPress={() => setShowDialog(false)}
                style={styles.cancelButton}
              >
                إلغاء
              </Button>
              <Button
                mode="contained"
                onPress={handleReport}
                style={styles.confirmButton}
                labelStyle={styles.buttonLabel}
              >
                تأكيد
              </Button>
            </Dialog.Actions>
          </View>
        </Dialog>
      </Portal>
    </Card>
  );
};

const Comment = ({
  bottomSheetRef,
  selectedRecipeId,
  comments,
  onSendComment,
}) => {
  const [comment, setComment] = useState("");

  const handleSheetChanges = (index) => {
    if (index === -1) {
      Keyboard.dismiss();
    }
  };

  const handleSend = () => {
    if (comment.trim()) {
      onSendComment(comment);
      setComment("");
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["50%", "70%"]}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      onChange={handleSheetChanges}
      backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
    >
      <BottomSheetView style={styles.commentSheetContainer}>
        <Text style={styles.commentSheetTitle}>التعليقات</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="اكتب تعليقك..."
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
              maxLength={500}
              minHeight={48}
              maxHeight={120}
              placeholderTextColor="#B0B0B0"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: comment.trim() ? "#6B5B95" : "#ccc" },
              ]}
              onPress={handleSend}
              disabled={!comment.trim()}
            >
              <IconButton icon="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.commentsScroll}>
            {comments.length === 0 && (
              <Text style={styles.noCommentsText}>لا توجد تعليقات بعد</Text>
            )}
            {comments.map((item) => (
              <View key={item.id} style={styles.commentBubbleNew}>
                <Image
                  source={{
                    uri:
                      item.user?.userImage ||
                      "https://randomuser.me/api/portraits/men/1.jpg",
                  }}
                  style={styles.commentAvatarNew}
                  onError={() => console.log("Error loading avatar")}
                />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeaderRow}>
                    <Text style={styles.commentAuthorNew}>
                      {item.user?.userName || "مستخدم مجهول"}
                    </Text>
                    <Text style={styles.commentTimestampNew}>
                      {item.timestamp}
                    </Text>
                  </View>
                  <Text style={styles.commentTextNew}>{item.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: 10,
    borderRadius: 18,
    elevation: 4,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#6B5B95",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    resizeMode: "cover",
  },
  overlayTop: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    elevation: 2,
  },
  avatar: {
    marginRight: 8,
    backgroundColor: "#fff",
  },
  authorInfo: {
    flexDirection: "column",
    justifyContent: "center",
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#6B5B95",
  },
  recipeTime: {
    fontSize: 11,
    color: "#888",
  },
  recipeContent: {
    paddingTop: 10,
    paddingBottom: 0,
    paddingHorizontal: 4,
  },
  recipeTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#FF6B6B",
    textAlign: "right",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "right",
    marginBottom: 8,
  },
  recipeMetaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  metaText: {
    fontSize: 13,
    color: "#6B5B95",
    marginLeft: 2,
  },
  actionsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 4,
    paddingTop: 0,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },
  countText: {
    fontSize: 15,
    marginLeft: 2,
    color: "#666",
  },
  lastUpdateText: {
    textAlign: "center",
    color: "#666",
    paddingVertical: 8,
    fontSize: 12,
  },
  updateTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    textAlign: "right",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 80,
    maxHeight: 150,
    textAlign: "right",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
    resizeMode: "cover",
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 14,
  },
  commentText: {
    fontSize: 15,
    color: "#333",
    textAlign: "right",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    textAlign: "left",
  },
  noCommentsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  menuContainer: {
    position: "relative",
    zIndex: 9999,
  },
  menuButton: {
    margin: 0,
    padding: 0,
  },
  menuContent: {
    marginLeft: 0,
    marginTop: 0,
  },
  menuItemText: {
    color: "red",
    marginLeft: 8,
    position: "relative",
    top: 2,
  },
  dialogContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "90%",
  },
  dialogText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "right",
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cancelButton: {
    borderColor: "#999",
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#ff4444",
  },
  buttonLabel: {
    color: "white",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
    gap: 8,
  },
  userInfoRow: {
    flexDirection: "row-reverse", // avatar left, name right (RTL)
    alignItems: "center",
    gap: 4,
    marginLeft: 8,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    marginLeft: 4,
    backgroundColor: "#fff",
  },
  authorNameSmall: {
    fontSize: 13,
    color: "#6B5B95",
    fontWeight: "bold",
    maxWidth: 80,
    marginLeft: 4,
    textAlign: "left",
  },
  commentSheetContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  commentSheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6B5B95",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 18,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 18,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    textAlign: "right",
    minHeight: 48,
    maxHeight: 120,
  },
  sendButton: {
    borderRadius: 18,
    padding: 8,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  commentsScroll: {
    flex: 1,
    marginTop: 4,
  },
  commentBubbleNew: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    backgroundColor: "#f3e6fa",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#6B5B95",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  commentAvatarNew: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  commentContent: {
    flex: 1,
  },
  commentHeaderRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  commentAuthorNew: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#6B5B95",
    marginLeft: 8,
  },
  commentTimestampNew: {
    fontSize: 12,
    color: "#aaa",
    marginRight: 8,
  },
  commentTextNew: {
    fontSize: 15,
    color: "#333",
    textAlign: "right",
    marginTop: 2,
  },
});

export default Home;
