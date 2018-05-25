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
  ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import {
  graphql,
  QueryRenderer,
  createFragmentContainer,
} from 'react-relay';
import findIndex from 'lodash/findIndex';
import clamp from 'lodash/clamp';
import base64 from 'base-64';
import { LinearGradient } from 'expo';

// import StoryItem from './components/StoryItem.js';
import { modernEnvironment } from '../../environment.js';

// import PeekCommentItem from './components/PeekCommentItem.js';

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
    // flexDirection: 'row',
    // marginTop: 43,
    // marginRight: 10,
    // marginBottom: 10,
    // marginLeft: 10,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
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
    height: '20%',
    right: 0,
    bottom: 0,
    // top: 0,
    left: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 10,
    paddingRight: 16,
    paddingBottom: 10,
    paddingLeft: 16,
    overflow: 'hidden',
  },
  commentText: {
    color: 'white',
    fontSize: 12,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // bottom: '20%',
    height: '20%',
  },
});

class StoryPage extends React.Component {
  constructor(props) {
    super(props);
    const object = this.props.navigation.getParam('object', null);
    this.state = {
      index: findIndex(
        this.props.query.user.objects.edges, edge => edge.node.id === object.id
      ) || 0,
      dy: new Animated.Value(0),
    };
    this.shiftIndex = this.shiftIndex.bind(this);
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => (evt, gestureState) => {
        return gestureState.dx > 5 && gestureState.dy > 5;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx > 5 && gestureState.dy > 5;
      },
      onMoveShouldSetPanResponder: () => (evt, gestureState) => {
        return gestureState.dx > 5 && gestureState.dy > 5;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx > 5 && gestureState.dy > 5;
      },
      onPanResponderGrant: () => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 5) {
          Animated.event(
            [null, { dy: this.state.dy }]
          )(evt, gestureState);
        }
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        if (
          gestureState.dy >= 150 ||
          gestureState.vy > 2
        ) {
          this.props.navigation.goBack();
        } else if (gestureState.dy <= -80) {
          this.props.navigation.navigate('Comment', {
            object: this.props.query.user.objects.edges[this.state.index].node,
          });
        } else {
          Animated.timing(this.state.dy, {
            toValue: 0,
            easing: Easing.ease,
            duration: 100,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: () => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }
  shiftIndex(amount) {
    const max = this.props.query.user.objects.edges.length - 1;
    const min = 0;

    if (
      this.state.index + amount > max ||
      this.state.index + amount < min
    ) {
      this.props.navigation.goBack();
    } else {
      this.setState({
        index: clamp(this.state.index + amount, min, max),
      });
    }
  }
  render() {
    // const object = this.props.navigation.getParam('object', null);
    // const source = this.props.navigation.getParam('source', null);
    const { objects } = this.props.query.user;
    const object = objects.edges[this.state.index].node;
    console.log(objects);

    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: '#333',
          justifyContent: 'flex-start',
          transform: [{ translateY: this.state.dy }],
        }}
        {...this._panResponder.panHandlers}
      >
        <StatusBar hidden />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Image
            style={styles.image}
            resizeMode="cover"
            // source={{ uri: this.props.source }}
            source={{ uri: `http://192.168.1.213:1337/assets/objects/${fromGlobalId(objects.edges[this.state.index].node.id).id}` }}
          />
        </View>
        <View
          style={styles.controllerContainer}
        >
          <View style={styles.controller}>
            <TouchableWithoutFeedback
              onPress={() => { this.shiftIndex(-1); }}
            >
              <View style={styles.backward}>
                <Text>
                  {' '}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => { this.shiftIndex(1); }}
            >
              <View style={styles.forward}>
                <Text>
                  {' '}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {/* <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate('Comment', {
              object,
            });
          }}
        >
          <View
            style={styles.hintCommentSection}
          >
            {object.parentComments.edges.map(edge => (
              <PeekCommentItem
                key={edge.node.id}
                comment={edge.node}
              />
            ))}
          </View>
        </TouchableWithoutFeedback> */}
        <View style={{
          position: 'absolute',
          top: 0,
          flexDirection: 'row',
          margin: 18,
          justifyContent: 'center',
          alignItems: 'center',
          // right: 16,
        }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 100,
              backgroundColor: '#fafafa',
              marginRight: 16,
            }}
          />
          <View style={{ flexDirection: 'row' }}>
            <Text style={{
              color: 'white',
              fontSize: 13,
              textShadowColor: '#444',
              textShadowOffset: {
                width: 0, height: 0.1,
              },
              textShadowRadius: 8,
              marginRight: 8,
              fontWeight: '700',
            }}
            >
              {this.props.query.user.username}
            </Text>
            <Text style={{
              fontSize: 13,
              textShadowColor: '#444',
              textShadowOffset: {
                width: 0, height: 0.1,
              },
              textShadowRadius: 8,
              fontWeight: '700',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
            >
              {object.createdAt}
            </Text>
          </View>
          {/* <Text style={{
            color: 'white',
            fontSize: 21,
          }}
          >
            {this.state.index + 1} / {this.props.query.user.objectCount}
          </Text> */}
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate('Comment', {
              object,
            });
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(0, 0, 0, 0.75)',
            ]}
            style={styles.gradient}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate('Comment', {
              object,
            });
          }}
        >
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: 18,
            right: 0,
            zIndex: 1000,
          }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                textShadowColor: '#000',
                textShadowOffset: {
                  width: 0, height: 1,
                },
                textShadowRadius: 4,
                fontWeight: '700',
              }}
            >
              {object.commentCount} comments
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

StoryPage.propTypes = {
  query: PropTypes.object.isRequired,
};

const StoryPageFragmentContainer = createFragmentContainer(withNavigation(StoryPage), {
  query: graphql`
    fragment StoryPage_query on Query {
      user(username: $username) {
        id
        username
        objectCount
        objects(first: 10) @connection(key: "StoryPage_objects") {
          edges {
            node {
              id
              image
              createdAt
              commentCount
            }
          }
        }
      }
    }
  `,
});

class StoryPageQueryRenderer extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
          query StoryPageQuery($username: String!) {
            ...StoryPage_query
          }
        `}
        variables={{ username: this.props.navigation.getParam('user').username }}
        render={({ err, props }) => {
          if (props) {
            return <StoryPageFragmentContainer query={props} />;
          } else if (err) console.log(err);
          return (
            <View
              style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            />
          );
        }}
      />
    );
  }
}

function forVertical(props) {
  const { layout, position, scene } = props;

  const { index } = scene;
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: ([index - 1, index, index + 1]),
    outputRange: ([height, 0, 0]),
  });

  return {
    transform: [{ translateX }, { translateY }],
  };
}

StoryPageQueryRenderer.navigationOptions = {
  // header: () => (
  //   <Text>
  //     test
  //   </Text>
  // ),
  transitionConfig: () => ({
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(3)),
      timing: Animated.timing,
    },
    screenInterpolator: forVertical,
  }),
  cardStyle: {
    backgroundColor: 'transparent',
  },
};

export default StoryPageQueryRenderer;
