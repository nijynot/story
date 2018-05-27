import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.UpdateProfileMutation = ({ environment, uploadables }) => {
  const mutation = graphql`
  mutation UpdateProfileMutation {
    updateProfile
  }`;

  const variables = {};

  // const configs = [{
  //   type: 'RANGE_ADD',
  //   parentID: me.id,
  //   connectionInfo: [{
  //     key: 'DraftingPage_images',
  //     rangeBehavior: 'prepend',
  //   }],
  //   edgeName: 'imageEdge',
  // }];

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      uploadables,
      // configs,
      onCompleted: (res, err) => {
        if (err) console.error(err);
        resolve(res);
      },
      onError: err => reject(err),
    });
  });
};
