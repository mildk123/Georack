import React, { Component } from "react";
import { MailComposer } from "expo";
import { Text, View, Dimensions } from "react-native";

import { Icon } from "native-base";
import { Input, Button } from "react-native-elements";

import firebase from "../../../config";
const database = firebase.database().ref();

const { width, height } = Dimensions.get("window");

class Mail extends Component {
  constructor () {
    super()
    this.state = {
      email : '',
      userExists : false
    }
  }
  componentDidMount = () => {
    let code = this.props.navigation.state.params.code;
  
    this.setState({
      code
    });
  };

  stopLoading = () => {
    if (this.state.userExists !== true) {
      alert('User does not exists.')
      this._SendEmail('Not token')
    }
  };


  checkUserOnFirebase = () => {
    const { email } = this.state;
    if (email) {
      setTimeout(() => {
        this.stopLoading();
      }, 5000);
      database.child("Users").orderByChild('email').equalTo(email).once('child_added', pay => {
        if (pay.exists()){
          this.setState({userExists : true})
          this._SendEmail(pay.val().token)
        }else{
          alert('User not registered on Georack.')
        }
      })
    }else{
      alert('please enter email ')
    }
  };

  _SendEmail = async (token) => {
    const { email, code } = this.state;

    let mailTo = [email];

    if (email && code) {
      const { status } = await MailComposer.composeAsync({
        recipients: mailTo,
        body: `Hey , 
        join me on my circle. Just enter ${code} in join page.`,
        subject: "Georack - Circle Code"
      });

      fetch("https://exp.host/--/api/v2/push/send",{
        body: JSON.stringify({
          to: token,
          title: 'Georak',
          body: 'You are requested to join a circle in Georak',
          data: { code: `Your circle code is :- ${code}` },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      .then(res => alert('Done.'))
      .catch(err => alert('Error:', err))

      if (status === "cancelled") {
        alert("cancelled");
      }
    } else {
      alert("Please enter an email!");
    }
  };

  render() {
    return (
      <View style={{ padding: 15 }}>
        <Input
        keyboardType='email-address'
        keyboardAppearance="dark"
        returnKeyLabel="Done"
        returnKeyType="send"
          inputContainerStyle={{
            width: width * 0.75,
            marginVertical: height * 0.1
          }}
          onChangeText={email => {
            let lowerMail = email.toLowerCase()
            this.setState({
              email: lowerMail
            })
          }
        }
          placeholder="johndoe@abc.com"
          leftIcon={
            <Icon
              type="MaterialCommunityIcons"
              name="email"
              style={{ fontSize: 20, marginRight: 15 }}
            />
          }
        />

        <View>
          <Button
            onPress={() => this.checkUserOnFirebase()}
            title="Send"
            buttonStyle={{
              padding: 10,
              width: width * 0.3,
              borderRadius: 25,
              backgroundColor: "#23ddae"
            }}
            containerStyle={{ alignSelf: "center" }}
          />
        </View>
      </View>
    );
  }
}

export default Mail;
