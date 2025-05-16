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
  Image
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Avatar, Card, IconButton, Menu, Icon, Dialog, Button, Portal } from "react-native-paper";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      
      const [recipesResponse, commentsResponse] = await Promise.all([
        axios.get('http://recipe-hub.runasp.net/api/Recipes/GetAll'),
        axios.get('http://recipe-hub.runasp.net/api/Comments/GetAll')
      ]);

      const recipesData = recipesResponse.data.map(recipe => ({
        ...recipe,
        backgroundImage: recipe.backgroundImage 
          ? `data:image/jpeg;base64,${recipe.backgroundImage}`
          : 'https://source.unsplash.com/400x300/?food'
      }));

      const allComments = commentsResponse.data;

      const usersPromises = recipesData.map(recipe => 
        axios.get(`http://recipe-hub.runasp.net/api/users/GetById/${recipe.userID}`)
      );
      
      const usersResponses = await Promise.all(usersPromises);
      const usersMap = usersResponses.reduce((acc, response) => {
        acc[response.data.id] = response.data;
        return acc;
      }, {});

      const commentsByRecipe = {};
      for (const comment of allComments) {
        const recipeId = comment.recipeID.toString();
        if (!commentsByRecipe[recipeId]) {
          commentsByRecipe[recipeId] = [];
        }
        
        let user = comment.user;
        if (!user && comment.userID) {
          try {
            const userResponse = await axios.get(`http://recipe-hub.runasp.net/api/users/GetById/${comment.userID}`);
            user = userResponse.data;
          } catch (error) {
            console.error('Error fetching user for comment:', error);
            user = {
              id: comment.userID,
              userName: "مستخدم مجهول",
              userImage: "https://randomuser.me/api/portraits/men/1.jpg"
            };
          }
        }

        commentsByRecipe[recipeId].push({
          id: comment.id.toString(),
          text: comment.description,
          timestamp: new Date(comment.createdAt).toLocaleString(),
          user: user || {
            userName: "مستخدم مجهول",
            userImage: "https://randomuser.me/api/portraits/men/1.jpg"
          }
        });
      }

      setRecipes(recipesData);
      setUsers(usersMap);
      setComments(commentsByRecipe);
      setLastUpdated(new Date());
      
      setLikesCount(recipesData.reduce((acc, recipe) => {
        acc[recipe.id] = recipe.rate || 0;
        return acc;
      }, {}));
      
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error.message);
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
        const response = await axios.get(`http://recipe-hub.runasp.net/api/Comments/GetById/${recipeId}`);
        const commentsData = await Promise.all(response.data.map(async (comment) => {
          let user = comment.user;
          if (!user && comment.userID) {
            try {
              const userResponse = await axios.get(`http://recipe-hub.runasp.net/api/users/GetById/${comment.userID}`);
              user = userResponse.data;
            } catch (error) {
              console.error('Error fetching user for comment:', error);
              user = {
                userName: "مستخدم مجهول",
                userImage: "https://randomuser.me/api/portraits/men/1.jpg"
              };
            }
          }
          
          return {
            id: comment.id.toString(),
            text: comment.description,
            timestamp: new Date(comment.createdAt).toLocaleString(),
            user: user || {
              userName: "مستخدم مجهول",
              userImage: "https://randomuser.me/api/portraits/men/1.jpg"
            }
          };
        }));
        
        setComments(prev => ({
          ...prev,
          [recipeId]: commentsData
        }));
      }
      
      bottomSheetRef.current?.expand();
    } catch (error) {
      console.error('Error fetching comments:', error.response?.data || error.message);
    }
  };

  const handleSendComment = async (commentText) => {
    if (commentText.trim() && selectedRecipeId) {
      try {
        const userData = JSON.parse(await AsyncStorage.getItem('userData'));
        
        const response = await axios.post('http://recipe-hub.runasp.net/api/Comments/Add', {
          recipeID: parseInt(selectedRecipeId),
          userID: userData.id,
          description: commentText,
          rate: 0
        });
        
        if (response.status === 200) {
          const newComment = {
            id: Date.now().toString(),
            text: commentText,
            timestamp: new Date().toLocaleString(),
            user: {
              id: userData.id,
              userName: userData.userName,
              userImage: userData.userImage
            }
          };
          
          setComments(prev => ({
            ...prev,
            [selectedRecipeId]: [...(prev[selectedRecipeId] || []), newComment],
          }));
        }
      } catch (error) {
        console.error('Error posting comment:', error.response?.data || error.message);
      }
    }
  };

  const toggleFavorite = (recipeId) => {
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
      ...item
    };

    return (
      <RecipeCard
        item={{...recipeItem, lastUpdated}}
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
            colors={['#FF6B6B']}
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

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffMinutes < 60) return `${diffMinutes} دقيقة مضت`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} ساعة مضت`;
  return `${Math.floor(diffMinutes / 1440)} يوم مضى`;
}

const RecipeCard = ({ item, onCommentPress, onFavoritePress, isFavorite, likesCount, commentsCount }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleReport = () => {
    console.log("Reported recipe:", item.id);
    setShowDialog(false);
    setMenuVisible(false);
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={item.author}
        subtitle={item.time}
        left={(props) => <Avatar.Image {...props} source={{ uri: item.avatar }} />}
        right={(props) => (
          <View style={styles.menuContainer}>
            <IconButton
              {...props}
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
        )}
      />

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

      <TouchableOpacity onPress={() => router.push(`/RecipeDetails?id=${item.id}`)}>
        <Card.Cover 
          source={{ 
            uri: imageError 
              ? 'https://source.unsplash.com/400x300/?food' 
              : item.image 
          }} 
          style={styles.coverImage}
          onError={() => setImageError(true)}
        />
      </TouchableOpacity>

      <Card.Content>
        <Text variant="titleMedium" style={styles.recipeTitle}>{item.title}</Text>
        <Text variant="bodyMedium" style={styles.recipeDescription}>{item.description}</Text>
        <Text style={styles.updateTime}>
          تم التحديث: {item.lastUpdated.toLocaleTimeString()}
        </Text>
      </Card.Content>
      <Card.Actions>
        <View style={styles.actionContainer}>
          <IconButton
            icon={isFavorite ? "heart" : "heart-outline"}
            iconColor="red"
            onPress={onFavoritePress}
          />
          <Text style={styles.countText}>{likesCount}</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <IconButton icon="comment-outline" onPress={onCommentPress} />
          <Text style={styles.countText}>{commentsCount}</Text>
        </View>
      </Card.Actions>
    </Card>
  );
};

const Comment = ({ bottomSheetRef, selectedRecipeId, comments, onSendComment }) => {
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
      snapPoints={["50%", "60%"]}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="اكتب تعليقك..."
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
              maxLength={500}
              minHeight={80}
              maxHeight={150}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <IconButton icon="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            {comments.map((item) => (
              <View key={item.id} style={styles.commentBubble}>
                <View style={styles.commentHeader}>
                  <Image 
                    source={{ 
                      uri: item.user?.userImage || "https://randomuser.me/api/portraits/men/1.jpg" 
                    }} 
                    style={styles.commentAvatar}
                    onError={() => console.log("Error loading avatar")}
                  />
                  <Text style={styles.commentAuthor}>{item.user?.userName || "مستخدم مجهول"}</Text>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            ))}
            {comments.length === 0 && (
              <Text style={styles.noCommentsText}>لا توجد تعليقات بعد</Text>
            )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 10,
    position: 'relative',
    overflow: 'visible',
    borderRadius: 12,
    elevation: 3,
  },
  coverImage: {
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'right',
    marginBottom: 8,
  },
  menuContainer: {
    position: 'relative',
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
    color: 'red',
    marginLeft: 8,
    position: 'relative',
    top: 2,
  },
  dialogContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '90%',
  },
  dialogText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'right',
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    borderColor: '#999',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#ff4444',
  },
  buttonLabel: {
    color: 'white',
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
    textAlign: 'right',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
    resizeMode: 'cover',
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'right',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    textAlign: 'left',
  },
  noCommentsText: {
    fontSize: 16,
    color: "#888",
    textAlign: 'center',
    marginTop: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  countText: {
    fontSize: 16,
    marginLeft: 4,
    color: '#666',
  },
  lastUpdateText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 8,
    fontSize: 12,
  },
  updateTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
});

export default Home;