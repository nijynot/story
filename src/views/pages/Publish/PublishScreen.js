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
  TouchableOpacity,
} from 'react-native';
import { withNavigation, Header } from 'react-navigation';

import { modernEnvironment } from '../../environment.js';
import { NewParentCommentMutation } from './mutations/NewParentCommentMutation.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
  },
  image: {
    flex: 1,
  },
});

class PublishScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
    };
    this.mutationNewParentComment = this.mutationNewParentComment.bind(this);
  }
  componentWillMount() {
    this.props.navigation.setParams({ mutationNewParentComment: this.mutationNewParentComment });
  }
  mutationNewParentComment() {
    const object = this.props.navigation.getParam('object', null);
    NewParentCommentMutation({
      environment: modernEnvironment,
      parentId: object.id,
      objectId: object.id,
      body: this.state.body,
    })
    .then((res) => {
      console.log(res);
    });
  }
  render() {
    const object = this.props.navigation.getParam('object', null);

    return (
      <View style={styles.container}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 100,
            backgroundColor: '#aaa',
            marginTop: 12,
            marginLeft: 12,
          }}
        />
        <TextInput
          style={{
            flex: 1,
            padding: 12,
            fontSize: 16,
          }}
          underlineColorAndroid="transparent"
          placeholder="Add a comment..."
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={this.state.body}
          onChangeText={text => this.setState({ body: text })}
        />
      </View>
    );
  }
}

PublishScreen.propTypes = {
};

PublishScreen.navigationOptions = ({ navigation, screenProps }) => {
  const params = navigation.state.params || {};

  return {
    title: params.title || 'Publish a comment',
    headerRight: (
      <TouchableOpacity onPress={params.mutationNewParentComment}>
        <View style={{
          borderRadius: 20,
          paddingVertical: 6,
          paddingHorizontal: 16,
          backgroundColor: 'black',
          marginRight: 8,
        }}
        >
          <Text style={{ fontWeight: '700', color: 'white' }}>
            Publish
          </Text>
        </View>
      </TouchableOpacity>
    ),
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
  };
};

export default PublishScreen;
