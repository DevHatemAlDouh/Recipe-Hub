import React, { useState, useRef } from 'react';
import {View,Text,ImageBackground,TextInput,TouchableOpacity,ActivityIndicator,} from 'react-native';
import icen_img from '@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg';
import { Link, useRouter } from 'expo-router';
import globalStyles from './globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import PhoneInput from 'react-native-phone-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import axios from 'axios';

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePasswordError, setRePasswordError] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const phoneRef = useRef(null);

  const handlePhoneChange = (value) => {
    setPhone(value);

    // الحصول على رمز الدولة باستخدام react-native-phone-input
    const countryCode = phoneRef.current?.getCountryCode() || '';
    setCountryCode(countryCode);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, countryCode);
    return phoneNumberObj && phoneNumberObj.isValid();
  };

  const handleSignUp = async () => {
    let valid = true;

    if (!name) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!phone || !validatePhoneNumber(phone)) {
      setPhoneError('Invalid phone number');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (rePassword !== password) {
      setRePasswordError('Passwords do not match');
      valid = false;
    } else {
      setRePasswordError('');
    }

    if (valid) {
      setLoading(true);
      try {
        const response = await axios.post('http://recipe-hub.runasp.net/api/users/Add', {
          userName: name,
          phoneNumber: phone.replace('+', ''), // إزالة علامة + من رقم الهاتف
          countryCode: countryCode,
          email: email,
          password: password,
        });

        if (response.status === 201) {
          router.push('/Sign_in');
        } else {
          console.error('Error:', response.data);
          alert('Error: ' + (response.data.message || 'There was an error with your registration'));
        }
      } catch (error) {
        console.error('Error during registration:', error.response?.data || error.message);
        alert('There was an error during registration: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
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
          <PhoneInput
            ref={phoneRef}
            initialCountry="ye"
            value={phone}
            onChangePhoneNumber={handlePhoneChange}
            textStyle={{ color: 'black' }}
            textProps={{ placeholder: 'Phone number' }}
          />
        </View>
        {phoneError ? <Text style={globalStyles.errorText}>{phoneError}</Text> : null}

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

        <TouchableOpacity
          style={[globalStyles.createAccountButton, globalStyles.createSignIn]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={globalStyles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <Text style={[globalStyles.subtitle]}>
          I have an account? <Link href="/Sign_in">Sign in to an account</Link>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default CreateAccount;