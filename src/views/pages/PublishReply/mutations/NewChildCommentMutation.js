import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.NewChildCommentMutation = ({ environment, parentId, parentCommentId, body }) => {
  const mutation = graphql`
  mutation NewChildCommentMutation($input: NewChildCommentInput!) {
    newChildComment(input: $input) {
      childCommentEdge {
        node {
          id
          body
          user {
            id
            name
            username
          }
        }
        cursor
      }
    }
  }`;

  const variables = { input: { parentCommentId, body } };

  const configs = [{
    type: 'RANGE_ADD',
    parentID: parentId,
    connectionInfo: [{
      key: 'ParentCommentItem_childComments',
      rangeBehavior: 'prepend',
    }],
    edgeName: 'childCommentEdge',
  }];

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      configs,
      onCompleted: (res, err) => {
        if (err) console.error(err);
        resolve(res);
      },
      onError: err => reject(err),
    });
  });
};
