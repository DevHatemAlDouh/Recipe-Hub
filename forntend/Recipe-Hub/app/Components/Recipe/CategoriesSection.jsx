import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";

const CategorySelect = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { recipeId, title } = params;
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://recipe-hub.runasp.net/api/Categories/GetAll"
        );
        setCategories(response.data);
      } catch (error) {
        Alert.alert("خطأ", "تعذر تحميل التصنيفات.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      Alert.alert("تنبيه", "يرجى اختيار تصنيف واحد على الأقل.");
      return;
    }
    setIsSubmitting(true);
    try {
      await Promise.all(
        selectedCategories.map((catId) =>
          axios.post("http://recipe-hub.runasp.net/api/Recipes/Category/Add", {
            id: 0,
            recipeID: Number(recipeId),
            categoryID: catId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        )
      );
      router.push({
        pathname: "/Components/Recipe/StepsSection",
        params: {
          recipeId,
          title,
        },
      });
    } catch (error) {
      Alert.alert("خطأ", "تعذر حفظ التصنيفات.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>اختر تصنيفات الوصفة</Text>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#6B5B95"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  selectedCategories.includes(cat.id) &&
                    styles.selectedCategory,
                ]}
                onPress={() => toggleCategory(cat.id)}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategories.includes(cat.id) &&
                      styles.selectedCategoryText,
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
                {selectedCategories.includes(cat.id) && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          (isSubmitting || selectedCategories.length === 0) && { opacity: 0.6 },
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting || selectedCategories.length === 0}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>التالي</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#6B5B95",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  listContainer: {
    paddingBottom: 30,
    alignItems: "center",
    width: "100%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  categoryItem: {
    minWidth: 120,
    maxWidth: "45%",
    margin: 6,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#FFD6D6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#6B5B95",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    position: "relative",
  },
  selectedCategory: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
    elevation: 4,
    shadowOpacity: 0.13,
  },
  categoryText: {
    fontSize: 17,
    color: "#6B5B95",
    fontWeight: "600",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  checkCircle: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  checkMark: {
    color: "#FF6B6B",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: -1,
  },
  submitButton: {
    backgroundColor: "#6B5B95",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    width: "100%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default CategorySelect;
