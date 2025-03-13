import { useState } from 'react';
import { GET_INTERVIEW_QUESTIONS } from '../../gql/query/interview';
import { useSuspenseQuery } from '@apollo/client';
import { Alert } from 'react-native';

interface InterviewQuestion {
  id: number;
  question: string;
}

interface GetInterviewQuestionsData {
  getInterviewQuestions: InterviewQuestion[];
}

export const useGetInterviewQuestions = () => {
  const { data, error } = useSuspenseQuery<GetInterviewQuestionsData>(
    GET_INTERVIEW_QUESTIONS
  );
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleNextQuestion = () => {
    if (questionIndex < data.getInterviewQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      Alert.alert('End of Interview', '면접이 종료되었습니다.');
    }
  };

  return { data, questionIndex, handleNextQuestion, error };
};
