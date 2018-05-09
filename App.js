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
} from 'react-native';
import { Permissions } from 'expo';
import { createStackNavigator } from 'react-navigation';

import HomePage from './views/pages/Home/HomePage.js';
import StoryPage from './views/pages/Story/StoryPage.js';
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

const RootStack = createStackNavigator({
  Home: HomePage,
  Story: StoryPage,
}, {
  headerMode: 'screen',
  mode: 'modal',
  initialRouteName: 'Home',
  navigationOptions: {
    header: null,
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
