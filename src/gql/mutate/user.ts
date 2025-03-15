import { gql } from '@apollo/client';

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
      token
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const SEND_VERIFY_EMAIL = gql`
  mutation SendVerifyEmail($input: SendVerifyEmailInput!) {
    sendVerifyEmail(input: $input) {
      ok
      error
    }
  }
`;
