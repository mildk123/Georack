import React, { Component } from 'react'
import { View, Dimensions, Image, StyleSheet, AsyncStorage } from 'react-native'

import { Button } from 'react-native-elements'
import { Card, CardItem, Text, Body } from "native-base";


const { width } = Dimensions.get("window");
// import pic1 from '../../Assets/Start/1st.svg'

import Carousel from 'react-native-snap-carousel'
export class StartScreen extends Component {
    constructor() {
        super();
        this.state = {
            entries: [
                {
                    thumbnail: require('../../assets/Start/1st.png')
                },
                {
                    thumbnail: require("../../assets/Start/2nd.png")
                },
                {
                    thumbnail: require("../../assets/Start/3rd.png")
                }
            ]
        };
    }

    _renderItem({ item, index }, parallaxProps) {
        return (
            <View style={styles.cardMain}>
                <CardItem cardBody style={styles.cardBody} bordered={false}>
                    <Body>
                        <Image source={item.thumbnail} style={styles.image} />
                    </Body>
                </CardItem>
            </View>
        );
    }

    _CompleteStartScreen = () => {
        AsyncStorage.setItem('completeStart' , 'true')
        this.props.navigation.navigate('AuthLoading')
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: "#ffffff",
                justifyContent: 'space-between',
            }}>
                <View style={{
                    paddingTop: 50, flexDirection: "row",
                    justifyContent: 'space-around',
                }}>

                    <Text style={{ fontSize: 25, fontStyle: 'italic' }}> Welcome to Georack </Text>
                </View>

                <View style={{
                    maxHeight: "70%",
                    justifyContent: "center",
                    alignItems: "center"
                }} >

                    <Carousel
                        layout={'default'}
                        data={this.state.entries}
                        renderItem={this._renderItem}
                        sliderWidth={styles.sliderWidth.width}
                        itemWidth={styles.itemWidth.width}
                        hasParallaxImages={true}
                        enableSnap={true}
                        firstItem={0}
                        useScrollView={true}
                        vertical={false}
                    />

                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: 'space-around',
                }}>

                    <Button
                        title="Get Started"
                        onPress={() => this._CompleteStartScreen()}
                        titleStyle={{
                            color: '#00A84A'
                        }}
                        containerStyle={{ padding: 25, }}
                        buttonStyle={{
                            backgroundColor: 'white',
                            borderColor: '#00A84A',
                            borderWidth: 1,
                            width: width * 0.35,
                            padding: 5,
                            borderRadius: 25,
                            elevation: 0
                        }}
                    />
                </View>
            </View>
        )
    }
}

export default StartScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },

    sliderWidth: {
        width: Dimensions.get("window").width
    },
    itemWidth: {
        width: Dimensions.get("window").width
    },

    cardMain: {
        elevation: 0,
        borderWidth: 0
    },
    cardBody: {
        width: width * 0.9,
        height: Dimensions.get("window").height * 0.7
    },
    image: {
        width: width * 1,
        height: Dimensions.get("window").height * 0.7
    }
});
