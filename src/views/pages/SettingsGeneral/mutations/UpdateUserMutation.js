import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.UpdateUserMutation = ({ environment, name, biography, tags }) => {
  const mutation = graphql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      biography
      rawTags
      tags {
        tag
      }
    }
  }`;

  const variables = {
    input: {
      name,
      biography,
      tags,
    },
  };

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
