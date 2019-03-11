import React, { Component, Fragment } from "react";
import { View, Dimensions } from 'react-native'
import { Header, Left, Body, Right, Button, Title, Icon, Text, Item, Input } from "native-base";

import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";

import { Button as Buttonel } from "react-native-elements";
// import Modal from '../Modal'

const { width } = Dimensions.get("window");

class HeaderComp extends Component {
  constructor() {
    super();
    this.state = {}
    // this.showModal = React.createRef()
  }

  // renderModal = () => {
  //   this.setState({
  //     renderModal: true
  //   }, () => this.showModal.current.setModalVisible())
  // }

  render() {
    return (
      <Fragment>
        {/* {this.state.renderModal && <Modal ref={this.showModal} />} */}

        <Header
          style={{ backgroundColor: this.props.headerColor, height: 70, paddingTop: 20 }}
          iosBarStyle={"light-content"}
        >
          <Left>

            {this.props.goBack && <Button
              onPress={() => this.props.navigation.goBack()}
              transparent
            >
              <Text><IconMaterial name={this.props.icon} size={23} color="white" /></Text>
            </Button>
            }

            {this.props.close && <Button
              onPress={() => this.props.close()}
              transparent
            >
              <Text><IconMaterial name={this.props.icon} size={23} color="white" /></Text>
            </Button>
            }


          </Left>

          <Body>
            <Title>{this.props.title}</Title>
          </Body>
          <Right>


            {this.props.favBtn && (
              <Button transparent>
                <Icon name="heart" />
              </Button>
            )}

            {this.props.threeDots && (
              <Button transparent>
                <Icon name="more" />
              </Button>
            )}

          </Right>
        </Header>

        {this.props.searchBar && <View style={{ padding: 5 }}>
          <Item >
            <Icon name="ios-search" />
            <Input placeholder="Find work" />
            <IconMaterial name="filter-outline" style={{ marginEnd: 15, fontSize: 24 }} onPress={() => { this.renderModal() }} />
            <Buttonel
              title="Search"

              buttonStyle={{
                borderRadius: 12,
                elevation: 0
              }}
            />
          </Item>
        </View>}

      </Fragment>
    );
  }
}

export default HeaderComp;
