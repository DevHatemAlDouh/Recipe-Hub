import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// منع إغلاق شاشة التحميل تلقائيًا
SplashScreen.preventAutoHideAsync();

const screens = [
  { name: "open",           options: { headerShown: false } },
  { name: "index",          options: { headerShown: false } },
  { name: "Sign_in",        options: { headerShown: false } },
  { name: "Create_account", options: { headerShown: false } },
  { name: "Comment",        options: { headerShown: false } },
  { name: "RecipeDetails",  options: { headerShown: false } },
  { name: "Edeit_Profile",  options: { headerShown: false } },
  // { name: "Profile",        options: { headerShown: false } },
  // { name: "Settings",       options: { headerShown: false } },
  { name: "not-found",      options: { title: "Page Not Found" } },
];

export default function RootLayout() {
  // تحميل الخطوط
  const [fontsLoaded] = useFonts({
    // تحميل خطوط MaterialCommunityIcons تلقائيًا عبر @expo/vector-icons
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PaperProvider>
            <StatusBar style="auto"  />
            <Stack>
              {screens.map((screen, index) => (
                <Stack.Screen key={index} name={screen.name} options={screen.options} />
              ))}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </PaperProvider>
        </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}