import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator ,ImageBackground} from 'react-native';
import { useRouter } from 'expo-router';
import icen_img from "@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg";
import globalStyles from './globalStyles';

const Open = () => {
  const router = useRouter();

  useEffect(() => {
    // الانتقال إلى الشاشة التالية بعد 3 ثوانٍ
    const timer = setTimeout(() => {
      router.replace('/open'); // الانتقال إلى صفحة "Home"
    }, 15000);

    return () => clearTimeout(timer); // تنظيف المؤقت عند الخروج من الصفحة
  }, [router]);

  return (
    <ImageBackground source={icen_img} resizeMode="cover" style={globalStyles.image}>
    <View style={styles.container}>
      <Text style={styles.title}>One Piese</Text>
      <ActivityIndicator size="large" color="#00f" style={styles.loader} />
      <Text style={styles.subtitle}></Text>
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
    fontSize: 28,
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
