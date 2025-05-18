import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// منع إغلاق شاشة التحميل تلقائيًا
SplashScreen.preventAutoHideAsync();

const screens = [
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  { name: "open",                               options: { headerShown: false } },
  { name: "index",                              options: { headerShown: false } },
  { name: "Sign_in",                            options: { headerShown: false } },
  { name: "Create_account",                     options: { headerShown: false } },
  { name: "Comment",                            options: { headerShown: false } },
  { name: "RecipeDetails",                      options: { headerShown: false } },
  { name: "Profile_Content/Edeit_Profile",      options: { headerShown: false } },
  { name: "Profile_Content/Edeit_Recipe",       options: { headerShown: false } },
  { name: "Profile_Content/Featured_Recipes",   options: { title: "Featured Recipes"} },
  { name: "not-found",                          options: { title: "Page Not Found" } },
=======
=======
>>>>>>> Stashed changes
  { name: "open", options: { headerShown: false } },
  { name: "index", options: { headerShown: false } },
  { name: "Sign_in", options: { headerShown: false } },
  { name: "Create_account", options: { headerShown: false } },
  { name: "Comment", options: { headerShown: false } },
  { name: "RecipeDetails", options: { headerShown: false } },
  { name: "Profile_Content/Edeit_Profile", options: { headerShown: false } },
  { name: "Profile_Content/Edeit_Recipe", options: { headerShown: false } },
  { name: "not-found", options: { title: "Page Not Found" } },
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
          <StatusBar style="auto" />
          <Stack>
            {screens.map((screen, index) => (
              <Stack.Screen
                key={index}
                name={screen.name}
                options={screen.options}
              />
            ))}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
