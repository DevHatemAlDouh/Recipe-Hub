import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { router } from 'expo-router';
import PropTypes from 'prop-types';
import RecipeCard from './RecipeCard';

const MyRecipesSection = ({ myRecipes }) => {
  return (
    <View style={styles.myRecipesSection}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconContainer, styles.myRecipesIconContainer]}>
          <Icon name="book" size={20} color="#6B5B95" solid /> {/* تغيير الأيقونة */}
        </View>
        <Text style={styles.sectionTitle}>My Recipes</Text> {/* تغيير العنوان */}
        {myRecipes.length > 2 && (
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/MyRecipes')} 
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="chevron-right" size={14} color="#6B5B95" />
          </TouchableOpacity>
        )}
      </View>

      {myRecipes.length === 0 ? (
        <View style={styles.emptySection}>
          <Icon name="book-open" size={40} color="#6B5B95" /> {/* تغيير الأيقونة */}
          <Text style={styles.emptyText}>No recipes created yet</Text> {/* تغيير النص */}
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/(tabs)/Add_Reciepe')} 
          >
            <Text style={styles.createButtonText}>Create New Recipe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recipesList}
        >
          {myRecipes.map(recipe => (
            <RecipeCard 
              key={recipe.id}
              targetScreen="MyRecipes"
              {...recipe}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

MyRecipesSection.propTypes = {
  myRecipes: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  myRecipesSection: {
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  myRecipesIconContainer: {
    backgroundColor: 'rgba(107, 91, 149, 0.1)', // لون بنفسجي فاتح
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
  emptySection: {
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
  createButton: {
    backgroundColor: '#6B5B95',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  recipesList: {
    paddingLeft: 5,
  },
});

export default React.memo(MyRecipesSection);