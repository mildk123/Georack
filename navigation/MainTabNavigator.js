import React from "react";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { Image, TouchableHighlight } from "react-native";

import { Icon } from "native-base";

import MyCircles from "../Screens/MyCircles";
import Create from "../Screens/MyCircles/Create";
import Send from "../Screens/MyCircles/Send";
import Mail from "../Screens/MyCircles/Mail";
import Map from "../Screens/MyCircles/Map";

import Settings from "../Screens/Settings";
import DelCircles from "../Screens/Settings/DelCircles";
import Notifications from "../Screens/Settings/Notifications";
import SetProfile from "../Screens/Settings/Profile";
import SetLocation from "../Screens/Settings/Location";
import Alarm from "../Screens/MyCircles/Alarm";

const MyCirclesStackNav = createStackNavigator({
  MyCircles: {
    screen: MyCircles,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "My Circles",
        headerLeft: (
          <Icon
            type="Entypo"
            style={{ paddingLeft: 10 }}
            onPress={() => navigation.openDrawer()}
            name="menu"
            size={30}
          />
        ),
        headerRight: (
          <TouchableHighlight onPress={() => navigation.navigate("Create")}>
            <Image
              onPress={() => navigation.openDrawer()}
              style={{ marginRight: 15 }}
              source={require("../assets/icon/create.png")}
              alt="create"
            />
          </TouchableHighlight>
        )
      };
    }
  },
  Create: {
    screen: Create,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Create Circle"
      };
    }
  },
  Send: {
    screen: Send,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Send Invites"
      };
    }
  },
  Mail: {
    screen: Mail,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Send Invites"
      };
    }
  },
  Map: {
    screen: Map,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Map"
      };
    }
  },
  Alarm: {
    screen: Alarm,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Emergency"
      };
    }
  }
});

MyCirclesStackNav.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {
    tabBarLabel: "Home",
    tabBarIcon: ({ tintColor }) => (
      <Icon
        type="MaterialCommunityIcons"
        name="google-circles"
        style={{ color: tintColor, fontSize: 25 }}
      />
    )
  }

  if (routeName === "Map") {
    navigationOptions.tabBarVisible = false;
  } else if (routeName === "Alarm") {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

const SettingsStackNav = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Setting",
        headerLeft: (
          <Icon
            type="Entypo"
            style={{ paddingLeft: 10 }}
            onPress={() => navigation.openDrawer()}
            name="menu"
            size={30}
          />
        )
      };
    }
  },
  SetProfile,
  SetLocation,
  DelCircles: {
    screen: DelCircles,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Leave Circles"
      };
    }
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Notifications"
      };
    }
  }
});

SettingsStackNav.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {
    tabBarLabel: "Settings",
    tabBarIcon: ({ tintColor }) => (
      <Icon
        type="Feather"
        name="settings"
        style={{ color: tintColor, fontSize: 25 }}
      />
    )
  };

  if (routeName === "DelCircles") {
    navigationOptions.tabBarVisible = false;
  } else if (routeName === "SetProfile") {
    navigationOptions.tabBarVisible = false;
  }

  return navigationOptions;
};

export default createBottomTabNavigator(
  {
    MyCirclesStackNav,
    SettingsStackNav
  },
  {
    navigationOptions: ({ navigation }) => {
      return {
        header: null
      };
    },
    tabBarOptions: {
      showLabel: true,
      activeTintColor: "#23ddae",
      inactiveTintColor: "#a3a3a3",
      style: {
        backgroundColor: "#ffffff", // TabBar background
        padding: 2
      }
    },
    lazy: true
  }
);
