import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";

const EditRecipe = () => {
  // الحالة المحلية
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);

  const handleSave = () => {
    // منطق الحفظ
    console.log({
      title,
      author,
      ingredients,
      steps,
    });
    alert("تم حفظ التعديلات بنجاح!");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>العنوان</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="أدخل عنوان الوصفة"
        />

        <Text style={styles.label}>المؤلف</Text>
        <TextInput
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
          placeholder="أدخل اسم المؤلف"
        />

        <Text style={styles.label}>المكونات</Text>
        {ingredients.map((ingredient, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={ingredient}
            onChangeText={(text) => {
              const updatedIngredients = [...ingredients];
              updatedIngredients[index] = text;
              setIngredients(updatedIngredients);
            }}
            placeholder={`مكون ${index + 1}`}
          />
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIngredients([...ingredients, ""])}
        >
          <Text style={styles.addButtonText}>+ إضافة مكون</Text>
        </TouchableOpacity>

        <Text style={styles.label}>الخطوات</Text>
        {steps.map((step, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={step}
            onChangeText={(text) => {
              const updatedSteps = [...steps];
              updatedSteps[index] = text;
              setSteps(updatedSteps);
            }}
            placeholder={`خطوة ${index + 1}`}
          />
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setSteps([...steps, ""])}
        >
          <Text style={styles.addButtonText}>+ إضافة خطوة</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>حفظ التعديلات</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2d3436",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  addButton: {
    backgroundColor: "#e17055",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#2d3436",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditRecipe;