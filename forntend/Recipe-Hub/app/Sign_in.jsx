import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ImageBackground, TextInput, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import icen_img from "@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg";
import { Link } from 'expo-router';
import globalStyles from '@/app/globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const validateEmail = (text) => {
    setEmail(text);
  };

  const validatePassword = (text) => {
    setPassword(text);
  };

  const handleSignIn = () => {
    if (!email) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }

    if (!emailError && !passwordError && email && password) {
      // تنفيذ عملية تسجيل الدخول هنا
    }
  };

  useEffect(() => {
    const backAction = () => {
      router.replace('/open'); // العودة للصفحة الرئيسية عند الضغط على زر الرجوع
      return true; // منع التطبيق من الإغلاق
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // إزالة المستمع عند مغادرة الصفحة
  }, []);

  return (
    <ImageBackground source={icen_img} resizeMode="cover" style={globalStyles.image}>
      <View style={globalStyles.overlay} />
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        
        {/* زر الرجوع */}
        <TouchableOpacity onPress={() => router.replace('/')} style={globalStyles.backButton}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

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

          {/* زر تسجيل الدخول */}
          <TouchableOpacity
            style={[globalStyles.createAccountButton, globalStyles.createSignIn]}
            onPress={handleSignIn}
          >
            <Text style={globalStyles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        
        </View>

        {/* رابط إنشاء حساب */}
        <Text style={globalStyles.subtitle}>
          Don't have an account? <Link href="/Comment">Create account</Link>
        </Text>
      </ScrollView>
    </ImageBackground>
  );
};

export default SignIn;
