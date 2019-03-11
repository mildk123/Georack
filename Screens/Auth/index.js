import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  AsyncStorage
} from "react-native";
import { createStackNavigator } from "react-navigation";
import { Font } from "expo";

import { Button } from "react-native-elements";
import { Icon } from "native-base";

import Login from "./login";
import Signup from "./Signup";

import { Facebook, Google } from "expo";
import { Permissions, Notifications } from "expo";

import { AppAuth } from "expo-app-auth";

import firebase from "../../config";
const database = firebase.database().ref();

const { width } = Dimensions.get("window");

class Authentication extends Component {
  constructor() {
    super();
    this.state = {};

    this._Register = this._Register.bind(this);
  }

  _Register = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status !== "granted") {
      alert("Please allow permissions");
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync();

    if (token) {
      this.saveToken(token);
    } else {
      alert("Cannot receive token from device !");
    }
  };

  saveToken = token => {
    this.setState({
      token: token
    });
  };

  componentWillMount = () => {
    this._Register();
  };

  static navigationOptions = {
    header: null
  };

  loginFB = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      "326653724645783",
      { permissions: ["email", "public_profile"] }
    );

    if (type === "success" && token) {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then(response => {
          let newUser = response.additionalUserInfo.isNewUser;
          AsyncStorage.setItem("userLoggedIn", "true");
          AsyncStorage.setItem("userToken", response.credential.accessToken);
          AsyncStorage.setItem("userUID", response.user.uid);
          if (newUser) {
            AsyncStorage.setItem("newUser", "yes");
            this._pushToDB();
          } else {
            this.props.navigation.navigate("AuthLoading");
          }
        })
        .catch(err => alert(err));
    }
  };

  _pushToDB = async () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let username = user.providerData[0].displayName;
        let email = user.providerData[0].email;
        let photoURL = user.providerData[0].photoURL;
        let providerId = user.providerData[0].providerId;
        let firebaseUid = user.uid;
        let token = this.state.token;

        database
          .child("Users/")
          .child(firebaseUid)
          .set(
            {
              username,
              email,
              photoURL,
              providerId,
              firebaseUid,
              token
            },
            () => this.props.navigation.navigate("AuthLoading")
          );
      }
    });
  };

  loginGoogle = async () => {
    alert("Under Construction!!");
    // try {
    // const logInResult = await AppAuth.authAsync({
    //   issuer: 'https://accounts.google.com',
    //   scopes: ['profile', 'email', 'openid'],
    //   clientId: '302303590241-cjo1t2qtsbgbkugab1ddk75nrvis5uk9.apps.googleusercontent.com',
    // });

    //   if (result.type === "success") {
    //     return result.accessToken;
    //   } else {

    //     return { cancelled: true };
    //   }
    // } catch (e) {
    //   return { error: true };
    // }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignSelf: "stretch", marginVertical: 17 }}>
          <Text
            style={{
              fontSize: 40,
              paddingLeft: 10,
              color: "white",
              fontFamily: "Singlet"
            }}
          >
            Welcome To Georack
          </Text>
        </View>

        <View
          style={{
            justifyContent: "space-evenly",
            alignSelf: "stretch",
            paddingHorizontal: 20
          }}
        >
          <Button
            title="Login"
            onPress={() => this.props.navigation.navigate("Login")}
            titleStyle={{ color: "black", fontSize: 24, fontFamily: "SansPro" }}
            iconRight
            icon={
              <Icon
                type="AntDesign"
                name="login"
                style={{ fontSize: 25, paddingLeft: 5, marginTop: 5 }}
              />
            }
            buttonStyle={{
              padding: 8,
              borderRadius: 50,
              marginVertical: 7,
              backgroundColor: "white"
            }}
          />

          <Button
            title="Sign Up"
            onPress={() =>
              this.props.navigation.navigate("Signup", {
                deviceToken: this.state.token
              })
            }
            titleStyle={{ color: "black", fontSize: 24, fontFamily: "SansPro" }}
            iconRight
            icon={
              <Icon
                type="MaterialIcons"
                name="person-add"
                style={{ fontSize: 25, paddingLeft: 5, marginTop: 5 }}
              />
            }
            buttonStyle={{
              padding: 8,
              borderRadius: 25,
              marginVertical: 7,
              backgroundColor: "white"
            }}
          />
        </View>

        <View style={styles.socialContainer}>
          <Button
            title="Google"
            onPress={() => this.loginGoogle()}
            icon={
              <Icon
                name="google"
                type="AntDesign"
                style={{ fontSize: 23, color: "red", paddingRight: 5 }}
              />
            }
            titleStyle={{
              color: "red",
              fontFamily: "Singlet"
            }}
            buttonStyle={{
              backgroundColor: "white",
              width: width * 0.3,
              padding: 7,
              elevation: 0
            }}
          />

          <Button
            title="Facebook"
            onPress={() => this.loginFB()}
            icon={
              <Icon
                name="facebook-square"
                type="AntDesign"
                style={{ fontSize: 23, color: "#3B5998", paddingRight: 5 }}
              />
            }
            titleStyle={{
              color: "#3B5998",
              fontFamily: "Singlet"
            }}
            buttonStyle={{
              backgroundColor: "white",
              width: width * 0.35,
              marginLeft: 5,
              padding: 7,
              elevation: 0
            }}
          />
        </View>
      </View>
    );
  }
}

