import React, { Component } from "react";
import { Text, View } from "react-native";

import {List, ListItem} from 'native-base'

class Notifications extends Component {
  constructor() {
    super();
    this.state = {
      dataList: []
    };
  }

  // static getDerivedStateFromProps = (nextProps, state) => {
  //   if(nextProps.navigation.state.params.data){
  //     const data = nextProps.navigation.state.params.data;
  //     if (data !== state.dataList) {
  //       return {
  //         dataList: [...state.dataList, data.data.code]
  //       };
  //     }
  //   }
  //   return null;
  // };

  render() {
    const {dataList} = this.state;
    return (
      <View>
        <List>
          {this.state.dataList !== [] ? 
            dataList.map((item, index) => {
              return (
                <Text>123</Text>
              )
            })
            :
          (<Text style={{textAlign : 'center', }}>No New Notifications</Text>)
          }
        </List>
      </View>
    );
  }
}

export default Notifications;
