import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Alert,
  Dimensions
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from "expo-router";
import { BackHandler } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const RecipeDetails = () => {
  // نفس منطق الحالة والوظائف السابق
  const params = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  // ... نفس دوال جلب البيانات السابقة ...

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* قسم الصورة مع التدرج اللوني */}
        <View style={styles.header}>
          {recipe?.backgroundImage ? (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: `data:image/jpeg;base64,${recipe.backgroundImage}` }} 
                style={styles.recipeImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                style={styles.imageGradient}
              />
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="restaurant-outline" size={50} color="#D1D5DB" />
              <Text style={styles.placeholderText}>لا توجد صورة متاحة</Text>
            </View>
          )}
        </View>

        {/* بطاقات المعلومات */}
        <View style={styles.metaContainer}>
          <View style={[styles.metaCard, { backgroundColor: '#EF4444' }]}>
            <Ionicons name="people" size={22} color="#FFF" />
            <Text style={styles.metaValue}>{recipe?.persons || 4}</Text>
            <Text style={styles.metaLabel}>أفراد</Text>
          </View>

          <View style={[styles.metaCard, { backgroundColor: '#F59E0B' }]}>
            <Ionicons name="star" size={22} color="#FFF" />
            <Text style={styles.metaValue}>{recipe?.rate || 0}</Text>
            <Text style={styles.metaLabel}>التقييم</Text>
          </View>

          <View style={[styles.metaCard, { backgroundColor: '#10B981' }]}>
            <Ionicons name="time" size={22} color="#FFF" />
            <Text style={styles.metaValue}>30</Text>
            <Text style={styles.metaLabel}>دقيقة</Text>
          </View>
        </View>

        {/* محتوى الوصفة */}
        <View style={styles.content}>
          <Text style={styles.title}>{recipe?.title}</Text>

          {/* مؤلف الوصفة */}
          <TouchableOpacity style={styles.authorContainer}>
            <Image 
              source={{ uri: user?.userImage || 'https://randomuser.me/api/portraits/men/1.jpg' }} 
              style={styles.authorImage}
            />
            <View style={styles.authorInfo}>
              <Text style={styles.postedBy}>نشرت بواسطة</Text>
              <Text style={styles.authorName}>{user?.userName || 'مستخدم مجهول'}</Text>
            </View>
          </TouchableOpacity>

          {/* المكونات */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cart" size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>المكونات</Text>
            </View>
            {ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>{item.name}</Text>
                {item.quantity && (
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* خطوات التحضير */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>طريقة التحضير</Text>
            </View>
            {steps.sort((a, b) => a.stepNumber - b.stepNumber).map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                </View>
                <Text style={styles.stepText}>{step.description}</Text>
              </View>
            ))}
          </View>

          {/* التعليقات */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubbles" size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>التعليقات ({comments.length})</Text>
            </View>

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="اكتب تعليقك هنا..."
                placeholderTextColor="#94A3B8"
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity
                style={styles.commentButton}
                onPress={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <Image
                  source={{ uri: comment.user?.userImage || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.user?.userName}</Text>
                    <Text style={styles.commentTime}>{comment.timestamp}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* شاشة التحميل */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    paddingBottom: 40,
  },
  header: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    marginBottom: 24,
  },
  imageContainer: {
    height: 320,
    justifyContent: 'flex-end',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageGradient: {
    height: '60%',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -24,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  metaCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    width: width * 0.28,
    marginHorizontal: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  metaValue: {
    fontSize: 20,
    fontFamily: 'NotoNaskhArabic-Bold',
    color: '#FFF',
    marginVertical: 4,
  },
  metaLabel: {
    fontSize: 14,
    fontFamily: 'NotoNaskhArabic',
    color: '#FFF',
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'NotoNaskhArabic-Bold',
    color: '#1E293B',
    textAlign: 'right',
    lineHeight: 38,
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    elevation: 2,
  },
  authorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 12,
  },
  authorInfo: {
    flex: 1,
  },
  postedBy: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'NotoNaskhArabic',
  },
  authorName: {
    fontSize: 16,
    color: '#1E293B',
    fontFamily: 'NotoNaskhArabic-Bold',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'NotoNaskhArabic-Bold',
    color: '#1E293B',
    marginRight: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginHorizontal: 8,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    fontFamily: 'NotoNaskhArabic',
    textAlign: 'right',
  },
  quantityBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  quantityText: {
    color: '#3B82F6',
    fontSize: 14,
    fontFamily: 'NotoNaskhArabic-Bold',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'NotoNaskhArabic-Bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    fontFamily: 'NotoNaskhArabic',
    lineHeight: 26,
    textAlign: 'right',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    fontFamily: 'NotoNaskhArabic',
    textAlignVertical: 'top',
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  commentButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
  },
  commentCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'NotoNaskhArabic-Bold',
  },
  commentTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'NotoNaskhArabic',
  },
  commentText: {
    fontSize: 14,
    color: '#475569',
    fontFamily: 'NotoNaskhArabic',
    lineHeight: 22,
    textAlign: 'right',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#3B82F6',
    fontFamily: 'NotoNaskhArabic',
  },
});

export default RecipeDetails;