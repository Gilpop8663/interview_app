import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '@gql/mutate/user'; // 실제 경로에 맞게 수정

interface ResetPasswordInput {
  password: string;
  code: string;
}

interface ResetPasswordResult {
  ok: boolean;
  error?: string;
}

export const useResetPassword = () => {
  const [resetPasswordMutation, { loading, error, data }] = useMutation<
    { resetPassword: ResetPasswordResult },
    { input: ResetPasswordInput }
  >(RESET_PASSWORD);

  const resetPassword = async ({ code, password }: ResetPasswordInput) => {
    try {
      const result = await resetPasswordMutation({
        variables: {
          input: { password, code },
        },
      });

      return result.data?.resetPassword;
    } catch (err) {
      console.error('Error resetting password:', err);
      throw err;
    }
  };

  return {
    resetPassword,
    data,
    loading,
    error,
  };
};
