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
  TouchableHighlight,
} from 'react-native';
import { Header, withNavigation, StackActions, NavigationActions } from 'react-navigation';
import base64 from 'base-64';
// import { Feather } from '@expo/vector-icons';
// import { ImagePicker, Permissions } from 'expo';

import { modernEnvironment } from '../../environment.js';

function fromGlobalId(globalId) {
  const unbasedGlobalId = base64.decode(globalId);
  const delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1),
  };
}

const styles = StyleSheet.create({
});

class RegisterPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
    };
    this.onPressLogout = this.onPressLogout.bind(this);
  }
  componentWillMount() {
    console.log(this.props.navigation.getParam('user'), {});
  }
  onPressLogout() {
    fetch('http://192.168.1.213:1337/logout', {
      credentials: 'include',
      method: 'GET',
    })
    .then((res) => {
      return res.text();
    })
    .then((res) => {
      console.log(res);
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      });
      this.props.navigation.dispatch(resetAction);
    })
    .catch(err => console.log(err));
  }
  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        margin: 24,
      }}
      >
        <Text style={{
          fontWeight: '700',
          fontSize: 18,
          marginBottom: 8,
        }}
        >
          Choose a password
        </Text>
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
            marginBottom: 8,
          }}
          onChangeText={text => this.setState({ name: text })}
          value={this.state.name}
          underlineColorAndroid="transparent"
        />
        <Text style={{
          color: '#aaa',
          fontWeight: '700',
          alignSelf: 'flex-start',
        }}
        >
          Retype password
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
          onChangeText={text => this.setState({ username: text })}
          value={this.state.username}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity
          style={{
            borderRadius: 40,
            // width: '100%',
            paddingTop: 12,
            paddingRight: 24,
            paddingBottom: 12,
            paddingLeft: 24,
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
              Next
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

RegisterPasswordScreen.propTypes = {
  query: PropTypes.object.isRequired,
};

const RegisterPasswordScreenFragmentContainer
  = createFragmentContainer(withNavigation(RegisterPasswordScreen), {
    query: graphql`
      fragment RegisterPasswordScreen_query on Query {
        viewer {
          id
          name
          username
        }
      }
    `,
  });

class RegisterPasswordScreenQueryRenderer extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
          query RegisterPasswordScreenQuery {
            ...RegisterPasswordScreen_query
          }
        `}
        variables={{}}
        render={({ err, props }) => {
          if (props) {
            return <RegisterPasswordScreenFragmentContainer query={props} />;
          } else if (err) console.log(err);
          return (
            <View
              style={{ flex: 1, backgroundColor: 'white' }}
            />
          );
        }}
      />
    );
  }
}

RegisterPasswordScreenQueryRenderer.navigationOptions = ({ navigation }) => ({
  title: '',
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

export default withNavigation(RegisterPasswordScreenQueryRenderer);
