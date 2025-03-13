import { gql } from '@apollo/client';

export const GET_INTERVIEW_QUESTIONS = gql`
  query GetInterviewQuestions {
    getInterviewQuestions {
      id
      question
    }
  }
`;
