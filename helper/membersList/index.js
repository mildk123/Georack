import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import {
  Content,
  List,
  Text,
  ListItem,
  Thumbnail,
  Left,
  Body,
  Right,
  Button,
  Icon
} from "native-base";

import firebase from "../../config";
const database = firebase.database().ref();

class MembersList extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount = async () => {
    let CircleKey = this.props.CircleKey;
    let userUid = await AsyncStorage.getItem("userUID");
    database
      .child("Location")
      .child(CircleKey)
      .child("data")
      .on("value", payload => {
        this.setState({
          members: payload.val()
        });
      });
  };

  render() {
    const { members } = this.state;
    return (
      <Content>
        <List>
          {members &&
            members.map((item, index) => {
              return <ListItem key={index} avatar noBorder>
                <Left>
                  <Thumbnail
                    source={{uri: item.photoURL}}
                    style={{ width: 35, height: 35 }}
                  />
                </Left>
                <Body>
                  <Text>{item.title}</Text>
                </Body>
                <Right>
                  <Button transparent>
                    <Icon type="MaterialIcons" name="person-pin" />
                  </Button>
                </Right>
              </ListItem>
            })}
        </List>
      </Content>
    );
  }
}

export default MembersList;
