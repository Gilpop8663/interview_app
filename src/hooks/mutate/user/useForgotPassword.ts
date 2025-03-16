import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD } from '@gql/mutate/user'; // 실제 경로에 맞게 수정

interface ForgotPasswordInput {
  email: string;
}

interface ForgotPasswordResult {
  ok: boolean;
  error?: string;
}

export const useForgotPassword = () => {
  const [forgotPasswordMutation, { loading, error, data }] = useMutation<
    { forgotPassword: ForgotPasswordResult },
    { input: ForgotPasswordInput }
  >(FORGOT_PASSWORD);

  const forgotPassword = async ({ email }: ForgotPasswordInput) => {
    try {
      const result = await forgotPasswordMutation({
        variables: {
          input: { email },
        },
      });

      return result.data?.forgotPassword;
    } catch (err) {
      console.error('Error sending forgot password email:', err);
      throw err;
    }
  };

  return {
    forgotPassword,
    data,
    loading,
    error,
  };
};
