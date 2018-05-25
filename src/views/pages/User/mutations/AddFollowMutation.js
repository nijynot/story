import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.AddFollowMutation = ({ environment, userId }) => {
  const mutation = graphql`
  mutation AddFollowMutation($userId: ID!) {
    addFollow(userId: $userId) {
      doesViewerFollow
      followersCount
      followingCount
    }
  }`;

  const variables = { userId };

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      onCompleted: (res, err) => {
        if (err) console.error(err);
        resolve(res);
      },
      onError: err => reject(err),
    });
  });
};
