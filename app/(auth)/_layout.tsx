import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="forgotPassword"
        options={{
          title: '비밀번호 찾기',
        }}
      />
      <Stack.Screen
        name="resetPassword"
        options={{
          title: '면접 연습',
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: '로그인',
        }}
      />
      <Stack.Screen
        name="signUp"
        options={{
          title: '회원가입',
        }}
      />
      <Stack.Screen
        name="accountSetting"
        options={{
          title: '계정 설정',
        }}
      />
    </Stack>
  );
}
