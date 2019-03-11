import React, { Component } from "react";
import { Text, View, Dimensions } from "react-native";
import { Button } from "react-native-elements";

import firebase from "../../../config";
const database = firebase.database().ref();

const { width, height } = Dimensions.get("window");

class Alarm extends Component {
  constructor() {
    super();
    this.state = {
      usersID: []
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    let props = nextProps.navigation.state.params.usersData;
    if (props !== state.users) {
      return {
        users: props
      };
    }
    return null;
  }

  notify = () => {
    const { users } = this.state;
    let data = users;
    data.map(item => {
      this.getDataFromFB(item.uid);
      this.setState({
        usersID: [...this.state.usersID, item.uid]
      });
    });
  };

  getDataFromFB = uid => {
    database
      .child("Users")
      .child(uid)
      .on("value", pay => {
        if (pay.exists()) {
          this._SendNotification(pay.val().token);
        } else {
          alert("User not registered on Georack.");
        }
      });
  };

  _SendNotification = async token => {
    fetch("https://exp.host/--/api/v2/push/send", {
      body: JSON.stringify({
        to: token,
        title: "Georak",
        body: "A friend in your circle needs help",
        data: { code: `I need help` }
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    })
      .then(res =>{ 
        alert("The user has been notified.")
        this.props.navigation.goBack()
    
    })
      .catch(err => alert("Error:", err));
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              marginVertical: height * 0.15
            }}
          >
            Do you want to inform everyone in your circle?
          </Text>

          <View style={{ flexDirection: "row" }}>
            <Button
              title="Yes"
              onPress={() => {
                this.notify();
              }}
              containerStyle={{ margin: 10 }}
              titleStyle={{ fontSize: 20 }}
              buttonStyle={{
                padding: 15,
                width: width * 0.3,
                borderRadius: 25,
                backgroundColor: "#db5c5c"
              }}
            />

            <Button
              title="No"
              onPress={() => {
                this.props.navigation.goBack();
              }}
              containerStyle={{ margin: 10 }}
              titleStyle={{ fontSize: 20 }}
              buttonStyle={{
                padding: 15,
                width: width * 0.3,
                borderRadius: 25,
                backgroundColor: "#22ddae"
              }}
            />
          </View>
        </View>

        <View style={{ alignSelf: "center" }}>
          <Text
            style={{
              color: "gray",
              fontSize: 14,
              textAlign: "center",
              marginVertical: 15
            }}
          >
            If you are in a serious threat please contact emergency helpline
          </Text>
        </View>
      </View>
    );
  }
}

export default Alarm;
