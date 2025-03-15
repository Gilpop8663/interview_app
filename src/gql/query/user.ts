import { gql } from '@apollo/client';

export const ME = gql`
  query Me {
    me {
      email
      nickname
      role
      subscriptionType
      answerSubmittedCount
    }
  }
`;
