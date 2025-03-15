import { useMutation } from '@apollo/client';
import { CREATE_ACCOUNT } from '../../../gql/mutate/user';

interface Result {
  ok: boolean;
  error?: string;
  token?: string;
}

interface Input {
  email: string;
  password: string;
  nickname: string;
}

export const useCreateAccount = () => {
  const [createAccountMutation, { data, loading, error }] = useMutation<
    { createAccount: Result },
    { input: Input }
  >(CREATE_ACCOUNT);

  const createAccount = async ({ email, nickname, password }: Input) => {
    try {
      const result = await createAccountMutation({
        variables: {
          input: { email, password, nickname },
        },
      });

      return result.data?.createAccount;
    } catch (err) {
      console.error('Error creating account:', err);
      throw err;
    }
  };

  return {
    createAccount,
    data,
    loading,
    error,
  };
};
