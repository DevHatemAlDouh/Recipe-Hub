import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Profile = () => {
  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header مع تدرج لوني */}
      <LinearGradient 
        colors={['#FF6B6B', '#FFA07A']} 
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Chef John</Text>
          <Text style={styles.userBio}>Home Chef | Italian Cuisine Lover</Text>
        </View>
      </LinearGradient>

      {/* إحصائيات مطورة مع أيقونات */}
      <View style={styles.statsContainer}>
        <StatItem icon="utensils" value="45" label="Recipes" />
        <StatItem icon="users" value="1.2K" label="Followers" />
        <StatItem icon="star" value="4.8" label="Rating" />
      </View>

      {/* أزرار تفاعلية مدمجة */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Icon name="user-plus" size={18} color="#fff" />
          <Text style={styles.buttonText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Icon name="user-edit" size={18} color="#6B5B95" />
          <Text style={styles.secondaryButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* نبذة مع أيقونة */}
      <View style={styles.aboutSection}>
        <View style={styles.sectionHeader}>
          <Icon name="user-alt" size={20} color="#6B5B95" />
          <Text style={styles.sectionTitle}>About Me</Text>
        </View>
        <Text style={styles.aboutText}>
          Passionate home chef with a love for Italian cuisine. Sharing my favorite recipes and cooking tips with the world!
        </Text>
      </View>

      {/* وصفات مميزة مع تأثيرات بصرية */}
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Icon name="star" size={20} color="#FFA07A" />
          <Text style={styles.sectionTitle}>Featured Recipes</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="arrow-right" size={14} color="#6B5B95" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        >
          <RecipeCard 
            image="https://via.placeholder.com/150"
            title="Spaghetti Carbonara"
            rating={4.9}
          />
          <RecipeCard 
            image="https://via.placeholder.com/150"
            title="Tiramisu"
            rating={4.7}
          />
        </ScrollView>
      </View>

      {/* تقييمات مع تصميم متقدم */}
      <View style={styles.reviewsSection}>
        <View style={styles.sectionHeader}>
          <Icon name="comments" size={20} color="#4CAF50" />
          <Text style={styles.sectionTitle}>User Reviews</Text>
        </View>

        <ReviewItem 
          reviewer="Jane Doe"
          avatar="https://via.placeholder.com/50"
          comment="Amazing recipes! Loved the Carbonara."
          rating={5.0}
        />
      </View>
    </ScrollView>
  );
};

// مكونات فرعية لإعادة الاستخدام
const StatItem = ({ icon, value, label }) => (
  <View style={styles.statItem}>
    <Icon name={icon} size={24} color="#6B5B95" />
    <Text style={styles.statNumber}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const RecipeCard = ({ image, title, rating }) => (
  <TouchableOpacity style={styles.recipeCard}>
    <Image source={{ uri: image }} style={styles.recipeImage} />
    <LinearGradient 
      colors={['transparent', 'rgba(0,0,0,0.6)']}
      style={styles.recipeOverlay}
    />
    <View style={styles.recipeDetails}>
      <Text style={styles.recipeName}>{title}</Text>
      <View style={styles.recipeRating}>
        <Icon name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const ReviewItem = ({ avatar, reviewer, comment, rating }) => (
  <View style={styles.reviewItem}>
    <Image source={{ uri: avatar }} style={styles.reviewerImage} />
    <View style={styles.reviewContent}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{reviewer}</Text>
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
    paddingBottom: 20,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B5B95',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
    backgroundColor: '#6B5B95',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flex: 1,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#6B5B95',
    borderWidth: 1.5,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#6B5B95',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  aboutSection: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#6B5B95',
    fontSize: 14,
    marginRight: 5,
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  recipeCard: {
    width: width * 0.6,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  recipeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  recipeDetails: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  recipeName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
  },
  recipeRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
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
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  reviewerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#6B5B95',
    marginRight: 15,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default Profile;