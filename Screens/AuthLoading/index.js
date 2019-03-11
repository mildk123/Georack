import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  AsyncStorage
} from "react-native";

import firebase from '../../config'

export class AuthLoading extends Component {
  constructor() {
    super();

    this._loadApp();
  }

  _loadApp = async () => {
    const completeStart = await AsyncStorage.getItem('completeStart')
    const userLoggedIn = await AsyncStorage.getItem("userLoggedIn");
    const newUser = await AsyncStorage.getItem("newUser");

    if (completeStart) {
      if (newUser === 'yes') {
        this.props.navigation.navigate('UserSetup');
      } else if (!userLoggedIn) {
        this.props.navigation.navigate("Auth");
      } else {
        this.props.navigation.navigate("App");
      }
    } else {
      this.props.navigation.navigate('startScreen');
    }

  };


  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}

export default AuthLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24
  }
});
