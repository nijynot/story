import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ViewPagerAndroid,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { LinearGradient } from 'expo';

const styles = StyleSheet.create({
  oddContainer: {
    flex: 1,
    height: 170,
    position: 'relative',
    marginLeft: 10,
    marginRight: 5,
    // marginBottom: 5,
    marginTop: 10,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  evenContainer: {
    flex: 1,
    height: 170,
    position: 'relative',
    marginLeft: 5,
    marginRight: 10,
    // marginBottom: 5,
    marginTop: 10,
  },
  image: {
    flex: 1,
    borderRadius: 4,
    // width: Dimensions.get('window').width

  },
  gradient: {
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    right: 0,
    // top: 0,
    bottom: 0,
    height: 80,
  },
  user: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 12,
    paddingBottom: 12,
  },
  username: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: 'white',
  },
});

class StoryItem extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Story', {
        user: {
          username: 'sama',
        },
      })}
      >
        <View style={(this.props.parity === 'even') ? styles.evenContainer : styles.oddContainer}>
          <Image
            resizeMode="cover"
            style={styles.image}
            source={{ uri: this.props.source }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
            style={styles.gradient}
          >
            <View style={styles.user}>
              <Text style={styles.timestamp}>
                20 hours ago
              </Text>
              <Text style={styles.username}>
                Sam Altman @sama
              </Text>
            </View>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

StoryItem.propTypes = {
  parity: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

export default withNavigation(StoryItem);
