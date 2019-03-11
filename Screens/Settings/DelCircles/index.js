import React, { Component, Fragment } from "react";
import { View, StyleSheet, AsyncStorage, FlatList } from "react-native";

import { ListItem, Text, Left, Body, Right, Icon, Spinner } from "native-base";

import firebase from "../../../config";
const database = firebase.database().ref();

class DelCircles extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      noData: true,
      joinedCircles: []
    };

    this.fetchMyCircle();
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.stopLoading();
    }, 5000);
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
      .on("child_added", payload => {
        let circleData = {
          circleKey: payload.val().circleKey,
          circleName: payload.val().circleName,
          databaseKey: payload.key
        };
        this.setState({
          joinedCircles: [...this.state.joinedCircles, circleData],
          isLoading: false,
          noData: false
        });
      });
  };

  delete = async (arrayKey, circleKey, databaseKey) => {
    let myUid = await AsyncStorage.getItem("userUID");

    database
      .child("Users")
      .child(myUid)
      .child("joinedCircles")
      .child(databaseKey)
      .remove()
      .then(res => {
        database
          .child("Location")
          .child(circleKey)
          .child("data")
          .orderByChild("uid")
          .equalTo(myUid)
          .on("child_added", res => {
            if (res.val().uid === myUid) {
              res.ref.remove();
            } else {
              alert("no id found");
            }
          });
      })
      .then(res => {
        let array = this.state.joinedCircles;
        array.splice(arrayKey, 1);
        this.setState({
          joinedCircles: array
        });
      });
  };

  onRefresh = () => {
    this.setState({ isLoading: true, joinedCircles: [] }, () => {
      this.fetchMyCircle();
    });
  };

  render() {
    const { isLoading, joinedCircles, noData } = this.state;
    if (isLoading === true) {
      return (
        <View style={styles.container}>
          <View style={styles.contentDiv}>
            <Spinner color="green" />
          </View>
        </View>
      );
    }
    if (noData === true) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>No Data Found...</Text>
        </View>
      );
    } else {
      return (
        <Fragment>
          <FlatList
            data={joinedCircles}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isLoading}
            renderItem={({ item, index }) => {
              return (
                <ListItem icon key={index}>
                  <Body>
                    <Text>{item.circleName}</Text>
                  </Body>

                  <Right>
                    <Icon
                      onPress={() => {
                        this.delete(index, item.circleKey, item.databaseKey);
                      }}
                      type="Entypo"
                      name="squared-cross"
                      style={{ fontSize: 22, color: "red" }}
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

export default DelCircles;

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
