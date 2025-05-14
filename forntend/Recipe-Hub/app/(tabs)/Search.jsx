import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

const RecipeSearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [allRecipes, setAllRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock data - in a real app this would come from an API
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockData = [
                {
                    id: '1',
                    title: 'Chicken Biryani',
                    image: 'https://via.placeholder.com/150',
                    cookingTime: '60 mins',
                    difficulty: 'Medium'
                },
                {
                    id: '2',
                    title: 'Tabbouleh Salad',
                    image: 'https://via.placeholder.com/150',
                    cookingTime: '20 mins',
                    difficulty: 'Easy'
                },
                {
                    id: '3',
                    title: 'Spaghetti Bolognese',
                    image: 'https://via.placeholder.com/150',
                    cookingTime: '30 mins',
                    difficulty: 'Easy'
                },
                {
                    id: '4',
                    title: 'Chocolate Cake',
                    image: 'https://via.placeholder.com/150',
                    cookingTime: '45 mins',
                    difficulty: 'Medium'
                },
                {
                    id: '5',
                    title: 'Grilled Salmon',
                    image: 'https://via.placeholder.com/150',
                    cookingTime: '25 mins',
                    difficulty: 'Easy'
                },
            ];
            setAllRecipes(mockData);
            setFilteredRecipes(mockData);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            // If search is empty, show all recipes
            setFilteredRecipes(allRecipes);
            return;
        }
        
        const filtered = allRecipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRecipes(filtered);
    };

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity style={styles.recipeCard}>
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeMeta}>⏱️ {item.cookingTime} | 🏆 {item.difficulty}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for recipes..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ff8c00" />
                    <Text>Loading recipes...</Text>
                </View>
            ) : filteredRecipes.length > 0 ? (
                <FlatList
                    data={filteredRecipes}
                    renderItem={renderRecipeItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.recipesList}
                />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text>No recipes found matching your search</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
    },
    searchButton: {
        backgroundColor: '#ff8c00',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    recipesList: {
        paddingBottom: 20,
    },
    recipeCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
    },
    recipeImage: {
        width: 100,
        height: 100,
    },
    recipeInfo: {
        flex: 1,
        padding: 15,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    recipeMeta: {
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RecipeSearchScreen;