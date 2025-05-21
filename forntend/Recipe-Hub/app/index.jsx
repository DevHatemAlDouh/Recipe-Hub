import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import icen_img from "@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg";
import globalStyles from './globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Open = () => {
  const router = useRouter();
  const [lastLoginTime, setLastLoginTime] = useState(null); // حالة لتخزين وقت آخر دخول
  const [userData, setUserData] = useState(null); // حالة لتخزين بيانات المستخدم



  useEffect(() => {
    const checkLastLogin = async () => {
      try {
        // الحصول على بيانات المستخدم من AsyncStorage
        const storedUserData = await AsyncStorage.getItem('userData');
        const currentTime = new Date();

        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserData(userData);

          // الحصول على وقت آخر دخول
          const storedLastLoginTime = await AsyncStorage.getItem('lastLoginTime');

          if (storedLastLoginTime) {
            const lastLoginDate = new Date(storedLastLoginTime);
            const monthsDifference = (currentTime.getFullYear() - lastLoginDate.getFullYear()) * 12 + (currentTime.getMonth() - lastLoginDate.getMonth());

            // إذا مرت 3 أشهر أو أكثر
            if (monthsDifference >= 3) {
              // مسح بيانات المستخدم وتوجيهه إلى صفحة تسجيل الدخول
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('lastLoginTime');
              router.replace('/SignIn');
              return;
            }
          }

          // تحديث وقت آخر دخول في كل مرة يفتح فيها التطبيق
          await AsyncStorage.setItem('lastLoginTime', currentTime.toISOString());
          setLastLoginTime(currentTime.toISOString());
        }

        // توجيه المستخدم إلى الصفحة الرئيسية بعد 15 ثانية إذا كان مسجل دخول
        setTimeout(() => {
          if (storedUserData) {
            router.replace('/(tabs)/Home'); // الانتقال إلى الصفحة الرئيسية إذا كان مسجل دخول
          } else {
            router.replace('/Sign_in'); // الانتقال إلى صفحة تسجيل الدخول إذا لم يكن مسجل دخول
          }
        }, 500);
      } catch (error) {
        console.error('Error checking last login time:', error);
      }
    };

    checkLastLogin();
  }, [router]);

  return (
    <ImageBackground source={icen_img} resizeMode="cover" style={globalStyles.image}>
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: width < 400 ? 24 : 28 }]}>Recipe Hub</Text>
        <ActivityIndicator size="large" color="#00f" style={styles.loader} />
        
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
});

export default Open;