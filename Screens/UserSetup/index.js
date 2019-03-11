import React from 'react'
import { AsyncStorage } from 'react-native'
import { Icon } from 'native-base'

import { createStackNavigator } from "react-navigation";
import Profile from './Profile'
import Location from './Location'
import AuthLoading from '../AuthLoading'

import firebase from '../../config'

export default createStackNavigator({
    Profile,
    Location,
    AuthLoading
}, {
        defaultNavigationOptions: ({ navigation }) => {
            const routeName = navigation.state.routeName
            return {
                headerTitle: routeName,
                headerLeft: (
                    <Icon
                        type='Entypo'
                        style={{ paddingLeft: 10, fontSize: 18 }}
                        onPress={() => {
                            firebase.auth().currentUser.delete()
                                .then(res => {
                                    AsyncStorage.removeItem("userLoggedIn");
                                    AsyncStorage.removeItem("newUser");
                                    AsyncStorage.removeItem('DatabaseKey')
                                    AsyncStorage.removeItem("setLocation");
                                    AsyncStorage.removeItem('setProfile')
                                    navigation.navigate('AuthLoading')
                                })
                                .catch(err => alert('Cannot go back', err))
                        }}
                        name="circle-with-cross"
                        size={30}
                    />
                ),
            };
        }

    });
