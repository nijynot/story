import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewPagerAndroid,
  Image,
  ScrollView,
  FlatList,
  Header,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  graphql,
  createFragmentContainer,
} from 'react-relay';
import base64 from 'base-64';

// import { Stories_query } from './__generated__/Stories_query.graphql';

import StoryItem from './components/StoryItem.js';

function fromGlobalId(globalId) {
  const unbasedGlobalId = base64.decode(globalId);
  const delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1),
  };
}

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

class Stories extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 80,
            marginTop: Platform.OS === 'ios' ? 20 : 0, // only for IOS to give StatusBar Space
          }}
        />
        <FlatList
          style={styles.container}
          data={this.props.query.userFeed.edges}
          renderItem={(edge) => {
            return (
              // <Text>
              //   test
              // </Text>
              <StoryItem
                key={edge.item.node.id}
                parity={(isEven(edge.index + 1)) ? 'even' : 'odd'}
                object={edge.item.node.objects.edges[0].node}
                source={`http://192.168.1.213:1337/assets/objects/${fromGlobalId(edge.item.node.objects.edges[0].node.id).id}?${Math.random()}`}
              />
            );
          }}
          numColumns={2}
        />
      </View>
    );
  }
}

Stories.propTypes = {
  query: PropTypes.object.isRequired,
};

// Stories.navigationOptions = ({ navigation, screenProps }) => {
//   const params = navigation.state.params || {};
//
//   return {
//     title: 'Search',
//     header: (headerProps) => {
//       return <Header {...headerProps} />;
//     },
//     headerStyle: {
//       backgroundColor: 'white',
//       elevation: 1,
//     },
//     headerTintColor: 'white',
//     headerTitleStyle: {
//       fontWeight: 'bold',
//     },
//     cardStyle: {
//       backgroundColor: 'white',
//     },
//   };
// };

export default createFragmentContainer(Stories, {
  query: graphql`
    fragment Stories_query on Query {
      userFeed(first: 10) {
        edges {
          node {
            id
            objects(first: 1) {
              edges {
                node {
                  id
                  image
                  user {
                    id
                    username
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
});
