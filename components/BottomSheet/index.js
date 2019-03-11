import React from "react";
import { View, Image, Dimensions, AsyncStorage } from "react-native";
import BottomDrawer from "rn-bottom-drawer";


import {
    Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Subtitle
} from "native-base";
import MembersList from "../../helper/membersList";

import firebase from "../../config";
const database = firebase.database().ref();
const { width, height } = Dimensions.get("window");

export default class BottomSheet extends React.Component {
  constructor() {
    super();
    this.state = {
      adminData: {
        photoURL: "wdasd",
        username: "John Doe",
        phone: 213
      }
    };
  }

  componentDidMount = async () => {
    let CircleKey = this.props.data.CircleKey;
    let userUid = await AsyncStorage.getItem("userUID");
    database
      .child("Circles")
      .child(CircleKey)
      .on("value", payload => {
        let adminID = payload.val().Admin;
        database
          .child("Users")
          .child(adminID)
          .on("value", response => {
            this.setState({ adminData: response.val() });
          });
      });
  };

  renderContent = () => {
    const { photoURL, username, phone } = this.state.adminData;
    return (
      <Container>
        <Header hasSubtitle hasSegment>
          <Left>
            <Button transparent>
              <Image
                source={{ uri: photoURL }}
                style={{ width: 35, height: 35 }}
              />
            </Button>
          </Left>
          <Body>
            <Title>{username}</Title>
            <Subtitle>
              <Icon
                type="FontAwesome"
                name="phone"
                style={{ fontSize: 15, color: "white", paddingRight: 5 }}
              />
              <Icon
                type="Octicons"
                name="dash"
                style={{ fontSize: 15, color: "white", paddingRight: 5 }}
              />
              {phone}
            </Subtitle>
          </Body>
          <Right>
            <Button transparent>
              <Icon type="MaterialCommunityIcons" name="face-profile" />
            </Button>
          </Right>
        </Header>

        <MembersList CircleKey={this.props.data.CircleKey} />
      </Container>
    );
  };

  render() {
    return (
      <BottomDrawer
        backgroundColor="#ffffff"
        containerHeight={height * 0.63}
        startUp={false}
        shadow={true}
      >
        {this.renderContent()}
      </BottomDrawer>
    );
  }
}
