import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput
} from "react-native";
import { Container, Header, Text as Textbase, Left, Icon } from "native-base";
import Payment from "./Payment";

export default class Contact extends Component {
  static navigationOptions = {
    drawerIcon: () => (
      <Icon name='library-books' style={{ fontSize: 30 }} />
    )
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Header>
          <Left>
            <Icon style={styles.icon} name='menu' onPress={() => { this.props.navigation.openDrawer() }} />
          </Left>
          <Text style={styles.headerStyle}>Contact</Text>
        </Header>
        <View style={styles.container}>
                  
          <Text style={styles.text}> In Contact!</Text>
          
          <TextInput />
        </View>
        <View>
          <Payment />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white"
  },
  headerStyle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlignVertical: "center",
    textAlign: "left",
    color: "white",
    fontSize: 22
  },
  text: {
    padding: 10,
    fontSize: 18,
    height: 44,
    textAlign: "left"
  },
  icon: {
    color: "white",
    margin: 10,
    fontSize: 40,
    textAlign: "left"
  }
});
