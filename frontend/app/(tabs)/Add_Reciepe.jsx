import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundImageBase64, setBackgroundImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState("");
  const router = useRouter();

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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
        selectionLimit: 1, // Add this line for SDK 49+
      });

      // For SDK 49+, result.assets is always an array
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setBackgroundImage(result.assets[0].uri);
        const base64 = await convertImageToBase64(result.assets[0].uri);
        setBackgroundImageBase64(base64);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleAddRecipe = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter recipe title");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter recipe description");
      return;
    }
    if (!backgroundImageBase64) {
      Alert.alert("Error", "Please select recipe image");
      return;
    }

    setLoading(true);

    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        throw new Error("User data not found. Please login again.");
      }

      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.id;

      const response = await axios.post(
        "http://recipe-hub.runasp.net/api/Recipes/Add",
        {
          // Only include the required fields
          userID: userId,
          title: title.trim(),
          backgroundImage: backgroundImageBase64,
          description: description.trim(),
          persons: Number(persons) || 1, // use the new field
        }
      );

      if (response.status === 201) {
        const recipeId = response.data.id;
        await AsyncStorage.setItem(
          "lastAddedRecipeId",
          JSON.stringify({
            id: recipeId,
            timestamp: new Date().getTime(),
          })
        );
        router.push({
          pathname: "/Components/Recipe/ingre",
          params: {
            recipeId: recipeId,
            title: title.trim(),
          },
        });
      }
    } catch (error) {
      console.error("Error adding recipe:", {
        message: error.message,
        response: error.response?.data,
      });
      let errorMessage = "Failed to add recipe";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).join("\n");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.title}>Add New Recipe</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Recipe Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Spaghetti Carbonara"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            placeholderTextColor="#B0B0B0"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Describe your recipe..."
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
            placeholderTextColor="#B0B0B0"
          />

          <Text style={styles.label}>عدد الأشخاص</Text>
          <TextInput
            style={styles.input}
            placeholder="مثال: 4"
            value={persons}
            onChangeText={setPersons}
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#B0B0B0"
          />

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickRecipeImage}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.imagePickerText}>
              {backgroundImage ? "Change Recipe Image" : "Choose Recipe Image"}
            </Text>
          </TouchableOpacity>

          {backgroundImage && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: backgroundImage }}
                style={styles.recipeImage}
                resizeMode="cover"
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.addButton, loading && styles.disabledButton]}
            onPress={handleAddRecipe}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.addButtonText}>Add Recipe</Text>
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
    backgroundColor: "#f8f8f8", // matches Profile.jsx
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerContainer: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: "#FF6B6B",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#FF6B6B",
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
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: "#FF6B6B",
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
    borderColor: "#FFD6D6",
    color: "#333",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePickerButton: {
    backgroundColor: "#6B5B95", // matches Profile.jsx accent
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 18,
    marginTop: 10,
    shadowColor: "#6B5B95",
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
    borderColor: "#FF6B6B",
  },
  addButton: {
    backgroundColor: "#FF6B6B",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#FF6B6B",
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

export default AddRecipe;
