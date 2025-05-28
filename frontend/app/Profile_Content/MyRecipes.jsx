import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const MyRecipes = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const user = userData ? JSON.parse(userData) : null;
        
        if (!user?.id) {
          setRecipes([]);
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://recipe-hub.runasp.net/api/users/GetAllMyRecipes?userId=${user.id}`
        );

        const validatedRecipes = res.data.map(recipe => ({
          ...recipe,
          backgroundImage: recipe.backgroundImage 
            ? `data:image/jpeg;base64,${recipe.backgroundImage}`
            : null
        }));

        setRecipes(validatedRecipes);
      } catch (error) {
        console.error("Fetch error:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyRecipes();
  }, []);

  const handleRecipePress = (item) => {
    router.push({
      pathname: "/Profile_Content/Edeit_Recipe",
      params: {
        id: item.id,
        title: item.title,
        cookTime: item.cookTime || "",
        difficulty: item.difficulty || "",
        image: item.backgroundImage,
      },
    });
  };

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const renderItem = ({ item }) => {
    const imageUri = imageErrors[item.id] 
      ? "https://source.unsplash.com/400x300/?food"
      : item.backgroundImage || "https://source.unsplash.com/400x300/?food";

    return (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => handleRecipePress(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.recipeImage}
          onError={() => handleImageError(item.id)}
          resizeMode="cover"
          progressiveRenderingEnabled
        />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <View style={styles.recipeMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>👥</Text>
              <Text style={styles.recipeMetaText}>{item.persons} أشخاص</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⭐</Text>
              <Text style={styles.recipeMetaText}>{item.rate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>👁️</Text>
              <Text style={styles.recipeMetaText}>{item.view}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6B5B95" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>وصفاتي</Text>
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            لا توجد وصفات بعد
          </Text>
        }
      />
    </View>
  );
};

// الأنماط تبقى كما هي بدون تغيير
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F5F0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4A3120",
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#4A3120",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  recipeImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  recipeInfo: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#4A3120",
  },
  recipeMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  metaIcon: {
    marginRight: 6,
  },
  recipeMetaText: {
    fontSize: 14,
    color: "#8D6E63",
    fontWeight: "500",
  },
  separator: {
    height: 18,
  },
});

export default MyRecipes;