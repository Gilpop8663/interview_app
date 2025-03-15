import { Stack } from 'expo-router';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql', // 실제 GraphQL 서버 URL로 교체
  cache: new InMemoryCache(),
});

type ItemRouteParams = {
  id: string;
};

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ title: '홈', headerShown: false }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: '모달' }}
        />
        <Stack.Screen
          name="item/[id]"
          options={({ route }) => {
            const { id } = route.params as ItemRouteParams; // 강제로 타입을 지정

            return {
              title: `아이템 ${id}`,
            };
          }}
        />
        <Stack.Screen
          name="login"
          options={{ title: '로그인' }} // 상단 타이틀 "로그인" 설정
        />

        {/* 회원가입 화면 타이틀 설정 */}
        <Stack.Screen
          name="signUp"
          options={{ title: '회원가입' }} // 상단 타이틀 "회원가입" 설정
        />
      </Stack>
    </ApolloProvider>
  );
}
