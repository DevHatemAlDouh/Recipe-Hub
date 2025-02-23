import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {IconButton } from "react-native-paper";

const Comment = () => {
  const bottomSheetRef = useRef(null);
  const [comment, setComment] = useState('');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); // تعقب حالة الـ BottomSheet

  // بيانات محلية (Mock Data)
  const initialComments = [
    { id: '1', text: 'تعليق تجريبي 1', timestamp: '2023-10-01 10:00 AM' },
    { id: '2', text: 'تعليق تجريبي 2', timestamp: '2023-10-01 10:05 AM' },
  ];

  const [commentsList, setCommentsList] = useState(initialComments);

  // إضافة تعليق جديد
  const handleSendComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(),
        text: comment,
        timestamp: new Date().toLocaleString(),
      };
      setCommentsList((prevComments) => [...prevComments, newComment]);
      setComment('');
    }
  };

  // تتبع حالة الـ BottomSheet
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setIsBottomSheetOpen(false); // BottomSheet مغلق
    } else {
      setIsBottomSheetOpen(true); // BottomSheet مفتوح
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* أيقونة التعليقات */}
      {!isBottomSheetOpen && ( // إظهار الأيقونة فقط إذا كان الـ BottomSheet مغلقًا
        <IconButton name="comment" size={30} color="#007AFF" onPress={() => bottomSheetRef.current?.expand()}/>
        // <TouchableOpacity style={styles.commentsButton} >
        //   <Icon name="comment" size={30} color="#007AFF" />
        //   <View style={styles.badge}>
        //     <Text style={styles.badgeText}>{commentsList.length}</Text>
        //   </View>
        // </TouchableOpacity>
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // يبدأ مغلقًا
        snapPoints={['40%', '70%', '90%']} // نقاط التوقف
        enablePanDownToClose={true} // السماح بالإغلاق بالسحب لأسفل
        enableContentPanningGesture={false} // تعطيل السحب من المحتوى الداخلي
        enableHandlePanningGesture={true} // تمكين السحب فقط من الشريط العلوي
        onChange={handleSheetChanges} // تتبع حالة الـ BottomSheet
      >
        <BottomSheetView style={styles.contentContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // تهيئة خاصة بنظام التشغيل
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // تعويض لوحة المفاتيح لنظام iOS
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
                scrollEnabled={true} // تمكين التمرير داخل الحقل
                textAlignVertical="top"
                maxLength={500}
                minHeight={80} // ارتفاع ثابت
                maxHeight={150} // ارتفاع أقصى
              />
              {/* زر الإرسال */}
              <TouchableOpacity style={styles.sendButton} onPress={handleSendComment}>
                <Icon name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* محتوى قابل للتمرير */}
            <ScrollView style={styles.scrollView}>
              {commentsList.map((item) => (
                <View key={item.id} style={styles.commentBubble}>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
              ))}
              {commentsList.length === 0 && (
                <Text style={styles.noCommentsText}>لا توجد تعليقات</Text>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

// الأنماط
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
    flexDirection: 'row', // ترتيب أفقي
    alignItems: 'flex-end', // محاذاة العناصر أسفلًا
    gap: 10, // مسافة بين الحقل والزر
    marginBottom: 20,
  },
  input: {
    flex: 1, // أخذ المساحة المتبقية
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80, // ارتفاع ثابت
    maxHeight: 150, // ارتفاع أقصى
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
  scrollView: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#e3e3e3',
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
    color: '#666',
    marginTop: 4,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});

export default Comment;