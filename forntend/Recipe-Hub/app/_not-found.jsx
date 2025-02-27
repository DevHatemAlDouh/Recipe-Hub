import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const NotFoundScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>عذراً، الصفحة غير موجودة!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/Home")}
      >
        <Text style={styles.buttonText}>العودة إلى الصفحة الرئيسية</Text>
      </TouchableOpacity>
    </View>
  );
};

// الأنماط نفسها كما بالسابق...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default NotFoundScreen;