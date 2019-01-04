import React, { Component } from 'react';
import { View, SafeAreaView, Image, ScrollView, Modal, TouchableHighlight } from 'react-native';

import {
  createDrawerNavigator,
  DrawerItems,
  createAppContainer
} from "react-navigation";
import Signup from "./signup";
import Signin from "./signin";
import Payment from "./Payment";
import TabNavigator from "./tabNavigator";
import Search from "./Search";


export class Options extends Component {
  render() {
    return (
      <AppDrawerNavigator />
    );
  }
}

const CustumDrawerComponent = (props) => (
  <View>
    <StatusBar
      backgroundColor="#ffffff"
      barStyle="dark-content"
      animated={true}
    />
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <DrawerItems {...props} />
      </ScrollView>
    </SafeAreaView>
  </View>
)

const AppDrawerNavigator = createDrawerNavigator({
  "Ask'Em": TabNavigator,
  Search: Search,
  Signin: Signin,
  Signup: Signup,
  Payment: Payment,
  // Feedback: Payment,
  // About: Payment,
},
  {
    initialRouteName: "Ask'Em",
    ContentComponent: CustumDrawerComponent,
    drawerWidth: 200,
    contentOptions: {
      activeTintColor: '#E65100',
      activeBackgroundColor: 'rgba(0,0,0,0)',
      inactiveBackgroundColor: 'rgba(0,0,0,0)',
      inactiveTintColor: '#545f7a',
      style: {
        marginVertical: 0
      },
      labelStyle: {
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        backgroundColor: 'transparent'
      }
    },
  },

)

export default createAppContainer(AppDrawerNavigator);