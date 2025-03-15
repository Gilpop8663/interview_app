import { useMutation } from '@apollo/client';
import { LOGIN } from '../../../gql/mutate/user';

interface LoginResponse {
  ok: boolean;
  error?: string;
  token?: string;
  refreshToken?: string;
}

interface Input {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLogin = () => {
  const [loginMutation, { data, loading, error }] = useMutation<
    { login: LoginResponse },
    { input: Input }
  >(LOGIN);

  const login = async (input: Input) => {
    try {
      const result = await loginMutation({ variables: { input } });

      return result.data?.login;
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return { login, data, loading, error };
};
