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

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (text) => {
    setEmail(text);
  };

  // التحقق من صحة كلمة المرور
  const validatePassword = (text) => {
    setPassword(text);
  };

  // معالجة تسجيل الدخول
  const handleSignIn = () => {
    let isValid = true;

    // التحقق من البريد الإلكتروني
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    // التحقق من كلمة المرور
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // إذا كانت جميع البيانات صحيحة، انتقل إلى الصفحة الرئيسية
    if (isValid) {
      router.replace('/Home'); // الانتقال إلى صفحة Home
    }
  };

  // التعامل مع زر الرجوع
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

          {/* حقل البريد الإلكتروني */}
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

          {/* حقل كلمة المرور */}
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
          Don't have an account? <Link href="/Create_account">Create account</Link>
        </Text>
      </ScrollView>
    </ImageBackground>
  );
};

export default SignIn;