export default (AuthStackNavigator = createStackNavigator({
  Auth: Authentication,
  Login: Login,
  Signup: Signup
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00c18e",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 25
  }
});

{
  /* <View style={styles.container}>


<View style={styles.imgContainer}>
  <Image
    style={styles.picSize}
    source={require("../../assets/icon.png")}
  />
</View>

<View style={styles.socialContainer}>
  <Button
    title="Google"
    onPress={() => this.loginGoogle()}
    icon={
      <Icon
        name="google"
        type="AntDesign"
        style={{ fontSize: 23, color: "red", paddingRight: 5 }}
      />
    }
    titleStyle={{
      color: "red"
    }}
    buttonStyle={{
      backgroundColor: "white",
      borderColor: "red",
      borderWidth: 1,
      width: width * 0.3,
      padding: 7,
      borderRadius: 20,
      elevation: 0
    }}
  />

  <Button
    title="Facebook"
    onPress={() => this.loginFB()}
    icon={
      <Icon
        name="facebook-square"
        type="AntDesign"
        style={{ fontSize: 23, color: "#3B5998", paddingRight: 5 }}
      />
    }
    titleStyle={{
      color: "#3B5998"
    }}
    buttonStyle={{
      backgroundColor: "white",
      borderColor: "#3B5998",
      borderWidth: 1,
      width: width * 0.35,
      padding: 7,
      borderRadius: 20,
      elevation: 0
    }}
  />
</View>

<View style={styles.btnContainer}>
  <Button
    onPress={() => this.props.navigation.navigate("Login")}
    title="Login"
    iconRight
    icon={
      <Icon
        type="MaterialCommunityIcons"
        name="login"
        style={{ fontSize: 20, color: "white", paddingLeft: 5 }}
      />
    }
    buttonStyle={{
      backgroundColor: "#23ddae",
      width: width * 0.5,
      borderRadius: 0,
      padding: 8
    }}
  />
  <Button
    onPress={() =>
      this.props.navigation.navigate("Signup", {
        deviceToken: this.state.token
      })
    }
    title="Signup"
    iconRight
    icon={
      <Icon
        name="adduser"
        type="AntDesign"
        style={{ fontSize: 20, color: "white", paddingLeft: 5 }}
      />
    }
    buttonStyle={{
      backgroundColor: "#23ddae",
      width: width * 0.5,
      borderRadius: 0,
      padding: 8
    }}
  />
</View>
</View> */
}
