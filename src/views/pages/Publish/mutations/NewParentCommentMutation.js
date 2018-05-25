import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.NewParentCommentMutation = ({ environment, parentId, objectId, body }) => {
  const mutation = graphql`
  mutation NewParentCommentMutation($input: NewParentCommentInput!) {
    newParentComment(input: $input) {
      parentCommentEdge {
        node {
          id
          body
          user {
            id
            name
            username
          }
          childComments(first: 10) @connection(key: "ParentCommentItem_childComments") {
            edges {
              node {
                id
                body
                user {
                  id
                  name
                  username
                }
              }
            }
          }
          # id
          # body
          # user {
          #   id
          #   username
          #   name
          #   createdAt
          # }
          # childComments(first: 3) @connection(key: "ParentComment_childComments") {
          #   edges {
          #     node {
          #       ...ChildComment_comment
          #     }
          #   }
          #   pageInfo {
          #     endCursor
          #     hasNextPage
          #   }
          # }
        }
        cursor
      }
    }
  }`;

  const variables = { input: { objectId, body } };

  const configs = [{
    type: 'RANGE_ADD',
    parentID: parentId,
    connectionInfo: [{
      key: 'CommentScreen_parentComments',
      rangeBehavior: 'prepend',
    }],
    edgeName: 'parentCommentEdge',
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
