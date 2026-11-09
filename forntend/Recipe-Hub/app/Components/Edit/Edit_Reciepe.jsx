import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const EditRecipe = () => {
  const { recipeId } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    persons: "",
    backgroundImage: null,
    backgroundImageBase64: "",
  });
  const [loading, setLoading] = useState({
    fetching: true,
    submitting: false,
    image: false,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        console.log(`Fetching recipe with ID: ${recipeId}`);
        
        const response = await axios.get(
          `http://recipe-hub.runasp.net/api/Recipes/GetById/${recipeId}`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log("API Response:", response.data);

        if (response.data) {
          const recipe = response.data;
          setFormData({
            title: recipe.title || "",
            description: recipe.description || "",
            persons: recipe.persons?.toString() || "",
            backgroundImage: recipe.backgroundImage 
              ? recipe.backgroundImage.startsWith('http')
                ? recipe.backgroundImage
                : `data:image/jpeg;base64,${recipe.backgroundImage}`
              : null,
            backgroundImageBase64: "",
          });
        }
      } catch (error) {
        console.error("Error fetching recipe:", {
          message: error.message,
          config: error.config,
          response: error.response?.data
        });
        Alert.alert("Error", "Failed to load recipe details");
      } finally {
        setLoading(prev => ({ ...prev, fetching: false }));
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  const convertImageToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error converting image:", error);
      Alert.alert("Error", "Failed to process image");
      return null;
    }
  };

  const pickRecipeImage = async () => {
    try {
      setLoading(prev => ({ ...prev, image: true }));
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64 = await convertImageToBase64(result.assets[0].uri);
        setFormData(prev => ({
          ...prev,
          backgroundImage: result.assets[0].uri,
          backgroundImageBase64: base64,
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setLoading(prev => ({ ...prev, image: false }));
    }
  };

  const handleUpdateRecipe = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter recipe title");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter recipe description");
      return;
    }

    setLoading(prev => ({ ...prev, submitting: true }));

    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        throw new Error("User data not found. Please login again.");
      }

      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.id;

      const updateData = {
        id: recipeId,
        userID: userId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        persons: Number(formData.persons) || 0,
      };

      // Only include the image if a new one was selected
      if (formData.backgroundImageBase64) {
        updateData.backgroundImage = formData.backgroundImageBase64;
      }

      console.log("Sending update data:", updateData);

      const response = await axios.put(
        `http://recipe-hub.runasp.net/api/Recipes/Update/${recipeId}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Update response:", response.data);

      if (response.status === 200) {
        Alert.alert("Success", "Recipe updated successfully", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating recipe:", {
        message: error.message,
        config: error.config,
        response: error.response?.data
      });
      
      let errorMessage = "Failed to update recipe";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).join("\n");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  if (loading.fetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B5B95" />
        <Text style={styles.loadingText}>Loading recipe data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8f8f8" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 60 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Edit Recipe</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Recipe Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Spaghetti Carbonara"
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            maxLength={100}
            placeholderTextColor="#B0B0B0"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Describe your recipe..."
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            multiline
            maxLength={500}
            placeholderTextColor="#B0B0B0"
          />

          <Text style={styles.label}>Number of people</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: 4"
            value={formData.persons}
            onChangeText={(text) => setFormData(prev => ({ ...prev, persons: text }))}
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#B0B0B0"
          />

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickRecipeImage}
            disabled={loading.image}
            activeOpacity={0.85}
          >
            {loading.image ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.imagePickerText}>
                {formData.backgroundImage || formData.backgroundImageBase64 
                  ? "Change Recipe Image" 
                  : "Update Recipe Image"}
              </Text>
            )}
          </TouchableOpacity>

          {(formData.backgroundImage || formData.backgroundImageBase64) && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ 
                  uri: formData.backgroundImageBase64 
                    ? `data:image/jpeg;base64,${formData.backgroundImageBase64}`
                    : formData.backgroundImage
                }}
                style={styles.recipeImage}
                resizeMode="cover"
                onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.addButton, loading.submitting && styles.disabledButton]}
            onPress={handleUpdateRecipe}
            disabled={loading.submitting}
            activeOpacity={0.85}
          >
            {loading.submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.addButtonText}>Update Recipe</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 15,
    color: "#6B5B95",
    fontSize: 16,
  },
  headerContainer: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: "#6B5B95",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#6B5B95",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    width: "92%",
    shadowColor: "#6B5B95",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: "#6B5B95",
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#FFF5F0",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E6E6FA",
    color: "#333",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePickerButton: {
    backgroundColor: "#FF6B6B",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 18,
    marginTop: 10,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  recipeImage: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#6B5B95",
  },
  addButton: {
    backgroundColor: "#6B5B95",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#6B5B95",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default EditRecipe;