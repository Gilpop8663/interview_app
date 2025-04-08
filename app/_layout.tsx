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
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@constants/storage';
import { AuthProvider } from '@contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@components/ErrorFallback';
import { getItemSync, setItemAsync, setItemSync } from '@utils/storage';

interface RefreshTokenResult {
  data: {
    refreshToken: {
      ok: boolean;
      error?: string;
      token?: string;
      refreshToken?: string;
    };
  };
}

// const fetchUrl = process.env.VITE_DB_URL || 'http://localhost:3000/graphql';
const fetchUrl = 'https://server.interview.coddink.com/graphql';

// Error Link
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const errorCode = err.extensions?.code; // ← `extensions.code` 확인

      if (err.extensions?.code === 'FORBIDDEN') {
        // Forbidden (권한 없음) 에러 처리
        console.error('Forbidden error occurred:', err);
        // 예를 들어, 사용자에게 권한이 부족하다는 메시지를 보여줄 수 있습니다.

        return forward(operation);
      }

      if (err.extensions?.code === 'UNAUTHENTICATED') {
        return new Observable<FetchResult>((observer) => {
          const refreshToken = getItemSync(REFRESH_TOKEN);
          const token = getItemSync(ACCESS_TOKEN);

          console.log(refreshToken, token);
          fetch(fetchUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // 토큰을 사용
            },
            body: JSON.stringify({
              query: `
                   mutation RefreshToken($input: RefreshTokenInput!) {
                      refreshToken(input: $input) {
                        ok
                        error
                        token
                        refreshToken
                      }
                    }
                  `,
              variables: { input: { refreshToken } },
            }),
          })
            .then((response) => response.json())
            .then((result: RefreshTokenResult) => {
              if (!result.data.refreshToken.ok) {
                return;
              }

              console.log(result.data.refreshToken);

              const newAccessToken = result.data.refreshToken.token ?? '';
              const newRefreshToken =
                result.data.refreshToken.refreshToken ?? '';

              setItemSync(ACCESS_TOKEN, newAccessToken);
              setItemSync(REFRESH_TOKEN, newRefreshToken);

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
      }
    }

    return forward(operation);
  }
});

const httpLink = new HttpLink({
  uri: fetchUrl,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getItemSync(ACCESS_TOKEN);

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '', // 토큰을 헤더에 설정
    },
  }));
  forward(operation);

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
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ title: '홈', headerShown: false }}
            />
            <Stack.Screen name="(auth)" options={{ title: '회원' }} />
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
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}
