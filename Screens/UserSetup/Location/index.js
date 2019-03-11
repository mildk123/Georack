import React, { Fragment } from "react";
import { Platform, Text, View, StyleSheet, Dimensions, AsyncStorage } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

import { Spinner } from 'native-base'

import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { Button } from 'react-native-elements'

import firebase from '../../../config'
const database = firebase.database().ref()

const { width, height } = Dimensions.get("window");

class SetLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      Profile: null,
      region: {
        latitude: 24.882859,
        longitude: 67.069200,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      Markers: [{
        coordinates: {
          latitude: 24.882859,
          longitude: 67.069200,
        },
        title: 'My Location',
        description: 'my location',
        key: '0',
        color: 'red'
      }]

    }

    this._getLocationAsync()
  }

  checkDevice() {
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

      // Location.getCurrentPositionAsync({}, (callback) => {
      //   return (
      //   )
      // });



      let location = await Location.getCurrentPositionAsync({});

      if (location) {
        this.setState({
          region: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          Markers: [{
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            title: 'My Location',
            description: 'my location',
            key: '0',
            color: 'red'
          }]
        });

      } else {

        this.setState({
          region: {
            latitude: 24.882859,
            longitude: 67.069200,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          Markers: [{
            coordinates: {
              latitude: 24.882859,
              longitude: 67.069200,
            },
            title: 'My Location',
            description: 'my location',
            key: '0',
            color: 'red'
          }]
        });

      }

    }
  }

  _onPress = async () => {
    let myUID = firebase.auth().currentUser.uid
    let databaseKey = await AsyncStorage.getItem('DatabaseKey')

    database.child('Users').child(databaseKey).update({
      userLocation: this.state.Markers[0]
    })
      .then(async () => {
        await AsyncStorage.removeItem("setProfile");
        await AsyncStorage.removeItem("setServices");
        await AsyncStorage.removeItem("setLocation");
        await AsyncStorage.removeItem("newUser");
        this.props.navigation.navigate('AuthLoading')
      })
      .catch(() => alert('Error Occurred!'))

  }



  render() {
    const { isLoading, region, Markers } = this.state;
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
          minZoomLevel={5}
          zoomControlEnabled={true}
          loadingEnabled={true}
          mapType='standard'
          style={styles.Map}
          region={region}
        >

          {Markers.length !== 0 && this.state.Markers.map(marker => {
            return <Marker
              draggable
              key={marker.key}
              coordinate={marker.coordinates}
              pinColor={marker.color}
              title={marker.title}
              description={marker.description}
            />
          }
          )}

        </MapView>

        <View style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0
        }}>
          <Button
            title={"All Done"}
            titleStyle={{ color: 'white' }}
            containerStyle={{ backgroundColor: '#23ddae'}}
            buttonStyle={{ backgroundColor: '#23ddae', padding: 10 }}
            onPress={() => this._onPress()}
          />
        </View>

      </Fragment >
    )
  }
}



export default SetLocation;


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


