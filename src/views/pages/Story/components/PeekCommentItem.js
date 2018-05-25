import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  Animated,
  Easing,
  TextInput,
} from 'react-native';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

const styles = StyleSheet.create({
  profile: {
    borderRadius: 100,
    height: 18,
    width: 18,
    backgroundColor: 'white',
    marginRight: 8,
    marginTop: 3,
  },
});

class PeekCommentItem extends React.Component {
  render() {
    return (
      <View
        style={{ flexDirection: 'row', marginBottom: 2 }}
      >
        {/* <View style={styles.profile} /> */}
        <View style={{ flex: 1 }}>
          <Text
            style={{ color: 'white', fontSize: 12 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            <Text style={{ fontWeight: '700', color: 'white' }}>
              {this.props.comment.user.username}
            </Text>
            {'  '}{this.props.comment.body}
          </Text>
          {/* <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>
            Reply
          </Text> */}
        </View>
      </View>
    );
  }
}

PeekCommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default createFragmentContainer(PeekCommentItem, {
  comment: graphql`
    fragment PeekCommentItem_comment on ParentComment {
      id
      body
      user {
        id
        username
      }
    }
  `,
});
