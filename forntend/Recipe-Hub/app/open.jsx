import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import icen_img from "@/assets/images/alyona-yankovska-AlrHfEvOexw-unsplash.jpg";
import globalStyles from '@/app/globalStyles';

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
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;
