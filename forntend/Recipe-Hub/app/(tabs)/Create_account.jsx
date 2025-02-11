import React, { useState } from 'react';
import { View, Text, ImageBackground, TextInput, Button , StyleSheet} from 'react-native';
import icen_img from "@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg";
import { Link, useRouter } from 'expo-router'; // استيراد useRouter
import globalStyles from './globalStyles'; // تحديث المسار ليشير إلى ملف التنسيقات
import Icon from 'react-native-vector-icons/FontAwesome'; // مكتبة الأيقونات

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePasswordError, setRePasswordError] = useState('');
  const router = useRouter(); // استخدام useRouter للانتقال

  const handleSignUp = () => {
    // تحقق من صحة الاسم
    if (!name) {
      setNameError('Name is required');
    } else {
      setNameError('');
    }

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

    // تحقق من مطابقة كلمة المرور المعاد إدخالها
    if (!rePassword) {
      setRePasswordError('Re-enter password is required');
    } else if (rePassword !== password) {
      setRePasswordError('Passwords do not match');
    } else {
      setRePasswordError('');
    }

    // إذا لم تكن هناك أخطاء، الانتقال إلى صفحة تسجيل الدخول
    if (!nameError && !emailError && !passwordError && !rePasswordError && name && email && password && rePassword) {
      router.push('/Sign_in'); // الانتقال إلى صفحة تسجيل الدخول
    }
  };

  return (
    <ImageBackground source={icen_img} resizeMode="cover" style={globalStyles.image}>
      <View style={globalStyles.overlay} />
      <View style={[globalStyles.container, globalStyles.content]}>
        <Text style={[globalStyles.title, globalStyles.sign_In_Up_titl]}>
          Create account
        </Text>
        <View style={globalStyles.inputContainer}>
          <Icon name="user" style={globalStyles.icon} />
          <TextInput
            placeholder="User Name"
            placeholderTextColor="#ccc"
            style={globalStyles.input}
            value={name}
            onChangeText={setName}
          />
        </View>
        {nameError ? <Text style={globalStyles.errorText}>{nameError}</Text> : null}
        <View style={globalStyles.inputContainer}>
          <Icon name="envelope" style={globalStyles.icon} />
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#ccc"
            style={globalStyles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {emailError ? <Text style={globalStyles.errorText}>{emailError}</Text> : null}
        <View style={globalStyles.inputContainer}>
          <Icon name="lock" style={globalStyles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            style={globalStyles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {passwordError ? <Text style={globalStyles.errorText}>{passwordError}</Text> : null}
        
        <View style={globalStyles.inputContainer}>
          <Icon name="lock" style={globalStyles.icon} />
          <TextInput
            placeholder="Re-enter Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            style={globalStyles.input}
            value={rePassword}
            onChangeText={setRePassword}
          />
        </View>
        {rePasswordError ? <Text style={globalStyles.errorText}>{rePasswordError}</Text> : null}
        <Button title="Add account" onPress={handleSignUp} style={[globalStyles.createAccountButton, globalStyles.createSignIn]} />
      </View>
    </ImageBackground>
  );
};

export default CreateAccount;
