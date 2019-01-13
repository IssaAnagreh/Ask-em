import React, { Component } from "react";
import { TouchableHighlight, View } from "react-native";
import PropTypes from "prop-types";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button
} from "native-base";

// props are from account
export default class AccountThumbnails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allSurveysInfo: props.allSurveys,
      surveyImages: props.surveyImages
    };
  }

  render() {
    const { surveyImages } = this.state;
    return (
      <Container>
        {Array.isArray(this.props.allSurveys) &&
          this.props.allSurveys.map((survey, index) => (
            <List key={survey.id}>
              <ListItem thumbnail>
                <Left>
                  <Thumbnail square source={surveyImages[index]} />
                </Left>
                {this.props.isUserSurveys ? (
                  <Body>
                    <TouchableHighlight
                      onPress={() => {
                        this.props.onChangeSurveyInfo(
                          survey.survey_name,
                          survey.description,
                          survey.category,
                          survey.id,
                          survey.id_users
                        );
                        this.props.showHandler();
                        this.props.getBirthdays(survey.id);
                        this.props.getGenders(survey.id);
                        this.props.getLastNames(survey.id);
                        this.props.getEducationLevels(survey.id);
                        this.props.getMaritalStatuses(survey.id);
                      }}
                      underlayColor="#E02A23"
                    >
                      <Text key={survey.id}>
                        {survey.survey_name}
                      </Text>
                    </TouchableHighlight>

                    <Text note numberOfLines={3}>
                      {survey.description}
                    </Text>
                  </Body>
                ) : (
                    <Body>
                      <Text key={survey.id}>{survey.survey_name}</Text>
                      <Text note numberOfLines={3}>
                        {survey.description}
                      </Text>
                    </Body>
                  )}

                {this.props.isUserSurveys ? (
                  <Right>
                    <Button
                      bordered
                      primary
                      onPress={() => {
                        this.props.onChangeSurveyInfo(
                          survey.survey_name,
                          survey.description,
                          survey.category,
                          survey.id,
                          survey.id_users
                        );
                        this.props.showHandler();
                        this.props.getBirthdays(survey.id);
                        this.props.getGenders(survey.id);
                        this.props.getLastNames(survey.id);
                        this.props.getEducationLevels(survey.id);
                        this.props.getMaritalStatuses(survey.id);
                      }}
                    >
                      <Text key={survey.id} style={{ color: '#039BE5' }}>View</Text>
                    </Button>
                  </Right>
                ) : (
                    <Right />
                  )}
              </ListItem>
            </List>
          ))}
      </Container>
    );
  }
}

AccountThumbnails.propTypes = {
  allSurveys: PropTypes.array,
  selectedSurvey: PropTypes.func,
  showHandler: PropTypes.func,
  surveyImages: PropTypes.array,
  onChangeSurveyInfo: PropTypes.func,
  isUserSurveys: PropTypes.bool,
  getBirthdays: PropTypes.func,
  getGenders: PropTypes.func,
  getLastNames: PropTypes.func
};
