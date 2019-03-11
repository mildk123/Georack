import React, { Component } from "react";
import { Text, View, Dimensions } from "react-native";

import { Icon } from "native-base";
import { Button } from "react-native-elements";
import Picker from "../../../helper/picker";
const { width, height } = Dimensions.get("window");

class Create extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  onChangePicker = selected => {
    this.setState({
      code: selected
    });
  };

  next = () => {
    if (this.state.code === 'select'){
      alert('Please select your circle.')
    }else if(this.state.code) {
      this.props.navigation.navigate("Mail", { code: this.state.code });
    }else{
      alert('Please select your circle.')
    }
  };

  render() {
    return (
      <View style={{ padding: 15 }}>
        <View style={{ alignItems: "center", padding: 5 }}>
          <Text style={{ fontSize: 24, textAlign: "center" }}>
            Invite others to be member of your group
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Picker onChangePicker={selected => this.onChangePicker(selected)} />
        </View>

        <Text>Code: {this.state.code}</Text>

        <View>
          <Button
            onPress={() => this.next()}
            title="Send Via Email"
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
