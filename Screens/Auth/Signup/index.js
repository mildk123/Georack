import React, { Component } from "react";
import {
  StyleSheet,
  View,
  AsyncStorage,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";

import { Icon } from "native-base";
import { Input, Button } from "react-native-elements";

import firebase from "../../../config";
const database = firebase.database().ref();

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      token: ""
    };
  }

  static navigationOptions = {
    title: "Create Account",
    headerStyle: {
      backgroundColor: "#23ddae"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.navigation.state.params.deviceToken !== state.token) {
      return {
        token: nextProps.navigation.state.params.deviceToken
      };
    }

    return null;
  }

  _onPress = () => {
    const { fname, lname, email, password, token } = this.state;

    if (!fname || !lname || !email || !password) {
      alert(`please enter correct information`);
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          let firebaseUid = response.user.uid;
          let newUser = response.additionalUserInfo.isNewUser;
          if (token) {
            AsyncStorage.setItem("userLoggedIn", "true");
            AsyncStorage.setItem("newUser", "yes");
            AsyncStorage.setItem("userUID", response.user.uid);
            database
              .child("Users/")
              .child(firebaseUid)
              .set({
                email,
                username: `${fname} ${lname}`,
                photoURL: "Placeholder",
                providerId: "Authentication",
                firebaseUid: firebaseUid,
                token: token
              })
              .then(res => {
                this.props.navigation.navigate("AuthLoading");
              })
              .catch(err => alert("cannot create account"));
          }else{
            alert('Getting Token')
          }
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
          // ...
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.inputDiv}>
            <Input
              enablesReturnKeyAutomatically
              returnKeyType="next"
              labelStyle={{
                fontSize: 18,
                color: "#23ddae",
                marginTop: 10
              }}
              label="First Name"
              onChangeText={fname => {
                this.setState({ fname: fname });
              }}
              placeholder="Abdullah"
              leftIcon={
                <Icon
                  type="AntDesign"
                  name="user"
                  style={{ color: "black", fontSize: 22, paddingRight: 5 }}
                />
              }
            />
            <Input
              returnKeyType="next"
              labelStyle={{
                fontSize: 18,
                color: "#23ddae",
                marginTop: 10
              }}
              label="Last Name"
              onChangeText={lname => {
                this.setState({ lname: lname });
              }}
              placeholder="Khan"
              leftIcon={
                <Icon
                  type="AntDesign"
                  name="user"
                  style={{ color: "black", fontSize: 22, paddingRight: 5 }}
                />
              }
            />
            <Input
              returnKeyType="next"
              keyboardType="email-address"
              label="Email"
              labelStyle={{
                fontSize: 18,
                color: "#23ddae",
                marginTop: 10
              }}
              placeholder="abec@domain.com"
              onChangeText={email => {
                this.setState({ email: email });
              }}
              leftIcon={
                <Icon
                  type="AntDesign"
                  name="mail"
                  style={{ color: "black", fontSize: 22, paddingRight: 5 }}
                />
              }
            />

            <Input
              secureTextEntry
              returnKeyType='done'
              labelStyle={{
                fontSize: 18,
                color: "#23ddae",
                marginTop: 10
              }}
              label="Password"
              placeholder="********"
              onChangeText={password => {
                this.setState({ password: password });
              }}
              leftIcon={
                <Icon
                  type="AntDesign"
                  name="lock"
                  style={{ color: "black", fontSize: 22, paddingRight: 5 }}
                />
              }
            />
          </View>

          <View style={styles.btnDiv}>
            <Button
              title="Done"
              iconRight
              onPress={() => this._onPress()}
              icon={
                <Icon
                  type="AntDesign"
                  name="check"
                  style={{ color: "white", fontSize: 22, paddingLeft: 5 }}
                />
              }
              buttonStyle={{
                backgroundColor: "#23ddae",
                width: 150,
                height: 55,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5,
                elevation: 0
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  inputDiv: {
    marginTop: 10,
    padding: 10,
    flexDirection: "column",
    alignItems: "center"
  },
  btnDiv: {
    alignItems: "flex-end",
    margin: 25
  }
});
