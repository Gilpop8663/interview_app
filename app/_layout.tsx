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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
      </Stack>
    </ApolloProvider>
  );
}
