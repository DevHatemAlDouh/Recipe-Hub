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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import axios from 'axios';

const AddRecipe = () => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState([{ text: '', image: null }]); // خطوات مع نص وصورة
  const [recipeImage, setRecipeImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // اختيار صورة الوصفة الرئيسية
  const pickRecipeImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setRecipeImage(result.assets[0].uri);
    }
  };

  // اختيار صورة لخطوة معينة
  const pickStepImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedSteps = [...steps];
      updatedSteps[index].image = result.assets[0].uri;
      setSteps(updatedSteps);
    }
  };

  // إضافة خطوة جديدة
  const addStep = () => {
    setSteps([...steps, { text: '', image: null }]);
  };

  // تحديث نص الخطوة
  const updateStepText = (index, text) => {
    const updatedSteps = [...steps];
    updatedSteps[index].text = text;
    setSteps(updatedSteps);
  };

  // حذف خطوة معينة
  const deleteStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index); // حذف الخطوة المحددة
    setSteps(updatedSteps);
  };

  // إرسال الوصفة إلى الخادم
  const handleAddRecipe = async () => {
    if (!recipeName || !ingredients || steps.some(step => !step.text) || !recipeImage) {
      Alert.alert('Error', 'Please fill all fields, add steps, and select an image.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://recipe-hub.runasp.net/api/recipes/Add', {
        recipeName,
        ingredients: ingredients.split('\n').filter(line => line.trim() !== ''), // تحويل المكونات إلى مصفوفة
        steps: steps.map(step => ({
          text: step.text,
          image: step.image, // إرسال صورة الخطوة
        })),
        recipeImage, // إرسال صورة الوصفة الرئيسية
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Recipe added successfully!');
        router.push('/Home'); // توجيه المستخدم إلى الصفحة الرئيسية
      } else {
        Alert.alert('Error', 'Failed to add recipe.');
      }
    } catch (error) {
      console.error('Error adding recipe:', error);
      Alert.alert('Error', 'An error occurred while adding the recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Recipe</Text>

      {/* اسم الوصفة */}
      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
      />

      {/* المكونات */}
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Ingredients (one per line)"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />

      {/* عرض المكونات بشكل مرقم */}
      <ScrollView style={styles.ingredientsContainer}>
        {ingredients.split('\n').map((ingredient, index) => (
          ingredient.trim() !== '' && (
            <Text key={index} style={styles.ingredientText}>
              {`${index + 1}- ${ingredient}`}
            </Text>
          )
        ))}
      </ScrollView>

      {/* الخطوات */}
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepNumber}>Step {index + 1}</Text>
            <TouchableOpacity
              style={styles.deleteStepButton}
              onPress={() => deleteStep(index)}
            >
              <Text style={styles.deleteStepButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder={`Step ${index + 1} description`}
            value={step.text}
            onChangeText={(text) => updateStepText(index, text)}
            multiline
          />
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={() => pickStepImage(index)}
          >
            <Text style={styles.imagePickerText}>
              {step.image ? 'Change Step Image' : 'Add Step Image'}
            </Text>
          </TouchableOpacity>
          {step.image && (
            <Image source={{ uri: step.image }} style={styles.stepImage} />
          )}
        </View>
      ))}

      {/* زر إضافة خطوة جديدة */}
      <TouchableOpacity style={styles.addStepButton} onPress={addStep}>
        <Text style={styles.addStepButtonText}>Add Step</Text>
      </TouchableOpacity>

      {/* اختيار صورة الوصفة الرئيسية */}
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickRecipeImage}>
        <Text style={styles.imagePickerText}>Choose Recipe Image</Text>
      </TouchableOpacity>

      {/* عرض صورة الوصفة الرئيسية */}
      {recipeImage && (
        <Image source={{ uri: recipeImage }} style={styles.recipeImage} />
      )}

      {/* زر إضافة الوصفة */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddRecipe}
        disabled={loading}
      >
        <Text style={styles.addButtonText}>
          {loading ? 'Adding...' : 'Add Recipe'}
        </Text>
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
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  ingredientsContainer: {
    marginBottom: 15,
  },
  ingredientText: {
    fontSize: 16,
    marginBottom: 5,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteStepButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  deleteStepButtonText: {
    color: '#fff',
    fontSize: 14,
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
  },
  stepImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  addStepButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  addStepButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddRecipe;