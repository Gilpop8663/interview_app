import { useMutation } from '@apollo/client';
import { SEND_VERIFY_EMAIL } from '@gql/mutate/user';

interface Result {
  ok: boolean;
  error?: string;
}

interface Input {
  email: string;
}

export const useSendVerifyEmail = () => {
  const [sendVerifyEmailMutation, { data, loading, error, reset }] =
    useMutation<{ sendVerifyEmail: Result }, { input: Input }>(
      SEND_VERIFY_EMAIL
    );

  const sendVerifyEmail = async (email: string) => {
    try {
      const result = await sendVerifyEmailMutation({
        variables: {
          input: { email },
        },
      });

      return result.data?.sendVerifyEmail;
    } catch (err) {
      console.error('Error sending email verification:', err);
      throw err;
    }
  };

  return {
    sendVerifyEmail,
    data,
    loading,
    error,
    reset,
  };
};
