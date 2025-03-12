import { useMutation } from '@apollo/client';
import { UPLOAD_SPEECH_FILE } from '../../gql/mutate/audio';

interface Result {
  ok: boolean;
  feedback: string | null;
}

interface Input {
  file: string; // Base64 파일 문자열
}

export const useUploadSpeechFile = () => {
  const [uploadSpeechFileMutation, { data, loading, error }] = useMutation<
    {
      uploadSpeechFile: Result;
    },
    {
      input: Input;
    }
  >(UPLOAD_SPEECH_FILE);

  const uploadSpeechFile = async (file: string) => {
    try {
      const result = await uploadSpeechFileMutation({
        variables: {
          input: { file },
        },
      });

      return result.data?.uploadSpeechFile;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  };

  return {
    uploadSpeechFile,
    data,
    loading,
    error,
  };
};
