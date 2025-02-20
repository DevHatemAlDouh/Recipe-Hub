import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const Navbar = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: '#333' }}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.replace('/open')} style={styles.navItem}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/Sign_in')} style={styles.navItem}>
          <Text style={styles.navText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/Create_account')} style={styles.navItem}>
          <Text style={styles.navText}>Create account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/Comment')} style={styles.navItem}>
          <Text style={styles.navText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute', // جعل الشريط ثابتًا
    top: 50, // المسافة من الأعلى
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333', // لون خلفية الشريط
    paddingVertical: 10,
    zIndex: 10, // التأكد من أن الشريط يظهر فوق العناصر الأخرى
  },
  navItem: {
    paddingHorizontal: 10,
  },
  navText: {
    color: '#fff', // لون النص
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Navbar;