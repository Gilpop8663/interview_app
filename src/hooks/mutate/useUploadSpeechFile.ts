import { useMutation } from '@apollo/client';
import { PROCESS_INTERVIEW_AUDIO } from '../../gql/mutate/interview';
import { useEffect } from 'react';

interface Result {
  ok: boolean;
  feedback: string;
  habits: string;
  speed: string;
}

interface Input {
  file: string; // Base64 파일 문자열
  question: string;
}

export const useProcessInterviewAudio = (question: string) => {
  const [processInterviewAudioMutation, { data, loading, error, reset }] =
    useMutation<
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

  useEffect(() => {
    reset();
  }, [question]);

  return {
    processInterviewAudio,
    data,
    loading,
    error,
    reset,
  };
};
