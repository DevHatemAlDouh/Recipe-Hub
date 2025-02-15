import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import icen_img from "@/assets/images/erwan-nonon-D5vE6tDzB80-unsplash.jpg";
import globalStyles from './globalStyles';

const { width, height } = Dimensions.get('window');

const Open = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/open');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ImageBackground source={icen_img} resizeMode="cover" style={globalStyles.image}>
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: width < 400 ? 24 : 28 }]}>Recipe Hub</Text>
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