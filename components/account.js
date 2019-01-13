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
import { Col, Row, Grid } from "react-native-easy-grid";

import AccountThumbnails from "./AccountThumbnails";
import AccountModal from "./AccountModal";

const ip = require("../ip.json");

export default class Account extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="account-box" style={{ fontSize: 30 }} />
    )
  };
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedSurvey: null,
      surveyName: "",
      surveyDescription: "",
      surveyCategory: "",
      surveyID: "",
      surveyUserID: "",
      fetchedSurveys: [],
      user_id: null,
      images: [
        require("./assets/1.jpeg"),
        require("./assets/2.jpeg"),
        require("./assets/3.jpeg"),
        require("./assets/4.jpeg"),
        require("./assets/5.jpeg"),
        require("./assets/6.jpeg"),
        require("./assets/7.jpeg"),
        require("./assets/8.jpeg"),
        require("./assets/9.jpeg"),
        require("./assets/10.jpg")
      ],
      user: "",
      isUserSurveys: false,
      birthdays: [],
      lastnames: [],
      genders: [],
      maritalstatuses: [],
      educationlevels: [],
      finalSmartAnswer: ["Show final smart answer"],
    };
  }

  componentDidMount = async () => {
    var user = await AsyncStorage.getItem("userID");
    user = JSON.parse(user);
    if (user["userName"]) {
      this.setState({ user: user.userName });
    }
  };

  onPressMySurveys = async () => {
    try {
      const value = await AsyncStorage.getItem("userID");
      if (value !== null) {
        const token = JSON.parse(value);
        this.setState({
          user_id: ` ${token.user_id} `
        });
        fetch(`${ip}:3000/mysurveys/retrieve`, {
          method: "POST",
          headers: {
            Accept: "application/json",
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
        fetch(`${ip}:3000/mysurveys/answered`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: this.state.user_id })
        })
          .then(response => response.json())
          .then(res => {
            this.setState({ fetchedSurveys: res });
          })
          .done(() => { });
      }
    } catch (error) {
      console.warn("error from the token surveysAnsByUser", error);
    }
  };

  getBirthdays(id) {
    fetch(`${ip}:3000/surveys/retrieve/all/birthday`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyID: id })
    })
      .then(response => response.json())
      .then(res => {
        this.setState({ birthdays: res });
      })
      .catch(err => {
        console.warn("getBirthdays");
      });
  }

  getGenders(id) {
    fetch(`${ip}:3000/surveys/retrieve/all/gender`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyID: id })
    })
      .then(response => response.json())
      .then(res => {
        this.setState({ genders: res });
      })
      .catch(err => {
        console.warn("getGenders");
      });
  }

  getLastNames(id) {
    fetch(`${ip}:3000/surveys/retrieve/all/lastname`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyID: id })
    })
      .then(response => response.json())
      .then(res => {
        this.setState({ lastnames: res });
      })
      .catch(err => {
        console.warn("getLastNames");
      });
  }

  getEducationLevels(id) {
    fetch(`${ip}:3000/surveys/retrieve/all/educationlevel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyID: id })
    })
      .then(response => response.json())
      .then(res => {
        this.setState({ educationlevels: res });
      })
      .catch(err => {
        console.warn("getEducationLevels");
      });
  }

  getMaritalStatuses(id) {
    fetch(`${ip}:3000/surveys/retrieve/all/maritalstatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyID: id })
    })
      .then(response => response.json())
      .then(res => {
        this.setState({ maritalstatuses: res });
      })
      .catch(err => {
        console.warn("getMaritalStatuses");
      });
  }

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  selectedSurvey = item => {
    this.setState({ selectedSurvey: item });
  };

  async onChangeSurveyInfo(name, description, category, id, userID) {
    await this.setState({
      surveyName: name,
      surveyDescription: description,
      surveyCategory: category,
      surveyID: id,
      surveyUserID: userID
    });
  }

  onPressCloseModal() {
    this.setState({ modalVisible: false });
  }

  finalSmartAnswer(x, y, z) {
    fetch(`${ip}:4000/smart/answer/final`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surveyID: this.state.surveyID,
        input: {
          "39": x,
          "40": y,
          "41": z
        }
      })
    })
      .then(response => {
        this.setState({
          finalSmartAnswer: response._bodyText,
        })
        response.json()
      })
      .then(res => {
      })
      .catch(error => {
        // catch is a must for every fetch
        console.warn("Error:", error);
      });
  }

  render() {
    const {
      modalVisible,
      selectedSurvey,
      allSurveysInfo,
      images,
      surveyDescription,
      surveyCategory,
      surveyName,
      loggedin,
      surveyUserID,
      surveyID,
      fetchedSurveys,
      isUserSurveys,
      birthdays,
      genders,
      lastnames,
      educationlevels,
      maritalstatuses
    } = this.state;
    if (genders) {
      return (
        <Container>
          <Header style={{ backgroundColor: "#037FBC" }}>
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
                      uri:
                        "https://unixtitan.net/images/profile-vector-person-4.png"
                    }}
                  />
                  <Text style={styles.name}>{this.state.user}</Text>
                  <View style={styles.bodyContent}>
                    <TouchableOpacity
                      style={styles.buttonContainerFirst}
                      onPress={() => {
                        this.onPressMySurveys();
                        this.setState({ isUserSurveys: true });
                      }}
                    >
                      <Text style={styles.text}>My Surveys</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonContainerSecond}
                      onPress={() => {
                        this.onPressSurveysHasBeenAns();
                        this.setState({ isUserSurveys: false });
                      }}
                    >
                      <Text style={styles.bigText}>Answered Surveys</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Row>
              <Row size={2}>
                <AccountModal
                  showHandler={this.setModalVisible.bind(this)}
                  finalSmartAnswer={this.finalSmartAnswer.bind(this)}
                  finalSmartAnswerValue={this.state.finalSmartAnswer}
                  visibility={modalVisible}
                  selectedSurvey={selectedSurvey}
                  allSurveys={fetchedSurveys}
                  surveyName={surveyName}
                  surveyDescription={surveyDescription}
                  surveyCategory={surveyCategory}
                  submitModalHandler={this.onPressCloseModal.bind(this)}
                  surveyID={surveyID}
                  birthdays={birthdays}
                  genders={genders}
                  lastnames={lastnames}
                  maritalstatuses={maritalstatuses}
                  educationlevels={educationlevels}
                />
                <AccountThumbnails
                  allSurveys={fetchedSurveys}
                  selectedSurvey={this.selectedSurvey.bind(this)}
                  showHandler={this.setModalVisible.bind(this)}
                  surveyImages={images}
                  onChangeSurveyInfo={this.onChangeSurveyInfo.bind(this)}
                  isUserSurveys={isUserSurveys}
                  getBirthdays={this.getBirthdays.bind(this)}
                  getGenders={this.getGenders.bind(this)}
                  getLastNames={this.getLastNames.bind(this)}
                  getMaritalStatuses={this.getMaritalStatuses.bind(this)}
                  getEducationLevels={this.getEducationLevels.bind(this)}
                />
              </Row>
            </Grid>
          </ScrollView>
        </Container>
      );
    } else {
      return (
        <Container>
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
                      uri:
                        "https://unixtitan.net/images/profile-vector-person-4.png"
                    }}
                  />
                  <Text style={styles.name}>{this.state.user}</Text>
                  <View style={styles.bodyContent}>
                    <TouchableOpacity
                      style={styles.buttonContainerFirst}
                      onPress={() => {
                        this.onPressMySurveys();
                        this.setState({ isUserSurveys: true });
                      }}
                    >
                      <Text style={styles.text}>My Surveys</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonContainerSecond}
                      onPress={() => {
                        this.onPressSurveysHasBeenAns();
                        this.setState({ isUserSurveys: false });
                      }}
                    >
                      <Text style={styles.bigText}>Answered</Text>
                      <Text style={styles.bigText}>Surveys</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Row>
              <Row size={2}>
                <AccountThumbnails
                  allSurveys={fetchedSurveys}
                  selectedSurvey={this.selectedSurvey.bind(this)}
                  showHandler={this.setModalVisible.bind(this)}
                  surveyImages={images}
                  onChangeSurveyInfo={this.onChangeSurveyInfo.bind(this)}
                  isUserSurveys={isUserSurveys}
                  getBirthdays={this.getBirthdays.bind(this)}
                  getGenders={this.getGenders.bind(this)}
                  getLastNames={this.getLastNames.bind(this)}
                  getMaritalStatuses={this.getMaritalStatuses.bind(this)}
                  getEducationLevels={this.getEducationLevels.bind(this)}
                />
              </Row>
            </Grid>
          </ScrollView>
        </Container>
      );
    }
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
    alignItems: "center"
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
    color: "#002C43",
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
    flexDirection: "row"
  },
  buttonContainerFirst: {
    flex: 2,
    marginTop: 10,
    height: 45,
    marginBottom: 1,
    alignItems: "center",
    //borderColor: "black",
    //borderRightWidth: 1,
    backgroundColor: "#DBE3E7",
    borderRadius: 30,
    marginRight: 5,
    marginLeft: 10,

  },
  buttonContainerSecond: {
    flex: 2,
    marginTop: 10,
    height: 45,
    marginBottom: 1,
    alignItems: "center",
    //borderColor: "black",
    //borderLeftWidth: 1,
    backgroundColor: "#DBE3E7",
    borderRadius: 30,
    marginRight: 10,
  },
  thumbnails: {
    color: "black"
  },
  text: {
    color: "black",
    fontSize: 17,
    marginTop: 10,
    fontWeight: "bold",
  },
  bigText: {
    color: "black",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
  },
  icon: {
    color: "white",
    margin: 10,
    fontSize: 40,
    textAlign: "left"
  }
});
