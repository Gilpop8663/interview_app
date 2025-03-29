import { useEffect, useState } from 'react';
import { GET_INTERVIEW_QUESTIONS } from '@gql/query/interview';
import { useSuspenseQuery } from '@apollo/client';
import { Alert } from 'react-native';
import { getItemAsync, setItemAsync, setItemSync } from '@utils/storage';
import { useAudioRecording } from '@contexts/AudioRecordingContext';

interface InterviewQuestion {
  id: number;
  question: string;
}

interface GetInterviewQuestionsData {
  getInterviewQuestions: InterviewQuestion[];
}

const saveProgress = async (questionIndex: number) => {
  try {
    await setItemAsync('progress', JSON.stringify(questionIndex));
  } catch (error) {
    console.error('진행도 저장 실패:', error);
  }
};

const loadProgress = async () => {
  try {
    const progress = await getItemAsync('progress');
    return progress ? JSON.parse(progress) : 0;
  } catch (error) {
    console.error('진행도 불러오기 실패:', error);
    return 0;
  }
};

export const useGetInterviewQuestions = () => {
  const { data, error } = useSuspenseQuery<GetInterviewQuestionsData>(
    GET_INTERVIEW_QUESTIONS
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const { setRecordingTime, setIsLoading, setIsRecording, setRecordedUri } =
    useAudioRecording();

  const handleNextQuestion = () => {
    if (questionIndex < data.getInterviewQuestions.length - 1) {
      const newIndex = questionIndex + 1;
      setQuestionIndex(newIndex);
      saveProgress(newIndex);
      setRecordedUri(null);
      setIsRecording(false);
      setIsLoading(false);
      setRecordingTime(0);
    } else {
      Alert.alert(
        'End of Interview',
        '면접이 종료되었습니다. 다시 시작하시겠습니까?',
        [
          {
            text: '예',
            onPress: () => {
              setQuestionIndex(0);
              saveProgress(0);
              setRecordedUri(null);
              setIsRecording(false);
              setIsLoading(false);
              setRecordingTime(0);
            },
          },
          {
            text: '아니오',
            onPress: () => console.log('면접 종료'),
          },
        ]
      );
    }
  };

  useEffect(() => {
    (async () => {
      const savedProgress = await loadProgress();
      setQuestionIndex(savedProgress);
    })();
  }, []);

  return { data, questionIndex, handleNextQuestion, error };
};
