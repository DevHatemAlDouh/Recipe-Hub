import React, { useRef, useState } from "react";
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
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Avatar, Card, IconButton, Menu } from "react-native-paper";

const recipes = [
  {
    id: "1",
    author: "Ahmed Ali",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    image: "https://source.unsplash.com/400x300/?pasta",
    title: "Pasta",
    description: "Pasta with tomato sauce",
    time: "30 minutes ago",
  },
  {
    id: "2",
    author: "Hassen Sabri",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    image: "https://source.unsplash.com/400x300/?pastries",
    title: "Pastries",
    description: "Cheesecake recipe",
    time: "30 minutes ago",
  },
];

const Home = () => {
  const bottomSheetRef = useRef(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [comments, setComments] = useState({});
  const [favorites, setFavorites] = useState({});

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
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [recipeId]: prevFavorites[recipeId] === "heart" ? "heart-outline" : "heart",
    }));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            item={item}
            onCommentPress={() => handleCommentPress(item.id)}
            onFavoritePress={() => toggleFavorite(item.id)}
            isFavorite={favorites[item.id] === "heart"}
          />
        )}
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

const RecipeCard = ({ item, onCommentPress, onFavoritePress, isFavorite }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Card style={{ margin: 10 }}>
      <Card.Title
        title={item.author}
        subtitle={item.time}
        left={(props) => <Avatar.Image {...props} source={{ uri: item.avatar }} />}
        right={(props) => (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                {...props}
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              leadingIcon={() => (
                <IconButton 
                  icon="alert" 
                  iconColor="red"
                  size={24}
                  // لمنع تفاعل الزر
                />
              )} // إضافة اللون الأحمر للأيقونة
              titleStyle={{ color: 'red',margin:8 }} // إضافة اللون الأحمر للنص
              onPress={() => {
                console.log("Reported recipe:", item.id);
                setMenuVisible(false);
              }}
              title="Report"
            />
          </Menu>
        )}
      />
      <Card.Cover source={{ uri: item.image }} />
      <Card.Content>
        <Text variant="titleMedium">{item.title}</Text>
        <Text variant="bodyMedium">{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon={isFavorite ? "heart" : "heart-outline"}
          iconColor="red"
          onPress={onFavoritePress}
        />
        <IconButton icon="comment-outline" onPress={onCommentPress} />
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
});

export default Home;