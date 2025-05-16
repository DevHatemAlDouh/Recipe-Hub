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
  Alert
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BackHandler } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecipeDetails = () => {
  const params = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  const fetchRecipeData = async (id) => {
    try {
      const response = await axios.get(`http://recipe-hub.runasp.net/api/Recipes/GetById/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching recipe:', err);
      throw new Error('Failed to load recipe');
    }
  };

  const fetchAdditionalData = async (id) => {
    try {
      const [ingredientsRes, stepsRes, commentsRes] = await Promise.all([
        axios.get(`http://recipe-hub.runasp.net/api/Ingredients/GetByRecipeId/${id}`),
        axios.get(`http://recipe-hub.runasp.net/api/Steps/GetByRecipeId/${id}`),
        axios.get(`http://recipe-hub.runasp.net/api/Comments/GetByRecipeId/${id}`)
      ]);
      
      return {
        ingredients: ingredientsRes.data || [],
        steps: stepsRes.data || [],
        comments: commentsRes.data || []
      };
    } catch (err) {
      console.error('Error fetching additional data:', err);
      return {
        ingredients: [],
        steps: [],
        comments: []
      };
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://recipe-hub.runasp.net/api/users/GetById/${userId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching user:', err);
      return {
        userName: "مستخدم مجهول",
        userImage: "https://randomuser.me/api/portraits/men/1.jpg"
      };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let recipeData;
        
        if (params.recipe) {
          recipeData = JSON.parse(params.recipe);
        } else if (params.id) {
          recipeData = await fetchRecipeData(params.id);
        } else {
          throw new Error('No recipe identifier provided');
        }
        
        setRecipe(recipeData);
        
        if (recipeData.id) {
          const additionalData = await fetchAdditionalData(recipeData.id);
          setIngredients(additionalData.ingredients);
          setSteps(additionalData.steps);
          setComments(additionalData.comments);
          
          if (recipeData.userID) {
            const userData = await fetchUserData(recipeData.userID);
            setUser(userData);
          }
        }
      } catch (err) {
        console.error('Error loading recipe:', err);
        setError(err.message || 'حدث خطأ أثناء تحميل الوصفة');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id, params.recipe]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !recipe?.id) return;

    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        throw new Error('User not authenticated');
      }

      const userData = JSON.parse(userDataString);
      if (!userData?.id) {
        throw new Error('User data is invalid');
      }

      const response = await axios.post('http://recipe-hub.runasp.net/api/Comments/Add', {
        recipeID: recipe.id,
        userID: userData.id,
        description: newComment,
        rate: 0
      });

      const addedComment = {
        id: response.data.id || Date.now().toString(),
        text: newComment,
        timestamp: new Date().toLocaleString(),
        user: {
          id: userData.id,
          userName: userData.userName,
          userImage: userData.userImage || "https://randomuser.me/api/portraits/men/1.jpg"
        }
      };
      
      setComments(prev => [...prev, addedComment]);
      setNewComment('');
      Alert.alert('نجاح', 'تم إضافة التعليق بنجاح');
    } catch (err) {
      console.error('Error adding comment:', err);
      Alert.alert('خطأ', err.message || 'فشل في إضافة التعليق. يرجى المحاولة مرة أخرى.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e17055" />
        <Text style={styles.loadingText}>جاري تحميل الوصفة...</Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="sad-outline" size={48} color="#888" />
        <Text style={styles.errorText}>تعذر تحميل الوصفة</Text>
        <Text style={styles.errorSubText}>{error || 'الوصفة غير موجودة'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            useEffect(); // إعادة تحميل البيانات
          }}
        >
          <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* قسم الصورة */}
        <View style={styles.header}>
          {recipe.backgroundImage ? (
            <Image 
              source={{ uri: `data:image/jpeg;base64,${recipe.backgroundImage}` }} 
              style={styles.image}
              resizeMode="cover"
              onError={() => console.log('Failed to load image')}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={50} color="#ced6e0" />
              <Text style={styles.placeholderText}>لا توجد صورة متاحة</Text>
            </View>
          )}
        </View>

        {/* معلومات الوصفة */}
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={24} color="#e17055" />
            <Text style={styles.metaValue}>{recipe.persons || 4}</Text>
            <Text style={styles.metaLabel}>أفراد</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="star-outline" size={24} color="#e17055" />
            <Text style={styles.metaValue}>{recipe.rate || 0}</Text>
            <Text style={styles.metaLabel}>التقييم</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={24} color="#e17055" />
            <Text style={styles.metaValue}>30</Text>
            <Text style={styles.metaLabel}>دقيقة</Text>
          </View>
        </View>

        {/* محتوى الوصفة */}
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>
          
          <View style={styles.authorContainer}>
            <Image 
              source={{ uri: user?.userImage || "https://randomuser.me/api/portraits/men/1.jpg" }} 
              style={styles.authorAvatar}
            />
            <Text style={styles.authorText}>{user?.userName || "مستخدم مجهول"}</Text>
          </View>

          <Text style={styles.description}>{recipe.description}</Text>

          {/* المكونات */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المكونات</Text>
            {ingredients.length > 0 ? (
              <View style={styles.ingredientsList}>
                {ingredients.map((ingredient, index) => (
                  <View key={`ingredient-${index}`} style={styles.ingredientItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.ingredientText}>{ingredient.name}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noItemsText}>لا توجد مكونات متاحة</Text>
            )}
          </View>

          {/* خطوات التحضير */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>طريقة التحضير</Text>
            {steps.length > 0 ? (
              steps.sort((a, b) => a.stepNumber - b.stepNumber).map((step, index) => (
                <View key={`step-${index}`} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                  </View>
                  <Text style={styles.stepText}>{step.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>لا توجد خطوات متاحة</Text>
            )}
          </View>

          {/* التعليقات */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>التعليقات ({comments.length})</Text>
            
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="اكتب تعليقك هنا..."
                placeholderTextColor="#999"
                value={newComment}
                onChangeText={setNewComment}
                multiline
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[
                  styles.commentButton,
                  !newComment.trim() && styles.disabledButton
                ]}
                onPress={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {comments.length > 0 ? (
              comments.map((comment) => (
                <View key={`comment-${comment.id}`} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Image
                      source={{ uri: comment.user?.userImage || "https://randomuser.me/api/portraits/men/1.jpg" }}
                      style={styles.commentAvatar}
                    />
                    <View>
                      <Text style={styles.commentAuthor}>
                        {comment.user?.userName || "مستخدم مجهول"}
                      </Text>
                      <Text style={styles.commentTime}>
                        {comment.timestamp || new Date().toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.commentText}>{comment.text || comment.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noCommentsText}>لا توجد تعليقات بعد</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  errorSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#e17055',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 250,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
    marginTop: 8,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  metaItem: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 100,
    elevation: 2,
  },
  metaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  metaLabel: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  authorText: {
    fontSize: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'right',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'right',
    borderBottomWidth: 2,
    borderBottomColor: '#e17055',
    paddingBottom: 8,
  },
  ingredientsList: {
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e17055',
    marginHorizontal: 8,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 1,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e17055',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'right',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    padding: 12,
    maxHeight: 120,
    backgroundColor: '#f9f9f9',
    textAlign: 'right',
  },
  commentButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e17055',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  commentItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'right',
  },
  noCommentsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },
  noItemsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
});

export default RecipeDetails;