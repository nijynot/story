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
  createPaginationContainer,
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
  },
  backward: {
    flex: 1,
  },
  forward: {
    flex: 2,
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
    this._loadMore = this._loadMore.bind(this);
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

    if (((this.state.index + amount + 1) % 5) === 0) {
      this._loadMore();
    }

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
  _loadMore() {
    console.log(this.props.relay.hasMore());
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(
      5, // Fetch the next 10 feed items
      (error) => {
        console.log(error);
      },
    );
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
        <View style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <Text style={{
            fontWeight: '700',
            color: 'white',
            fontSize: 18,
            textShadowRadius: 2,
            textShadowColor: '#aaa',
            textShadowOffset: { width: 0, height: 0.1 },
          }}
          >
            {object.body}
          </Text>
        </View>
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
          <Image
            style={{
              width: 28,
              height: 28,
              borderRadius: 100,
              // backgroundColor: '#fafafa',
              marginRight: 16,
            }}
            source={{ uri: `http://192.168.1.213:1337/assets/u/${fromGlobalId(this.props.query.user.id).id}`, cache: 'reload' }}
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

/* react-relay */
const StoryPagePaginationContainer = createPaginationContainer(
  withNavigation(StoryPage),
  {
    query: graphql`
      fragment StoryPage_query on Query
      @argumentDefinitions(
        username: { type: "String" }
        first: { type: "Int", defaultValue: 10 }
        after: { type: "String" }
        # orderby: {type: "[FriendsOrdering]", defaultValue: [DATE_ADDED]}
      ) {
        user(username: $username) {
          id
          username
          objectCount
          objects(
            first: $first
            after: $after
          ) @connection(key: "StoryPage_objects") {
            edges {
              node {
                id
                image
                body
                createdAt
                commentCount
              }
              cursor
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.query.user.objects;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    // getFragmentVariables(prevVars, totalCount) {
    //   return {
    //     ...prevVars,
    //     count: totalCount,
    //   };
    // },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        first: count,
        after: cursor,
        username: props.query.user.username,
        // orderBy: fragmentVariables.orderBy,
        // userID isn't specified as an @argument for the fragment, but it should be a variable available for the fragment under the query root.
        // userID: fragmentVariables.userID,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling loadMore.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query StoryPagePaginationQuery($username: String!, $first: Int!, $after: String) {
        ...StoryPage_query @arguments(username: $username, first: $first, after: $after)
      }
    `,
  }
);

// const StoryPageFragmentContainer = createFragmentContainer(withNavigation(StoryPage), {
//   query: graphql`
//     fragment StoryPage_query on Query {
//       user(username: $username) {
//         id
//         username
//         objectCount
//         objects(first: 10) @connection(key: "StoryPage_objects") {
//           edges {
//             node {
//               id
//               image
//               createdAt
//               commentCount
//             }
//           }
//         }
//       }
//     }
//   `,
// });

class StoryPageQueryRenderer extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
          query StoryPageQuery($username: String!) {
            ...StoryPage_query @arguments(username: $username)
          }
        `}
        variables={{ username: this.props.navigation.getParam('user').username }}
        render={({ err, props }) => {
          if (props) {
            return <StoryPagePaginationContainer query={props} />;
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

/* react-navigation */
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
