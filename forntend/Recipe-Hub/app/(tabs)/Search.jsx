import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RecipeSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authors, setAuthors] = useState({});

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
              authorMap[uid] = userData?.userName || "Unknown";
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
    <TouchableOpacity style={styles.recipeCard} activeOpacity={0.92}>
      <View style={styles.recipeImageContainer}>
        {item.backgroundImage ? (
          <Image
            source={{
              uri: `data:image/jpeg;base64,${item.backgroundImage}`,
            }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="restaurant-outline" size={38} color="#D1D5DB" />
          </View>
        )}
      </View>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.recipeMeta}>
          <Ionicons name="person" size={14} color="#6B5B95" />{" "}
          {authors[item.userID] || "Loading..."}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={16} color="#FF6B6B" />
            <Text style={styles.metaText}>{item.persons || 0}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="heart-outline" size={16} color="#FF6B6B" />
            <Text style={styles.metaText}>{item.rate || 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={22}
            color="#B0B0B0"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن وصفة..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="arrow-forward-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>جاري تحميل الوصفات...</Text>
          </View>
        ) : filteredRecipes.length > 0 ? (
          <FlatList
            data={filteredRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.recipesList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="alert-circle-outline" size={38} color="#FF6B6B" />
            <Text style={styles.noResultsText}>لا توجد وصفات مطابقة</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: "#6B5B95",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  recipesList: {
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 15,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#6B5B95",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  recipeImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFF5F0",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  recipeInfo: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 0,
    paddingLeft: 0,
    justifyContent: "center",
  },
  recipeTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#6B5B95",
  },
  recipeMeta: {
    color: "#888",
    fontSize: 13,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  metaText: {
    fontSize: 13,
    color: "#FF6B6B",
    marginLeft: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 10,
    color: "#6B5B95",
    fontSize: 15,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  noResultsText: {
    marginTop: 8,
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RecipeSearchScreen;
