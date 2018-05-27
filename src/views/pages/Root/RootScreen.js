import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewPagerAndroid,
  TouchableOpacity,
  Platform,
  Image,
  // Dimensions,
} from 'react-native';
// import PropTypes from 'prop-types';
import {
  graphql,
  QueryRenderer,
} from 'react-relay';
import get from 'lodash/get';
import { withNavigation } from 'react-navigation';

import { modernEnvironment } from '../../environment.js';
// import HomePage from '../Home/HomePage.js';
// import LoginScreen from '../Login/LoginScreen.js';

class RootScreenQueryRenderer extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  componentWillMount() {
    console.log(this.props.navigation.getParam('route'));
  }
  render() {
    return (
      <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
          query RootScreenQuery {
            isLoggedIn
          }
        `}
        variables={{}}
        render={({ err, props }) => {
          if (get(props, 'isLoggedIn', null)) {
            // return <Text>Home</Text>;
            this.props.navigation.navigate('Home');
          } else if (get(props, 'isLoggedIn', null) === false) {
            this.props.navigation.navigate('Login');
          }
          if (err) {
            console.log(err);
          }
          return <View />;
        }}
      />
    );
  }
}

export default withNavigation(RootScreenQueryRenderer);
