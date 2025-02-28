import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ImageBackground, TextInput, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import icen_img from "@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg";
import { Link } from 'expo-router';
import globalStyles from '@/app/globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState(''); // رسالة خطأ لتسجيل الدخول
  const router = useRouter();

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (text) => {
    setEmail(text);
    if (!text) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(text)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  // التحقق من صحة كلمة المرور
  const validatePassword = (text) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password is required');
    } else if (text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  // معالجة تسجيل الدخول
  const handleSignIn = async () => {
    let valid = true;
    setLoginError(''); // إعادة تعيين رسالة الخطأ

    // التحقق من صحة البريد الإلكتروني
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

    // التحقق من صحة كلمة المرور
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    // إذا كانت البيانات صحيحة، قم بإرسالها إلى الخادم
    if (valid) {
      try {
        // الخطوة 1: استرجاع جميع المستخدمين
        const usersResponse = await axios.get('http://recipe-hub.runasp.net/api/users/GetAll');

        // البحث عن المستخدم باستخدام البريد الإلكتروني
        const user = usersResponse.data.find(u => u.email === email);

        if (user) {
          // الخطوة 2: استرجاع بيانات المستخدم باستخدام الـ ID
          const userResponse = await axios.get(`http://recipe-hub.runasp.net/api/users/GetById/${user.id}`);

          // إذا تم العثور على المستخدم
          if (userResponse.status === 200 && userResponse.data) {
            const userData = userResponse.data;

            // التحقق من صحة كلمة المرور (هذا مثال بسيط، يجب استخدام مكتبة مثل bcrypt لمقارنة كلمات المرور)
            if (userData.password === password) {
              // توجيه المستخدم إلى الصفحة الرئيسية
              router.push('/');
            } else {
              setLoginError('Invalid email or password');
            }
          } else {
            setLoginError('User not found');
          }
        } else {
          setLoginError('User not found');
        }
      } catch (error) {
        console.error('Error during login:', error.response?.data || error.message);
        setLoginError('There was an error during login. Please try again later.');
      }
    }
  };

  // منع العودة إلى الشاشة السابقة
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

          {/* رسالة الخطأ في حالة فشل تسجيل الدخول */}
          {loginError ? <Text style={globalStyles.errorText}>{loginError}</Text> : null}
        
        </View>

        {/* رابط إنشاء حساب */}
        <Text style={globalStyles.subtitle}>
          Don't have an account? <Link href="/Photo">Create account</Link>
        </Text>
      </ScrollView>
    </ImageBackground>
  );
};

export default SignIn;