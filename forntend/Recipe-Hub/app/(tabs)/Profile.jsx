import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [myRecipes, setMyRecipes] = useState([]);

  useEffect(() => {
    const fetchUserDataAndRecipes = async () => {
      try {
        const data = await AsyncStorage.getItem("userData");
        let user = null;
        if (data) {
          user = JSON.parse(data);
          setUserData(user);
        }
        if (user?.id) {
          const res = await fetch(
            `http://recipe-hub.runasp.net/api/users/GetAllMyRecipes?userId=${user.id}`
          );
          const recipes = await res.json();
          setMyRecipes(Array.isArray(recipes) ? recipes : []);
        }
      } catch (error) {
        console.error("Failed to load user data or recipes:", error);
      }
    };
    fetchUserDataAndRecipes();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      Alert.alert("Logged Out", "You have been logged out.");
      router.replace("/Sign_in");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const RecipeCard = ({ id, backgroundImage, title, rate, persons }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() =>
        router.push({
          pathname: "/RecipeDetails",
          params: {
            id,
            title,
            image: backgroundImage,
            rating: rate,
            prepTime: persons ? `${persons} persons` : "",
          },
        })
      }
      activeOpacity={0.92}
    >
      <Image source={{ uri: backgroundImage }} style={styles.recipeImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={styles.recipeOverlay}
      />
      <View style={styles.recipeDetails}>
        <Text style={styles.recipeName} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.recipeInfoContainer}>
          <View style={styles.ratingContainer}>
            <Icon name="heart" size={14} color="#FF6B6B" solid />
            <Text style={styles.ratingText}>{rate}</Text>
          </View>
          {persons ? (
            <View style={styles.timeContainer}>
              <Icon name="users" size={12} color="#fff" />
              <Text style={styles.timeText}>{persons} People</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Calculate total views for all recipes
  const totalViews = myRecipes.reduce(
    (sum, recipe) => sum + (recipe.view || 0),
    0
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#FF6B6B", "#FFA07A"]}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={{
                uri: userData?.userImage
                  ? `data:image/jpeg;base64,${userData.userImage}`
                  : "https://randomuser.me/api/portraits/men/32.jpg",
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => router.push("Profile_Content/Edeit_Profile")}
            >
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData?.name || "Chef John"}</Text>
          <Text style={styles.userBio}>
            {userData?.bio || "Home Chef | Italian Cuisine Lover"}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <StatItem
          icon="utensils"
          value={myRecipes.length.toString()}
          label="My descriptions"
        />
        <StatItem icon="eye" value={totalViews.toString()} label="The views" />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("Profile_Content/Edeit_Profile")}
        >
          <Icon name="user-edit" size={18} color="#fff" />
          <Text style={styles.buttonText}>Edit the file</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/Profile_Content/Favorites")}
        >
          <Icon name="heart" size={18} color="#6B5B95" solid />
          <Text style={styles.secondaryButtonText}>The favorite</Text>
        </TouchableOpacity>
      </View>

      {/* My Recipes Section */}
      <View style={styles.favoriteSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Icon name="book" size={22} color="#FF6B6B" solid />
          </View>
          <Text style={styles.sectionTitle}>My descriptions</Text>
          {myRecipes.length > 2 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push("/Profile_Content/MyRecipes")}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <Icon name="chevron-left" size={14} color="#6B5B95" />
            </TouchableOpacity>
          )}
        </View>

        {myRecipes.length === 0 ? (
          <View style={styles.emptyFavorites}>
            <Icon name="book-dead" size={40} color="#FF6B6B" />
            <Text style={styles.emptyText}>There are no recipes yet.</Text>
            <TouchableOpacity
              style={styles.discoverButton}
              onPress={() => router.push("/Add_Reciepe")}
            >
              <Text style={styles.discoverButtonText}>Add a new recipe</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.favoriteRecipesList}
          >
            {myRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                backgroundImage={recipe.backgroundImage}
                title={recipe.title}
                rate={recipe.rate}
                persons={recipe.persons}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const StatItem = ({ icon, value, label }) => (
  <View style={styles.statItem}>
    <Icon name={icon} size={24} color="#6B5B95" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ReviewItem = ({ avatar, reviewer, comment, rating, date }) => (
  <View style={styles.reviewItem}>
    <Image source={{ uri: avatar }} style={styles.reviewerImage} />
    <View style={styles.reviewContent}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.reviewerName}>{reviewer}</Text>
          <Text style={styles.reviewDate}>{date}</Text>
        </View>
        <View style={styles.reviewRating}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>{comment}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    backgroundColor: "#f8f8f8",
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: "center",
  },
  profileImageWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#6B5B95",
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  userBio: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    maxWidth: "80%",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B5B95",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B5B95",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#6B5B95",
    borderWidth: 1.5,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#6B5B95",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionIconContainer: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: "#6B5B95",
    fontSize: 14,
    marginRight: 5,
    fontWeight: "600",
  },
  favoriteSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  reviewsSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyFavorites: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 15,
    marginBottom: 20,
  },
  recipeDetails: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  recipeName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 8,
  },
  recipeInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  ratingText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  timeText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  reviewItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  reviewerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#6B5B95",
    marginRight: 15,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderColor: "#FF6B6B",
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 40,
    marginTop: 10,
    marginBottom: 50,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    color: "#FF6B6B",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Profile;
