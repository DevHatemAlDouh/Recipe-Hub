import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from 'react-native-paper'; // <-- أضف هذا الاستيراد
import { StatusBar } from "expo-status-bar";

const screens = [
  { name: "open",           options: { headerShown: false } },
  { name: "index",          options: { headerShown: false } },
  { name: "Sign_in",        options: { headerShown: false } },
  { name: "Create_account", options: { headerShown: false } },
  { name: "Comment",        options: { headerShown: false } },
  { name: "not-found",      options: { title: "Page Not Found" } },
];

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar style="auto" />
        <Stack>
          {screens.map((screen, index) => (
            <Stack.Screen key={index} name={screen.name} options={screen.options} />
          ))}
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}