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
  const [favoriteRecipes, setFavoriteRecipes] = useState([
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
      title: "Pasta Carbonara",
      rating: 4.9,
      prepTime: "20 mins",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
      title: "Greek Salad",
      rating: 4.7,
      prepTime: "15 mins",
    },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AsyncStorage.getItem("userData");
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      Alert.alert("Logged Out", "You have been logged out.");
      router.replace("/Login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const RecipeCard = ({ id, image, title, rating, prepTime }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() =>
        router.push({
          pathname: "/RecipeDetails",
          params: {
            recipeId: id,
            recipeTitle: title,
            recipeImage: image,
            recipeRating: rating,
            recipePrepTime: prepTime,
          },
        })
      }
    >
      <Image source={{ uri: image }} style={styles.recipeImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={styles.recipeOverlay}
      />
      <View style={styles.recipeDetails}>
        <Text style={styles.recipeName}>{title}</Text>
        <View style={styles.recipeInfoContainer}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" solid />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
          {prepTime && (
            <View style={styles.timeContainer}>
              <Icon name="clock" size={12} color="#fff" />
              <Text style={styles.timeText}>{prepTime}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
          <Image
            source={{
              uri: userData?.userImage
                ? `data:image/jpeg;base64,${userData.userImage}`
                : "https://randomuser.me/api/portraits/men/32.jpg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{userData?.name || "Chef John"}</Text>
          <Text style={styles.userBio}>
            {userData?.bio || "Home Chef | Italian Cuisine Lover"}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <StatItem
          icon="utensils"
          value={favoriteRecipes.length.toString()}
          label="Favorites"
        />
        <StatItem icon="star" value="4.8" label="Rating" />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("Profile_Content/Edeit_Profile")}
        >
          <Icon name="user-edit" size={18} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Favorite Recipes Section */}
      <View style={styles.favoriteSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Icon name="heart" size={22} color="#FF6B6B" solid />
          </View>
          <Text style={styles.sectionTitle}>My Favorite Recipes</Text>
          {favoriteRecipes.length > 2 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push("/Profile_Content/Favorites")}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Icon name="chevron-right" size={14} color="#6B5B95" />
            </TouchableOpacity>
          )}
        </View>

        {favoriteRecipes.length === 0 ? (
          <View style={styles.emptyFavorites}>
            <Icon name="heart-broken" size={40} color="#FF6B6B" />
            <Text style={styles.emptyText}>No favorites yet</Text>
            <TouchableOpacity
              style={styles.discoverButton}
              onPress={() => router.push("/Explore")}
            >
              <Text style={styles.discoverButtonText}>Discover Recipes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.favoriteRecipesList}
          >
            {favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                image={recipe.image}
                title={recipe.title}
                rating={recipe.rating}
                prepTime={recipe.prepTime}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Featured Recipes Section */}
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Icon name="star" size={20} color="#FFD700" />
          </View>
          <Text style={styles.sectionTitle}>Featured Recipes</Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push("/Profile_Content/Featured_Recipes")}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="chevron-right" size={14} color="#6B5B95" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recipesList}
        >
          <RecipeCard
            id="featured1"
            image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            title="Avocado Toast"
            rating={4.5}
            prepTime="10 mins"
          />
          <RecipeCard
            id="featured2"
            image="https://images.unsplash.com/photo-1518779578993-ec3579fee39f"
            title="Pancakes"
            rating={4.8}
            prepTime="25 mins"
          />
        </ScrollView>
      </View>

      {/* Reviews Section */}
      <View style={styles.reviewsSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Icon name="comments" size={20} color="#4CAF50" />
          </View>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
        </View>

        <ReviewItem
          reviewer="Sarah Johnson"
          avatar="https://randomuser.me/api/portraits/women/44.jpg"
          comment="Your carbonara recipe changed my life! So delicious and easy to make."
          rating={5.0}
          date="2 days ago"
        />
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
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
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
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
  featuredSection: {
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
  discoverButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  discoverButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  favoriteRecipesList: {
    paddingLeft: 5,
  },
  recipesList: {
    paddingLeft: 5,
  },
  recipeCard: {
    width: width * 0.5,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  recipeImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  recipeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
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
    marginBottom: 30,
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
