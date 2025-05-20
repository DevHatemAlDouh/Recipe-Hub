import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView, // <-- Add this import
} from "react-native";

const RecipeSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authors, setAuthors] = useState({}); // { userId: userName }

  // Fetch all recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          "http://recipe-hub.runasp.net/api/Recipes/GetAll"
        );
        const data = await res.json();
        setAllRecipes(Array.isArray(data) ? data : []);
        setFilteredRecipes(Array.isArray(data) ? data : []);
        // Fetch all authors in parallel
        const userIds = [...new Set(data.map((r) => r.userID))];
        const authorMap = {};
        await Promise.all(
          userIds.map(async (uid) => {
            try {
              const userRes = await fetch(
                `http://recipe-hub.runasp.net/api/users/GetById/${uid}`
              );
              const userData = await userRes.json();
              authorMap[uid] = userData?.userName || "Unknown"; // <-- use userName
            } catch {
              authorMap[uid] = "Unknown";
            }
          })
        );
        setAuthors(authorMap);
      } catch {
        setAllRecipes([]);
        setFilteredRecipes([]);
      }
      setIsLoading(false);
    };
    fetchRecipes();
  }, []);

  // Update filteredRecipes as user types in the search bar
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(allRecipes);
    } else {
      const filtered = allRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, allRecipes]);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(allRecipes);
      return;
    }
    const filtered = allRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard}>
      {/* <Image
        source={{ uri: item.backgroundImage }}
        style={styles.recipeImage}
      /> */}
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeMeta}>
          Author: {authors[item.userID] || "Loading..."}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff8c00" />
            <Text>Loading recipes...</Text>
          </View>
        ) : filteredRecipes.length > 0 ? (
          <FlatList
            data={filteredRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.recipesList}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text>No recipes found matching your search</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingTop: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#ff8c00",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  recipesList: {
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 10,
  },
  recipeInfo: {
    flex: 1,
    padding: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recipeMeta: {
    color: "#666",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipeSearchScreen;
