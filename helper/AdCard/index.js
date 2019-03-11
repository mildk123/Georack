import React, { Component } from 'react';
import { RefreshControl } from 'react-native'
import { Container, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, View, Icon } from 'native-base';

import { Card } from 'native-base';
import { Button } from 'react-native-elements'



export default class ListThumbnailExample extends Component {
    render() {
        const { data } = this.props;

        return (
            <Container>
                <Content>
                    <List
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.refreshState}
                                onRefresh={() => this.props._onRefresh()}
                            />
                        }
                        style={{ padding: 5 }}>
                        {data && data.map((item, index) => {
                            return <Card key={index} style={{ padding: 5, borderRadius: 25 }}>
                                <ListItem thumbnail noBorder >
                                    <Left>
                                        <Thumbnail source={{ uri: item.photoURL }} />
                                    </Left>
                                    <Body>
                                        <Text>{item.username} </Text>
                                        <Text note numberOfLines={1}>{item.providerId}</Text>
                                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}> */}
                                        <Text note>{item.phone}</Text>
                                        <Text note>{item.email}</Text>
                                        {/* </View> */}
                                    </Body>
                                    <Right>
                                        <View style={{ padding: 5 }}>
                                            <Button
                                                onPress={() => this.props.ViewProfile(item.firebaseUid, index)}
                                                iconRight
                                                title=''
                                                icon={<Icon type='Entypo' name="chevron-thin-right" style={{ color: '#23ddae' }} />}
                                                buttonStyle={{
                                                    elevation: 0,
                                                    backgroundColor: '#FFFFFF'
                                                }}
                                            />

                                            <Text> {item.budget} /5</Text>
                                        </View>
                                    </Right>
                                </ListItem>
                            </Card>
                        })
                        }
                    </List>
                </Content>
            </Container>
        );
    }
}