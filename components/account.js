import React, { Component } from "react";
import {
  StyleSheet,
  SectionList,
  Text,
  View,
  Modal,
  TouchableHighlight,
  AsyncStorage,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import { Container, Header, Text as Textbase, Left, Icon } from "native-base";
//mport { Icon } from "react-native-elements";
import SurveyListThumbnails from "./SurveyListThumbnails";
import { Col, Row, Grid } from "react-native-easy-grid";

const ip = require("../ip.json");
// import IP from 'ip';
// ip = IP.mask()

export default class Account extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="account-box" style={{ fontSize: 30 }} />
    )
  };
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      modalVisible: false,
      selectedSurvey: null,
      surveyName: "",
      surveyDescription: "",
      surveyCategory: "",
      fetchedSurveys: [],
      user_id: null,
      images: [
        "https://cdn-images-1.medium.com/max/1200/1*jh6bmapyE8nPWju7W_7qEw.png",
        "https://softwareengineeringdaily.com/wp-content/uploads/2018/12/machinelearning.jpg",
        "https://d2odgkulk9w7if.cloudfront.net/images/default-source/blogs/nativescript-vuef711652a7b776b26a649ff04000922f2.png?sfvrsn=75660efe_0"
      ]
    };
  }

  onPressMySurveys = async () => {
    try {
      const value = await AsyncStorage.getItem("userID");
      if (value !== null) {
        const token = JSON.parse(value);
        this.setState({
          user_id: ` ${token.user_id} `
        });
        fetch(`${ip}:3000/mysurveys`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: this.state.user_id })
        })
          .then(response => response.json())
          .then(res => {
            console.warn(res);
            this.setState({ fetchedSurveys: res });
          })
          .done();
      }
    } catch (error) {
      console.warn("error from the token mysurveys", error);
    }
  };

  onPressSurveysHasBeenAns = async () => {
    
    try {
      const value = await AsyncStorage.getItem("userID");
      console.warn(value)
      if (value !== null) {
        const token = JSON.parse(value);
        this.setState({
          user_id: ` ${token.user_id} `
        });
        fetch(`${ip}:3000/surveysAnsByUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: this.state.user_id })
        })
          .then(response => response.json())
          .then(res => {
            this.setState({ fetchedSurveys: res });
          })
          .done(() => {
            console.warn(this.state.fetchedSurveys);
          });
      }
    } catch (error) {
      console.warn("error from the token surveysAnsByUser", error);
    }
  };

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  selectedSurvey = item => {
    this.setState({ selectedSurvey: item });
  };

  render() {
    return (
      <ScrollView>
        <Grid>
          <Row size={2}>
            <View style={styles.container}>
              <View style={styles.header} />
              <Image
                style={styles.avatar}
                source={{
                  uri: "https://bootdey.com/img/Content/avatar/avatar6.png"
                }}
              />
              <View style={styles.body}>
                <View style={styles.bodyContent}>
                  <Text style={styles.name}>John Doe</Text>
                  <Text style={styles.info}>
                    UX Designer / Mobile developer
                  </Text>
                  <Text style={styles.description}>
                    Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne
                    assum electram expetendis, omittam deseruisse consequuntur
                    ius an,
                  </Text>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => {
                      this.onPressMySurveys();
                    }}
                  >
                    <Text>My Surveys</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => {
                      this.onPressSurveysHasBeenAns();
                    }}
                  >
                    <Text>Answered Surveys</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Row>
          <Row size={2}>
            <SurveyListThumbnails
              allSurveys={this.state.fetchedSurveys}
              selectedSurvey={this.selectedSurvey.bind(this)}
              showHandler={this.setModalVisible.bind(this)}
              surveyImages={this.state.images}
            />
          </Row>
        </Grid>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00BFFF",
    height: 200
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 75
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600"
  },
  body: {
    marginTop: 40
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center"
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF"
  },
  thumbnails: {
    // marginTop: 50,
    color: "black"
  }
});
