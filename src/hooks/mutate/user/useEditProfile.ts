import { useMutation } from '@apollo/client';
import { EDIT_PROFILE } from '@gql/mutate/user';

interface EditProfileResult {
  ok: boolean;
  error?: string;
}

interface EditProfileInput {
  nickname?: string;
  password?: string;
}

export const useEditProfile = () => {
  const [editProfileMutation, { data, loading, error }] = useMutation<
    { editProfile: EditProfileResult },
    { input: EditProfileInput }
  >(EDIT_PROFILE);

  const editProfile = async ({ nickname, password }: EditProfileInput) => {
    try {
      const result = await editProfileMutation({
        variables: {
          input: { nickname, password },
        },
      });

      return result.data?.editProfile;
    } catch (err) {
      console.error('Error editing profile:', err);
      throw err;
    }
  };

  return {
    editProfile,
    data,
    loading,
    error,
  };
};
