import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function TabLayout() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login'); // replace를 사용하여 뒤로 가기 방지
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
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
