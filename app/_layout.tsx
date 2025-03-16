import { Stack } from 'expo-router';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  HttpLink,
  ApolloLink,
  Observable,
  FetchResult,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import * as SecureStore from 'expo-secure-store'; // SecureStore로 토큰 저장
import { ACCESS_TOKEN } from '@constants/storage';
import { AuthProvider } from '@contexts/AuthContext';

interface RefreshTokenResult {
  data: {
    refreshToken: {
      ok: boolean;
      error?: string;
      token?: string;
    };
  };
}

const fetchUrl = process.env.VITE_DB_URL || 'http://localhost:3000/graphql';

// Error Link
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    console.log(graphQLErrors, 'ddd');
    for (const err of graphQLErrors) {
      const error = err as { code: string; message: string };

      if (error.code === 'FORBIDDEN') {
        // Forbidden (권한 없음) 에러 처리
        console.error('Forbidden error occurred:', err);
        // 예를 들어, 사용자에게 권한이 부족하다는 메시지를 보여줄 수 있습니다.
        // alert('권한이 부족합니다. 관리자에게 문의해주세요.');

        return forward(operation);
      }

      if (error.code === 'UNAUTHENTICATED') {
        return new Observable<FetchResult>((observer) => {
          // SecureStore에서 토큰을 불러옴
          SecureStore.getItemAsync(ACCESS_TOKEN).then((token) => {
            fetch(fetchUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // 토큰을 사용
              },
              body: JSON.stringify({
                query: `
                    mutation RefreshToken {
                      refreshToken {
                        ok
                        error
                        token
                      }
                    }
                  `,
              }),
              credentials: 'include',
            })
              .then((response) => response.json())
              .then((result: RefreshTokenResult) => {
                if (!result.data.refreshToken.ok) {
                  return;
                }

                const newAccessToken = result.data.refreshToken.token ?? '';

                // SecureStore에 새 토큰 저장
                SecureStore.setItemAsync(ACCESS_TOKEN, newAccessToken);

                // 새로운 토큰으로 헤더 설정
                operation.setContext({
                  headers: {
                    ...operation.getContext().headers,
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                });

                // 요청 재시도
                forward(operation).subscribe({
                  next: (result) => observer.next(result),
                  error: (err) => observer.error(err),
                  complete: () => observer.complete(),
                });
              })
              .catch((refreshError) => {
                console.error('Refresh token request failed:', refreshError);
              });
          });
        });
      }
    }

    return forward(operation);
  }
});

const httpLink = new HttpLink({
  uri: fetchUrl,
  credentials: 'include',
});

const authLink = new ApolloLink((operation, forward) => {
  // SecureStore에서 토큰을 불러옴
  SecureStore.getItemAsync(ACCESS_TOKEN).then((token) => {
    console.log(token);
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '', // 토큰을 헤더에 설정
      },
    }));
    forward(operation);
  });

  return forward(operation);
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  credentials: 'include',
});

type ItemRouteParams = {
  id: string;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ title: '홈', headerShown: false }}
          />
          <Stack.Screen
            name="(auth)"
            options={{ title: '회원', headerShown: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: '모달' }}
          />
          <Stack.Screen
            name="item/[id]"
            options={({ route }) => {
              const { id } = route.params as ItemRouteParams;
              return {
                title: `아이템 ${id}`,
              };
            }}
          />
        </Stack>
      </ApolloProvider>
    </AuthProvider>
  );
}
