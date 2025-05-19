import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

<<<<<<< HEAD:forntend/Recipe-Hub/app/Profile_Content/MyRecipes.jsx
const MyRecipes = () => {
    const router = useRouter();
    
    const recipes = [
        { 
            id: '1', 
            title: 'Spaghetti Carbonara', 
            cookTime: '25 mins',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        { 
            id: '2', 
            title: 'Chicken Tikka Masala', 
            cookTime: '40 mins',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        { 
            id: '3', 
            title: 'Beef Stroganoff', 
            cookTime: '35 mins',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
    ];
=======
const Featured_Recipes = () => {
  const router = useRouter();
>>>>>>> b504ce4515062c4b6bf4845fd2cc46951e8d13e2:forntend/Recipe-Hub/app/Profile_Content/Featured_Recipes.jsx

  const recipes = [
    {
      id: "1",
      title: "Spaghetti Carbonara",
      cookTime: "25 mins",
      difficulty: "Medium",
      image:
        "https://images.unsplash.com/photo-1588013273468-315fd88ea34c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "2",
      title: "Chicken Tikka Masala",
      cookTime: "40 mins",
      difficulty: "Hard",
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "3",
      title: "Beef Stroganoff",
      cookTime: "35 mins",
      difficulty: "Medium",
      image:
        "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ];

  const handleRecipePress = (item) => {
    router.push({
      pathname: "/Profile_Content/Edeit_Recipe",
      params: {
        id: item.id,
        title: item.title,
        cookTime: item.cookTime,
        difficulty: item.difficulty,
        image: item.image,
      },
    });
    console.log(`Recipe ${item.id} pressed`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => handleRecipePress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.recipeMetaText}>{item.cookTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⚡</Text>
            <Text style={styles.recipeMetaText}>{item.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Featured Recipes</Text>
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

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
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
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

<<<<<<< HEAD:forntend/Recipe-Hub/app/Profile_Content/MyRecipes.jsx
export default MyRecipes;
=======
export default Featured_Recipes;
>>>>>>> b504ce4515062c4b6bf4845fd2cc46951e8d13e2:forntend/Recipe-Hub/app/Profile_Content/Featured_Recipes.jsx
