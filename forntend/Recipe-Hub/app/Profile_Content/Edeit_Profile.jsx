import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    phoneNumber: "",
    countryCode: "",
    email: "",
  });

  // تحميل بيانات المستخدم من AsyncStorage و API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await AsyncStorage.getItem("userData");
        if (data) {
          const user = JSON.parse(data);
          if (!user.id) {
            Alert.alert(
              "خطأ",
              "تعذر تحديد المستخدم. يرجى تسجيل الدخول مرة أخرى."
            );
            router.replace("/Sign_in");
            return;
          }
          setName(user.name || "");
          setProfileImage(
            user.userImage ? `data:image/jpeg;base64,${user.userImage}` : null
          );
          setUserId(user.id);

          // جلب بيانات المستخدم الكاملة من الـ API
          const apiRes = await axios.get(
            `http://recipe-hub.runasp.net/api/users/GetById/${user.id}`
          );
          const apiUser = apiRes.data;
          setUserData({
            phoneNumber: apiUser.phoneNumber || "",
            countryCode: apiUser.countryCode || "",
            email: apiUser.email || "",
            password: apiUser.password || "",
            createdAt: apiUser.createdAt,
          });
        } else {
          Alert.alert("خطأ", "تعذر تحميل بيانات المستخدم. يرجى تسجيل الدخول.");
          router.replace("/Sign_in");
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    loadUserData();
  }, []);

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleImageChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare updated user data for API
      const updatedUser = {
        id: userId,
        userName: name,
        phoneNumber: userData.phoneNumber || "",
        countryCode: userData.countryCode || "",
        email: userData.email || "",
        password: userData.password || "",
        userImage: profileImage
          ? profileImage.replace(/^data:image\/jpeg;base64,/, "")
          : "",
      };

      // Call the API to update user
      await axios.put(
        `http://recipe-hub.runasp.net/api/users/Update/${userId}`,
        updatedUser
      );

      // Save updated data locally (update all fields)
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          id: userId,
          email: updatedUser.email,
          name: updatedUser.userName,
          userImage: updatedUser.userImage,
        })
      );
      Alert.alert("تم التحديث", "تم تحديث الملف الشخصي بنجاح.");
      router.back();
    } catch (error) {
      Alert.alert("خطأ", "فشل في حفظ بيانات الملف الشخصي.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <View style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.profileImage}
          />
        )}
        <TouchableOpacity
          style={styles.changeImageButton}
          onPress={handleImageChange}
        >
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
