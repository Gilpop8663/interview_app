import { useSuspenseQuery } from '@apollo/client';
import { ME } from '@gql/query/user';
import { useAuth } from '@contexts/AuthContext';
import { User } from '@models/user';

interface Result {
  me: User;
}

export const useMe = () => {
  const { logout } = useAuth();

  try {
    const { data } = useSuspenseQuery<Result>(ME, {
      fetchPolicy: 'network-only', // 최신 데이터를 가져오도록 설정
    });

    return { data };
  } catch (error: any) {
    if (error.networkError?.statusCode === 401) {
      console.log('🔴 인증 오류: 401 - 자동 로그아웃 처리');
      logout(); // 401 발생 시 자동 로그아웃
    }
    throw error; // 에러를 다시 던져서 Suspense가 처리하도록 함
  }
};
