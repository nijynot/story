import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewPagerAndroid,
  TouchableOpacity,
  Platform,
  Image,
  // Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  graphql,
  QueryRenderer,
  createFragmentContainer,
} from 'react-relay';
import { Permissions } from 'expo';
import { Header, HeaderBackButton, withNavigation, StackActions, NavigationActions } from 'react-navigation';
import get from 'lodash/get';
import base64 from 'base-64';

import { modernEnvironment } from '../../environment.js';
import CameraView from '../Camera/CameraView.js';
import Stories from '../Stories/Stories.js';
// import UserScreen from '../User/UserScreen.js';

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
  viewPager: {
    flex: 1,
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  },
});

function genTitle(position) {
  if (position === 0) {
    return 'Stories';
  } else if (position === 1) {
    return 'Camera';
  } else if (position === 2) {
    return 'Explore';
  }
  return 'null';
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
    this.onChangePage = this.onChangePage.bind(this);
  }
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    this.props.navigation.setParams({ user: this.props.query.viewer });
    this.props.navigation.setParams({ seed: new Date().getTime() });
  }
  onChangePage(evt) {
    this.setState({ page: evt.nativeEvent.position });
    this.props.navigation.setParams({ page: evt.nativeEvent.position });
  }
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={styles.container}>
        <ViewPagerAndroid
          style={styles.viewPager}
          initialPage={this.state.page}
          onPageSelected={this.onChangePage}
        >
          <View style={styles.container} key="1">
            <Stories query={this.props.query} />
          </View>
          <View style={styles.container} key="2">
            <CameraView
              user={this.props.query.viewer}
              environment={this.props.relay.environment}
            />
          </View>
          {/* <View style={styles.container} key="3">
            <UserScreen
              viewer={this.props.query.viewer}
              query={null}
            />
          </View> */}
        </ViewPagerAndroid>
      </View>
    );
  }
}

HomePage.propTypes = {
  query: PropTypes.object.isRequired,
};

const HomePageFragmentContainer = createFragmentContainer(withNavigation(HomePage), {
  query: graphql`
    fragment HomePage_query on Query {
      ...Stories_query
      viewer {
        id
        username
      }
    }
  `,
});

// const HomePageRefetchContainer = createRefetchContainer(
//   withNavigation(HomePage),
//   {
//     query: graphql`
//       fragment HomePage_query on Query {
//         ...Stories_query
//         isLoggedIn
//         viewer {
//           id
//           username
//           # ...UserScreen_viewer
//         }
//       }
//     `,
//   },
//   graphql`
//     # Refetch query to be fetched upon calling refetch.
//     # Notice that we re-use our fragment and the shape of this query matches our fragment spec.
//     query HomePageRefetchQuery {
//       ...HomePage_query
//     }
//   `,
// );

class HomePageQueryRenderer extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    return (
      <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
          query HomePageQuery {
            ...HomePage_query
            isLoggedIn
            viewer {
              id
              username
            }
          }
        `}
        variables={{}}
        render={({ err, props }) => {
          if (get(props, 'isLoggedIn', null)) {
            return <HomePageFragmentContainer query={props} />;
          } else if (get(props, 'isLoggedIn', null) === false) {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Login' })],
            });
            this.props.navigation.dispatch(resetAction);
          }

          if (err) {
            console.log(err);
          }
          return <View />;
        }}
      />
    );
  }
}

HomePageQueryRenderer.navigationOptions = ({ navigation, screenProps }) => {
  return {
    title: 'Home',
    header: () => {
      const page = navigation.getParam('page', 1);
      const user = navigation.getParam('user', { id: 'asdf', username: null });
      const seed = navigation.getParam('seed', new Date().getTime());

      return (
        <View
          style={{
            height: 80,
            marginTop: Platform.OS === 'ios' ? 20 : 0, // only for IOS to give StatusBar Space
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            elevation: 0,
            zIndex: 5,
          }}
        >
          <View style={{
            flex: 1,
            flexDirection: 'row',
            marginTop: 24,
            marginLeft: 16,
            // justifyContent: 'center',
            alignItems: 'center',
            opacity: 1,
            // transform: [{ translateY: this.state.dy }],
          }}
          >
            <Text style={{
              flex: 1,
              fontSize: 20,
              fontWeight: '700',
              color: (page === 1) ? 'white' : 'black',
            }}
            >
              {genTitle(page)}
            </Text>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
              }}
              onPress={() => navigation.navigate('User', {
                user,
              })}
            >
              <Image
                style={{
                  width: 28,
                  height: 28,
                  marginRight: 20,
                  borderRadius: 24,
                  // backgroundColor: '#ddd',
                }}
                source={{ uri: `http://192.168.1.213:1337/assets/u/${fromGlobalId(user.id).id}?${seed}`, cache: 'reload' }}
              />
            </TouchableOpacity>
          </View>
          <View style={{
            width: '100%',
            height: 1,
            alignSelf: 'flex-end',
          }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                borderTopWidth: 1,
                borderTopColor: '#ddd',
                opacity: 0.3,
                marginRight: 10,
                marginLeft: 10,
              }}
            />
          </View>
        </View>
      );
    },
    // header: (headerProps) => {
    //   return (
    //     <Header {...headerProps} />
    //   );
    // },
    // headerStyle: {
    //   position: 'absolute',
    //   top: 0,
    //   left: 0,
    //   right: 0,
    //   backgroundColor: 'transparent',
    //   elevation: 0,
    //   zIndex: 1000,
    // },
    // // headerLeft: <HeaderBackButton />,
    // headerTintColor: 'black',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
  };
};

export default HomePageQueryRenderer;
