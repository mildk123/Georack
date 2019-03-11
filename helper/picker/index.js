import React, { Component } from "react";
import { Text, View, Dimensions, AsyncStorage } from "react-native";

import { Picker } from "native-base";

import firebase from "../../config";
const database = firebase.database().ref();
const { width, height } = Dimensions.get("window");

export default class PickerExample extends Component {
  constructor() {
    super();
    this.state = {
      selected: "select",
      circles: []
    };

    this.getCircles();
  }

  onValueChange(value) {
    this.setState({
      selected : value
    })
    this.props.onChangePicker(value);
  }

  getCircles = async () => {
    let myUid = await AsyncStorage.getItem("userUID");
    database
      .child("Users")
      .child(myUid)
      .child("joinedCircles")
      .on("child_added", circles => {
        this.setState(
          {
            circles: [...this.state.circles, circles.val()]
          }
        );
      });
  };

  render() {
    const { circles } = this.state;
    return (
      <Picker
        note
        mode="dropdown"
        style={{ width: width * 0.8 }}
        selectedValue={this.state.selected}
        onValueChange={this.onValueChange.bind(this)}
      >
        <Picker.Item label="Select Circle" value="select" />
        {circles &&
          circles.map((item, index) => {
            return <Picker.Item key={index} label={item.circleName} value={item.circleKey} />
          })}
      </Picker>
    );
  }
}
