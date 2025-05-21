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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { BackHandler } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const RecipeDetails = () => {
  const params = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchRecipeData = async (id) => {
    try {
      const response = await axios.get(
        `http://recipe-hub.runasp.net/api/Recipes/GetById/${id}`
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching recipe:", err);
      throw new Error("Failed to load recipe");
    }
  };

  const fetchAdditionalData = async (id) => {
    try {
      const [ingredientsRes, stepsRes, categoriesRes] = await Promise.all([
        axios.get(
          `http://recipe-hub.runasp.net/api/Recipes/GetAllIngredient?recipeid=${id}`
        ),
        axios.get(
          `http://recipe-hub.runasp.net/api/Recipes/GetAllSteps?recipeid=${id}`
        ),
        axios.get(
          `http://recipe-hub.runasp.net/api/Recipes/GetAllCategories?recipeId=${id}`
        ),
      ]);

      // Fetch ingredient names in parallel
      const ingredientsWithNames = await Promise.all(
        (ingredientsRes.data || []).map(async (ingredient) => {
          try {
            const nameRes = await axios.get(
              `http://recipe-hub.runasp.net/api/Ingredients/GetById/${ingredient.ingredientID}`
            );
            return {
              ...ingredient,
              name: nameRes.data?.name || "مكون غير معروف",
            };
          } catch {
            return {
              ...ingredient,
              name: "مكون غير معروف",
            };
          }
        })
      );

      // Fetch category names in parallel
      const categoriesWithNames = await Promise.all(
        (categoriesRes.data || []).map(async (cat) => {
          try {
            const catRes = await axios.get(
              `http://recipe-hub.runasp.net/api/Categories/GetById/${cat.categoryID}`
            );
            return {
              ...cat,
              name: catRes.data?.name || "تصنيف غير معروف",
            };
          } catch {
            return {
              ...cat,
              name: "تصنيف غير معروف",
            };
          }
        })
      );

      return {
        ingredients: ingredientsWithNames,
        steps: stepsRes.data || [],
        categories: categoriesWithNames,
      };
    } catch (err) {
      console.error("Error fetching additional data:", err);
      return {
        ingredients: [],
        steps: [],
        categories: [],
      };
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `http://recipe-hub.runasp.net/api/users/GetById/${userId}`
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching user:", err);
      return {
        userName: "مستخدم مجهول",
        userImage: "https://randomuser.me/api/portraits/men/1.jpg",
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
          throw new Error("No recipe identifier provided");
        }

        setRecipe(recipeData);

        if (recipeData.id) {
          const additionalData = await fetchAdditionalData(recipeData.id);
          setIngredients(additionalData.ingredients);
          setSteps(additionalData.steps);
          setCategories(additionalData.categories);

          if (recipeData.userID) {
            const userData = await fetchUserData(recipeData.userID);
            setUser(userData);
          }
        }
      } catch (err) {
        console.error("Error loading recipe:", err);
        setError(err.message || "حدث خطأ أثناء تحميل الوصفة");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id, params.recipe]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/(tabs)/Home");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
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
        <Text style={styles.errorSubText}>{error || "الوصفة غير موجودة"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
        >
          <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom AppBar */}
      <View style={styles.customAppBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)/Home")}
        >
          <Ionicons name="arrow-back" size={26} color="#e17055" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle} numberOfLines={1}>
          {recipe.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* صورة الوصفة */}
        <View style={styles.header}>
          {recipe.backgroundImage ? (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${recipe.backgroundImage}`,
              }}
              style={styles.image}
              resizeMode="cover"
              onError={() => console.log("Failed to load image")}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="restaurant-outline" size={50} color="#D1D5DB" />
              <Text style={styles.placeholderText}>لا توجد صورة متاحة</Text>
            </View>
          )}
        </View>

        {/* معلومات الوصفة */}
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={24} color="#e17055" />
            <Text style={styles.metaValue}>{recipe.persons || 0}</Text>
            <Text style={styles.metaLabel}>أفراد</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="heart-outline" size={24} color="#e17055" />
            <Text style={styles.metaValue}>{recipe.rate || 0}</Text>
            <Text style={styles.metaLabel}>الاعجابات</Text>
          </View>
        </View>

        {/* محتوى الوصفة */}
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>

          <View style={styles.authorContainer}>
            <Image
              source={{
                uri: user?.userImage
                  ? `data:image/jpeg;base64,${user.userImage}`
                  : "https://randomuser.me/api/portraits/men/32.jpg",
              }}
              style={styles.authorAvatar}
            />
            <Text style={styles.authorText}>
              {user?.userName || "مستخدم مجهول"}
            </Text>
          </View>

          <Text style={styles.description}>{recipe.description}</Text>

          {/* المكونات */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المكونات</Text>
            {ingredients.length > 0 ? (
              <View style={styles.ingredientsList}>
                {ingredients.map((ingredient, index) => (
                  <View
                    key={`ingredient-${index}`}
                    style={styles.ingredientItem}
                  >
                    <View style={styles.bulletPoint} />
                    <Text style={styles.ingredientText}>
                      {ingredient.name}
                      {ingredient.quantity
                        ? ` - ${ingredient.quantity} ${ingredient.unit || ""}`
                        : ""}
                    </Text>
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
              steps
                .sort((a, b) => a.stepNumber - b.stepNumber)
                .map((step, index) => (
                  <View key={`step-${index}`} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>
                        {step.stepNumber}
                      </Text>
                    </View>
                    <Text style={styles.stepText}>{step.description}</Text>
                  </View>
                ))
            ) : (
              <Text style={styles.noItemsText}>لا توجد خطوات متاحة</Text>
            )}
          </View>

          {/* التصنيفات */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>التصنيفات</Text>
            {categories.length > 0 ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {categories.map((cat, idx) => (
                  <View key={`cat-${idx}`} style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{cat.name}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noItemsText}>لا توجد تصنيفات متاحة</Text>
            )}
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
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  errorSubText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#e17055",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  customAppBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3e6fa",
    elevation: 2,
    zIndex: 10,
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e17055",
    flex: 1,
    textAlign: "right",
    marginRight: 12,
  },
  header: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: 250,
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
    marginTop: 8,
  },
  recipeMeta: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  metaItem: {
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: 100,
    elevation: 2,
  },
  metaValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 4,
  },
  metaLabel: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "right",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  authorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 12,
  },
  authorText: {
    fontSize: 16,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "right",
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "right",
    borderBottomWidth: 2,
    borderBottomColor: "#e17055",
    paddingBottom: 8,
  },
  ingredientsList: {
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e17055",
    marginHorizontal: 8,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    textAlign: "right",
  },
  quantityBadge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  quantityText: {
    color: "#3B82F6",
    fontSize: 14,
    fontFamily: "NotoNaskhArabic-Bold",
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 1,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e17055",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "NotoNaskhArabic-Bold",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    textAlign: "right",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1E293B",
    fontFamily: "NotoNaskhArabic",
    textAlignVertical: "top",
    maxHeight: 120,
    backgroundColor: "#f9f9f9",
    textAlign: "right",
  },
  commentButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e17055",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    elevation: 2,
  },
  commentItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  commentTime: {
    fontSize: 12,
    color: "#999",
  },
  commentText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    textAlign: "right",
  },
  noCommentsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 16,
    fontStyle: "italic",
  },
  categoryBadge: {
    backgroundColor: "#e17055",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default RecipeDetails;
