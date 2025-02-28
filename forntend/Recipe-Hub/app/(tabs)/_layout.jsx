import { Tabs } from "expo-router";

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
    <Tabs.Screen
        name="home"
        options={{
        title: "الرئيسية",
        tabBarIcon: ({ color }) => "🏠",
        }}
    />
    <Tabs.Screen
        name="search"
        options={{
        title: "بحث",
        tabBarIcon: ({ color }) => "🔍",
        }}
    />
    <Tabs.Screen
        name="profile"
        options={{
        title: "حسابي",
        tabBarIcon: ({ color }) => "👤",
        }}
    />
    </Tabs>
);
}