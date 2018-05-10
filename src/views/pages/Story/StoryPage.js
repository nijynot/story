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
} from 'react-native';

// import StoryItem from './components/StoryItem.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    // marginTop: 43,
    // marginRight: 10,
    // marginBottom: 10,
    // marginLeft: 10,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    flex: 1,
  },
  controllerContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  controller: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'green',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  backward: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'red',
  },
  forward: {
    flex: 2,
    borderWidth: 0.5,
    borderColor: 'red',
  },
});

export default class StoryPage extends React.Component {
  render() {
    console.log(Dimensions.get('window').width);
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Image
          style={styles.image}
          // source={{ uri: this.props.source }}
          source={{ uri: 'https://images.pexels.com/photos/698875/pexels-photo-698875.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' }}
        />
        <View style={styles.controllerContainer}>
          <View style={styles.controller}>
            <TouchableWithoutFeedback
              onPress={() => { console.log('backward'); }}
            >
              <View style={styles.backward}>
                <Text>
                  {' '}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => { console.log('forward'); }}
            >
              <View style={styles.forward}>
                <Text>
                  {' '}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}

StoryPage.propTypes = {
  // source: PropTypes.string.isRequired,
};

StoryPage.navigationOptions = {
};
