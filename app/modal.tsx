import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Modal() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>모달 화면</Text>
      <Button title="닫기" onPress={() => router.back()} />
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
    marginBottom: 16,
  },
});
