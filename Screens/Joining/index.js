import React, { Component } from "react";
import { Text, View, Dimensions, AsyncStorage } from "react-native";

import { Icon } from "native-base";
import { Input, Button } from "react-native-elements";
import random from "random-hex";

import firebase from "../../config";
const database = firebase.database().ref();

const { width, height } = Dimensions.get("window");

class Joining extends Component {
  constructor() {
    super();
    this.state = {
      membersList: []
    };
  }

  onChange = circleKey => {
    this.setState({
      circleKey
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

  _JoinCircle = async () => {
    const { circleKey, coordinates, title, photoURL, firebaseUid } = this.state;
    let myUid = await AsyncStorage.getItem("userUID");
    database
      .child("Circles")
      .child(circleKey)
      .once("value", async payload => {
        let circle = payload.val();
        let membersList = await payload.val().members;
        membersList.push(myUid);

        database.child("Circles").child(circleKey).update({
            members: membersList
          })
          .then(res => {
            database.child("Users").child(myUid).child("joinedCircles").push({
                circleKey: circleKey,
                circleName: circle.circleName
              })
              .then(result => {
                database.child("Location").child(circleKey).child("data").once("value", res => {
                    let locationData = res.val();
                    let myData = {
                      color: "blue",
                      coordinates: coordinates,
                      photoURL: photoURL,
                      title: title,
                      uid: myUid
                    }
                    locationData.push(myData);
                    console.log(myData)
                    database.child("Location").child(circleKey).update({
                        data: locationData
                      })
                      .then(res => this.props.navigation.navigate("App"));
                  });
              })
          });
      });
  };

  render() {
    return (
      <View style={{ padding: 15 }}>
        <View
          style={{
            alignItems: "center",
            padding: 5,
            marginVertical: height * 0.1
          }}
        >
          <Text style={{ fontSize: 24 }}>Join a circle to stay connected</Text>
        </View>

        <View style={{ alignSelf: "center", marginVertical: height * 0.1 }}>
          <Input
            label="Enter your circle's secret key:"
            inputContainerStyle={{
              width: width * 0.55
            }}
            onChangeText={circleKey => {
              this.onChange(circleKey);
            }}
            placeholder="XX-XX-XX"
            leftIcon={
              <Icon
                type="FontAwesome"
                name="hashtag"
                style={{ fontSize: 20, marginRight: 15 }}
              />
            }
          />
        </View>

        <View style={{ marginVertical: height * 0.1 }}>
          <Button
            onPress={() => this._JoinCircle()}
            title="Join"
            buttonStyle={{
              padding: 15,
              width: width * 0.4,
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

export default Joining;

// database
// .child("Location")
// .child(circleKey)
// .set({
//   data
// })
// .then(res => {
//   database
//     .child("Users")
//     .child(firebaseUid)
//     .child("joinedCircles")
//     .push({
//       circleKey: circleKey,
//       circleName: circleName
//     })
//     .then(response => {
//       database
//         .child("Circles")
//         .child(circleKey)
//         .set({
//           Admin: firebaseUid,
//           circleKey: circleKey,
//           circleName: circleName,
//           members: [firebaseUid]
//         });
//     });
//   this.props.navigation.navigate("Send");
// });
// }
