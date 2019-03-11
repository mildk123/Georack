import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage, ScrollView } from "react-native";


import {Icon} from 'native-base';
import { Input, Button } from "react-native-elements";


import firebase from '../../../config';

class SignIn extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: ''
    }
  }
  static navigationOptions = {
    title: "Login",
    headerStyle: {
      backgroundColor: "#23ddae"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  _onPress = () => {
    const { email, password } = this.state;
    if (!email || !password) {
      alert('Please Enter Email/Password')
    } else {
      this.setState({
        isLoading: true
      })
      if ((email && password) !== null) {
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(res => {
            let uid = res.user.uid
            AsyncStorage.setItem("userLoggedIn", 'true');
            AsyncStorage.setItem('userToken', res.user.refreshToken)
            AsyncStorage.setItem('userUID', uid)
            AsyncStorage.removeItem('newUser')

            this.props.navigation.navigate('AuthLoading')
          })
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode, errorMessage)

            // ...
          });
      } else {
        alert(`please enter correct information`);
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.inputDiv}>
            <Input
              label="Email"
              keyboardType="email-address"
              labelStyle={{
                fontSize: 18,
                color: "#23ddae",
                marginTop: 10
              }}
              onChangeText={email => {
                this.setState({ email: email });
              }}
              placeholder="abc@domain.com"
              leftIcon={<Icon type='FontAwesome' name="envelope-o" style={{color: "black", fontSize: 22, paddingRight: 5 }} />}
            />

            <Input
              label="Password"
              secureTextEntry
              labelStyle={{
                fontSize: 18,
                color: "#23ddae",
                marginTop: 10
              }}
              onChangeText={password => {
                this.setState({ password: password });
              }}
              placeholder="********"
              leftIcon={<Icon type='FontAwesome' name="lock" style={{color: "black", fontSize: 22, paddingRight: 5 }} />}
            />

          </View>

          <View style={styles.btnDiv}>
            <Button
              title="Done"
              iconRight
              onPress={() => this._onPress()}
              icon={<Icon type='FontAwesome' name="chevron-right" style={{color: "white", fontSize: 18, paddingLeft: 5 }} />}
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

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  inputDiv: {
    marginTop: 18,
    flexDirection: "column",
    alignItems: "center"
  },
  btnDiv: {
    alignItems: "flex-end",
    margin: 25
  }
});
