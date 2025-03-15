import { useSuspenseQuery } from '@apollo/client';
import { ME } from '../../../gql/query/user';
import { User } from '../../../types/user';

interface Result {
  me: User;
}

export const useMe = () => {
  const { data } = useSuspenseQuery<Result>(ME, {
    fetchPolicy: 'cache-first',
  });

  return { data };
};
