// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
//
// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//         <Text>Changes you make will automatically reload.</Text>
//         <Text>Shake your phone to open the developer menu.</Text>
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  ViewPagerAndroid,
  Easing,
  Animated,
} from 'react-native';
import { Permissions } from 'expo';
import { createStackNavigator } from 'react-navigation';
import get from 'lodash/get';
// import * as Keychain from 'react-native-keychain';
// import StackViewStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator.js';
import StackViewTransitionConfigs from 'react-navigation/src/views/StackView/StackViewTransitionConfigs.js';

import HomePage from './views/pages/Home/HomePage.js';
import StoryPage from './views/pages/Story/StoryPage.js';
import LoginScreen from './views/pages/Login/LoginScreen.js';
import CaptureScreen from './views/pages/Capture/CaptureScreen.js';
import CommentScreen from './views/pages/Comment/CommentScreen.js';
import UserScreen from './views/pages/User/UserScreen.js';
import PublishScreen from './views/pages/Publish/PublishScreen.js';
import PublishReplyScreen from './views/pages/PublishReply/PublishReplyScreen.js';
// import Stories from './views/pages/Stories/Stories.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  viewPager: {
    flex: 1,
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  },
});

// const transitionConfig = () => {
//   return {
//     transitionSpec: {
//       duration: 750,
//       easing: Easing.out(Easing.poly(4)),
//       timing: Animated.timing,
//       useNativeDriver: true,
//     },
//     screenInterpolator: (sceneProps) => {
//       const { layout, position, scene } = sceneProps;
//
//       const thisSceneIndex = scene.index;
//       const width = layout.initWidth;
//
//       const translateX = position.interpolate({
//         inputRange: [thisSceneIndex - 1, thisSceneIndex],
//         outputRange: [width, 0],
//       });
//
//       return { transform: [{ translateX }] };
//     },
//   };
// };

function fromTop(props) {
  // const { routeName } = props.scene.route;
  const { layout, position, scene } = props;

  const { index } = scene;
  const height = layout.initHeight;

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: ([index - 1, index, index + 1]),
    outputRange: ([-height, 0, 0]),
  });

  return {
    transform: [{ translateX }, { translateY }],
  };
}

function fromBottom(props) {
  // const { routeName } = props.scene.route;
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

const RootStack = createStackNavigator({
  Home: HomePage,
  Story: StoryPage,
  Login: LoginScreen,
  Capture: CaptureScreen,
  Comment: CommentScreen,
  User: UserScreen,
  Publish: PublishScreen,
  PublishReply: PublishReplyScreen,
}, {
  headerMode: 'screen',
  mode: 'card',
  initialRouteName: 'Home',
  navigationOptions: {
    header: null,
  },
  cardStyle: {
    backgroundColor: 'transparent',
  },
  // transitionConfig: () => ({
  //   screenInterpolator: (sceneProps) => {
  //     const { layout, position, scene } = sceneProps;
  //     const { index } = scene;
  //
  //     const translateX = position.interpolate({
  //       inputRange: [index - 1, index, index + 1],
  //       outputRange: [layout.initWidth, 0, 0],
  //     });
  //
  //     const opacity = position.interpolate({
  //       inputRange: [index - 1, index - 0.99, index, index + 0.99, index + 1],
  //       outputRange: [0, 1, 1, 0.3, 0],
  //     });
  //
  //     return { opacity, transform: [{ translateX }] };
  //   },
  // }),
  // transitionConfig: () => ({
  //   transitionSpec: {
  //     duration: 300,
  //     easing: Easing.out(Easing.poly(3)),
  //     timing: Animated.timing,
  //   },
  //   screenInterpolator: forVertical,
  // }),
  transitionConfig: (props) => {
    const { routeName } = props.scene.route;
    const { index } = props.scene;

    if (
      (get(props.scenes[index], 'route.routeName', null) === 'User' &&
      get(props.scenes[index - 1], 'route.routeName', null) === 'Home') ||
      (get(props.scenes[index + 1], 'route.routeName', null) === 'User' &&
      get(props.scenes[index], 'route.routeName', null) === 'Home')
    ) {
      return {
        transitionSpec: {
          duration: 300,
          // easing: Easing.out(Easing.poly(3)),
          easing: Easing.out(Easing.exp),
          timing: Animated.timing,
        },
        screenInterpolator: fromTop,
      };
    }

    return {
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(3)),
        timing: Animated.timing,
      },
      screenInterpolator: fromBottom,
    };

    // if (routeName === 'Story') {
    // }
  },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  async componentWillMount() {
    // const { status } = await Permissions.askAsync(Permissions.CAMERA);
    // this.setState({ hasCameraPermission: status === 'granted' });
    // const { height, width } = Dimensions.get('window');
    // console.log(height / width);
  }
  render() {
    // const { hasCameraPermission } = this.state;
    // if (hasCameraPermission === null) {
    //   return <View />;
    // } else if (hasCameraPermission === false) {
    //   return <Text>No access to camera</Text>;
    // }
    return (
      <RootStack />
    );
  }
}

// <View style={styles.container}>
//   <ViewPagerAndroid
//     style={styles.viewPager}
//     initialPage={1}
//   >
//     <View style={styles.container} key="1">
//       <CameraView />
//     </View>
//     <View style={styles.container} key="2">
//       <Stories />
//     </View>
//   </ViewPagerAndroid>
// </View>
