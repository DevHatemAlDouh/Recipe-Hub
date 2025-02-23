import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Avatar, Card, IconButton } from "react-native-paper";

// بيانات الوصفات
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

// المكون الرئيسي
const Home = () => {
  const bottomSheetRef = useRef(null); // مرجع الـ BottomSheet هنا
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); // تخزين معرف الوصفة المختارة
  const [comments, setComments] = useState({}); // تخزين التعليقات لكل وصفة

  // فتح BottomSheet وتحديد الوصفة المختارة
  const handleCommentPress = (recipeId) => {
    setSelectedRecipeId(recipeId); // تحديد الوصفة المختارة
    bottomSheetRef.current?.expand(); // فتح BottomSheet
  };

  // إضافة تعليق جديد للوصفة المختارة
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

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* قائمة الوصفات */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard item={item} onCommentPress={() => handleCommentPress(item.id)} />
        )}
      />

      {/* مكون التعليقات */}
      <Comment
        bottomSheetRef={bottomSheetRef}
        selectedRecipeId={selectedRecipeId}
        comments={comments[selectedRecipeId] || []}
        onSendComment={handleSendComment}
      />
    </GestureHandlerRootView>
  );
};

// مكون بطاقة الوصفة
const RecipeCard = ({ item, onCommentPress }) => {
  return (
    <Card style={{ margin: 10 }}>
      <Card.Title
        title={item.author}
        subtitle={item.time}
        left={(props) => <Avatar.Image {...props} source={{ uri: item.avatar }} />}
        right={(props) => <IconButton {...props} icon="dots-vertical" />}
      />
      <Card.Cover source={{ uri: item.image }} />
      <Card.Content>
        <Text variant="titleMedium">{item.title}</Text>
        <Text variant="bodyMedium">{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        <IconButton icon="heart-outline" />
        <IconButton icon="comment-outline" onPress={onCommentPress} />
      </Card.Actions>
    </Card>
  );
};

// مكون التعليقات
const Comment = ({ bottomSheetRef, selectedRecipeId, comments, onSendComment }) => {
  const [comment, setComment] = useState("");

  // إضافة تعليق جديد
  const handleSend = () => {
    onSendComment(comment);
    setComment("");
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // البداية من الأسفل
      snapPoints={["50%", "60%"]} // نقاط التوقف: النصف السفلي وما فوقه قليلاً
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
    >
      <BottomSheetView style={styles.contentContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          {/* حقل الإدخال وزر الإرسال */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="اكتب تعليقك هنا..."
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

          {/* عرض التعليقات */}
          <ScrollView style={styles.scrollView}>
            {comments.map((item) => (
              <View key={item.id} style={styles.commentBubble}>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            ))}
            {comments.length === 0 && (
              <Text style={styles.noCommentsText}>لا توجد تعليقات</Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
};

// الأنماط
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