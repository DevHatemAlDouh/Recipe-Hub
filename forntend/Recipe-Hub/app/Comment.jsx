import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Comment = () => {
  const bottomSheetRef = useRef(null);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);

  // Callback for handling sheet changes
  const handleSheetChanges = useCallback((index) => {
    console.log('Sheet index:', index); // Debugging purposes
    if (index === -1) {
      console.log('Sheet closed');
    }
  }, []);

  // Open the BottomSheet
  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  // Send a new comment
  const handleSendComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(),
        text: comment,
        timestamp: new Date().toLocaleString(),
      };
      console.log('New Comment:', newComment);
      setCommentsList((prevComments) => [...prevComments, newComment]);
      setComment('');
    }
  };

  // Custom handle component for better UX
  const renderHandle = useCallback(() => (
    <View style={styles.handleContainer}>
      <View style={styles.handleBar} />
    </View>
  ), []);

  // Gesture handler for simultaneous gestures
  const flatListRef = useRef(null);

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
        index={-1} // Start closed
        snapPoints={['40%', '70%', '90%']} // Flexible snap points
        onChange={handleSheetChanges}
        enablePanDownToClose={true} // Enable closing with one finger swipe down
        handleComponent={renderHandle} // Add a custom handle bar
        gestureHandlerProps={{
          simultaneousHandlers: flatListRef, // Allow simultaneous gestures with FlatList
        }}
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
            <FlatList
              ref={flatListRef} // Reference to FlatList for simultaneous gestures
              data={commentsList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.flatListContent}
              renderItem={({ item }) => (
                <View style={styles.commentBubble}>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.noCommentsText}>لا توجد تعليقات</Text>}
            />
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
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
  noCommentsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
  },
});

export default Comment;