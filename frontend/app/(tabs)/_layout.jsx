import { Tabs } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: Platform.OS === "ios" ? 80 : 65,
          shadowColor: "#6B5B95",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 10,
          borderTopWidth: 0,
          position: "absolute",
        },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName,
            iconComponent,
            label = "";
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            iconComponent = Ionicons;
            label = "Home";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
            iconComponent = Ionicons;
            label = "Search";
          } else if (route.name === "Add_Reciepe") {
            iconName = focused ? "plus-circle" : "plus-circle-outline";
            iconComponent = MaterialCommunityIcons;
            label = "Add";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
            iconComponent = Ionicons;
            label = "Profile";
          }
          // Change icon size here
          const iconSize = focused ? 36 : 28;
          return (
            <View style={styles.tabIconContainer}>
              <View
                style={[styles.iconCircle, focused && styles.iconCircleFocused]}
              >
                {iconComponent === Ionicons ? (
                  <Ionicons
                    name={iconName}
                    size={10}
                    color={focused ? "#FF6B6B" : "#6B5B95"}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={iconName}
                    size={10}
                    color={focused ? "#FF6B6B" : "#6B5B95"}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: focused ? "#FF6B6B" : "#6B5B95",
                    width: 60,
                    textAlign: "center",
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tabs.Screen
        name="Home"
        options={{ title: "Home", unmountOnBlur: false }}
      />
      <Tabs.Screen
        name="Search"
        options={{ title: "Search", unmountOnBlur: false }}
      />
      <Tabs.Screen
        name="Add_Reciepe"
        options={{ title: "Add Reciepe", unmountOnBlur: false }}
      />
      <Tabs.Screen
        name="Profile"
        options={{ title: "Profile", unmountOnBlur: false }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },
  iconCircle: {
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    padding: 8,
    marginBottom: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconCircleFocused: {
    backgroundColor: "#FFF0ED",
    borderColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
    letterSpacing: 0.5,
    width: 40, // About 10 characters wide
    textAlign: "center",
  },
});
