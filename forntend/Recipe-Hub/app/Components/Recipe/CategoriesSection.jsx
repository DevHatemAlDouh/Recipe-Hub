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
import axios from "axios";

const CategoriesSection = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState({});
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await axios.get(
          "http://recipe-hub.runasp.net/api/Categories/GetAll"
        );
        setCategoriesList(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Alert.alert(
          "Error",
          "Failed to load categories. Please try again later."
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categoriesList.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = async (category) => {
    const alreadySelected = selectedCategories.some(
      (item) => item.id === category.id
    );
    if (alreadySelected) {
      setSelectedCategories((prev) =>
        prev.filter((item) => item.id !== category.id)
      );
      setCategoryDetails((prev) => {
        const newDetails = { ...prev };
        delete newDetails[category.id];
        return newDetails;
      });
    } else {
      setSelectedCategories((prev) => [...prev, category]);
      setIsLoadingDetails(true);
      try {
        const response = await axios.get(
          `http://recipe-hub.runasp.net/api/Categories/GetById/${category.id}`
        );
        setCategoryDetails((prev) => ({
          ...prev,
          [category.id]: response.data,
        }));
      } catch (error) {
        Alert.alert("Error", "Failed to fetch category details.");
      } finally {
        setIsLoadingDetails(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recipe Categories</Text>

      <TextInput
        style={styles.input}
        placeholder="Search categories..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        editable={!isLoadingCategories}
      />

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Available Categories</Text>
        {isLoadingCategories ? (
          <ActivityIndicator size="small" color="#6B5B95" />
        ) : (
          <View style={styles.categoriesScrollContainer}>
            <ScrollView
              style={styles.categoriesList}
              nestedScrollEnabled={true}
            >
              {filteredCategories.map((item) => (
                <TouchableOpacity
                  key={item.id.toString()}
                  style={[
                    styles.categoryItem,
                    selectedCategories.some((cat) => cat.id === item.id) &&
                      styles.selectedCategoryItem,
                  ]}
                  onPress={() => toggleCategory(item)}
                  disabled={isLoadingDetails}
                >
                  <Text style={styles.categoryName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Selected Categories ({selectedCategories.length})
        </Text>
        {isLoadingDetails && <ActivityIndicator size="small" color="#FF6B6B" />}
        {selectedCategories.length > 0 ? (
          <View style={styles.selectedCategoriesContainer}>
            {selectedCategories.map((cat) => (
              <View key={cat.id} style={styles.selectedCategoryContainer}>
                <Text style={styles.selectedCategoryText}>{cat.name}</Text>
                {categoryDetails[cat.id] && (
                  <Text style={styles.categoryDetailText}>
                    {categoryDetails[cat.id].description || "No description"}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noCategoriesText}>No categories selected</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#6B5B95", // Accent color from Profile.jsx
  },
  input: {
    backgroundColor: "#FFF5F0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#FFD6D6",
    color: "#333",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF6B6B", // Main color from Profile.jsx
  },
  categoriesScrollContainer: {
    maxHeight: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoriesList: {
    backgroundColor: "#fff",
    padding: 10,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedCategoryItem: {
    backgroundColor: "#e3f2fd",
  },
  categoryName: {
    fontSize: 16,
    color: "#6B5B95",
  },
  selectedCategoriesContainer: {
    width: "100%",
  },
  selectedCategoryContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFD6D6",
    shadowColor: "#6B5B95",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCategoryText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  categoryDetailText: {
    color: "#333",
    fontSize: 14,
    fontStyle: "italic",
  },
  noCategoriesText: {
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    padding: 10,
  },
});

export default CategoriesSection;
