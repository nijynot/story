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
} from 'react-native';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1500,
  },
  image: {
    flex: 1,
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
      console.log(res);
    })
    .then(() => { this.props.refresh(); })
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
      <View style={styles.container}>
        <StatusBar hidden />
        <Text>Login</Text>
        <TextInput
          onChangeText={text => this.setState({ username: text })}
          value={this.state.username}
        />
        <TextInput
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
          secureTextEntry
        />
        <Button
          onPress={this.onPressLogin}
          title="Login"
        />
        <Button
          onPress={this.checkLogin}
          title="Check Login status"
        />
        <Button
          onPress={this.onPressLogout}
          title="Logout"
        />
      </View>
    );
  }
}

LoginScreen.propTypes = {
  refresh: PropTypes.func.isRequired,
  // query: PropTypes.object.isRequired,
};
