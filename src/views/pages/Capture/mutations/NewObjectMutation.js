import {
  commitMutation,
  graphql,
} from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

function sharedUpdater(store, { id, edge, connection }) {
  const proxy = store.getRootField('feed');
  console.log(proxy);
  // const conn = ConnectionHandler.getConnection(
  //   proxy,
  //   connection,
  // );
  // ConnectionHandler.insertEdgeAfter(conn, edge);
}

exports.NewObjectMutation = ({ environment, uploadables, image, body, parentId }) => {
  const mutation = graphql`
  mutation NewObjectMutation($input: NewObjectInput!) {
    newObject(input: $input) {
      objectEdge {
        node {
          id
          image
          createdAt
          commentCount
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

  const variables = {
    input: { image, body },
  };

  const configs = [
    {
      type: 'RANGE_ADD',
      parentID: parentId,
      connectionInfo: [{
        key: 'StoryPage_objects',
        rangeBehavior: 'append',
      }],
      edgeName: 'objectEdge',
    },
    {
      type: 'RANGE_ADD',
      parentID: parentId,
      connectionInfo: [{
        key: 'UserScreen_objects',
        rangeBehavior: 'prepend',
      }],
      edgeName: 'objectEdge',
    },
  ];

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      uploadables,
      configs,
      onCompleted: (res, err) => {
        if (err) console.error(err);
        resolve(res);
      },
      onError: err => reject(err),
      // updater: (store, data) => {
      //   console.log(data);
      //   // const payload = store.getRootField('newObject');
      //   // const edge = payload.getLinkedRecord('objectEdge');
      //   sharedUpdater(store, {
      //     id: 'UXVlcnk6',
      //     edge: data.objectEdge,
      //     connection: 'FeedPage_feed',
      //   });
      // },
    });
  });
};
