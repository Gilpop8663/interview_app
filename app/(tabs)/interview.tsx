import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import InterviewFetcher from '../../src/fetcher/InterviewFetcher';

const InterviewScreen = () => {
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <InterviewFetcher />
    </Suspense>
  );
};

export default InterviewScreen;
