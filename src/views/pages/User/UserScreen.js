import React from 'react';
import PropTypes from 'prop-types';
import {
  graphql,
  QueryRenderer,
  createFragmentContainer,
} from 'react-relay';
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
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Header, withNavigation } from 'react-navigation';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import base64 from 'base-64';
import { LinearGradient } from 'expo';

import { modernEnvironment } from '../../environment.js';

import { AddFollowMutation } from './mutations/AddFollowMutation.js';
import { RemoveFollowMutation } from './mutations/RemoveFollowMutation.js';

function fromGlobalId(globalId) {
  const unbasedGlobalId = base64.decode(globalId);
  const delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1),
  };
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    right: 0,
    // top: 0,
    bottom: 0,
    height: 160,
  },
  user: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 12,
    paddingBottom: 12,
  },
  username: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: 'white',
  },
});

class UserScreen extends React.Component {
  constructor(props) {
    super(props);
    this.mutationAddFollow = this.mutationAddFollow.bind(this);
    this.mutationRemoveFollow = this.mutationRemoveFollow.bind(this);
  }
  mutationAddFollow() {
    AddFollowMutation({
      environment: this.props.relay.environment,
      userId: this.props.query.user.id || this.props.viewer.user.id,
    })
    .then(res => console.log(res));
  }
  mutationRemoveFollow() {
    RemoveFollowMutation({
      environment: this.props.relay.environment,
      userId: this.props.query.user.id || this.props.viewer.user.id,
    })
    .then(res => console.log(res));
  }
  render() {
    const { user } = this.props.query;

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{
            // minHeight: '30%',
            backgroundColor: '#fafafa',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'stretch',
            paddingTop: 40,
            padding: 30,
            marginBottom: 30,
          }}
          >
            <View style={{
              flexDirection: 'row',
              width: '100%',
              maxWidth: 240,
              flexWrap: 'wrap',
              borderRadius: 4,
              marginBottom: 8,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              <Image
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 100,
                }}
                source={{ uri: 'https://i.imgur.com/NCVkLV4.jpg' }}
              />
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '700',
              }}
              >
                {user.name} @{user.username}
              </Text>
            </View>
            <Text style={{
              maxWidth: 240,
              // fontSize: 13,
              color: 'black',
              textAlign: 'justify',
            }}
            >
              {user.biography}
            </Text>
            <View style={{
              marginTop: 8,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              maxWidth: 240,
              flexWrap: 'wrap',
              marginBottom: 8,
            }}
            >
              {user.tags.map(tag => (
                <Text
                  key={tag.tag}
                  style={{
                    textDecorationLine: 'underline',
                    color: 'black',
                    // fontSize: 13,
                    paddingRight: 4,
                    fontWeight: '600',
                    textAlign: 'left',
                    alignSelf: 'flex-start',
                  }}
                >
                  {tag.tag}
                </Text>
              ))}
            </View>
            {/* <View style={{
              padding: 20,
              // justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              flex: 1,
            }}
            >
              <View style={{
                maxWidth: 170,
                // justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                flex: 1,
              }}
              >
                <Text style={{ fontWeight: '700', flex: 1 }}>
                  {user.followersCount} Followers
                </Text>
              </View>
              <View>
                <Text style={{ fontWeight: '700' }}>
                  {user.followingCount} Following
                </Text>
              </View>
            </View> */}
            {(user.doesViewerFollow) ? (
              <TouchableOpacity
                onPress={this.mutationRemoveFollow}
                style={{
                  borderWidth: 1,
                  borderColor: 'black',
                  backgroundColor: 'white',
                  width: 240,
                  padding: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: 'black' }}>
                  Unfollow
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  width: 240,
                  padding: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                }}
                onPress={this.mutationAddFollow}
              >
                <Text style={{ color: 'white' }}>
                  Follow
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            // marginBottom: 20,
            paddingBottom: 20,
          }}
          >
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Story', {
              object: user.objects.edges[0].node,
              user: { username: user.username },
            })}
            >
              <View
                style={{
                  aspectRatio: 0.6,
                  width: '80%',
                  borderRadius: 8,
                }}
              >
                <Image
                  style={{
                    flex: 1,
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                  source={{ uri: `http://192.168.1.213:1337/assets/objects/${fromGlobalId(user.objects.edges[0].node.id).id}` }}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
                  style={styles.gradient}
                >
                  <View style={styles.user}>
                    <Text style={styles.timestamp}>
                      {user.objects.edges[0].node.createdAt}
                    </Text>
                    <Text style={styles.username}>
                      {user.name} @{user.username || 'unknown'}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </View>
    );
  }
}

UserScreen.propTypes = {
  query: PropTypes.object.isRequired,
};

// UserScreen.defaultProps = {
//   query: {},
//   viewer: {},
// };

const UserScreenFragmentContainer = createFragmentContainer(withNavigation(UserScreen), {
  query: graphql`
    fragment UserScreen_query on Query {
      user(username: $username) {
        id
        name
        username
        biography
        followersCount
        followingCount
        doesViewerFollow
        tags {
          tag
        }
        objects(first: 1) @connection(key: "UserScreen_objects") {
          edges {
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
          }
        }
      }
    }
  `,
});

class UserScreenQueryRenderer extends React.Component {
  render() {
    const user = this.props.navigation.getParam('user', { username: '' });

    return (
      <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
          query UserScreenQuery($username: String!) {
            ...UserScreen_query
          }
        `}
        variables={{ username: user.username }}
        render={({ err, props }) => {
          if (props) {
            return <UserScreenFragmentContainer query={props} />;
          } else if (err) console.log(err);
          return (
            <View
              style={{ flex: 1, backgroundColor: '#fafafa' }}
            />
          );
        }}
      />
    );
  }
}

UserScreenQueryRenderer.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.user.username,
  header: (headerProps) => {
    return <Header {...headerProps} />;
  },
  headerStyle: {
    backgroundColor: 'white',
    elevation: 0,
  },
  headerTintColor: 'black',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  cardStyle: {
    backgroundColor: 'white',
  },
});

export default withNavigation(UserScreenQueryRenderer);
