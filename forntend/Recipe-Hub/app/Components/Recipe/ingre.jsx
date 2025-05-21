import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

const IngredientsSection = () => {
  const params = useLocalSearchParams();
  const [recipeId, setRecipeId] = useState(null);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState({
    total: 0,
    success: 0,
    failed: 0,
  });

  useEffect(() => {
    const initializeRecipeData = async () => {
      if (params.recipeId) {
        setRecipeId(params.recipeId);
        if (params.title) setRecipeTitle(params.title);
        return;
      }
      try {
        const storedRecipe = await AsyncStorage.getItem("lastAddedRecipeId");
        if (storedRecipe) {
          const { id, timestamp } = JSON.parse(storedRecipe);
          const isRecent = new Date().getTime() - timestamp < 3600000;
          if (isRecent) {
            setRecipeId(id);
          } else {
            await AsyncStorage.removeItem("lastAddedRecipeId");
          }
        }
      } catch (error) {
        console.error("Error loading recipe data:", error);
      }
    };

    const fetchIngredients = async () => {
      setIsLoadingIngredients(true);
      try {
        const response = await axios.get(
          "http://recipe-hub.runasp.net/api/Ingredients/GetAll"
        );
        setIngredientsList(response.data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
        Alert.alert("خطأ", "تعذر تحميل المكونات. حاول مرة أخرى لاحقًا.");
      } finally {
        setIsLoadingIngredients(false);
      }
    };

    initializeRecipeData();
    fetchIngredients();
  }, []);

  const filteredIngredients = ingredientsList.filter((ingredient) => {
    const ingName = ingredient.name || "";
    return ingName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.ingredient.id === ingredient.id
      );
      if (existingIndex >= 0) {
        return prev.filter((item) => item.ingredient.id !== ingredient.id);
      } else {
        return [
          ...prev,
          {
            ingredient,
            quantity: "",
            unit: "g",
          },
        ];
      }
    });
  };

  const updateIngredientQuantity = (ingredientId, quantity) => {
    if (/^\d*\.?\d*$/.test(quantity)) {
      setSelectedIngredients((prev) =>
        prev.map((item) =>
          item.ingredient.id === ingredientId ? { ...item, quantity } : item
        )
      );
    }
  };

  const updateIngredientUnit = (ingredientId, unit) => {
    setSelectedIngredients((prev) =>
      prev.map((item) =>
        item.ingredient.id === ingredientId ? { ...item, unit } : item
      )
    );
  };

  const submitIngredients = async () => {
    if (!recipeId) {
      Alert.alert("خطأ", "لا يوجد وصفة محددة. يرجى إنشاء أو تحديد وصفة أولاً.");
      return;
    }

    const hasEmptyQuantities = selectedIngredients.some(
      (item) => !item.quantity
    );
    if (hasEmptyQuantities) {
      Alert.alert("تنبيه", "يرجى إدخال الكمية لكل مكون محدد");
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress({
      total: selectedIngredients.length,
      success: 0,
      failed: 0,
    });

    const results = [];

    try {
      for (const [index, item] of selectedIngredients.entries()) {
        try {
          const response = await axios.post(
            "http://recipe-hub.runasp.net/api/Recipes/Ingredient/Add",
            {
              ingredientID: item.ingredient.id,
              recipeID: recipeId,
              quantity: item.quantity,
              unit: item.unit,
            },
            {
              timeout: 5000,
            }
          );

          if (response.status === 204) {
            results.push({ success: true, name: item.ingredient.name });
            setSubmitProgress((prev) => ({
              ...prev,
              success: prev.success + 1,
            }));
          } else {
            throw new Error(`Unexpected status code: ${response.status}`);
          }
        } catch (error) {
          results.push({
            success: false,
            name: item.ingredient.name,
            error: error.response?.data?.message || error.message,
          });
          setSubmitProgress((prev) => ({ ...prev, failed: prev.failed + 1 }));
        }
      }

      const failedIngredients = results.filter((r) => !r.success);
      if (failedIngredients.length === 0) {
        Alert.alert("تم", "تمت إضافة جميع المكونات بنجاح!", [
          {
            text: "التالي",
            onPress: () => {
              setSelectedIngredients([]);
              router.push({
                pathname: "/Components/Recipe/CategoriesSection",
                params: {
                  recipeId: recipeId,
                  title: recipeTitle,
                },
              });
            },
          },
        ]);
      } else {
        Alert.alert(
          "تم جزئياً",
          `تمت إضافة ${results.filter((r) => r.success).length} من أصل ${
            selectedIngredients.length
          } مكون.\n\n` +
            `فشل في الإضافة: ${failedIngredients
              .map((i) => i.name)
              .join(", ")}`,
          [
            {
              text: "متابعة",
              onPress: () => {
                router.push({
                  pathname: "/Components/Recipe/CategoriesSection",
                  params: {
                    recipeId: recipeId,
                    title: recipeTitle,
                  },
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("خطأ", error.message || "حدث خطأ غير متوقع أثناء الإرسال");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>إضافة مكونات الوصفة</Text>

      <TextInput
        style={styles.input}
        placeholder="ابحث عن مكون..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        editable={!isSubmitting}
        placeholderTextColor="#B0B0B0"
      />

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>المكونات المتاحة</Text>
        {isLoadingIngredients ? (
          <ActivityIndicator
            size="small"
            color="#6B5B95"
            style={{ marginTop: 20 }}
          />
        ) : (
          <ScrollView
            style={styles.ingredientsList}
            nestedScrollEnabled={true}
            contentContainerStyle={{ paddingBottom: 60 }}
          >
            <View style={styles.grid}>
              {filteredIngredients.map((item) => (
                <TouchableOpacity
                  key={item.id.toString()}
                  style={[
                    styles.ingredientItem,
                    selectedIngredients.some(
                      (ing) => ing.ingredient.id === item.id
                    ) && styles.selectedIngredientItem,
                  ]}
                  onPress={() => !isSubmitting && toggleIngredient(item)}
                  disabled={isSubmitting}
                  activeOpacity={0.85}
                >
                  <Text style={styles.ingredientName}>{item.name}</Text>
                  {selectedIngredients.some(
                    (ing) => ing.ingredient.id === item.id
                  ) && (
                    <View style={styles.checkCircle}>
                      <Text style={styles.checkMark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          المكونات المختارة ({selectedIngredients.length})
        </Text>

        {isSubmitting && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              جاري المعالجة: {submitProgress.success + submitProgress.failed}/
              {submitProgress.total}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((submitProgress.success + submitProgress.failed) /
                        submitProgress.total) *
                      100
                    }%`,
                    backgroundColor:
                      submitProgress.failed > 0 ? "#e74c3c" : "#2ecc71",
                  },
                ]}
              />
            </View>
            <Text style={styles.progressDetail}>
              نجاح: {submitProgress.success} | فشل: {submitProgress.failed}
            </Text>
          </View>
        )}

        {selectedIngredients.length > 0 ? (
          <View style={styles.selectedIngredientsContainer}>
            {selectedIngredients.map(({ ingredient, quantity, unit }) => (
              <View
                key={ingredient.id}
                style={styles.selectedIngredientContainer}
              >
                <Text style={styles.selectedIngredientText}>
                  {ingredient.name}
                </Text>

                <View style={styles.quantitySection}>
                  <View style={styles.quantityInputContainer}>
                    <Text style={styles.inputLabel}>الكمية:</Text>
                    <TextInput
                      style={styles.quantityInput}
                      placeholder="أدخل الكمية"
                      value={quantity}
                      onChangeText={(text) =>
                        updateIngredientQuantity(ingredient.id, text)
                      }
                      keyboardType="numeric"
                      editable={!isSubmitting}
                      placeholderTextColor="#B0B0B0"
                    />
                  </View>

                  <View style={styles.unitPickerContainer}>
                    <Text style={styles.inputLabel}>الوحدة:</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={unit}
                        dropdownIconColor="#333"
                        style={styles.unitPicker}
                        onValueChange={(itemValue) =>
                          updateIngredientUnit(ingredient.id, itemValue)
                        }
                        enabled={!isSubmitting}
                      >
                        <Picker.Item label="جرام (g)" value="g" />
                        <Picker.Item label="كيلوجرام (kg)" value="kg" />
                        <Picker.Item label="ملعقة صغيرة (tsp)" value="tsp" />
                        <Picker.Item label="ملعقة كبيرة (tbsp)" value="tb" />
                        <Picker.Item label="كوب (cup)" value="cup" />
                        <Picker.Item label="ملليلتر (ml)" value="ml" />
                        <Picker.Item label="لتر (l)" value="l" />
                        <Picker.Item label="قطعة (p)" value="p" />
                      </Picker>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noIngredientsText}>لم يتم اختيار أي مكون</Text>
        )}
      </View>

      {selectedIngredients.length > 0 && recipeId && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submittingButton,
            isSubmitting && { backgroundColor: "#f39c12" },
          ]}
          onPress={submitIngredients}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.submitButtonText}>
                {submitProgress.success + submitProgress.failed ===
                submitProgress.total
                  ? "جاري إنهاء العملية..."
                  : "جاري الإرسال..."}
              </Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>حفظ المكونات</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#6B5B95",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    textAlign: "right",
  },
  sectionContainer: {
    marginBottom: 18,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
    textAlign: "right",
  },
  ingredientsList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 220,
    marginBottom: 8,
    paddingHorizontal: 6,
    width: "100%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-start",
  },
  ingredientItem: {
    minWidth: 110,
    maxWidth: "45%",
    margin: 6,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#f3e6fa",
    borderWidth: 1.5,
    borderColor: "#FFD6D6",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  selectedIngredientItem: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
    elevation: 3,
  },
  ingredientName: {
    fontSize: 16,
    color: "#6B5B95",
    fontWeight: "600",
    textAlign: "center",
  },
  checkCircle: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
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
    fontSize: 14,
    marginTop: -1,
  },
  progressContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#2c3e50",
    marginBottom: 5,
    textAlign: "center",
  },
  progressDetail: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 5,
    textAlign: "center",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#bdc3c7",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 6,
  },
  progressFill: {
    height: "100%",
  },
  selectedIngredientsContainer: {
    width: "100%",
  },
  selectedIngredientContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedIngredientText: {
    color: "#6B5B95",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "right",
  },
  quantitySection: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    gap: 8,
  },
  quantityInputContainer: {
    flex: 1,
    marginLeft: 10,
  },
  unitPickerContainer: {
    flex: 1,
    marginRight: 10,
  },
  inputLabel: {
    marginBottom: 5,
    color: "#555",
    fontSize: 14,
    textAlign: "right",
  },
  quantityInput: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    fontSize: 15,
    height: 50,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  unitPicker: {
    height: 50,
    width: "100%",
  },
  noIngredientsText: {
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    padding: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submittingButton: {
    opacity: 0.9,
  },
  submitButton: {
    backgroundColor: "#6B5B95",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

export default IngredientsSection;
