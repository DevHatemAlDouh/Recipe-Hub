import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Comment = () => {
  // ref
  const bottomSheetRef = useRef(null);

  // state
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]); // قائمة التعليقات

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    if (index === 0) bottomSheetRef.current?.close();
  }, []);

  // فتح البوتن شيت
  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  // إرسال التعليق
  const handleSendComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(), // معرف فريد
        text: comment,
        timestamp: new Date().toLocaleString(), // تاريخ إرسال التعليق
      };
      setCommentsList([...commentsList, newComment]); // إضافة التعليق الجديد
      setComment(''); // مسح حقل الإدخال
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* أيقونة التعليقات مع العداد */}
      <TouchableOpacity style={styles.commentsButton} onPress={openBottomSheet}>
        <Icon name="comment" size={30} color="#007AFF" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{commentsList.length}</Text>
        </View>
      </TouchableOpacity>

      {/* البوتن شيت */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["40%", "70%", "90%"]}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendComment}
              >
                <Icon name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* قائمة التعليقات */}
            <ScrollView style={styles.commentsContainer}>
              {commentsList.map((comment) => (
                <View key={comment.id} style={styles.commentBubble}>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.timestamp}>{comment.timestamp}</Text>
                </View>
              ))}
            </ScrollView>
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  commentsButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    zIndex: 1,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  commentsContainer: {
    flex: 1,
    marginTop: 10, // مسافة بين حقل الإدخال وقائمة التعليقات
  },
  commentBubble: {
    backgroundColor: '#e3e3e3',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 50,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Comment;