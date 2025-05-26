import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { router } from 'expo-router';
import PropTypes from 'prop-types';
import RecipeCard from '@/app/Components/Profile/RecipeCard';

const FavoriteRecipesSection = ({ favoriteRecipes }) => (
  <View style={styles.favoriteSection}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconContainer}>
        <Icon name="heart" size={22} color="#FF6B6B" solid />
      </View>
      <Text style={styles.sectionTitle}>My Favorite Recipes</Text>
      {favoriteRecipes.length > 2 && (
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/Profile_Content/Favorites')}
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
          onPress={() => router.push('/(tabs)/Home')}
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
        {favoriteRecipes.map(recipe => (
          <RecipeCard 
            targetScreen="RecipeDetails"
            key={recipe.id}
            {...recipe}
            
          />
        ))}
      </ScrollView>
    )}
  </View>
);

FavoriteRecipesSection.propTypes = {
  favoriteRecipes: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  favoriteSection: {
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
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#6B5B95',
    fontSize: 14,
    marginRight: 5,
    fontWeight: '600',
  },
  emptyFavorites: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    marginBottom: 20,
  },
  discoverButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  discoverButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  favoriteRecipesList: {
    paddingLeft: 5,
  },
});

export default React.memo(FavoriteRecipesSection);