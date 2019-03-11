import React, { Component, Fragment } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  AsyncStorage,
  FlatList
} from "react-native";

import { Spinner } from "native-base";
import NoTasks from "../../assets/MyTasks/noTask.png";

import { List, ListItem, Text, Icon, Left, Body, Right } from "native-base";

import { Button } from "react-native-elements";
import firebase from "../../config";

const database = firebase.database().ref();
const { height, width } = Dimensions.get("window");

class MyCircles extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      noData: true,
      userLoggedIn: false,
      data: []
    };
  }

  componentDidMount = async () => {
    let myUid = await AsyncStorage.getItem("userUID");
    if (myUid) {
      setTimeout(() => {
        this.stopLoading();
      }, 5000);
      this.setState({
        userLoggedIn: true
      });
      this.fetchMyCircle();
    }
  };

  stopLoading = () => {
    if (this.state.isLoading === true) {
      this.setState({
        isLoading: false,
        noData: true
      });
    }
  };

  fetchMyCircle = async () => {
    let myUid = await AsyncStorage.getItem("userUID");
    database
      .child("Users")
      .child(myUid)
      .child("joinedCircles")
      .on("child_added", circles => {
        this.setState({
          isLoading: false,
          noData: false,
          data: [...this.state.data, circles.val()]
        });
      });
  };

  selectCircle = index => {
    // let myData = this.fetchMyData(index)
    let circleKey = this.state.data[index].circleKey;
    this.props.navigation.navigate("Map", {
      CircleKey: circleKey
    });
  };

  onRefresh = () => {
    this.setState({ isLoading: true, data: [] }, () => {
      this.fetchMyCircle();
    });
  };

  render() {
    const { isLoading, noData, userLoggedIn, data } = this.state;
    if (isLoading === true) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    }
    if (userLoggedIn === false) {
      return (
        <View style={styles.container}>
          <View
            style={{
              padding: 20,
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#ffffff"
            }}
          >
            <Text>You need to login first</Text>
          </View>
        </View>
      );
    }
    if (noData === true) {
      return (
        <View style={styles.container}>
          <View style={styles.contentDiv}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 30
              }}
            >
              <Image
                style={{ width: width, height: height * 0.5 }}
                source={NoTasks}
                alt="No Chats"
              />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <Fragment>
          <FlatList
            data={data}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isLoading}
            renderItem={({ item, index }) => {
              return (
                <ListItem
                  icon
                  key={index}
                  onPress={() => {
                    this.selectCircle(index);
                  }}
                >
                  <Left>
                    <Image
                      source={require("../../assets/MyTasks/list.png")}
                      style={{ width: 25, height: 25 }}
                    />
                  </Left>

                  <Body>
                    <Text>{item.circleName}</Text>
                  </Body>

                  <Right>
                    <Button
                      onPress={() => {
                        this.selectCircle(index);
                      }}
                      title="View"
                      buttonStyle={{ backgroundColor: "white" }}
                      titleStyle={{ color: "#23ddae" }}
                    />
                  </Right>
                </ListItem>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </Fragment>
      );
    }
  }
}

export default MyCircles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECF0F3"
  },
  contentDiv: {
    padding: 20,
    flexDirection: "column",
    alignItems: "center"
  }
});
