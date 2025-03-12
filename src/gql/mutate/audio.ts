import { gql } from '@apollo/client';

export const UPLOAD_SPEECH_FILE = gql`
  mutation UploadSpeechFile($input: UploadSpeechFileInput!) {
    uploadSpeechFile(input: $input) {
      ok
      feedback
    }
  }
`;
