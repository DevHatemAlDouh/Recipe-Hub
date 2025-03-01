import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BackHandler } from 'react-native';
import { useFocusEffect, router } from 'expo-router';

const RecipeDetails = () => {
  // استقبال المعاملات
// في RecipeDetails.js
const params = useLocalSearchParams();
  // تحويل السلسلة النصية إلى كائن
const parsedRecipe = JSON.parse(params.recipe);




useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back(); // العودة للشاشة السابقة في المكدس
        return true; // منع السلوك الافتراضي
      };
  
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => 
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  if (!parsedRecipe) {
    return (
      <View style={styles.container}>
        <Text>Recipe not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* عرض صورة الوصفة */}
      <Image source={{ uri: parsedRecipe.image }} style={styles.image} />

      {/* عرض عنوان الوصفة */}
      <Text style={styles.title}>{parsedRecipe.title}</Text>

      {/* عرض الوصف */}
      <Text style={styles.description}>{parsedRecipe.description}</Text>

      {/* عرض المؤلف والوقت */}
      <Text style={styles.author}>Author: {parsedRecipe.author}</Text>
      <Text style={styles.time}>Time: {parsedRecipe.time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
},
description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
},
author: {
    fontSize: 14,
    color: "#888",
},
time: {
    fontSize: 14,
    color: "#888",
},
});

export default RecipeDetails;