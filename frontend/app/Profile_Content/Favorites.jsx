import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Favorites = () => {
  const [ingredients, setIngredients] = useState([]);
  const [favorites, setFavorites] = useState([]); // [{id, ingredientID, type}]
  const [loading, setLoading] = useState(true);
  const [selectedPreferred, setSelectedPreferred] = useState();
  const [selectedNotPreferred, setSelectedNotPreferred] = useState();
  const [userId, setUserId] = useState();

  // Fetch ingredients and user favorites
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("userData");
        const user = data ? JSON.parse(data) : null;
        if (!user?.id) {
          Alert.alert("Error", "User not found.");
          setLoading(false);
          return;
        }
        setUserId(user.id);

        const [ingredientsRes, favoritesRes] = await Promise.all([
          fetch("http://recipe-hub.runasp.net/api/Ingredients/GetAll"),
          fetch(
            `http://recipe-hub.runasp.net/api/users/GetAllMyFavorites/${user.id}`
          ),
        ]);
        const ingredientsData = await ingredientsRes.json();
        const favoritesData = await favoritesRes.json();

        setIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);
        setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "Failed to load data.");
      }
    };
    fetchData();
  }, []);

  // Preferred and not preferred IDs
  const preferred = favorites
    .filter((f) => f.type === "preferred")
    .map((f) => f.ingredientID);
  const notPreferred = favorites
    .filter((f) => f.type === "notPreferred")
    .map((f) => f.ingredientID);

  // Add to preferred (add to local list only)
  const addPreferred = () => {
    if (
      selectedPreferred &&
      !preferred.includes(selectedPreferred) &&
      !notPreferred.includes(selectedPreferred)
    ) {
      setFavorites([
        ...favorites,
        {
          id: Date.now(), // temporary unique id for UI
          userID: userId,
          ingredientID: selectedPreferred,
          type: "preferred",
        },
      ]);
      setSelectedPreferred(undefined);
    }
  };

  // Add to not preferred (add to local list only)
  const addNotPreferred = () => {
    if (
      selectedNotPreferred &&
      !notPreferred.includes(selectedNotPreferred) &&
      !preferred.includes(selectedNotPreferred)
    ) {
      setFavorites([
        ...favorites,
        {
          id: Date.now(), // temporary unique id for UI
          userID: userId,
          ingredientID: selectedNotPreferred,
          type: "notPreferred",
        },
      ]);
      setSelectedNotPreferred(undefined);
    }
  };

  // Remove from preferred or not preferred (remove from local list only)
  const removeFavorite = (favoriteId) => {
    setFavorites(favorites.filter((f) => f.id !== favoriteId));
  };

  // Send all preferences to API
  const handleSend = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      const user = data ? JSON.parse(data) : null;
      if (!user?.id) {
        Alert.alert("Error", "User not found.");
        return;
      }
      // Send all favorites (preferred and notPreferred)
      for (const fav of favorites) {
        await fetch("http://recipe-hub.runasp.net/api/users/AddFavorite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: 0,
            userID: user.id,
            ingredientID: fav.ingredientID,
            type: fav.type,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        });
      }
      Alert.alert("Success", "Preferences sent!");
    } catch {
      Alert.alert("Error", "Failed to send preferences.");
    }
  };

  return (
    <LinearGradient colors={["#FFA07A", "#FF6B6B"]} style={styles.container}>
      <Text style={styles.title}>Select Your Ingredient Preferences</Text>
      <Text style={styles.subtitle}>
        Add ingredients you love or dislike/allergic to.
      </Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollArea}>
          {/* Preferred Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Ingredients</Text>
            <View style={styles.pickerRow}>
              <Picker
                selectedValue={selectedPreferred}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedPreferred(itemValue)}
                dropdownIconColor="#FF6B6B"
              >
                <Picker.Item label="Select ingredient..." value={undefined} />
                {ingredients
                  .filter(
                    (ing) =>
                      !preferred.includes(ing.id) &&
                      !notPreferred.includes(ing.id)
                  )
                  .map((ing) => (
                    <Picker.Item key={ing.id} label={ing.name} value={ing.id} />
                  ))}
              </Picker>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addPreferred}
                disabled={!selectedPreferred}
              >
                <Icon name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.listArea}>
              {favorites.filter((f) => f.type === "preferred").length === 0 && (
                <Text style={styles.emptyText}>No preferred ingredients.</Text>
              )}
              {favorites
                .filter((f) => f.type === "preferred")
                .map((fav) => {
                  const ing = ingredients.find(
                    (i) => i.id === fav.ingredientID
                  );
                  if (!ing) return null;
                  return (
                    <View key={fav.id} style={styles.listItem}>
                      <Text style={styles.ingredientText}>{ing.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFavorite(fav.id)}
                        style={styles.removeButton}
                      >
                        <Icon name="times" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          </View>

          {/* Not Preferred Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Not Preferred / Allergic</Text>
            <View style={styles.pickerRow}>
              <Picker
                selectedValue={selectedNotPreferred}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setSelectedNotPreferred(itemValue)
                }
                dropdownIconColor="#333"
              >
                <Picker.Item label="Select ingredient..." value={undefined} />
                {ingredients
                  .filter(
                    (ing) =>
                      !notPreferred.includes(ing.id) &&
                      !preferred.includes(ing.id)
                  )
                  .map((ing) => (
                    <Picker.Item key={ing.id} label={ing.name} value={ing.id} />
                  ))}
              </Picker>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: "#333" }]}
                onPress={addNotPreferred}
                disabled={!selectedNotPreferred}
              >
                <Icon name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.listArea}>
              {favorites.filter((f) => f.type === "notPreferred").length ===
                0 && (
                <Text style={styles.emptyText}>
                  No not preferred ingredients.
                </Text>
              )}
              {favorites
                .filter((f) => f.type === "notPreferred")
                .map((fav) => {
                  const ing = ingredients.find(
                    (i) => i.id === fav.ingredientID
                  );
                  if (!ing) return null;
                  return (
                    <View key={fav.id} style={styles.listItem}>
                      <Text style={styles.ingredientText}>{ing.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeFavorite(fav.id)}
                        style={styles.removeButton}
                      >
                        <Icon name="times" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          </View>
          {/* Send Button */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={loading}
          >
            <Icon name="paper-plane" size={18} color="#fff" />
            <Text style={styles.sendButtonText}>Send Preferences</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollArea: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    height: 60, // changed from 30 to 60
    minHeight: 60,
    maxHeight: 60,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  listArea: {
    marginTop: 6,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    justifyContent: "space-between",
  },
  ingredientText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#FF6B6B",
    borderRadius: 16,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#aaa",
    fontStyle: "italic",
    fontSize: 14,
    marginTop: 4,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B5B95",
    borderRadius: 24,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 30,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default Favorites;
