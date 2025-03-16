import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import InterviewFetcher from '@fetcher/InterviewFetcher';

const InterviewScreen = () => {
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <InterviewFetcher />
    </Suspense>
  );
};

export default InterviewScreen;
