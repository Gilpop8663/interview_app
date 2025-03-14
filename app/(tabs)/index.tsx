import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>면접 질문 앱</Text>
      <Text style={styles.description}>
        프론트엔드 개발자 면접 질문을 연습하고, 면접 준비를 도와드립니다.
      </Text>

      <Link href="/interview" style={styles.linkButton}>
        <Text style={styles.linkText}>면접 시작하기</Text>
      </Link>

      <Link href="/settings" style={styles.linkButton}>
        <Text style={styles.linkText}>설정</Text>
      </Link>

      {/* 로그인 링크 추가 */}
      <Link href="/login" style={styles.linkButton}>
        <Text style={styles.linkText}>로그인</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f7fc',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#555',
    marginHorizontal: 20,
  },
  linkButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // 그림자 효과 추가
  },
  linkText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HomeScreen;
