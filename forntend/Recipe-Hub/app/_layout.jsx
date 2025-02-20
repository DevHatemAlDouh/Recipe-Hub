import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
// import {StyleSheet} from "react-native";

export default function RootLayout() {
  return (

    <SafeAreaProvider>
      <StatusBar style="auto"  />

      <Stack>

      <Stack.Screen name="open" options={{headerShown: false }}/>
      <Stack.Screen name="index" options={{headerShown: false }}/>
      <Stack.Screen name="Sign_in" options={{headerShown: false }}/>
      <Stack.Screen name="Create_account" options={{headerShown: false }}/>
      <Stack.Screen name="Comment" options={{headerShown: false }}/>

      </Stack>
    </SafeAreaProvider>

  );
}

// const o = StyleSheet.create({
//   states:{
//     color: "red"
//   }
// });
