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
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  profile: {
    borderRadius: 100,
    height: 24,
    width: 24,
    backgroundColor: 'white',
    marginRight: 8,
    marginTop: 3,
  },
});

class ParentCommentItem extends React.Component {
  render() {
    return (
      <View style={{
        flexDirection: 'row',
        marginBottom: 8,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 0,
      }}
      >
        <View style={styles.profile} />
        <View style={{ flex: 1 }}>
          <View style={{}}>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.navigate('User', {
                user: { username: this.props.comment.user.username },
              })}
            >
              <View>
                <Text style={{ fontWeight: '700', color: 'white' }}>
                  {this.props.comment.user.name} @{this.props.comment.user.username}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <Text
              style={{
                color: 'white',
                marginBottom: 2,
                flexWrap: 'wrap',
              }}
            >
              {this.props.comment.body}
              {/* fluent-ffmpeg - drawtext with a single quote
              fluent-ffmpeg - drawtext with a single quote
              fluent-ffmpeg - drawtext with a single quote
              fluent-ffmpeg - drawtext with a single quote */}
            </Text>
          </View>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('PublishReply', {
            parentComment: this.props.comment,
          })}
          >
            <View>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>
                Reply
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {this.props.comment.childComments.edges.map(edge => (
            <View
              key={edge.node.id}
              style={{ flexDirection: 'row', marginTop: 6 }}
            >
              <View style={styles.profile} />
              <View style={{ flex: 1 }}>
                <View
                  style={{ marginBottom: 2 }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('User', {
                      user: { username: edge.node.user.username },
                    })}
                  >
                    <View>
                      <Text style={{ fontWeight: '700', color: 'white' }}>
                        {edge.node.user.name} @{edge.node.user.username}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <Text style={{ color: 'white' }}>
                    {edge.node.body}
                  </Text>
                </View>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('PublishReply', {
                  parentComment: this.props.comment,
                })}
                >
                  <View>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>
                      Reply
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

ParentCommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default createFragmentContainer(withNavigation(ParentCommentItem), {
  comment: graphql`
    fragment ParentCommentItem_comment on ParentComment {
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
    }
  `,
});
