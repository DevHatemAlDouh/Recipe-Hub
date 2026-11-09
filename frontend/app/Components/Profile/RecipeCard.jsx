import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');

const RecipeCard = ({ id, image, title, rating, prepTime, targetScreen }) => (
  <TouchableOpacity
    style={styles.recipeCard}
    onPress={() => router.push({
      pathname: `/${targetScreen}`,
      params: { 
        recipeId: id,
        recipeTitle: title,
        recipeImage: image,
        recipeRating: rating,
        recipePrepTime: prepTime
      }
    })}
  >
    <Image 
      source={{ uri: image }} 
      style={styles.recipeImage}
      defaultSource={require('../../../assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg')} 
    />
    <LinearGradient 
      colors={['transparent', 'rgba(0,0,0,0.7)']}
      style={styles.recipeOverlay}
    />
    <View style={styles.recipeDetails}>
      <Text style={styles.recipeName} numberOfLines={1}>{title}</Text>
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

RecipeCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  prepTime: PropTypes.string,
  targetScreen: PropTypes.oneOf(['RecipeDetails', 'MyRecipes']).isRequired,
};

const styles = StyleSheet.create({
  recipeCard: {
    width: width * 0.5,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  recipeImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  recipeOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: '50%',
  },
  recipeDetails: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  recipeName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
  },
  recipeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  ratingText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
  },
  timeText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default React.memo(RecipeCard);