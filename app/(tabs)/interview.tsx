import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import InterviewFetcher from '@fetcher/InterviewFetcher';
import { AudioRecordingProvider } from '@contexts/AudioRecordingContext';

const InterviewScreen = () => {
  return (
    <AudioRecordingProvider>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <InterviewFetcher />
      </Suspense>
    </AudioRecordingProvider>
  );
};

export default InterviewScreen;
