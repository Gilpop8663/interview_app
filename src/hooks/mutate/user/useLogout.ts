import { useMutation } from '@apollo/client';
import { LOGOUT } from '../../../gql/mutate/user';

interface LogoutResponse {
  logout: {
    ok: boolean;
    error?: string;
  };
}

export const useLogout = () => {
  const [logoutMutation, { data, loading, error }] =
    useMutation<LogoutResponse>(LOGOUT);

  const logout = async () => {
    try {
      const result = await logoutMutation();
      if (result.data?.logout.ok) {
        // 로그아웃 성공 처리 (예: 토큰 삭제)
        console.log('Logout successful');
      } else {
        console.error('Logout failed:', result.data?.logout.error);
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return { logout, data, loading, error };
};
