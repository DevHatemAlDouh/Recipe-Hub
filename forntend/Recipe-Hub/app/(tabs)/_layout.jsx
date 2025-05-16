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
        headerShown: false
    }}
    >
      {/* الصفحة الرئيسية */}
    <Tabs.Screen
        name="Home"
        options={{
        title: "Home",
        unmountOnBlur: false,
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
        unmountOnBlur: false,
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
        ),
        }}
    />

    
    
            {/* صفحة إضافة وصفة */}
<Tabs.Screen
        name="Add_Reciepe"
        options={{
        title: "Add Reciepe",
        unmountOnBlur: false,
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" size={size} color={color} />
        ),
        }}
        // plus-box
        
    />

      {/* صفحة الملف الشخصي */}
    <Tabs.Screen
        name="Profile"
        options={{
        title: "Profile",
        unmountOnBlur: false,
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
        ),
        }}
    />


    </Tabs>
);
}