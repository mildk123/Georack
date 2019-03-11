import React from "react";
import { View, StyleSheet, YellowBox, StatusBar } from "react-native";
import { Root } from "native-base";

import { AppLoading, Font, Icon } from "expo";
import AppNavigator from "./navigation/MainSwitchNavigator";

YellowBox.ignoreWarnings(["Setting a timer"]);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        'Singlet': require('./assets/Fonts/Sniglet-Regular.ttf'),
        "SansPro": require('./assets/Fonts/SansPro.ttf'),
      })
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  componentDidMount() {
    StatusBar.setHidden((hidden = false));
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Root>
          <AppNavigator />
        </Root>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
