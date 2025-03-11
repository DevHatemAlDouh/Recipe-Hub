import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import icen_img from '@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg';
import { Link, useRouter } from 'expo-router';
import globalStyles from './globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import PhoneInput from 'react-native-phone-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; // استيراد FileSystem

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
  const [userImage, setUserImage] = useState(null); // حالة لتخزين رابط الصورة
  const [b_userImage, b_setUserImage] = useState(null); // حالة لتخزين الصورة كـ base64
  const [showPassword, setShowPassword] = useState(false); // حالة إظهار/إخفاء كلمة المرور
  const [showRePassword, setShowRePassword] = useState(false); // حالة إظهار/إخفاء إعادة كلمة المرور

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserImage(result.assets[0].uri); // تعيين رابط الصورة

      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      b_setUserImage(base64); // تخزين الصورة كـ base64
    }
  };

  const handleSignUp = async () => {
    let valid = true;

    // التحقق من الحقول المطلوبة
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

    // التحقق من وجود صورة
    if (!userImage) {
      Alert.alert('Error', 'Please select a profile image.');
      valid = false;
    }

    if (valid) {
      setLoading(true);
      try {
        const usersResponse = await axios.get('http://recipe-hub.runasp.net/api/users/GetAll');

        // البحث عن المستخدم باستخدام البريد الإلكتروني
        const user = usersResponse.data.find(u => u.email === email);
        if (!user) {
          const response = await axios.post('http://recipe-hub.runasp.net/api/users/Add', {
            userName: name,
            phoneNumber: phone.replace('+', ''),
            countryCode: countryCode,
            email: email,
            password: password,
            userImage: b_userImage, // إرسال الصورة كـ base64
            userInfo: {
              // إضافة معلومات إضافية إذا كان الخادم يتطلبها
              bio: 'New user',
              joinDate: new Date().toISOString(),
            },
          });
          if (response.status === 201) {
            router.push('/Sign_in');
          } else {
            console.error('Error:', response.data);
            Alert.alert('Error', response.data.message || 'There was an error with your registration');
          }
        } else {
          Alert.alert('Error', 'This email is already registered.');
        }
      } catch (error) {
        console.error('Error during registration:', error.response?.data || error.message);
        Alert.alert('Error', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ImageBackground source={icen_img} resizeMode="cover" style={globalStyles.image}>
      <View style={globalStyles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // ضبط الإزاحة لنظام iOS
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled" // يمنع إخفاء الكيبورد عند النقر خارج الحقول
        >
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
                textStyle={{ color: '#ccc' }}
                textProps={{ placeholder: 'Phone number' }}
              />
            </View>
            {phoneError ? <Text style={globalStyles.errorText}>{phoneError}</Text> : null}

            <View style={globalStyles.inputContainer}>
              <Icon name="lock" style={globalStyles.icon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#ccc"
                secureTextEntry={!showPassword} // إظهار/إخفاء كلمة المرور بناءً على الحالة
                style={globalStyles.input}
                value={password}
                onChangeText={setPassword}
              />
              {/* أيقونة العين لكلمة المرور */}
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 10 }}
              >
                <Icon
                  name={showPassword ? 'eye-slash' : 'eye'}
                  size={20}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={globalStyles.errorText}>{passwordError}</Text> : null}

            <View style={globalStyles.inputContainer}>
              <Icon name="lock" style={globalStyles.icon} />
              <TextInput
                placeholder="Re-enter Password"
                placeholderTextColor="#ccc"
                secureTextEntry={!showRePassword} // إظهار/إخفاء إعادة كلمة المرور بناءً على الحالة
                style={globalStyles.input}
                value={rePassword}
                onChangeText={setRePassword}
              />
              {/* أيقونة العين لإعادة كلمة المرور */}
              <TouchableOpacity
                onPress={() => setShowRePassword(!showRePassword)}
                style={{ position: 'absolute', right: 10 }}
              >
                <Icon
                  name={showRePassword ? 'eye-slash' : 'eye'}
                  size={20}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>
            {rePasswordError ? <Text style={globalStyles.errorText}>{rePasswordError}</Text> : null}

            {/* زر اختيار الصورة */}
            <View style={styles.photoContainer}>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Choose picture</Text>
              </TouchableOpacity>

              {userImage && (
                <Image
                  source={{ uri: userImage }}
                  style={styles.image}
                />
              )}
            </View>

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
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20, // إضافة مسافة أسفل الصفحة
  },
  photoContainer: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6B8E23',
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: 'cover',
  },
});

export default CreateAccount;