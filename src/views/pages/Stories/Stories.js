import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewPagerAndroid,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';

import StoryItem from './components/StoryItem.js';

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: 'row',
    // marginTop: 43,
    // marginRight: 10,
    // marginBottom: 10,
    // marginLeft: 10,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

function isEven(n) {
  return n % 2 === 0;
}

export default class Stories extends React.Component {
  render() {
    return (
      <FlatList
        style={styles.container}
        data={[1, 2, 3, 4, 5, 6, 7]}
        renderItem={(item) => {
          return (
            <StoryItem
              key={item.item}
              parity={(isEven(item.item)) ? 'even' : 'odd'}
              source="https://images.pexels.com/photos/698875/pexels-photo-698875.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            />
          );
        }}
        numColumns={2}
      />
    );
  }
}
