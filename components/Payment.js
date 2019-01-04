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
	AsyncStorage,
} from "react-native";
import { Container, Header, Text as Textbase, Left, Icon as IconMenu } from "native-base";
import myStripe from '../stripe.json'
import { Icon } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';


export default class Payment extends Component {
	static navigationOptions = {
		drawerIcon: () => (
			<Icon name='payment' style={{ fontSize: 30 }} />
		)
	};
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
			currency: 'usd', //Default
			showAlert: false
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
						//alert('You paid!')
						scope.showAlert()
						setTimeout(function(){ scope.hideAlert(); }, 2000);
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
	//https://www.experian.com/blogs/ask-experian/wp-content/uploads/What-Is-a-Credit-Card_Graphic.png

	showAlert = () => {
		this.setState({
			showAlert: true
		});
	};

	hideAlert = () => {
		this.setState({
			showAlert: false
		});
	};

	render() {
		const { showAlert } = this.state;
		if (showAlert) {
		return (
			<View style={{height: '100%'}}>
				<View>
					<Header style={{ backgroundColor: "#E65100" }}>
						<Left>
							<IconMenu style={styles.icon} name='menu' onPress={() => { this.props.navigation.openDrawer() }} />
						</Left>
						<Text style={styles.headerStyle}>Payment</Text>
					</Header>
					{/* <Image
						style={styles.avatar}
						source={{
							uri: "https://www.experian.com/blogs/ask-experian/wp-content/uploads/What-Is-a-Credit-Card_Graphic.png"
						}}
					/> */}
					<View style={styles.card}>
						<View style={styles.inCard}>
							<View style={styles.logo}>
								<Text style={{ fontSize: 17 }}>VISA</Text>
							</View>
							<View style={styles.cardNumber}>
								<Text style={styles.textNumber}>{this.state["card[number]"]}</Text>
							</View>
							<View style={styles.cardExpiration}>
								<Text style={styles.textExpiration}>{this.state["card[exp_month]"]}/{this.state["card[exp_year]"]}</Text>
							</View>
						</View>
					</View>

					<View style={{ height: 60 }}>
						<TextInput
							style={styles.inputNumber}
							placeholder='Account Number'
							onChangeText={Number => {
								this.setState({ 'card[number]': Number });
							}}
						/>
					</View>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.inputExp_month}
							placeholder='Exp_month'
							onChangeText={Exp_month => {
								this.setState({ 'card[exp_month]': Exp_month });
							}}
						/>
						<TextInput style={styles.inputExp_year}
							placeholder='Exp_year'
							onChangeText={Exp_year => {
								this.setState({ 'card[exp_year]': Exp_year });
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
							placeholder="Money Amount '$'"
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
							<Text style={styles.text}>Submit Payment</Text>
						</TouchableHighlight>

					</View>
				</View>
				<AwesomeAlert
					show={showAlert}
					showProgress={false}
					title="Payment Success"
					message="You have successfully paid!"
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={true}
					showCancelButton={false}
					showConfirmButton={false}
					progressSize='50'
					progressColor='green'
					overlayStyle = {{
						padding: 50,
					}}
					contentContainerStyle = {{
						padding: 50,
					}}
				/>
			</View>
		)} else {
			return (
				<View>
					<Header style={{ backgroundColor: "#E65100" }}>
						<Left>
							<IconMenu style={styles.icon} name='menu' onPress={() => { this.props.navigation.openDrawer() }} />
						</Left>
						<Text style={styles.headerStyle}>Payment</Text>
					</Header>
					{/* <Image
						style={styles.avatar}
						source={{
							uri: "https://www.experian.com/blogs/ask-experian/wp-content/uploads/What-Is-a-Credit-Card_Graphic.png"
						}}
					/> */}
					<View style={styles.card}>
						<View style={styles.inCard}>
							<View style={styles.logo}>
								<Text style={{ fontSize: 17 }}>VISA</Text>
							</View>
							<View style={styles.cardNumber}>
								<Text style={styles.textNumber}>{this.state["card[number]"]}</Text>
							</View>
							<View style={styles.cardExpiration}>
								<Text style={styles.textExpiration}>{this.state["card[exp_month]"]}/{this.state["card[exp_year]"]}</Text>
							</View>
						</View>
					</View>

					<View style={{ height: 60 }}>
						<TextInput
							style={styles.inputNumber}
							placeholder='Account Number'
							onChangeText={Number => {
								this.setState({ 'card[number]': Number });
							}}
						/>
					</View>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.inputExp_month}
							placeholder='Exp_month'
							onChangeText={Exp_month => {
								this.setState({ 'card[exp_month]': Exp_month });
							}}
						/>
						<TextInput style={styles.inputExp_year}
							placeholder='Exp_year'
							onChangeText={Exp_year => {
								this.setState({ 'card[exp_year]': Exp_year });
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
							placeholder="Money Amount '$'"
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
							<Text style={styles.text}>Submit Payment</Text>
						</TouchableHighlight>

					</View>
				</View>
			)
		}
	}
}

const styles = {
	container: {
		flexDirection: "column",
		alignItems: 'stretch',
		justifyContent: 'space-between',
		marginTop: 150,
	},
	card: {
		margin: 40,
		marginBottom: 0,
		padding: 90,
		borderRadius: 20,
		borderColor: "#738E9B",
		borderWidth: 3,
		backgroundColor: 'white',
	},
	inCard: {
		margin: -85,
		padding: 90,
		borderRadius: 20,
		borderColor: "#738E9B",
		borderWidth: 1,
		backgroundColor: 'white',
	},
	logo: {
		marginLeft: -70,
		marginTop: -70,
		height: 27,
		width: 45,
		alignItems: 'center',
		borderRadius: 1,
		borderColor: "#738E9B",
		borderWidth: 1,
		backgroundColor: 'white',
	},
	cardNumber: {
		height: 10,
		//width: 10,
		borderRadius: 10,
		borderColor: "#738E9B",
		//marginLeft: 70,
		marginBottom: -70,
		marginTop: 40,
		marginLeft: -50,
		backgroundColor: 'white',
	},
	cardExpiration: {
		height: 10,
		width: 90,
		borderRadius: 10,
		borderColor: "#738E9B",
		//marginLeft: 70,
		marginBottom: -70,
		marginTop: 100,
		marginLeft: 130,
		backgroundColor: 'white',
	},
	textNumber: {
		fontSize: 20
	},
	textExpiration: {
		fontSize: 18
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
		borderColor: 'black',
		//borderWidth: 1,
		backgroundColor: '#002C43',
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
		position: "relative",
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
		flex: 1,
		marginTop: 20,
		borderBottomColor: "black",
		backgroundColor: "#FFFFFF",
		margin: 5,
		alignItems: "center",
		borderWidth: 1
	},
	inputExp_month: {
		flex: 3,
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
		borderWidth: 1,
		marginLeft: 1,
	},
	inputCvc: {
		flex: 3,
		borderBottomColor: "black",
		backgroundColor: "#FFFFFF",
		width: 50,
		height: 35,
		alignItems: "center",
		borderWidth: 1,
		marginLeft: 1,
	},
	avatar: {
		width: 400,
		height: 200,
		//borderRadius: 63,
		borderWidth: 4,
		borderColor: "white",
		alignSelf: "center",
		position: "relative",
		marginTop: 10
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
};