<<<<<<< HEAD
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import icen_img from "@/assets/images/alyona-yankovska-AlrHfEvOexw-unsplash.jpg";
import { Link } from 'expo-router';
=======
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import icen_img from "@/assets/images/alyona-yankovska-AlrHfEvOexw-unsplash.jpg";
>>>>>>> 08b19c66b146f08122454c1f8499c95cff25cad2
import globalStyles from './globalStyles';

const Home = () => {
  const router = useRouter();

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={icen_img} resizeMode="cover" style={globalStyles.image}>
        <View style={globalStyles.overlay} />
        <View style={globalStyles.content}>
          <Text style={globalStyles.title}>Hello, welcome</Text>
          <Text style={globalStyles.subtitle}>
            Welcome to Recipe Hub, the top platform for recipes
          </Text>
<<<<<<< HEAD
          
          {/* زر مخصص */}
          <TouchableOpacity
            style={ [globalStyles.signInButton, globalStyles.createSignIn]}
            onPress={() => router.replace('/Sign_in')} // الانتقال إلى صفحة Sign_in عند الضغط
          >
            <Text style={styles.buttonText}>Go to Sign In</Text>
          </TouchableOpacity>
                    {/* <Link href="/Sign_in" style={[globalStyles.signInButton, globalStyles.createSignIn]}>
            Sign in
          </Link> */}

<TouchableOpacity
            style={ [globalStyles.createAccountButton, globalStyles.createSignIn]}
            onPress={() => router.replace('/Create_account')} // الانتقال إلى صفحة Sign_in عند الضغط
          >
            <Text style={styles.buttonText}>Go to Create Account</Text>
          </TouchableOpacity>
          
          {/* <Link href="/Create_account" style={[globalStyles.createAccountButton, globalStyles.createSignIn]}>
            Create account
          </Link> */}
=======

          {/* زر مخصص */}
          <TouchableOpacity
            style={[globalStyles.signInButton, globalStyles.createSignIn]}
            onPress={() => router.replace('/Sign_in')} // الانتقال إلى صفحة Sign_in عند الضغط
          >
            <Text style={globalStyles.buttonText}>Go to Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.createAccountButton, globalStyles.createSignIn]}
            onPress={() => router.replace('/Create_account')} // الانتقال إلى صفحة Create_account عند الضغط
          >
            <Text style={globalStyles.buttonText}>Go to Create Account</Text>
          </TouchableOpacity>
>>>>>>> 08b19c66b146f08122454c1f8499c95cff25cad2
        </View>
      </ImageBackground>
    </View>
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF', // لون الخلفية
    paddingVertical: 12, // التباعد العلوي والسفلي
    paddingHorizontal: 20, // التباعد الجانبي
    borderRadius: 10, // الحواف الدائرية
    marginTop: 20, // المسافة العلوية
  },
  buttonText: {
    color: '#fff', // لون النص
    fontSize: 16, // حجم الخط
    fontWeight: 'bold', // الخط عريض
    textAlign: 'center', // النص في المنتصف
  },
});

=======
>>>>>>> 08b19c66b146f08122454c1f8499c95cff25cad2
export default Home;
