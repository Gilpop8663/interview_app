import { useMutation } from '@apollo/client';
import { DELETE_ACCOUNT } from '@gql/mutate/user';

interface DeleteAccountResult {
  ok: boolean;
  error?: string;
}

interface DeleteAccountInput {
  userId: number;
}

export const useDeleteAccount = () => {
  const [deleteAccountMutation, { data, loading, error }] = useMutation<
    { deleteAccount: DeleteAccountResult },
    { input: DeleteAccountInput }
  >(DELETE_ACCOUNT);

  const deleteAccount = async ({ userId }: DeleteAccountInput) => {
    try {
      const result = await deleteAccountMutation({
        variables: {
          input: { userId },
        },
      });

      return result.data?.deleteAccount;
    } catch (err) {
      console.error('Error deleting account:', err);
      throw err;
    }
  };

  return {
    deleteAccount,
    data,
    loading,
    error,
  };
};
