import React, { useState } from 'react';
// import BottomSheet from 'reanimated-bottom-sheet';
import { View, Text, ImageBackground, TextInput, ScrollView, Button } from 'react-native';
import icen_img from "@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg";
import { Link } from 'expo-router';
import {create} from "@/app/Create_account"
import globalStyles from './globalStyles'; // تحديث المسار ليشير إلى ملف التنسيقات
import Icon from 'react-native-vector-icons/FontAwesome'; // مكتبة الأيقونات

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (text) => {
    setEmail(text);
  };

  const validatePassword = (text) => {
    setPassword(text);
  };

  const handleSignIn = () => {
    // تحقق من صحة البريد الإلكتروني
    if (!email) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }

    // تحقق من صحة كلمة المرور
    if (!password) {
      setPasswordError('Password is required');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }

    // إذا لم تكن هناك أخطاء، تنفيذ عملية تسجيل الدخول
    if (!emailError && !passwordError && email && password) {
      // Perform sign-in action here
    }
  };

  return (
    <ImageBackground source={icen_img} resizeMode="cover" style={globalStyles.image}>
      <View style={globalStyles.overlay} />
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <View style={globalStyles.content}>
          <Text style={[globalStyles.title, globalStyles.sign_In_Up_title]}>Sign in</Text>
          {/* Email Input */}
          <View style={globalStyles.inputContainer}>
            <Icon name="envelope" style={globalStyles.icon} />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#ccc"
              style={globalStyles.input}
              value={email}
              onChangeText={validateEmail}
            />
          </View>
          {emailError ? <Text style={globalStyles.errorText}>{emailError}</Text> : null}
          {/* Password Input */}
          <View style={globalStyles.inputContainer}>
            <Icon name="lock" style={globalStyles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              style={globalStyles.input}
              value={password}
              onChangeText={validatePassword}
            />
          </View>
          {passwordError ? <Text style={globalStyles.errorText}>{passwordError}</Text> : null}
          <Button href={"/create"} title="Sign in" onPress={handleSignIn} style={globalStyles.createSignInButton} />
        </View>
        <Text style={globalStyles.subtitle}>
          Don't have an account? <Link href="/Create_account">Create account</Link>
        </Text>
      </ScrollView>
    </ImageBackground>
  );
};

export default SignIn;
