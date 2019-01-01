import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	TouchableHighlight,
	Image,
	Alert,
	AsyncStorage
} from "react-native";
import { Container } from 'native-base';
import myStripe from '../stripe.json'
//const stripe = require('stripe')(myStripe[0].secret)

export default class Payment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			"card[number]": "4242424242424242", //Default
			"card[exp_month]": "12", //Default
			"card[exp_year]": "2019", //Default
			"card[cvc]": "123", //Default
			userName: '', //logged in username
			token: {
				userName: "issa", //Default
				userToken: {}
			},
			money: '65', //cent //Default
			currency: 'usd' //Default
		};
	}

	checkUser = async () => {
		try {
			var value = await AsyncStorage.getItem("userID");
			if (value !== null) {
				// We have data!!
				var value = JSON.parse(value);
				this.setState({
					userName: value.userName
				});
			} else {
				console.warn('Please login!')
			}
		} catch (error) {
			// Error retrieving data
			console.warn('checkuser error', error)
		}
	}

	makeFormBody() {
		var cardDetails = {
			"card[number]": this.state["card[number]"],
			"card[exp_month]": this.state["card[exp_month]"],
			"card[exp_year]": this.state["card[exp_year]"],
			"card[cvc]": this.state["card[cvc]"]
		};
		var formBody = [];
		for (var property in cardDetails) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(cardDetails[property]);
			formBody.push(encodedKey + "=" + encodedValue);
		}
		return formBody = formBody.join("&");
	}

	requestPayment = async () => {
		const scope = this;
		await this.checkUser()
		if (this.state.userName) {
			let formBody = scope.makeFormBody()
			fetch('https://api.stripe.com/v1/tokens', {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Bearer ' + 'pk_test_uxJh964nHbbD6S1vgxkUlnJ0'
				},
				body: `${formBody}`//"card%5Bnumber%5D=4242424242424242&card%5Bexp_month%5D=12&card%5Bexp_year%5D=2019&card%5Bcvc%5D=123"
			})
				.then(function (res) {
					scope.setState({
						token: {
							userToken: res,
							userName: scope.state.userName
						}
					})
					res.json()
					//alert('You paid!')
					scope.chargeCustomer()
				})
				.then(() => {
				})
				.catch(err => { console.warn("Token is not made, err:", err) })
		} else {
			console.warn('Please login!')
		}
	};

	makeChargeBody() {
		var cardDetails = {
			"amount": this.state.money,
			"currency": this.state.currency,
			"source": JSON.parse(this.state.token.userToken._bodyInit)['id']
		};
		var chargeBody = [];
		for (var property in cardDetails) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(cardDetails[property]);
			chargeBody.push(encodedKey + "=" + encodedValue);
		}
		return chargeBody = chargeBody.join("&");
	}

	chargeCustomer = async () => {
		const scope = this;
		await this.checkUser()
		if (this.state.userName) {
			let chargeBody = scope.makeChargeBody()
			fetch('https://api.stripe.com/v1/charges', {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Bearer ' + `${myStripe[0].secret}`
				},
				body: `${chargeBody}`
			})
				.then(function (res) {
					res.json()
					if (res.status < 400) {
						alert('You paid!')
					} else {
						alert('Error, contact admin!')
					}
				})
				.then(() => {
				})
				.catch(err => { console.warn("Charge is not made, err:", err) })
		} else {
			console.warn('Please login!')
		}
	}
 
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.inputNumber}
						placeholder='Number'
						onChangeText={cvc => {
							this.setState({ 'card[number]': cvc });
						}}
					/>
					<TextInput
						style={styles.inputExp_month}
						placeholder='Exp_month'
						onChangeText={cvc => {
							this.setState({ 'card[exp_month]': cvc });
						}}
					/>
					<TextInput style={styles.inputExp_year}
						placeholder='Exp_year'
						onChangeText={cvc => {
							this.setState({ 'card[exp_year]': cvc });
						}}
					/>
					<TextInput
						style={styles.inputCvc}
						placeholder='CVC'
						onChangeText={cvc => {
							this.setState({ 'card[cvc]': cvc });
						}}
					/>
				</View>
				<View style={styles.inputContainerPay}>
					<TextInput
						style={styles.inputExp_year}
						placeholder='Money amount'
						onChangeText={money => {
							this.setState({ 'money': `${money}` });
						}}
					/>
				</View>
				<View style={styles.buttonContainer}>
					<TouchableHighlight
						style={styles.button}
						onPress={this.requestPayment}
					>
						<Text style={styles.text}>Pay</Text>
					</TouchableHighlight>

				</View>
			</View>
		);
	}
}

const styles = {
	container: {
		flexDirection: "column",
		alignItems: 'stretch',
		justifyContent: 'space-between',
		marginTop: 150,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: "stretch",
		justifyContent: 'space-between',
		marginLeft: 5,
		marginRight: 5,
	},
	button: {
		height: 45,
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 40,
		backgroundColor: "#4167b2",
		borderColor: 'black',
		borderWidth: 1
	},
	text: {
		flexDirection: "column",
		color: "white",
		marginTop: 7,
		fontSize: 20,
	},
	inputContainer: {
		flex: 1,
		flexDirection: 'row',
		marginLeft: 5,
		marginRight: 5,
	},
	inputContainerPay: {
		flex: 1,
		flexDirection: 'row',
		marginLeft: 5,
		marginRight: 5,
		marginTop: 40,
		width: 150,
	},
	input: {
		height: 45,
		marginBottom: 10,
		width: 50,
		borderRadius: 30
	},
	inputNumber: {
		flex: 20,
		borderBottomColor: "black",
		backgroundColor: "#FFFFFF",
		width: 150,
		height: 35,
		alignItems: "center",
		borderWidth: 1
	},
	inputExp_month: {
		flex: 2,
		borderBottomColor: "black",
		backgroundColor: "#FFFFFF",
		width: 50,
		height: 35,
		alignItems: "center",
		borderWidth: 1
	},
	inputExp_year: {
		flex: 5,
		borderBottomColor: "black",
		backgroundColor: "#FFFFFF",
		width: 50,
		height: 35,
		alignItems: "center",
		borderWidth: 1
	},
	inputCvc: {
		flex: 3,
		borderBottomColor: "black",
		backgroundColor: "#FFFFFF",
		width: 50,
		height: 35,
		alignItems: "center",
		borderWidth: 1
	},
};