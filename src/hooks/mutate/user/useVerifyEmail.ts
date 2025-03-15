import { useMutation } from '@apollo/client';
import { VERIFY_EMAIL } from '../../../gql/mutate/user';

interface Result {
  ok: boolean;
  error?: string;
}

interface Input {
  email: string;
  code: string;
}

export const useVerifyEmail = () => {
  const [verifyEmailMutation, { data, loading, error }] = useMutation<
    { verifyEmail: Result },
    { input: Input }
  >(VERIFY_EMAIL);

  const verifyEmail = async ({ code, email }: Input) => {
    try {
      const result = await verifyEmailMutation({
        variables: {
          input: { email, code },
        },
      });

      return result.data?.verifyEmail;
    } catch (err) {
      console.error('Error verifying email:', err);
      throw err;
    }
  };

  return {
    verifyEmail,
    data,
    loading,
    error,
  };
};
