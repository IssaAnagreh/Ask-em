import React, { Component } from "react";
import {
  StyleSheet,
  SectionList,
  Text,
  View,
  Modal,
  TouchableHighlight,
  AsyncStorage,
  ScrollView
} from "react-native";
import { Container, Header, Text as Textbase, Left } from "native-base";
import { Icon } from 'react-native-elements';
import SurveyListThumbnails from "./SurveyListThumbnails";
import SurveyModal from "./SurveyModal";

const ip = require("../ip.json");
// import IP from 'ip';
// ip = IP.mask()

export default class Account extends Component {
  static navigationOptions = {
    drawerIcon: () => (
      <Icon name='account-box' style={{ fontSize: 30 }} />
    )
  };
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      names: [
        {
          key: "Isa",
          imageURI:
            "https://cdn-images-1.medium.com/max/1200/1*jh6bmapyE8nPWju7W_7qEw.png"
        },
        {
          key: "Maram",
          imageURI:
            "https://softwareengineeringdaily.com/wp-content/uploads/2018/12/machinelearning.jpg"
        },
        {
          key: "Anagreh",
          imageURI:
            "https://d2odgkulk9w7if.cloudfront.net/images/default-source/blogs/nativescript-vuef711652a7b776b26a649ff04000922f2.png?sfvrsn=75660efe_0"
        }
      ],
      modalVisible: false,
      selectedSurvey: null,
      surveyName: "",
      surveyDescription: "",
      surveyCategory: "",
      loggedin: "",
      allSurveysInfo: [],
      images: [
        "https://cdn-images-1.medium.com/max/1200/1*jh6bmapyE8nPWju7W_7qEw.png",
        "https://softwareengineeringdaily.com/wp-content/uploads/2018/12/machinelearning.jpg",
        "https://d2odgkulk9w7if.cloudfront.net/images/default-source/blogs/nativescript-vuef711652a7b776b26a649ff04000922f2.png?sfvrsn=75660efe_0"
      ]
    };
  }

  componentDidMount = async () => {
    this.showAllSurveys();
    try {
      const value = await AsyncStorage.getItem("userID");
      if (value !== null) {
        // We have data!!
        const token = JSON.parse(value);
        this.setState({
          loggedin: ` ${token.userName} `
        });
      } else {
        this.setState({
          loggedin: ""
        });
      }
    } catch (error) {
      // Error retrieving data
      console.warn("Login Please!")
    }
  };

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  selectedSurvey = item => {
    this.setState({ selectedSurvey: item });
  };

  onChangeSurveyName = name => {
    this.setState({
      surveyName: name
    });
  };

  onChangeSurveyDescription = description => {
    this.setState({
      surveyDescription: description
    });
  };

  onChangeSurveyCategory = category => {
    this.setState({
      surveyCategory: category
    });
  };

  onPressSubmitModal(surveyName, surveyDescription, surveyCategory) {
    [...arguments].forEach(element => {
      this.setState({ element });
    });

    fetch(`${ip}:3000/surveys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surveyName: surveyName,
        surveyDescription: surveyDescription,
        surveyCategory: surveyCategory
      })
    })
      .then(response => response.json())
      .then(res => {
        this.setState({ modalVisible: false });
        console.warn(res);
      })
      .done();
  }

  showAllSurveys = () => {
    fetch(`${ip}:3000/surveys/`, {
      method: "GET"
    })
      .then(response => {
        return response.json();
      })
      .then(res => {
        this.setState({
          allSurveysInfo: res
        });
      })
      .done();
  };

  render() {
    const {
      data: { dark },
      modalVisible,
      selectedSurvey,
      allSurveysInfo,
      images
    } = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <Icon style={styles.icon} name='menu' onPress={() => { this.props.navigation.openDrawer() }} />
          </Left>
          <Text style={styles.headerStyle}>Account</Text>
        </Header>
        
        <ScrollView>
          <View>
            <SurveyModal
              showHandler={this.setModalVisible.bind(this)}
              visibility={modalVisible}
              selectedSurvey={selectedSurvey}
              submitModalHandler={this.onPressSubmitModal.bind(this)}
            />
            <SurveyListThumbnails
              allSurveys={allSurveysInfo}
              selectedSurvey={this.selectedSurvey.bind(this)}
              showHandler={this.setModalVisible.bind(this)}
              surveyImages={images}
            />
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    top: 0
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
  icon: {
    color: "white",
    margin: 10,
    fontSize: 40,
    textAlign: "left"
  }
});
