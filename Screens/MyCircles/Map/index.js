import React, { Component, Fragment } from "react";
import {
  Platform,
  Text,
  View,
  Dimensions,
  StyleSheet,
  AsyncStorage,
  Image
} from "react-native";
import { Constants, Location, Permissions } from "expo";

import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

import firebase from "../../../config";
import { Button } from "react-native-elements";
import { Icon } from "native-base";
import BottomSheet from "../../../components/BottomSheet";
const database = firebase.database().ref();

const { width, height } = Dimensions.get("window");

class Map extends Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      isloading: true,
      region: {
        latitude: 24.882868,
        longitude: 67.069167,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0421
      }
    };
  }

  getData = async CircleKey => {
    let circleKey = CircleKey;
    let myUid = await AsyncStorage.getItem("userUID");
    database
      .child("Location")
      .child(circleKey)
      .child("data")
      .on("child_added", locations => {
        if (locations.val().uid !== myUid) {
          this.setState({
            locations: [...this.state.locations, locations.val()],
            isloading: false
          });
        } else {
          this.setState(
            {
              isloading: false
            },
            () => this._getLocationAsync(circleKey, locations.key)
          );
        }
      });
  };

  refresh = (circleKey) => {
    this.setState({
      locations: []
    }, () => {
      this.getData(circleKey)
    })
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillMount = () => {
    let data = this.props.navigation.state.params;

    this.interval = setInterval(() => {
      this.refresh(data.CircleKey);
    }, 5000);

  };

  componentWillReceiveProps(nextProps) {
    let props = nextProps.navigation.state.params;

    if (props.Locations !== this.state.locations) {
      this.setState(
        {
          CircleKey: props.CircleKey
        },
        () => {
          this.getData(data.CircleKey);
        }
      );
    }
  }

  _getLocationAsync = async (CircleKey, myDatabaseKey) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    let locationState = (await Location.getProviderStatusAsync())
      .locationServicesEnabled;

    if (locationState !== true) {
      alert("Turn on your location services.");
    }

    if (status !== "granted") {
      alert("Cannot get location");
    } else {
      await Location.watchPositionAsync(
        {
          enableHighAccuracy: true,
          distanceInterval: 1
        },
        location => {
          database
            .child("Location")
            .child(CircleKey)
            .child("data")
            .child(myDatabaseKey)
            .update({
              coordinates: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
              }
            });

          this.setState(
            {
              isloading: false,
              region: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0421
              },
              MyMarker: {
                coordinates: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude
                },
                title: "Me",
                key: "55"
              }
            }
          );
        }
      );
    }
  };

  render() {
    const { isloading, region, MyMarker, locations } = this.state;
    if (isloading) {
      return (
        <View>
          <Text>Loading....</Text>
        </View>
      );
    }

    return (
      <Fragment>
        <MapView
          showsUserLocation
          rotateEnabled={false}
          loadingEnabled={true}
          mapType="standard"
          style={styles.Map}
          region={region}
        >
          {locations !== undefined &&
            locations.map(marker => (
              <Marker
                tracksViewChanges={false}
                key={marker.title}
                coordinate={marker.coordinates}
                pinColor={marker.pinColor}
                title={marker.title}
                description={marker.description}
                // image={marker.photoURL}
              />
            ))}

          {MyMarker && (
            
            <Marker
              tracksViewChanges={false}
              key={Math.floor(Math.random() * 10)}
              coordinate={{
                latitude: 24.9185264,
                longitude: 67.1024753
              }}
              // image={MyMarker.photoURL}
              pinColor={MyMarker.pinColor}
              title={MyMarker.title}
            />
          )}
        </MapView>

        <View
          style={{
            position: "absolute",
            bottom: height * 0.15,
            left: width * 0.09
          }}
        >
          <Button
            title=""
            containerStyle={{ alignSelf: "flex-end" }}
            buttonStyle={{ backgroundColor: "#23ddae" }}
            onPress={() =>
              this.props.navigation.navigate("Alarm", { usersData: locations })
            }
            icon={
              <Icon
                type="MaterialCommunityIcons"
                name="account-alert"
                style={{ color: "white", fontSize: 30 }}
              />
            }
          />
          <Button
            title=""
            buttonStyle={{ backgroundColor: "#23ddae", marginTop: 15 }}
            icon={
              <Icon
                type="SimpleLineIcons"
                name="reload"
                style={{ color: "white", fontSize: 30 }}
              />
            }
          />
        </View>
            <BottomSheet data={this.props.navigation.state.params} />
      </Fragment>
    );
  }
}

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  Map: {
    width: width,
    height: height * 0.9,
    zIndex: -1
  }
});
