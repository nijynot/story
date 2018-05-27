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
} from 'react-native';
import { Header, withNavigation } from 'react-navigation';
import base64 from 'base-64';
import { Feather } from '@expo/vector-icons';
import { ImagePicker, Permissions } from 'expo';

import { modernEnvironment } from '../../environment.js';
import { UpdateUserMutation } from './mutations/UpdateUserMutation.js';
import { UpdateProfileMutation } from './mutations/UpdateProfileMutation.js';

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

class SettingsGeneralScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.query.viewer.name,
      biography: this.props.query.viewer.biography,
      tags: this.props.query.viewer.rawTags,
      image: '',
    };
    this.onPressSave = this.onPressSave.bind(this);
    this.mutationUpdateUser = this.mutationUpdateUser.bind(this);
    this.mutationUpdateProfile = this.mutationUpdateProfile.bind(this);
    this._pickImage = this._pickImage.bind(this);
  }
  componentDidMount() {
    this.props.navigation.setParams({ onPressSave: this.onPressSave });
  }
  onPressSave() {
    console.log('test');
    this.mutationUpdateUser();
    this.mutationUpdateProfile();
  }
  mutationUpdateProfile() {
    if (this.state.image) {
      UpdateProfileMutation({
        environment: this.props.relay.environment,
        uploadables: {
          file: {
            uri: this.state.image,
            type: 'image/jpeg',
            name: 'myimage.jpg',
          },
        },
      })
      .then((res) => {
        console.log(res);
      });
    }
  }
  mutationUpdateUser() {
    UpdateUserMutation({
      environment: this.props.relay.environment,
      name: this.state.name,
      biography: this.state.biography,
      tags: this.state.tags,
    })
    .then((res) => {
      console.log(res);
      if (res) {
        this.props.navigation.goBack();
      }
    });
  }
  async _pickImage() {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  }
  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#fafafa',
        // justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <Image
          style={{
            marginTop: 24,
            width: 120,
            height: 120,
            borderRadius: 100,
          }}
          source={{ uri: this.state.image || `http://192.168.1.213:1337/assets/u/${fromGlobalId(this.props.query.viewer.id).id}?${new Date().getTime()}` }}
        />
        <TouchableOpacity onPress={this._pickImage}>
          <Text style={{
            marginTop: 8,
            fontWeight: '700',
            fontSize: 16,
          }}
          >
            Change profile photo
          </Text>
        </TouchableOpacity>
        <View style={{
          flex: 1,
          padding: 20,
        }}
        >
          <View style={{ marginBottom: 8 }}>
            <Text style={{
              color: '#aaa',
            }}
            >
              Name
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
              }}
              placeholder="Name"
              onChangeText={text => this.setState({ name: text })}
              value={this.state.name}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={{ marginBottom: 8 }}>
            <Text style={{
              color: '#aaa',
            }}
            >
              Biography
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
              }}
              placeholder="Biography"
              onChangeText={text => this.setState({ biography: text })}
              value={this.state.biography}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={{ marginBottom: 8 }}>
            <Text style={{
              color: '#aaa',
            }}
            >
              Tags (Add a tag with #, seperate tags by a space.)
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
              }}
              placeholder="Tags"
              onChangeText={text => this.setState({ tags: text })}
              value={this.state.tags}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
      </View>
    );
  }
}

SettingsGeneralScreen.propTypes = {
  query: PropTypes.object.isRequired,
};

const SettingsGeneralScreenFragmentContainer =
  createFragmentContainer(withNavigation(SettingsGeneralScreen), {
    query: graphql`
      fragment SettingsGeneralScreen_query on Query {
        viewer {
          id
          name
          username
          biography
          rawTags
        }
      }
    `,
  });

class SettingsGeneralScreenQueryRenderer extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
          query SettingsGeneralScreenQuery {
            ...SettingsGeneralScreen_query
          }
        `}
        variables={{}}
        render={({ err, props }) => {
          if (props) {
            return <SettingsGeneralScreenFragmentContainer query={props} />;
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

SettingsGeneralScreenQueryRenderer.navigationOptions = ({ navigation }) => ({
  title: 'Edit profile',
  header: (headerProps) => {
    return <Header {...headerProps} />;
  },
  headerRight: (
    <View>
      <TouchableOpacity onPress={navigation.getParam('onPressSave')}>
        <View style={{
          paddingRight: 20,
        }}
        >
          <Feather name="check" color="black" size={24} />
        </View>
      </TouchableOpacity>
    </View>
  ),
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

export default withNavigation(SettingsGeneralScreenQueryRenderer);
