import React, { useState, useRef } from 'react';
import { View, Text, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import icen_img from "@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg";
import { Link, useRouter } from 'expo-router'; // استيراد useRouter
import globalStyles from './globalStyles'; // تحديث المسار ليشير إلى ملف التنسيقات
import Icon from 'react-native-vector-icons/FontAwesome'; // مكتبة الأيقونات
import PhoneInput from 'react-native-phone-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // استيراد المكتبة للتحقق من صحة رقم الهاتف

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
  
  const router = useRouter(); // استخدام useRouter للانتقال
  const phoneRef = useRef(null); // إنشاء المرجع لـ PhoneInput

  const handlePhoneChange = (value) => {
    setPhone(value);
    if (value && !validatePhoneNumber(value)) {
      setPhoneError('Invalid phone number');
    } else {
      setPhoneError('');
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberObj = parsePhoneNumberFromString(phoneNumber);
    return phoneNumberObj && phoneNumberObj.isValid();
  };

  const handleSignUp = () => {
    // تحقق من صحة الاسم
    let valid = true;

    // التحقق من الاسم
    if (!name) {
      setNameError('Name is required');
      valid = false;
    } else if (name.length < 3) { // تصحيح: يجب أن يكون الاسم 3 أحرف على الأقل
      setNameError('Name must be at least 3 characters'); // تصحيح: استخدام setNameError بدلاً من setName
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

    // تحقق من صحة رقم الهاتف
    if (!phone) {
      setPhoneError('Phone number is required');
      valid = false;
    } else if (!validatePhoneNumber(phone)) {
      setPhoneError('Invalid phone number');
      valid = false;
    } else {
      setPhoneError('');
    }

    // تحقق من صحة كلمة المرور
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    // تحقق من مطابقة كلمة المرور المعاد إدخالها
    if (!rePassword) {
      setRePasswordError('Re-enter password is required');
      valid = false;
    } else if (rePassword !== password) {
      setRePasswordError('Passwords do not match');
      valid = false;
    } else {
      setRePasswordError('');
    }

    // إذا لم تكن هناك أخطاء، الانتقال إلى صفحة تسجيل الدخول
    if (valid) {
      router.push('/Sign_in');
    }
  };

  return (
    <ImageBackground source={icen_img} resizeMode="cover" style={globalStyles.image}>
      <View style={globalStyles.overlay} />
      <View style={[globalStyles.container, globalStyles.content]}>
        <Text style={[globalStyles.title, globalStyles.sign_In_Up_titl]}>
          Create account
        </Text>
        
        {/* حقل الاسم */}
        <View style={[
          globalStyles.inputContainer,
          { borderColor: nameError ? 'red' : 'white' } // تغيير لون الحدود بناءً على وجود خطأ
        ]}>
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

        {/* حقل البريد الإلكتروني */}
        <View style={[
          globalStyles.inputContainer,
          { borderColor: emailError ? 'red' : 'white' } // تغيير لون الحدود بناءً على وجود خطأ
        ]}>
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

        {/* حقل رقم الهاتف */}
        <View style={[
          globalStyles.inputContainer,
          { borderColor: phoneError ? 'red' : 'white' } // تغيير لون الحدود بناءً على وجود خطأ
        ]}>
          <PhoneInput
            ref={phoneRef} // استخدام useRef بدلاً من this
            initialCountry="ye" // البلد الافتراضي (اليمن)
            value={phone} // القيمة الحالية لرقم الهاتف
            onChangePhoneNumber={handlePhoneChange} // تحديث القيمة عند التغيير
            textStyle={{ color: 'black' }} // تنسيق النص
            textProps={{ placeholder: 'Phone number' }} // النص البديل
          />
        </View>
        {phoneError ? <Text style={globalStyles.errorText}>{phoneError}</Text> : null}

        {/* حقل كلمة المرور */}
        <View style={[
          globalStyles.inputContainer,
          { borderColor: passwordError ? 'red' : 'white' } // تغيير لون الحدود بناءً على وجود خطأ
        ]}>
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

        {/* حقل إعادة إدخال كلمة المرور */}
        <View style={[
          globalStyles.inputContainer,
          { borderColor: rePasswordError ? 'red' : 'white' } // تغيير لون الحدود بناءً على وجود خطأ
        ]}>
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

        {/* زر إنشاء الحساب */}
        <TouchableOpacity
          style={[globalStyles.createAccountButton, globalStyles.createSignIn]}
          onPress={handleSignUp}
        >
          <Text style={globalStyles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* رابط تسجيل الدخول */}
        <Text style={[globalStyles.subtitle]}>
          I have an account? <Link href="/Sign_in">Sign in to an account</Link>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default CreateAccount;