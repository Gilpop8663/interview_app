import { Navigator, Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store'; // 토큰을 SecureStore에서 가져오기
import { ACCESS_TOKEN } from '../../src/constants/storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 앱이 처음 시작될 때 토큰을 가져오기
    SecureStore.getItemAsync(ACCESS_TOKEN).then((savedToken) => {
      setToken(savedToken); // 토큰이 있으면 상태에 저장
    });
  }, []);

  useEffect(() => {
    if (token === null) {
      return; // 토큰이 아직 로딩 중이라면 아무것도 하지 않음
    }

    if (!token) {
      router.push('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션
    }
  }, [token, router]);

  if (token === null) {
    // 로딩 중일 때 표시할 UI
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      </View>
    );
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="interview"
        options={{
          title: '면접 연습',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble" size={24} color={color} /> // 대화창 아이콘을 사용
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f7fc',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
