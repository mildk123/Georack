import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  AsyncStorage
} from "react-native";

import { createDrawerNavigator, DrawerItems } from "react-navigation";
import { Button } from "react-native-elements";
import {Icon} from "native-base";

import { Image, Dimensions } from "react-native";
import MainTabNavigator from "./MainTabNavigator";

import Send from "../Screens/MyCircles/Send";
import Joining from "../Screens/Joining";

const { width, height } = Dimensions.get("window");

export default createDrawerNavigator(
  {
    App: {
      screen: MainTabNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          drawerLabel: "Home",
          drawerIcon: (
            <Image
              source={require("../assets/Drawer/app.png")}
              style={{ width: 25, height: 25 }}
            />
          )
        };
      }
    },
    Send: {
      screen: Send,
      navigationOptions: ({ navigation }) => {
        return {
          drawerLabel: "Send Invites",
          drawerIcon: (
            <Image
              source={require("../assets/Drawer/invite.png")}
              style={{ width: 30, height: 25 }}
            />
          )
        };
      }
    },
    Joining: {
      screen: Joining,
      navigationOptions: ({ navigation }) => {
        return {
          drawerLabel: "Join a circle",
          drawerIcon: (
            <Image
              source={require("../assets/Drawer/join.png")}
              style={{ width: 25, height: 25 }}
            />
          )
        };
      }
    }
  },
  {
    drawerWidth: width * 0.5,
    drawerBackgroundColor: "white",
    drawerType: "slide",

    contentComponent: props => (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            height: 100,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            source={require('../assets/icon.png')}
            alt="Header"
            style={{ height: 70, width: 70, padding: 25 }}
          />
        </View>

        <ScrollView>
          <DrawerItems {...props} />
        </ScrollView>
      </SafeAreaView>
    ),
    contentOptions: {
      activeTintColor: "white",
      activeBackgroundColor: "#22ddae",
      itemsContainerStyle : {

      },
      activeLabelStyle :{
        color: 'white'
      },
      labelStyle : {
        marginLeft: -2,
        fontSize : 18,
        color: 'gray'
      }
    }
  }
);
