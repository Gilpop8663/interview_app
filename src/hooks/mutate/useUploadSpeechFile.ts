import { useMutation } from '@apollo/client';
import { PROCESS_INTERVIEW_AUDIO } from '../../gql/mutate/interview';

interface Result {
  ok: boolean;
  feedback: string | null;
}

interface Input {
  file: string; // Base64 파일 문자열
  question: string;
}

export const useProcessInterviewAudio = () => {
  const [processInterviewAudioMutation, { data, loading, error }] = useMutation<
    {
      processInterviewAudio: Result;
    },
    {
      input: Input;
    }
  >(PROCESS_INTERVIEW_AUDIO);

  const processInterviewAudio = async (input: Input) => {
    try {
      const result = await processInterviewAudioMutation({
        variables: {
          input,
        },
      });

      return result.data?.processInterviewAudio;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  };

  return {
    processInterviewAudio,
    data,
    loading,
    error,
  };
};
