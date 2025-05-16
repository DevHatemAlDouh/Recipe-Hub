import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Favorites = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorites</Text>
            <Text style={styles.description}>This is the Favorites page.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
    },
});

export default Favorites;