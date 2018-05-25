import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  PanResponder,
  Button,
} from 'react-native';
import { Camera, Permissions } from 'expo';
import { withNavigation } from 'react-navigation';

class CameraView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      image: null,
      text: 'Enter text',
      screen: Dimensions.get('window'),
    };
    this.getRatio = this.getRatio.bind(this);
    this.onPressCapture = this.onPressCapture.bind(this);
    this.onPressClose = this.onPressClose.bind(this);
  }
  componentWillMount() {
    Permissions.askAsync(Permissions.CAMERA)
    .then(({ status }) => {
      this.setState({ hasCameraPermission: status === 'granted' });
    });
    // const { height, width } = Dimensions.get('window');

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => {
        if (gestureState.dy > Math.abs(20)) {
          return true;
        }
        return false;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        if (gestureState.dy > Math.abs(20)) {
          return true;
        }
        return false;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (gestureState.dy > Math.abs(20)) {
          return true;
        }
        return false;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (gestureState.dy > Math.abs(20)) {
          return true;
        }
        return false;
      },
      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        if (gestureState.dy >= 150) {
          this.props.navigation.navigate('User', {
            user: {
              username: 'alice',
            },
          });
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }
  onPressCapture() {
    console.log('Capture!');
    this.camera.takePictureAsync({
      quality: 0,
      base64: true,
      exif: true,
    })
    .then((res) => {
      console.log(res);
      this.props.navigation.navigate('Capture', {
        environment: this.props.environment,
        user: this.props.user,
        source: res.uri,
      });
      // this.setState({
      //   image: { ...res },
      // });
    });
  }
  onPressClose() {
    this.setState({
      image: null,
    });
  }
  getRatio() {
    this.camera.getSupportedRatiosAsync()
    .then((res) => {
      console.log(res);
    });
  }
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{ flex: 1 }}
        {...this._panResponder.panHandlers}
      >
        <Camera
          ref={(ref) => { this.camera = ref; }}
          style={{
            flex: 1,
            zIndex: 1,
          }}
          ratio="5:3"
          type={this.state.type}
          autoFocus={Camera.Constants.AutoFocus.on}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingBottom: 30,
            }}
          >
            {/* <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({
                  type: this.state.type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
                });
              }}
            >
              <Text
                style={{ fontSize: 18, marginBottom: 10, color: 'white' }}
              >
                {' '}Flip{' '}
              </Text>
            </TouchableOpacity> */}
            <View style={{
              position: 'relative',
              borderRadius: 50,
              width: 80,
              height: 80,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              // flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              // opacity: 0.5,
            }}
            >
              <TouchableOpacity
                style={{
                  // flex: 1,
                  // justifyContent: 'center',
                  // alignItems: 'center',
                }}
                // underlayColor="red"
                onPress={this.onPressCapture}
              >
                <View
                  style={{
                    // position: 'absolute',
                    // top: 0,
                    // left: 0,
                    // right: 0,
                    // bottom: 0,
                    borderRadius: 35,
                    width: 60,
                    height: 60,
                    backgroundColor: 'white',
                    opacity: 1,
                  }}
                />
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={this.getRatio}
            >
              <Text
                style={{ fontSize: 18, marginBottom: 10, color: 'white' }}
              >
                {' '}Ratio{' '}
              </Text>
            </TouchableOpacity> */}
          </View>
        </Camera>
      </View>
    );
  }
}

CameraView.propTypes = {
  user: PropTypes.object.isRequired,
  environment: PropTypes.object.isRequired,
};

export default withNavigation(CameraView);
