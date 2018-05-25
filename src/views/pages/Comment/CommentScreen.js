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
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { withNavigation, Header } from 'react-navigation';
import {
  graphql,
  QueryRenderer,
  createFragmentContainer,
} from 'react-relay';
import findIndex from 'lodash/findIndex';
import clamp from 'lodash/clamp';
import base64 from 'base-64';

// import StoryItem from './components/StoryItem.js';
import { modernEnvironment } from '../../environment.js';

import ParentCommentItem from './components/ParentCommentItem.js';

function fromGlobalId(globalId) {
  const unbasedGlobalId = base64.decode(globalId);
  const delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  controllerContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  controller: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  backward: {
    flex: 1,
  },
  forward: {
    flex: 2,
  },
  hintCommentSection: {
    position: 'absolute',
    top: 550,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  commentText: {
    color: 'white',
  },
});

const commentStyles = StyleSheet.create({
  commentSection: {
    flex: 4,
    // position: 'absolute',
    // top: 150,
    // right: 0,
    // bottom: 0,
    // left: 0,
    zIndex: 100,
    // paddingTop: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingBottom: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  commentBlackText: {
    color: 'white',
  },
  image: {
    backgroundColor: '#1a1715',
    flex: 7,
    margin: 10,
    borderRadius: 4,
  },
});

class CommentScreen extends React.Component {
  constructor(props) {
    super(props);
    const object = this.props.navigation.getParam('object', null);

    this.state = {
      dy: new Animated.Value(0),
      showComments: true,
    };
  }
  render() {
    // const object = this.props.navigation.getParam('object', null);
    // const source = this.props.navigation.getParam('source', null);
    // const object = this.props.navigation.getParam('object', null);
    const { object } = this.props.query;

    return (
      <Animated.View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        top: this.state.dy,
        justifyContent: 'flex-start',
      }}
      >
        <StatusBar hidden={false} />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Image
            style={(!this.state.showComments) ? styles.image : commentStyles.image}
            resizeMode="cover"
            // source={{ uri: this.props.source }}
            source={{ uri: `http://192.168.1.213:1337/assets/objects/${fromGlobalId(object.id).id}` }}
          />
          <View style={{ flex: 5, justifyContent: 'flex-end', margin: 10 }}>
            <Text style={{ fontSize: 10, color: 'white' }}>
              {object.createdAt}
            </Text>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('User', {
              user: object.user,
            })}
            >
              <View>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
                  {object.user.name} @{object.user.username}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View
          style={(this.state.showComments) ? commentStyles.commentSection : styles.hintCommentSection}
        >
          <ScrollView>
            {object.parentComments.edges.map(edge => (
              <ParentCommentItem
                key={edge.node.id}
                comment={edge.node}
              />
            ))}
          </ScrollView>
        </View>
        <View style={{
          overflow: 'visible',
          flexDirection: 'row',
        }}
        >
          <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Publish', {
            object,
          })}
          >
            <View style={{
              borderRadius: 4,
              borderColor: 'white',
              borderWidth: 1,
              flex: 1,
              paddingTop: 4,
              paddingRight: 6,
              paddingBottom: 4,
              paddingLeft: 6,
              margin: 10,
            }}
            >
              <Text style={{ color: 'white' }}>
                Add a comment...
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {/* <TextInput
            style={{
              alignSelf: 'center',
              borderRadius: 4,
              borderColor: 'white',
              borderWidth: 1,
              margin: 10,
              flex: 1,
              color: 'white',
              paddingTop: 2,
              paddingRight: 6,
              paddingBottom: 2,
              paddingLeft: 6,
            }}
            placeholder="Add a comment..."
            placeholderTextColor="white"
            underlineColorAndroid="transparent"
            blurOnSubmit
            multiline
          /> */}
        </View>
      </Animated.View>
    );
  }
}

CommentScreen.propTypes = {
  query: PropTypes.object.isRequired,
};

const CommentScreenFragmentContainer = createFragmentContainer(withNavigation(CommentScreen), {
  query: graphql`
    fragment CommentScreen_query on Query {
      object(id: $id) {
        id
        image
        createdAt
        user {
          id
          name
          username
        }
        parentComments(first: 10) @connection(
          key: "CommentScreen_parentComments"
        ) {
          edges {
            node {
              id
              ...ParentCommentItem_comment
            }
          }
        }
      }
    }
  `,
});

class CommentScreenQueryRenderer extends React.Component {
  render() {
    const object = this.props.navigation.getParam('object', null);

    return (
      <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
          query CommentScreenQuery($id: String!) {
            ...CommentScreen_query
          }
        `}
        variables={{ id: fromGlobalId(object.id).id }}
        render={({ err, props }) => {
          if (props) {
            return <CommentScreenFragmentContainer query={props} />;
          } else if (err) console.log(err);
          return (
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }} />
          );
        }}
      />
    );
  }
}

CommentScreenQueryRenderer.navigationOptions = ({ navigation, screenProps }) => ({
  title: 'Comments',
  header: (headerProps) => {
    return <Header {...headerProps} />;
  },
  headerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    elevation: 0,
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  cardStyle: {
    backgroundColor: 'transparent',
  },
});

export default CommentScreenQueryRenderer;
