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
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Feather } from '@expo/vector-icons';

import { NewObjectMutation } from './mutations/NewObjectMutation.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  caption: {
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center',
    fontSize: 42,
    fontWeight: '700',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});

export default class CaptureScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      // screen: Dimensions.get('window'),
    };
    this.onPressClose = this.onPressClose.bind(this);
    this.mutationNewObject = this.mutationNewObject.bind(this);
  }
  onPressClose() {
    this.props.navigation.goBack();
  }
  mutationNewObject() {
    const source = this.props.navigation.getParam('source', 'http://192.168.1.213:1337/assets/objects/9u3BnoN53xao');
    const user = this.props.navigation.getParam('user', {});
    const environment = this.props.navigation.getParam('environment', {});

    console.log(source);
    console.log(user);

    NewObjectMutation({
      environment,
      uploadables: {
        file: {
          uri: source,
          type: 'image/jpeg',
          name: 'myimage.jpeg',
        },
      },
      image: 1,
      body: this.state.text,
      parentId: user.id,
    })
    .then((res) => {
      console.log(res);
    });
  }
  render() {
    const source = this.props.navigation.getParam('source', 'http://192.168.1.213:1337/assets/objects/9u3BnoN53xao');

    return (
      <View style={styles.container}>
        <StatusBar hidden />
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
            source={{ uri: source }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'transparent',
              alignItems: 'center',
            }}
          >
            <ScrollView
              style={{
                flex: 1,
                width: '100%',
              }}
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{
                flex: 1,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: 'rgba(132, 16, 16, 0.6)',
              }}
              >
                <TextInput
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    alignSelf: 'center',
                    fontSize: 18,
                    fontWeight: '700',
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    // marginTop: this.state.screen.height * 0.2,
                    // width: this.state.screen.width - 60,
                    // backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    // marginBottom: '50%',
                    width: '100%',
                    padding: 0,
                    textShadowRadius: 4,
                    textShadowColor: '#666',
                    textShadowOffset: { width: 0, height: 0.1 },
                  }}
                  autoCorrent={false}
                  maxLength={140}
                  placeholder="Enter caption"
                  placeholderTextColor="#ddd"
                  underlineColorAndroid="transparent"
                  onChangeText={text => this.setState({ text })}
                  value={this.state.text}
                  multiline
                />
              </View>
            </ScrollView>
          </View>
        </View>
        <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 15 }}>
          <TouchableWithoutFeedback onPress={this.onPressClose}>
            <View style={{
              marginTop: 10,
              marginLeft: 10,
              elevation: 5,
            }}
            >
              <Feather name="x" size={32} color="white" />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 15 }}>
          <TouchableOpacity onPress={this.mutationNewObject}>
            <View style={{
              borderRadius: 32,
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: 'white',
              // marginRight: 8,
            }}
            >
              <Text style={{ fontWeight: '700', color: 'black' }}>
                Post
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

CaptureScreen.propTypes = {
  // query: PropTypes.object.isRequired,
};
