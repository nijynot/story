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
  TouchableOpacity,
} from 'react-native';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.onPressLogin = this.onPressLogin.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.onPressLogout = this.onPressLogout.bind(this);
  }
  onPressLogin() {
    console.log(this.state.username, this.state.password);
    fetch('http://192.168.1.213:1337/login', {
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      body: `username=${this.state.username}&password=${this.state.password}`,
      // mode: 'cors', // no-cors, cors, *same-origin
      // redirect: 'follow', // manual, *follow, error
      // referrer: 'no-referrer', // *client, no-referrer
    })
    // .then(res => res.text())
    .then((res) => {
      // this.props.navigation.goBack();
      // this.props.navigation.replace('Home');
      // console.log(res);
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home' })],
      });
      this.props.navigation.dispatch(resetAction);
    })
    .catch(err => console.log(err));
  }
  onPressLogout() {
    fetch('http://192.168.1.213:1337/logout', {
      credentials: 'include',
      method: 'GET',
    })
    .then((res) => {
      return res.text();
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }
  checkLogin() {
    fetch('http://192.168.1.213:1337/', {
      credentials: 'include', // include, same-origin, *omit
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
    })
    .then((res) => {
      return res.text();
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }
  render() {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 24,
          }}
          style={{
            flex: 1,
            width: '100%',
          }}
        >
          <StatusBar hidden />
          {/* <Text>Login</Text> */}
          <Text style={{
            color: '#aaa',
            fontWeight: '700',
            alignSelf: 'flex-start',
          }}
          >
            Username
          </Text>
          <TextInput
            style={{
              fontSize: 16,
              width: '100%',
              borderWidth: 1,
              borderColor: '#e0e0e0',
              backgroundColor: '#fafafa',
              paddingTop: 8,
              paddingRight: 12,
              paddingBottom: 8,
              paddingLeft: 12,
              borderRadius: 4,
              marginBottom: 8,
            }}
            // placeholder="Username"
            onChangeText={text => this.setState({ username: text })}
            value={this.state.username}
            underlineColorAndroid="transparent"
          />
          <Text style={{
            color: '#aaa',
            fontWeight: '700',
            alignSelf: 'flex-start',
          }}
          >
            Password
          </Text>
          <TextInput
            style={{
              fontSize: 16,
              width: '100%',
              borderWidth: 1,
              borderColor: '#e0e0e0',
              backgroundColor: '#fafafa',
              paddingTop: 8,
              paddingRight: 12,
              paddingBottom: 8,
              paddingLeft: 12,
              borderRadius: 4,
              marginBottom: 16,
            }}
            // placeholder="Password"
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            secureTextEntry
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={{
              width: '100%',
              borderColor: '#444',
              borderWidth: 1,
              borderRadius: 40,
              paddingTop: 12,
              paddingRight: 12,
              paddingBottom: 12,
              paddingLeft: 12,
              marginBottom: 8,
            }}
            onPress={this.onPressLogin}
          >
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
              }}
              >
                Login
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 40,
              width: '100%',
              paddingTop: 12,
              paddingRight: 12,
              paddingBottom: 12,
              paddingLeft: 12,
              backgroundColor: 'black',
            }}
            onPress={() => this.props.navigation.navigate('Register')}
          >
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '700',
              }}
              >
                Register
              </Text>
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

LoginScreen.propTypes = {
  // query: PropTypes.object.isRequired,
};
