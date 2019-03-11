import React, { Component, Fragment } from 'react';
import { Platform, Text, View, StyleSheet, AsyncStorage, Dimensions } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

import MapView from "react-native-maps";
// import MapViewDirections from "react-native-maps-directions";

import { Spinner } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from 'react-native-elements'


import firebase from '../../../config'

const database = firebase.database().ref()
const { height, width } = Dimensions.get("window");

class SetLocation extends Component {
  constructor() {
    super()

    this.state = {
      isLoading: true,
      region: {
        latitude: 24.882859,
        longitude: 67.069200,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      markers: {
        myMarker: {
          latitude: 24.882859,
          longitude: 67.069200,
          title: "My Marker",
          description: "My marker"
        }

      }
    }

    this.check()
  }

  check = async () => {
    let locationStep = await AsyncStorage.getItem('setLocation')
    if (locationStep === 'Done') {
      this.props.navigation.navigate('AuthLoading')
      await AsyncStorage.removeItem("setProfile");
      await AsyncStorage.removeItem("setServices");
      await AsyncStorage.removeItem("setLocation");
      await AsyncStorage.removeItem("newUser");
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  componentWillMount() {
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
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    } else {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        region: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        },
        markers: {
          myMarker: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        }
      });
    }
  }



  _onPress = () => {
    let myUID = firebase.auth().currentUser.uid
    database.child('Users').on('child_added', (payload) => {
      if (payload.val().firebaseUid === myUID) {
        database.child('Users').child(payload.key).update({
          userLocation: this.state.markers.myMarker
        })
          .then(() => {
            this.props.navigation.navigate('App')
            AsyncStorage.setItem('setLocation', 'Done')
          })
          .catch(() => alert('Error Occurred!'))
      }
    })
  }


  render() {
    const { isLoading, region, markers } = this.state;
    if (isLoading) {
      return (
        <View style={styles.container}>

          <View style={styles.contentDiv}>
            <Spinner color='green' />
          </View>
        </View>
      )
    }

    return (
      <View style={styles.container}>
    
        {/* <MapView
          minZoomLevel={12}
          maxZoomLevel={18}
          showsCompass={true}
          zoomControlEnabled={true}
          loadingEnabled={true}
          mapType="hybrid"
          showsUserLocation={true}
          style={styles.Map}
          followsUserLocation={true}
          region={region}
        >
          <MapView.Marker
            pinColor="#23ddae"
            title={markers.myMarker.title}
            description={markers.myMarker.description}
            key={markers.myMarker.title}
            coordinate={markers.myMarker}
          />

        </MapView> */}

        <View style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0
        }}>
          <Button
            title={"All Done"}
            titleStyle={{ color: 'white' }}
            buttonStyle={{ backgroundColor: '#23ddae', padding: 5 }}
            onPress={() => this._onPress()}
          />
        </View>

      </View >
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
