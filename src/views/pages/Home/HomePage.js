import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewPagerAndroid,
  // Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  graphql,
  QueryRenderer,
  createFragmentContainer,
} from 'react-relay';
import { Permissions } from 'expo';

import { HomePage_query } from './__generated__/HomePage_query.graphql';

import { modernEnvironment } from '../../environment.js';
import CameraView from '../Camera/CameraView.js';
import Stories from '../Stories/Stories.js';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewPager: {
    flex: 1,
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  },
});

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    console.log(this.props.query.static);
    // const { height, width } = Dimensions.get('window');
  }
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.container}>
        <ViewPagerAndroid
          style={styles.viewPager}
          initialPage={1}
        >
          <View style={styles.container} key="1">
            <CameraView />
          </View>
          <View style={styles.container} key="2">
            <Stories />
          </View>
        </ViewPagerAndroid>
      </View>
    );
  }
}

HomePage.propTypes = {
  // query: PropTypes.object.isRequired,
};

const HomePageFragmentContainer = createFragmentContainer(HomePage, {
  query: graphql`
    fragment HomePage_query on Query {
      id
      static
    }
  `,
});

const HomePageQueryRenderer = () => {
  fetch('http://192.168.1.213:1337/graphql?query=%7B%0A%20%20static%0A%7D')
  .then(res => res.json())
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });
  return (
    <QueryRenderer
      environment={modernEnvironment}
      query={graphql`
        query HomePageQuery {
          ...HomePage_query
        }
      `}
      variables={{}}
      render={({ err, props }) => {
        console.log('Props:', props);
        console.log('Error:', err);
        if (props) {
          return <HomePageFragmentContainer query={props} />;
        } else if (err) console.log(err);
        return <Text>Loading</Text>;
      }}
    />
  );
};

export default HomePageQueryRenderer;

// HomePage.navigationOptions = {
//   title: 'Home',
//   headerStyle: {
//     backgroundColor: 'transparent',
//   },
// };
