import React, { useRef, useState, useCallback } from "react";
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
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Avatar, Card, IconButton, Menu, Icon, Dialog, Button, Portal } from "react-native-paper";
import { router } from "expo-router";

const recipes = [
  {
    id: "1",
    author: "Ahmed Ali",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    image: "https://source.unsplash.com/400x300/?pasta",
    title: "Pasta",
    description: "Pasta with tomato sauce",
    time: "30 minutes ago",
    initialLikes: 15,
  },
  {
    id: "2",
    author: "Hassen Sabri",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    image: "https://source.unsplash.com/400x300/?pastries",
    title: "Pastries",
    description: "Cheesecake recipe",
    time: "30 minutes ago",
    initialLikes: 8,
  },
];

const Home = () => {
  const bottomSheetRef = useRef(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [comments, setComments] = useState({});
  const [favorites, setFavorites] = useState({});
  const [likesCount, setLikesCount] = useState(
    recipes.reduce((acc, recipe) => {
      acc[recipe.id] = recipe.initialLikes;
      return acc;
    }, {})
  );
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleCommentPress = (recipeId) => {
    setSelectedRecipeId(recipeId);
    bottomSheetRef.current?.expand();
  };

  const handleSendComment = (commentText) => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now().toString(),
        text: commentText,
        timestamp: new Date().toLocaleString(),
      };
      setComments((prevComments) => ({
        ...prevComments,
        [selectedRecipeId]: [...(prevComments[selectedRecipeId] || []), newComment],
      }));
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            item={{...item, lastUpdated}}
            onCommentPress={() => handleCommentPress(item.id)}
            onFavoritePress={() => toggleFavorite(item.id)}
            isFavorite={favorites[item.id] === "heart"}
            likesCount={likesCount[item.id] || 0}
            commentsCount={comments[item.id]?.length || 0}
          />
        )}
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
            Last updated: {lastUpdated.toLocaleTimeString()}
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

const RecipeCard = ({ item, onCommentPress, onFavoritePress, isFavorite, likesCount, commentsCount }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

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
                title="Report"
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
            <Dialog.Title>Confirm Report</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText}>
                Are you sure you want to report this recipe?
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button
                mode="outlined"
                onPress={() => setShowDialog(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleReport}
                style={styles.confirmButton}
                labelStyle={styles.buttonLabel}
              >
                Confirm
              </Button>
            </Dialog.Actions>
          </View>
        </Dialog>
      </Portal>

      <TouchableOpacity onPress={() => router.push(`/RecipeDetails?recipe=${encodeURIComponent(JSON.stringify(item))}`)}>
        <Card.Cover source={{ uri: item.image }} style={styles.coverImage} />
      </TouchableOpacity>

      <Card.Content>
        <Text variant="titleMedium">{item.title}</Text>
        <Text variant="bodyMedium">{item.description}</Text>
        <Text style={styles.updateTime}>
          Updated: {item.lastUpdated.toLocaleTimeString()}
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
              placeholder="Write your comment..."
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
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            ))}
            {comments.length === 0 && (
              <Text style={styles.noCommentsText}>No comments yet</Text>
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
  card: {
    margin: 10,
    position: 'relative',
    overflow: 'visible',
  },
  coverImage: {
    height: 200,
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
    backgroundColor: "#e3e3e3",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  noCommentsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
});

export default Home;