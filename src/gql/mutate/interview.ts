import { gql } from '@apollo/client';

export const PROCESS_INTERVIEW_AUDIO = gql`
  mutation ProcessInterviewAudio($input: ProcessInterviewAudioInput!) {
    processInterviewAudio(input: $input) {
      ok
      feedback
      habits
      speed
    }
  }
`;
