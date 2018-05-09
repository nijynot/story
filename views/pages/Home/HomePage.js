import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewPagerAndroid,
  // Dimensions,
} from 'react-native';
import { Permissions } from 'expo';

import CameraView from '../Camera/CameraView.js';
import Stories from '../Stories/Stories.js';

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

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    // const { height, width } = Dimensions.get('window');
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
          initialPage={1}
        >
          <View style={styles.container} key="1">
            <CameraView />
          </View>
          <View style={styles.container} key="2">
            <Stories />
          </View>
        </ViewPagerAndroid>
      </View>
    );
  }
}

// HomePage.navigationOptions = {
//   title: 'Home',
//   headerStyle: {
//     backgroundColor: 'transparent',
//   },
// };
