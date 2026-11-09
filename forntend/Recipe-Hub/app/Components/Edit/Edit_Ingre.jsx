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
import { router, useLocalSearchParams } from "expo-router";


function EditIngredientsSection() {
const params = useLocalSearchParams();
const [recipeId, setRecipeId] = useState(null);
const [recipeTitle, setRecipeTitle] = useState("");
const [ingredientsList, setIngredientsList] = useState([]);
const [searchQuery, setSearchQuery] = useState("");
const [selectedIngredients, setSelectedIngredients] = useState([]);
const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
    if (params.recipeId) {
        setRecipeId(params.recipeId);
        if (params.title) setRecipeTitle(params.title);
    }
    fetchIngredients();
    fetchRecipeIngredients();
    // eslint-disable-next-line
}, [params.recipeId]);

const fetchIngredients = async () => {
    setIsLoadingIngredients(true);
    try {
        const response = await axios.get(
            "http://recipe-hub.runasp.net/api/Ingredients/GetAll"
        );
        setIngredientsList(response.data);
    } catch (error) {
        Alert.alert("Error", "Failed to load ingredients.");
    } finally {
        setIsLoadingIngredients(false);
    }
};

const fetchRecipeIngredients = async () => {
    if (!params.recipeId) return;
    try {
        // First, get all ingredient IDs for the recipe
        const response = await axios.get(
            `http://recipe-hub.runasp.net/api/Recipes/GetAllIngredient?recipeId=${params.recipeId}`
        );

        // Fetch ingredient names for each ID
        const ingredientDetails = await Promise.all(
            response.data.map(async (item) => {
            const ingredientRes = await axios.get(
                `http://recipe-hub.runasp.net/api/Ingredients/GetById/${item.ingredientID}`
            );
            return {
                ...item,
                ingredientName: ingredientRes.data.name,
            };
            })
        );
        // Map to match the structure used in selectedIngredients
        setSelectedIngredients(
            response.data.map((item) => ({
                ingredient: {
                    id: item.ingredientID,
                    name: item.ingredientName,
                },
                quantity: item.quantity.toString(),
                unit: item.unit,
            }))
        );
    } catch (error) {
        Alert.alert("Error", "Failed to load recipe ingredients.");
    }
};

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
            // Remove ingredient
            return prev.filter((item) => item.ingredient.id !== ingredient.id);
        } else {
            // Add ingredient with default values
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
        Alert.alert("Error", "No recipe selected.");
        return;
    }
    const hasEmptyQuantities = selectedIngredients.some(
        (item) => !item.quantity
    );
    if (hasEmptyQuantities) {
        Alert.alert("Warning", "Please enter the quantity for each ingredient.");
        return;
    }
    setIsSubmitting(true);
    try {
        // Send all ingredients in one request (if API supports batch), otherwise loop
        for (const item of selectedIngredients) {
            await axios.put(
                "http://recipe-hub.runasp.net/api/Recipes/UpdateIngredient/",
                {
                    ingredientID: item.ingredient.id,
                    recipeID: recipeId,
                    quantity: item.quantity,
                    unit: item.unit,
                }
            );
        }
        Alert.alert("Success", "Ingredients updated successfully!", [
            {
                text: "Next",
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
        ]);
    } catch (error) {
        Alert.alert(
            "Error",
            error.response?.data?.message ||
                "An error occurred while updating ingredients."
        );
    } finally {
        setIsSubmitting(false);
    }
};

return (
    <View style={styles.outerContainer}>
        <Text style={styles.title}>Edit Recipe Ingredients</Text>

        <TextInput
            style={styles.input}
            placeholder="Search for an ingredient..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={!isSubmitting}
            placeholderTextColor="#B0B0B0"
        />

        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Available ingredients</Text>
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
                Selected ingredients ({selectedIngredients.length})
            </Text>
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
                                    <Text style={styles.inputLabel}>Quantity:</Text>
                                    <TextInput
                                        style={styles.quantityInput}
                                        placeholder="Enter the quantity"
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
                                    <Text style={styles.inputLabel}>Unit:</Text>
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
                                            <Picker.Item label="Gram (g)" value="g" />
                                            <Picker.Item label="Kilogram (kg)" value="kg" />
                                            <Picker.Item label="teaspoon (tsp)" value="tsp" />
                                            <Picker.Item label="Tablespoon (tbsp)" value="tb" />
                                            <Picker.Item label="Cup (cup)" value="cup" />
                                            <Picker.Item label="Milliliter (ml)" value="ml" />
                                            <Picker.Item label="liter (l)" value="l" />
                                            <Picker.Item label="Piece (p)" value="p" />
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={styles.noIngredientsText}>
                    No ingredient selected.
                </Text>
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
                            Updating...
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.submitButtonText}>
                        Save Changes
                    </Text>
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

export default EditIngredientsSection;