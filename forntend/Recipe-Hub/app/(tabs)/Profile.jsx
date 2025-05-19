import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// Components
import FavoriteRecipesSection from '@/app/Components/Profile/FavoriteRecipesSection';
import MyRecipesSection from '@/app/Components/Profile/MyRecipesSection';
import StatItem from '@/app/Components/Profile/StatItem';
import ReviewItem from '@/app/Components/Profile/ReviewItem';

const Profile = () => {
  const [favoriteRecipes] = useState([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
      title: 'Pasta Carbonara',
      rating: 4.9,
      prepTime: '20 mins'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
      title: 'Greek Salad',
      rating: 4.7,
      prepTime: '15 mins'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
      title: 'Greek Salad',
      rating: 4.7,
      prepTime: '15 mins'
    }
  ]);

  const [userRecipesList] = useState([
    // {
    //   id: 1,
    //   image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    //   title: 'Avocado Toast',
    //   rating: 4.5,
    //   prepTime: '10 mins'
    // },
    // {
    //   id: 2,
    //   image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
    //   title: 'Pancakes',
    //   rating: 4.8,
    //   prepTime: '25 mins'
    // },
    // {
    //   id: 3,
    //   image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
    //   title: 'Pancakes',
    //   rating: 4.8,
    //   prepTime: '25 mins'
    // }
  ]);

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient 
        colors={['#FF6B6B', '#FFA07A']} 
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Chef John</Text>
          <Text style={styles.userBio}>Home Chef | Italian Cuisine Lover</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <StatItem icon="utensils" value={favoriteRecipes.length} label="Favorites" />
        <StatItem icon="star" value="4.8" label="Rating" />
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => router.push('/Profile_Content/Edit_Profile')}
        >
          <Icon name="user-edit" size={18} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <FavoriteRecipesSection favoriteRecipes={favoriteRecipes} />
      <MyRecipesSection myRecipes={userRecipesList} />
      {/* <MyRecipesSection featuredRecipes={featuredRecipes} /> */}

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    backgroundColor: '#f8f8f8',
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
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  userBio: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    maxWidth: '80%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B5B95',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  reviewsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIconContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
});

export default Profile;