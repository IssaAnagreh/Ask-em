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
//import { Icon } from 'react-native-elements';
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
      ],
      user: '',
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
          headers: { 
            'Accept':'application/json',
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ id: this.state.user_id })
        })
          .then(response => response.json())
          .then(res => {
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
      if (value !== null) {
        const token = JSON.parse(value);
        this.setState({
          user_id: ` ${token.user_id} `
        });
        fetch(`${ip}:3000/surveysAnsByUser`, {
          method: "POST",
          headers: { 
            'Accept':'application/json',
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ id: this.state.user_id })
        })
          .then(response => response.json())
          .then(res => {
            this.setState({ fetchedSurveys: res });
          })
          .done(() => {
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

  componentDidMount = async () => {
    var user = await AsyncStorage.getItem("userID");
    user = JSON.parse(user)
    if (user["userName"]) {
      this.setState({ user: user.userName });
    }
  }

  render() {
    return (
      <Container >
        <Header style={{ backgroundColor: "#E65100" }}>
          <Left>
            <Icon
              style={styles.icon}
              name="menu"
              onPress={() => {
                this.props.navigation.openDrawer();
              }}
            />
          </Left>
          <Text style={styles.headerStyle}>Account</Text>
        </Header>
        <ScrollView>
          <Grid>
            <Row size={2}>
              <View style={styles.container}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: "https://unixtitan.net/images/profile-vector-person-4.png"
                  }}
                />
                <Text style={styles.name}>{this.state.user}</Text>
                <View style={styles.bodyContent}>
                  <TouchableOpacity
                    style={styles.buttonContainerFirst}
                    onPress={() => {
                      this.onPressMySurveys();
                    }}
                  >
                    <Text style={styles.text}>My Surveys</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonContainerSecond}
                    onPress={() => {
                      this.onPressSurveysHasBeenAns();
                    }}
                  >
                    <Text style={styles.bigText}>Answered</Text>
                    <Text style={styles.bigText}>Surveys</Text>
                  </TouchableOpacity>
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
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    width: 300
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
  container: {
    flex: 1,
    alignItems: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    alignSelf: "center",
    position: "relative",
    marginTop: 10
  },
  name: {
    fontSize: 22,
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
  bodyContent: {
    flex: 1,
    flexDirection: "row",
    //justifyContent: 'space-between',
  },
  buttonContainerFirst: {
    flex:2,
    marginTop: 10,
    height: 45,
    marginBottom: 1,
    //marginRight: 5,
    //width: 150,
    alignItems: 'center',
    //borderRadius: 12,
    borderColor: 'black',
    borderRightWidth: 1,
    backgroundColor: "#002C43"//"#003049",
  },
  buttonContainerSecond: {
    flex:2,
    marginTop: 10,
    height: 45,
    marginBottom: 1,
    //marginRight: 5,
    //width: 150,
    alignItems: 'center',
    //borderRadius: 12,
    borderColor: 'black',
    borderLeftWidth: 1,
    backgroundColor: "#EAE2B7"//"#003049",
  },
  thumbnails: {
    color: "black"
  },
  text: {
    color: 'white',
    fontSize: 15,
    marginTop: 12,
    fontWeight: 'bold',
  },
  bigText: {
    color: 'black',
    fontSize: 15,
    //marginLeft: 10,
    fontWeight: 'bold',
  },
  icon: {
    color: "white",
    margin: 10,
    fontSize: 40,
    textAlign: "left"
  }
});
