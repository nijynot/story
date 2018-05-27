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

class SettingsAccountScreen extends React.Component {
  constructor(props) {
    super(props);
    this.onPressLogout = this.onPressLogout.bind(this);
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
        backgroundColor: '#fafafa',
        alignItems: 'center',
      }}
      >
        <ScrollView style={{ width: '100%' }}>
          <TouchableHighlight
            style={{
              flex: 1,
              padding: 16,
            }}
            onPress={this.onPressLogout}
            underlayColor="#e3e3e3"
          >
            <View>
              <Text style={{ fontSize: 16 }}>
                Log out
              </Text>
            </View>
          </TouchableHighlight>
        </ScrollView>
      </View>
    );
  }
}

SettingsAccountScreen.propTypes = {
  query: PropTypes.object.isRequired,
};

const SettingsAccountScreenFragmentContainer =
  createFragmentContainer(withNavigation(SettingsAccountScreen), {
    query: graphql`
      fragment SettingsAccountScreen_query on Query {
        viewer {
          id
          name
          username
        }
      }
    `,
  });

class SettingsAccountScreenQueryRenderer extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
          query SettingsAccountScreenQuery {
            ...SettingsAccountScreen_query
          }
        `}
        variables={{}}
        render={({ err, props }) => {
          if (props) {
            return <SettingsAccountScreenFragmentContainer query={props} />;
          } else if (err) console.log(err);
          return (
            <View
              style={{ flex: 1, backgroundColor: '#fafafa' }}
            />
          );
        }}
      />
    );
  }
}

SettingsAccountScreenQueryRenderer.navigationOptions = ({ navigation }) => ({
  title: 'Settings',
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

export default withNavigation(SettingsAccountScreenQueryRenderer);
