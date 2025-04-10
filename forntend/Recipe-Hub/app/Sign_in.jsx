import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  Alert
} from 'react-native';
import icen_img from '@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg';
import { Link } from 'expo-router';
import globalStyles from '@/app/globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleSignIn = async () => {
    let valid = true;
    setLoginError('');
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    if (valid) {
      setLoading(true);
      try {
        // 1. Check if email exists and get user ID
        const checkResponse = await axios.get(`http://recipe-hub.runasp.net/api/users/CheckUserEmail/${email}`);

        const userId = checkResponse.data;

        if (userId > 0) {
          // 2. Get full user data by ID
          const userResponse = await axios.get(`http://recipe-hub.runasp.net/api/users/GetById/${userId}`);
          
          if (userResponse.status === 200 && userResponse.data) {
            const user = userResponse.data;
            
            // 3. Encrypt input password and compare
            const encryptedPassword = await Crypto.digestStringAsync(
              Crypto.CryptoDigestAlgorithm.SHA256,
              password
            );

            if (encryptedPassword === user.password) {
              // 4. Save user data and redirect
              await AsyncStorage.setItem('userData', JSON.stringify({
                id: userId,
                email: user.email,
                name: user.userName
              }));
              await AsyncStorage.setItem('lastLoginTime', new Date().toISOString());
              router.replace('/(tabs)/Home');
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
        console.error('Login error:', error.response?.data || error.message);
        setLoginError('There was an error during login. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      router.replace('/open');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <ImageBackground source={icen_img} resizeMode="cover" style={globalStyles.image}>
      <View style={globalStyles.overlay} />
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <TouchableOpacity onPress={() => router.replace('/')} style={globalStyles.backButton}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={globalStyles.content}>
          <Text style={[globalStyles.title, globalStyles.sign_In_Up_title]}>Sign in</Text>
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
          <Link href={'/Forgot_Password'}>for get</Link>
          {emailError ? <Text style={globalStyles.errorText}>{emailError}</Text> : null}
          <View style={globalStyles.inputContainer}>
            <Icon name="lock" style={globalStyles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry={!showPassword}
              style={globalStyles.input}
              value={password}
              onChangeText={validatePassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10 }}>
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={globalStyles.errorText}>{passwordError}</Text> : null}
          <TouchableOpacity
            style={[globalStyles.createAccountButton, globalStyles.createSignIn]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={globalStyles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          {loginError ? <Text style={globalStyles.errorText}>{loginError}</Text> : null}
        </View>
        <Text style={globalStyles.subtitle}>
          Don't have an account? <Link href="/Create_account">Create account</Link>
        </Text>
      </ScrollView>
    </ImageBackground>
  );
};

export default SignIn;