import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';

const IngredientsSection = () => {
  const params = useLocalSearchParams();
  const [recipeId, setRecipeId] = useState(null);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState({
    total: 0,
    success: 0,
    failed: 0
  });

  useEffect(() => {
    const initializeRecipeData = async () => {
      // Get from navigation params first
      if (params.recipeId) {
        setRecipeId(params.recipeId);
        if (params.title) setRecipeTitle(params.title);
        return;
      }

      // Fallback to AsyncStorage
      try {
        const storedRecipe = await AsyncStorage.getItem('lastAddedRecipeId');
        if (storedRecipe) {
          const { id, timestamp } = JSON.parse(storedRecipe);
          
          // Check if data is recent (within 1 hour)
          const isRecent = new Date().getTime() - timestamp < 3600000;
          if (isRecent) {
            setRecipeId(id);
          } else {
            await AsyncStorage.removeItem('lastAddedRecipeId');
          }
        }
      } catch (error) {
        console.error('Error loading recipe data:', error);
      }
    };

    const fetchIngredients = async () => {
      setIsLoadingIngredients(true);
      try {
        const response = await axios.get('http://recipe-hub.runasp.net/api/Ingredients/GetAll');
        setIngredientsList(response.data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        Alert.alert('Error', 'Failed to load ingredients. Please try again later.');
      } finally {
        setIsLoadingIngredients(false);
      }
    };

    initializeRecipeData();
    fetchIngredients();
  }, []);

  const filteredIngredients = ingredientsList.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients(prev => {
      const existingIndex = prev.findIndex(item => item.ingredient.id === ingredient.id);
      if (existingIndex >= 0) {
        return prev.filter(item => item.ingredient.id !== ingredient.id);
      } else {
        return [...prev, { 
          ingredient, 
          quantity: '',
          unit: 'g'
        }];
      }
    });
  };

  const updateIngredientQuantity = (ingredientId, quantity) => {
    if (/^\d*\.?\d*$/.test(quantity)) {
      setSelectedIngredients(prev =>
        prev.map(item =>
          item.ingredient.id === ingredientId ? { ...item, quantity } : item
        )
      );
    }
  };

  const updateIngredientUnit = (ingredientId, unit) => {
    setSelectedIngredients(prev =>
      prev.map(item =>
        item.ingredient.id === ingredientId ? { ...item, unit } : item
      )
    );
  };

  const submitIngredients = async () => {
    if (!recipeId) {
      Alert.alert('Error', 'No recipe selected. Please create or select a recipe first.');
      return;
    }

    const hasEmptyQuantities = selectedIngredients.some(item => !item.quantity);
    if (hasEmptyQuantities) {
      Alert.alert('Validation Error', 'Please enter quantity for all selected ingredients');
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress({
      total: selectedIngredients.length,
      success: 0,
      failed: 0
    });

    const results = [];
    
    try {
      for (const [index, item] of selectedIngredients.entries()) {
        try {
          const response = await axios.post(
            'http://recipe-hub.runasp.net/api/Recipes/Ingredient/Add',
            {
              ingredientID: item.ingredient.id,
              recipeID: recipeId,
              quantity: item.quantity,
              unit: item.unit
            },
            {
              timeout: 10000 // 10 seconds timeout
            }
          );

          if (response.status === 204) {
            results.push({ success: true, name: item.ingredient.name });
            setSubmitProgress(prev => ({...prev, success: prev.success + 1}));
          } else {
            throw new Error(`Unexpected status code: ${response.status}`);
          }
        } catch (error) {
          console.error(`Error adding ingredient ${item.ingredient.name}:`, error);
          results.push({ 
            success: false, 
            name: item.ingredient.name,
            error: error.response?.data?.message || error.message 
          });
          setSubmitProgress(prev => ({...prev, failed: prev.failed + 1}));
        }
      }

      const failedIngredients = results.filter(r => !r.success);
      if (failedIngredients.length === 0) {
        Alert.alert(
          'Success', 
          'All ingredients were added successfully!',
          [{
            text: 'OK', 
            onPress: () => {
              setSelectedIngredients([]);
              router.push({
                pathname: '/StepsSection',
                params: { 
                  recipeId: recipeId,
                  title: recipeTitle 
                }
              });
            }
          }]
        );
      } else {
        Alert.alert(
          'Partial Success',
          `Successfully added ${results.filter(r => r.success).length} out of ${selectedIngredients.length} ingredients.\n\n` +
          `Failed to add: ${failedIngredients.map(i => i.name).join(', ')}`,
          [{
            text: 'Continue Anyway', 
            onPress: () => {
              router.push({
                pathname: '/(tabs)/StepsSection',
                params: { 
                  recipeId: recipeId,
                  title: recipeTitle 
                }
              });
            }
          }]
        );
      }
    } catch (error) {
      console.error('Unexpected error during submission:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recipe Ingredients</Text>

      <TextInput
        style={styles.input}
        placeholder="S ingredients..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        editable={!isSubmitting}
      />

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Available Ingredients</Text>
        {isLoadingIngredients ? (
          <ActivityIndicator size="small" color="#3498db" />
        ) : (
          <View style={styles.ingredientsScrollContainer}>
            <ScrollView 
              style={styles.ingredientsList}
              nestedScrollEnabled={true}
            >
              {filteredIngredients.map((item) => (
                <TouchableOpacity 
                  key={item.id.toString()}
                  style={[
                    styles.ingredientItem,
                    selectedIngredients.some(ing => ing.ingredient.id === item.id) && 
                    styles.selectedIngredientItem
                  ]}
                  onPress={() => !isSubmitting && toggleIngredient(item)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.ingredientName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Selected Ingredients ({selectedIngredients.length})
        </Text>
        
        {isSubmitting && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Processing: {submitProgress.success + submitProgress.failed}/{submitProgress.total}
            </Text>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { 
                  width: `${(submitProgress.success + submitProgress.failed) / submitProgress.total * 100}%`,
                  backgroundColor: submitProgress.failed > 0 ? '#e74c3c' : '#2ecc71'
                }
              ]} />
            </View>
            <Text style={styles.progressDetail}>
              Success: {submitProgress.success} | Failed: {submitProgress.failed}
            </Text>
          </View>
        )}

        {selectedIngredients.length > 0 ? (
          <View style={styles.selectedIngredientsContainer}>
            {selectedIngredients.map(({ingredient, quantity, unit}) => (
              <View key={ingredient.id} style={styles.selectedIngredientContainer}>
                <Text style={styles.selectedIngredientText}>{ingredient.name}</Text>
                
                <View style={styles.quantitySection}>
                  <View style={styles.quantityInputContainer}>
                    <Text style={styles.inputLabel}>Quantity:</Text>
                    <TextInput
                      style={styles.quantityInput}
                      placeholder="Enter quantity"
                      value={quantity}
                      onChangeText={(text) => updateIngredientQuantity(ingredient.id, text)}
                      keyboardType="numeric"
                      editable={!isSubmitting}
                    />
                  </View>
                  
                  <View style={styles.unitPickerContainer}>
                    <Text style={styles.inputLabel}>Unit:</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={unit}
                        dropdownIconColor="#333"
                        style={styles.unitPicker}
                        onValueChange={(itemValue) => updateIngredientUnit(ingredient.id, itemValue)}
                        enabled={!isSubmitting}
                      >
                        <Picker.Item label="Gram (g)" value="g" />
                        <Picker.Item label="Kilogram (kg)" value="kg" />
                        <Picker.Item label="Teaspoon (tsp)" value="tsp" />
                        <Picker.Item label="Tablespoon (tbsp)" value="tbsp" />
                        <Picker.Item label="Cup (cup)" value="cup" />
                        <Picker.Item label="Milliliter (ml)" value="ml" />
                        <Picker.Item label="Liter (l)" value="l" />
                        <Picker.Item label="Piece (p)" value="p" />
                      </Picker>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noIngredientsText}>No ingredients selected</Text>
        )}
      </View>

      {selectedIngredients.length > 0 && recipeId && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submittingButton,
            isSubmitting && { backgroundColor: '#f39c12' }
          ]}
          onPress={submitIngredients}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.submitButtonText}>
                {submitProgress.success + submitProgress.failed === submitProgress.total ? 
                  'Finalizing...' : 'Sending...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Save Ingredients</Text>
          )}
        </TouchableOpacity>
      )}
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
    marginBottom: 10,
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
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  ingredientsScrollContainer: {
    maxHeight: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  ingredientsList: {
    backgroundColor: '#fff',
    padding: 10,
  },
  ingredientItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedIngredientItem: {
    backgroundColor: '#e3f2fd',
  },
  ingredientName: {
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  progressDetail: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#bdc3c7',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  selectedIngredientsContainer: {
    width: '100%',
  },
  selectedIngredientContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedIngredientText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  unitPickerContainer: {
    flex: 1,
    marginLeft: 10,
  },
  inputLabel: {
    marginBottom: 5,
    color: '#555',
    fontSize: 14,
  },
  quantityInput: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    fontSize: 15,
    height: 60,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  unitPicker: {
    height: 60,
    width: '100%',
  },
  noIngredientsText: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    padding: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submittingButton: {
    opacity: 0.9,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default IngredientsSection;