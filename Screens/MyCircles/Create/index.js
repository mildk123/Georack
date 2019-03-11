import React, { Component } from "react";
import { Text, View, Dimensions, AsyncStorage } from "react-native";

import { Icon } from "native-base";
import { Input, Button } from "react-native-elements";
import random from "random-hex";

import firebase from "../../../config";
const database = firebase.database().ref();

const { width, height } = Dimensions.get("window");

class Create extends Component {
  onChange = circleName => {
    this.setState({
      circleName
    });
  };

  componentDidMount = () => {
    this.getMyData();
  };

  getMyData = async () => {
    let myUid = await AsyncStorage.getItem("userUID");
    database
      .child("Users")
      .child(myUid)
      .on("value", me => {
        this.setState({
          firebaseUid: me.val().firebaseUid,
          photoURL: me.val().photoURL,
          coordinates: {
            latitude: me.val().userLocation.coordinates.latitude,
            longitude: me.val().userLocation.coordinates.longitude
          },
          title: me.val().username
        });
      });
  };

  createCircle = async () => {
    const {
      circleName,
      coordinates,
      title,
      photoURL,
      firebaseUid
    } = this.state;
    if (circleName) {
      let circleKey = random.generate();
      circleKey = circleKey.substring(1);

      let data = [
        {
          color: "green",
          coordinates: coordinates,
          title: title,
          photoURL: photoURL,
          uid: firebaseUid
        }
      ];

      database
        .child("Location")
        .child(circleKey)
        .set({
          data
        })
        .then(res => {
          database
            .child("Users")
            .child(firebaseUid)
            .child("joinedCircles")
            .push({
              circleKey: circleKey,
              circleName: circleName
            })
            .then(response => {
              database
                .child("Circles")
                .child(circleKey)
                .set({
                  Admin: firebaseUid,
                  circleKey: circleKey,
                  circleName: circleName,
                  members: [firebaseUid]
                });
            });
          this.props.navigation.goBack();
        });
    }
  };

  render() {
    return (
      <View style={{ padding: 15 }}>
        <View style={{ alignItems: "center", padding: 5 }}>
          <Text style={{ fontSize: 24 }}>Create a circle for your group </Text>
        </View>

        <Input
          label="Enter your circle's name:"
          inputContainerStyle={{
            width: width * 0.85,
            marginVertical: height * 0.1
          }}
          onChangeText={circleName => {
            this.onChange(circleName);
          }}
          placeholder="Family..."
          leftIcon={
            <Icon
              type="MaterialCommunityIcons"
              name="google-circles-extended"
              style={{ fontSize: 20, marginRight: 15 }}
            />
          }
        />

        <View>
          <Button
            onPress={() => this.createCircle()}
            title="Create"
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

export default Create;
