import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Link } from "expo-router";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>면접 질문 앱</Text>
      <Text style={styles.description}>
        프론트엔드 개발자 면접 질문을 연습하세요.
      </Text>
      <Link href="/interview" style={styles.button}>
        <Button title="면접 시작하기" onPress={() => {}} />
      </Link>
      <Link href="/settings" style={styles.button}>
        <Button title="설정" onPress={() => {}} />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    width: "80%",
  },
});

export default HomeScreen;
