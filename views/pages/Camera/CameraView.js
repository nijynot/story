import React from 'react';
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
} from 'react-native';
import { Camera, Permissions } from 'expo';

export default class CameraView extends React.Component {
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
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    const { height, width } = Dimensions.get('window');
    console.log(height / width);
    console.log(height, width);
  }
  getRatio() {
    this.camera.getSupportedRatiosAsync()
    .then((res) => {
      console.log(res);
    });
  }
  onPressCapture() {
    console.log('Capture!');
    this.camera.takePictureAsync({
      quality: 0,
      base64: true,
      exif: false,
    })
    .then((res) => {
      console.log(res);
      this.setState({
        image: { ...res },
      });
    });
  }
  onPressClose() {
    this.setState({
      image: null,
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
      >
        <Camera
          ref={(ref) => { this.camera = ref; }}
          style={{
            flex: 1,
            zIndex: 1,
          }}
          ratio="5:3"
          type={this.state.type}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingBottom: 50,
            }}
          >
            <TouchableOpacity
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
            </TouchableOpacity>
            <TouchableHighlight
              style={{
                borderWidth: 5,
                borderColor: '#fff',
                borderRadius: 100,
                width: 70,
                height: 70,
                elevation: 2,
                paddingBottom: 3,
                // shadowColor: '#000',
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.8,
                // shadowRadius: 2,
              }}
              underlayColor="red"
              onPress={this.onPressCapture}
            >
              <Text
                style={{ fontSize: 18, marginBottom: 10, color: 'white' }}
              >
                {' '}
              </Text>
            </TouchableHighlight>
            <TouchableOpacity
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
            </TouchableOpacity>
          </View>
        </Camera>
        {(this.state.image) ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              zIndex: 10,
            }}
          >
            <Image
              resizeMode="cover"
              style={{ flex: 1 }}
              source={{ uri: this.state.image.uri }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // width: 30'0,
                // height: 3'00,
                backgroundColor: 'transparent',
                alignItems: 'center',
              }}
            >
              <ScrollView
                style={{
                  flex: 1,
                }}
              >
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      alignSelf: 'center',
                      fontSize: 42,
                      fontWeight: '700',
                      paddingTop: this.state.screen.height * 0.3,
                      width: this.state.screen.width - 30,
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                    }}
                    autoCorrent={false}
                    maxLength={280}
                    underlineColorAndroid="transparent"
                    onChangeText={text => this.setState({ text })}
                    value={this.state.text}
                    multiline
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
