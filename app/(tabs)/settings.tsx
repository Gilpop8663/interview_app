import { View, Text, StyleSheet } from "react-native";

export default function SettingsTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정 탭</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
