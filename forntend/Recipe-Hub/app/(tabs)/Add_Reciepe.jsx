import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundImageBase64, setBackgroundImageBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const convertImageToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting image:', error);
      Alert.alert('Error', 'Failed to process image');
      return null;
    }
  };

  const pickRecipeImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        setBackgroundImage(result.assets[0].uri);
        const base64 = await convertImageToBase64(result.assets[0].uri);
        setBackgroundImageBase64(base64);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleAddRecipe = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter recipe title');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter recipe description');
      return;
    }
    if (!backgroundImageBase64) {
      Alert.alert('Error', 'Please select recipe image');
      return;
    }

    setLoading(true);

    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        throw new Error('User data not found. Please login again.');
      }
      
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.id;

      const response = await axios.post('http://recipe-hub.runasp.net/api/Recipes/Add', {
        userID: userId,
        title: title.trim(),
        backgroundImage: backgroundImageBase64,
        description: description.trim(),
        rate: 0,
        persons:0,
        view: 0,
        userInfo: {
          bio: 'New user',
          joinDate: new Date().toISOString(),
        },
      });

      if (response.status === 201) {
        const recipeId = response.data.id;
        
        // Save recipeId to AsyncStorage and navigate
        await AsyncStorage.setItem('lastAddedRecipeId', JSON.stringify({ 
          id: recipeId,
          timestamp: new Date().getTime() 
        }));
        
        router.push({
          pathname: '/(tabs)/ingre',
          params: { 
            recipeId: recipeId,
            title: title.trim() 
          }
        });
      }
    } catch (error) {
      console.error('Error adding recipe:', {
        message: error.message,
        response: error.response?.data,
      });
      
      let errorMessage = 'Failed to add recipe';
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Recipe</Text>

      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />

      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={500}
      />

      <TouchableOpacity 
        style={styles.imagePickerButton} 
        onPress={pickRecipeImage}
        disabled={loading}
      >
        <Text style={styles.imagePickerText}>
          {backgroundImage ? 'Change Recipe Image' : 'Choose Recipe Image'}
        </Text>
      </TouchableOpacity>

      {backgroundImage && (
        <Image 
          source={{ uri: backgroundImage }} 
          style={styles.recipeImage} 
          resizeMode="cover"
        />
      )}

      <TouchableOpacity
        style={[styles.addButton, loading && styles.disabledButton]}
        onPress={handleAddRecipe}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.addButtonText}>Add Recipe</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddRecipe;