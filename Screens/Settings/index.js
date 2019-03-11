import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, AsyncStorage } from 'react-native';

import { List, ListItem, Icon, Left, Right, Switch } from 'native-base';
import { Button } from "react-native-elements";



import firebase from '../../config'
import { createStackNavigator } from 'react-navigation'
const { height, width } = Dimensions.get("window");

class Settings extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      userLoggedIn: false
    }
  }

  componentDidMount = async () => {
    let userLoggedInToken = await await AsyncStorage.getItem('userLoggedIn');

    if (userLoggedInToken === 'true') {
      this.setState({
        userLoggedIn: true,
      })
      return userLoggedInToken

    } else {
      this.setState({
        userLoggedIn: false,
      })
      return userLoggedInToken
    }
  }

  SignOut = () => {
    // await AsyncStorage.removeItem("userLoggedIn");
    AsyncStorage.removeItem("userLoggedIn");
    AsyncStorage.removeItem('userUID')
    AsyncStorage.removeItem("newUser");
    AsyncStorage.removeItem("setLocation");
    AsyncStorage.removeItem("setProfile");
    AsyncStorage.removeItem("DatabaseKey");
    this.props.navigation.navigate("AuthLoading");
  };


  render() {
    const { isLoading, userLoggedIn } = this.state;
    if (isLoading) {
      return (
        <View style={styles.container}>
      
          <View style={styles.contentDiv}>
            <Spinner color='green' />
          </View>
        </View>
      )
    }

    return (
      <View style={styles.container}>

        {/* NON USER ///////////////////////// */}

        <ScrollView>
          <List>

            <ListItem onPress={() => this.props.navigation.navigate('DelCircles')}>
              <Left>
                <Text>Leave circle</Text>
              </Left>
              <Right>
                <Icon type='MaterialCommunityIcons' name="arrow-right" />
              </Right>
            </ListItem>

            <ListItem onPress={() => this.props.navigation.navigate('Profile', {goBack : true})}>
              <Left>
                <Text>Edit profile</Text>
              </Left>
              <Right><Icon type='MaterialCommunityIcons' name="arrow-right" />
              </Right>
            </ListItem>


            <ListItem onPress={() => this.props.navigation.navigate('Notifications')}>
              <Left>
                <Text>Notifications</Text>
              </Left>
              <Right><Icon type='MaterialCommunityIcons' name="arrow-right" />
              </Right>
            </ListItem>


            {!userLoggedIn && <ListItem onPress={() => this.props.navigation.navigate("AuthLoading")}>
              <Left>
                <Text>Login</Text>
              </Left>
              <Right><Icon type='MaterialCommunityIcons' name="arrow-right" />
              </Right>
            </ListItem>}

            {!userLoggedIn && <ListItem onPress={() => this.props.navigation.navigate("AuthLoading")}>
              <Left>
                <Text>Create Account</Text>
              </Left>
              <Right><Icon type='MaterialCommunityIcons' name="arrow-right" />
              </Right>
            </ListItem>}
          </List>

          {userLoggedIn && <View style={styles.socialContainer}>
            <Button
              title="Sign out"
              onPress={() => this.SignOut()}
              icon={<Icon type='MaterialCommunityIcons' name="logout" style={{ color: 'white', fontSize: 18, paddingRight: 5 }} />}
              titleStyle={{
                color: 'white'
              }}
              buttonStyle={{
                backgroundColor: 'red',
                width: width * 0.4,
                padding: 5,
                borderRadius: 10,
                elevation: 0
              }}
            />
            <Button
              title="Delete Account"
              onPress={() => alert('Not Yet Complete')}
              icon={<Icon type='FontAwesome' name='trash-o' style={{ color: 'white', fontSize: 18, paddingRight: 5  }} />}
              titleStyle={{
                color: 'white'
              }}
              buttonStyle={{
                backgroundColor: 'red',
                width: width * 0.4,
                padding: 5,
                borderRadius: 10,
                elevation: 0
              }}
            />
          </View>}

        </ScrollView>
      </View>
    )
  }
}
export default Settings;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentDiv: {
    padding: 20,
    flexDirection: "column",
    alignItems: "center"
  },
  socialContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: 'space-evenly',
  },
});
