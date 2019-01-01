import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableHighlight,
  TextInput,
  ScrollView
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Text as Textbase
} from "native-base";
import { Icon } from "react-native-elements";
//import Payment from "./Payment";

export default class SurveyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      survey: this.props.selectedSurvey,
      surveyName: "",
      surveyDescription: "",
      surveyCategory: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      survey: nextProps.selectedSurvey
    });
  }

  handleSurveyNameChange = name => {
    this.setState({ surveyName: name });
  };

  handleSurveyDescriptionChange = description => {
    this.setState({ surveyDescription: description });
  };

  handleSurveyCategoryChange = category => {
    this.setState({ surveyCategory: category });
  };

  render() {
    const {
      survey,
      surveyName,
      surveyDescription,
      surveyCategory
    } = this.state;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.visibility}
          onRequestClose={() => { }}
        >
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.modalContainer}>
                <Text style={styles.text}>{survey}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Survey Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  onChangeText={surveyName => {
                    this.handleSurveyNameChange(surveyName);
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Survey Description"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  onChangeText={surveyDescription => {
                    this.handleSurveyDescriptionChange(surveyDescription);
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Survey Category"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  onChangeText={surveyCategory => {
                    this.handleSurveyCategoryChange(surveyCategory);
                  }}
                />

                <View style={styles.buttonRow}>
                  <View style={styles.buttonSend}>
                    <Button
                      primary
                      full
                      block
                      onPress={() => {
                        this.props.submitModalHandler(
                          surveyName,
                          surveyDescription,
                          surveyCategory
                        );
                      }}
                    >
                      {/* need to changeicon color */}
                      <Icon name="send" style={{ color: "white" }} />
                      <Textbase>Submit</Textbase>
                    </Button>
                  </View>

                  <View style={styles.buttonCancel}>
                    <Button
                      primary
                      full
                      block
                      onPress={() => {
                        this.props.showHandler(false);
                      }}
                    >
                      {/* need to changeicon color */}
                      <Icon name="backspace" style={{ color: "white" }} />
                      <Textbase>Cancel</Textbase>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cce6ff",
    width: "100%"
  },
  text: {
    fontSize: 25,
    textAlignVertical: "center",
    textAlign: "center",
    marginBottom: 40
  },
  input: {
    height: 50,
    backgroundColor: "rgba(0, 0, 255, 0.2)",
    marginBottom: 20,
    color: "#FFF",
    paddingHorizontal: 10,
    fontSize: 18
  },
  modalContainer: {
    width: "80%"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20
  },
  buttonCancel: {
    width: "45%"
  },
  buttonSend: {
    width: "45%"
  }
});

SurveyModal.propTypes = {
  showHandler: PropTypes.func,
  visibility: PropTypes.bool,
  selectedSurvey: PropTypes.string
};
