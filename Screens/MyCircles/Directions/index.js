import React, { Fragment } from "react";
import { Platform, Text, View, Dimensions, StyleSheet, AsyncStorage } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

import { Spinner } from 'native-base'
import { Button } from 'react-native-elements'
import MapView from "react-native-maps";
import { Marker, Polyline } from "react-native-maps";

import MapViewDirections from 'react-native-maps-directions';

import firebase from '../../../config'
const database = firebase.database().ref();

const { width, height } = Dimensions.get("window");


export default class Directions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      Profile: null,
      buttonState: 'Hire',
      region: {
        latitude: 24.882859,
        longitude: 67.069200,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },

      Markers: [
        //   {
        //     coordinates: {
        //       latitude: 24.918266,
        //       longitude: 67.10272,
        //     },
        //     title: 'Start',
        //     description: 'my location',
        //     key: '0',
        //     color: '#ffff00'
        //   },

        //   {
        //     coordinates: {
        //       latitude: 24.918412,
        //       longitude: 67.10321,
        //     },
        //     title: 'FINISH',
        //     description: 'destination point',
        //     key: '1',
        //     color: 'lightblue'
        //   }

      ]

    }

    this.checkDevice()
  }

  checkDevice() {
    this.CheckEmployeeStatus()
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let locationState = (await Location.getProviderStatusAsync()).locationServicesEnabled

    if (locationState !== true) {
      alert('Turn on your location services.')
    }

    if (status !== 'granted') {
      alert('Cannot get location')
    } else {

      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        region: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        Markers: [
          {
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            title: 'Start',
            description: 'my location',
            key: '0',
            color: '#ffff00'
          },
          {
            coordinates: {
              latitude: this.props.navigation.state.params.Profile.Location.coordinates.latitude,
              longitude: this.props.navigation.state.params.Profile.Location.coordinates.longitude,
            },
            title: 'End Point',
            description: 'my location',
            key: '1',
            color: 'red'
          }
        ]
      });
    }
  }

  CheckEmployeeStatus = async () => {
    let myUid = await AsyncStorage.getItem('userUID')
    let profile = this.props.navigation.state.params.Profile

    database.child('Notifications').child(myUid).on(('child_added'), (payload) => {
      if (payload.val().requestTo === profile.fbUid) {
        this.setState({
          buttonState: 'Pending'
        })
      } else if (payload.val().requestFrom === profile.fbUid) {
        this.setState({
          buttonState: 'Pending'
        })
      }
    })
  }

  Hire = async () => {
    let myUid = await AsyncStorage.getItem('userUID')
    let profile = this.props.navigation.state.params.Profile

    database.child('Notifications').child(profile.fbUid).push({
      requestFrom: myUid,
      requestTo: profile.fbUid,
      status: 'pending'
    },() => {
      database.child('Notifications').child(myUid).push({
        requestFrom: myUid,
        requestTo: profile.fbUid,
        status: 'pending'
      })
      
    })
    this.props.navigation.popToTop()
  }


  render() {
    const { isLoading, region, buttonState } = this.state;
    if (isLoading) {
      return (
        <View>
          <Spinner color='green' />
        </View>
      )
    }

    return (
      <Fragment>

        <MapView
          showsCompass={true}
          minZoomLevel={9}
          zoomControlEnabled={true}
          loadingEnabled={true}
          mapType='standard'
          style={styles.Map}
          region={region}
        >

          {this.state.Markers.map(marker => (
            <Marker
              key={marker.key}
              coordinate={marker.coordinates}
              pinColor={marker.color}
              title={marker.title}
              description={marker.description}
            />
          ))}



          <MapViewDirections
            origin={this.state.Markers[0]}
            destination={this.state.Markers[1]}
            apikey={"AIzaSyBKUpUdX3QqZMFgdgHgqisvxeDFeCToHc4"}
            strokeWidth={13}
            strokeColor="violet"
          />

          {/* {this.state.Markers.length !== 0 && <Polyline
          coordinates={[
            { latitude: this.state.Markers[0].coordinates.latitude, longitude: this.state.Markers[0].coordinates.longitude },
            { latitude:this.state.Markers[1].coordinates.latitude, longitude: this.state.Markers[1].coordinates.longitude },
          ]}
          strokeColor="#ff0000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={15}
        />} */}
        </MapView>

        <View style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0
        }}>
          <Button
            title={buttonState}
            titleStyle={{ color: 'white' }}
            containerStyle={{ backgroundColor: '#23ddae' }}
            buttonStyle={buttonState === "Pending" ? { backgroundColor: 'orange', padding: 10 } : { backgroundColor: '#23ddae', padding: 10 }}
            onPress={buttonState === 'Pending' ? () => this.props.navigation.navigate('Notifications') : () => this.Hire()}
          />
        </View>

      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  Map: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: height * 0.065,
    right: 0
  }
});