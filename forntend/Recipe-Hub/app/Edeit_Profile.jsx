import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  const [name, setName] = useState("John Doe"); // اسم افتراضي
  const [profileImage, setProfileImage] = useState(null); // صورة افتراضية

  const handleNameChange = (text) => {
    setName(text); // تحديث الاسم عند تغييره
  };

  const handleImageChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // تحديث الصورة المختارة
    }
  };

  const handleSubmit = () => {
    Alert.alert("Profile Updated", `Name: ${name}`);
    console.log("Name:", name);
    console.log("Profile Image:", profileImage);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <View style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Image
            source={{ uri: "https://via.placeholder.com/150" }} // صورة افتراضية من الإنترنت
            style={styles.profileImage}
          />
        )}
        <TouchableOpacity style={styles.changeImageButton} onPress={handleImageChange}>
          <Text style={styles.changeImageText}>Change Image</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={handleNameChange}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F3",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#FF6B6B",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  changeImageButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  changeImageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditProfile;