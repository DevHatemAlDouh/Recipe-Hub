import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';

const ReviewItem = ({ avatar, reviewer, comment, rating, date }) => (
  <View style={styles.reviewItem}>
    <Image 
      source={{ uri: avatar }} 
      style={styles.reviewerImage}
      defaultSource={require('../../../assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg')}
    />
    <View style={styles.reviewContent}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.reviewerName} numberOfLines={1}>{reviewer}</Text>
          <Text style={styles.reviewDate}>{date}</Text>
        </View>
        <View style={styles.reviewRating}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.reviewText} numberOfLines={3}>{comment}</Text>
    </View>
  </View>
);

ReviewItem.propTypes = {
  avatar: PropTypes.string,
  reviewer: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 10,
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
    maxWidth: '70%',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 91, 149, 0.1)',
    borderRadius: 8,
    padding: 4,
  },
  ratingText: {
    color: '#6B5B95',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default React.memo(ReviewItem);