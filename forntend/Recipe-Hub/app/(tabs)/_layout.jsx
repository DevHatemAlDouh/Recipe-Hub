import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // استخدام @expo/vector-icons

export default function TabsLayout() {
return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: "white" },
    }}
    >
      {/* الصفحة الرئيسية */}
    <Tabs.Screen
        name="Home"
        options={{
        title: "Home",
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" size={size} color={color} />
        ),
        }}
    />

      {/* صفحة البحث */}
    <Tabs.Screen
        name="Search"
        options={{
        title: "Search",
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
        ),
        }}
    />

            {/* صفحة إضافة وصفة */}
<Tabs.Screen
        name="Add"
        options={{
        title: "Add",
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" size={size} color={color} />
        ),
        }}
    />

      {/* صفحة الملف الشخصي */}
    <Tabs.Screen
        name="Profile"
        options={{
        title: "Profile",
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
        ),
        }}
    />


    </Tabs>
);
}