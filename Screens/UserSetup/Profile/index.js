import React, { Component } from "react";
import { StyleSheet, View, TouchableHighlight, Image, Dimensions, AsyncStorage } from "react-native";
import { Spinner } from 'native-base'
import { ImagePicker, Permissions } from "expo";
import { StackActions, NavigationActions } from 'react-navigation';

import {
    Container,
    Item,
    Input,
    Button,
    Text,
    Icon
} from "native-base";


import firebase from '../../../config'
import placeholder from '../../../assets/place.png'

const database = firebase.database().ref()

const { width } = Dimensions.get("window");

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true
            // phone: null,
            // selectedImage: null
        };
    }

    check = async () => {
        let profileStep = await AsyncStorage.getItem('setProfile')
        if (profileStep === 'Done') {
            this.props.navigation.navigate('Location')
        } else {
            this.setState({
                isLoading: false
            })
        }
    }


    componentDidMount = async () => {
        this.check()
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        firebase.auth().onAuthStateChanged(response => {
            if (response.uid) {
                database.child('Users').on('child_added', payload => {
                    if (payload.val().firebaseUid === response.uid) {
                        database.child('Users').child(payload.key).on('value', (payload) => {
                            if (payload.val().photoURL) {
                                this.setState((previousState, currentProps) => {
                                    return {
                                        ...previousState, selectedImage: payload.val().photoURL,
                                        isLoading: false
                                    };
                                })
                            } else {
                                this.setState({
                                    isLoading: false
                                })
                            }

                        })
                    }
                })
            }else{
                alert('Please Login before')
            }
        })
    }

    selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1]
        });

        if (!result.cancelled) {
            this.setState({
                selectedImage: result.uri
            });
        }
    };

    uploadImage = async () => {
        let phone = this.state.phone;
        let uri = this.state.selectedImage;

        if (phone && uri) {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    let myUid = user.uid

                    if (uri) {
                        let filename = uri.split('/').pop()
                        this.setState({
                            isLoading: true
                        })

                        const blob = await new Promise((resolve, reject) => {
                            const xhr = new XMLHttpRequest();

                            xhr.onload = function () {
                                resolve(xhr.response);
                            };

                            xhr.onerror = function (e) {
                                reject(new TypeError("Network request failed"));
                            };

                            xhr.responseType = "blob";
                            xhr.open("GET", uri, true);
                            xhr.send(null);
                        });

                        firebase.storage().ref().child("display pictures").child(filename).put(blob)
                            .then((snapshot) => {
                                return snapshot.ref.getDownloadURL();
                            })
                            .then(downloadURL => {
                                database.child('Users').on('child_added', payload => {
                                    if (payload.val().firebaseUid === myUid) {
                                        database.child('Users').child(payload.key).update({
                                            phone: phone,
                                            photoURL: downloadURL
                                        }, () => {
                                            AsyncStorage.setItem('setProfile', 'Done');
                                            AsyncStorage.setItem('DatabaseKey', payload.key)
                                            this.props.navigation.navigate('Location');
                                        })
                                    }
                                })

                            })

                            .catch(err => alert(err))
                    } else {
                        alert('no file found')
                    }
                } else {
                    alert('not a user')
                    AsyncStorage.removeItem('newUser')
                    this.props.navigation.replace('AuthLoading')
                }

            });
        } else {
            alert('Please enter your phone number')
        }
    }

    render() {
        const { selectedImage, isLoading } = this.state;
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
            <Container style={{ flex: 1 }}>

                <View style={styles.inputCont}>
                    <Item>
                        <Icon active name='phone-call' type='Feather' style={{ fontSize: 25, padding: 5 }} />
                        <Input
                            value={this.state.phone}
                            keyboardType="numeric"
                            placeholder="Phone Number"
                            onChangeText={text => this.setState({ phone: text })}
                        />
                    </Item>

                </View>
                <View style={{ height: width, alignItems: 'center', justifyContent: 'space-between' }}>

                    {isLoading ? <Spinner color={"green"} /> : <TouchableHighlight onPress={this.selectImage}>
                        <Image
                            source={this.state.selectedImage ? { uri: selectedImage } : placeholder}
                            alt="placeholder"
                            style={{ height: width * 0.7, width: width * 0.7 }}
                        />
                    </TouchableHighlight>}

                    <View style={{ alignContent: 'center' }}>
                        <Button
                            onPress={this.uploadImage}
                            style={{
                                backgroundColor: '#23ddae',
                                borderRadius: 10,
                                padding: 10,
                                justifyContent: "center"
                            }}
                        >
                            <Text>Next</Text>
                        </Button>
                    </View>



                </View>

            </Container>
        );
    }
}


export default Profile;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    inputCont: {
        padding: 25,
    }
});