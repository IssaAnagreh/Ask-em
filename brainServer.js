var express = require('express');
const fs = require('fs');
const brain = require('brain.js');
//var data = require('./server/data.json')
var db = require('./database/index')
const bodyParser = require("body-parser");
var data;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// nueral network declaration

var userID;
var surveyID;

// save answers from specific surveys into json file
app.post("/answers/smart/create", (req, res) => {
	console.log("search brainServer", req.body.surveyID);
	surveyID = req.body.surveyID;
	db.selectAllSmartAnsOfASurvey(surveyID, async (err, result) => {
		if (result) {
			var array = []
			var input = ''
			for (var i = 0; i < result.length; i++) {
				input += result[i].smartanswer;
			}
			var req = { body: { input: input, surveyID: 7 } };
			var Think = await think(req, res)
		} else {
			res.status(404).send("Invalid surveyID");
		}
	})
});


var think = function (req, res) {
	var surveyID = req.body['surveyID'];
	const trainingData = require(`./smartData/surveyID${surveyID}_Dummy.json`)

	let trainedNet;
	let maxLengthInput = -1;
	var longest;

	longest = trainingData.reduce((a, b) => a.input.length > b.input.length ? a : b).input.length;
	for (let i = 0; i < trainingData.length; i++) {
		trainingData[i].input = adjustSize(trainingData[i].input);
	}

	function adjustSize(string) {
		while (string.length < longest) {
			string += ' ';
		}
		return string;
	}

	function fixLengths(data) {
		var before = data
		for (let i = 0; i < data.length; i++) {
			if (data.length > maxLengthInput) {
				maxLengthInput = data.length;
			}
		}

		for (let i = 0; i < data.length; i++) {
			while (data.length < maxLengthInput) {
				data = data + 0;
			}
		}
		if (data !== before) {
		}
		return Number(data);
	}

	function encode(arg) {
		var encoded = arg.split('').map(x => {
			var item = x.charCodeAt(0) / 255;
			return fixLengths(String(item))
		});
		return encoded;
	}

	function processTrainingData(data) {
		return data.map(d => {
			return {
				input: encode(d.input),
				output: d.output
			}
		})
	}

	function train(data) {
		let net = new brain.NeuralNetwork();
		net.train(processTrainingData(data), {
			iterations: 20000,
			errorThresh: 0.05,
			log: true
		});
		trainedNet = net.toFunction();
		console.log('Finished training...');
	};

	function execute(input) {
		let results = trainedNet(encode(input));
		let output;
		console.log("results", results)
		if (!results.no) {
			console.log('==============convert============')

			for (var i = 0; i < trainingData.length; i++) {
				trainingData[i].output = Object.keys(trainingData[i].output)[0]
			}
			console.log(trainingData)
			let trainedNet;

			function train(data) {
				let net = new brain.recurrent.LSTM();
				net.train(data, {
					iterations: 1000,
					log: true
				});
				trainedNet = net.toFunction();
				console.log('Finished training...');
			};

			function execute(input) {
				let results = trainedNet(input);
				res.status(200).send(results)
				console.log('Finished thinking...');
				return results;
			}

			train(trainingData);
			var input = adjustSize(req.body.input);
			var smartAnswer = execute(input)
			console.log('smartAnswer', smartAnswer);


		} else {
			results.no > results.yes ? output = 'no' : output = 'yes';
			console.log(results)
			res.status(200).send(results)
			return output;
		}
	}

	train(trainingData);
	var input = Object.values(req.body.input).join('');
	var smartAnswer = execute(adjustSize(input))
	console.log('smartAnswer', smartAnswer)

	try { // if dummy data is not existing
		// bring all the thinking data
		var array = require(`./smartData/surveyID${surveyID}_Dummy.json`)

		if (smartAnswer == "yes" || smartAnswer === "no") {
			array.push({
				input: adjustSize(input),
				output: { [smartAnswer]: 1 }
			});
			var data = array;
			fs.writeFileSync(`./smartData/surveyID${surveyID}_Dummy.json`, JSON.stringify(array, null, '  '));
			console.log('run answer =============', smartAnswer)
		}

	} catch { // if no dummy file
		console.log('NO DUMMY DATA')
	}
};


app.post("/smart/answer/think", think)





/*
async (req, res) => {
	var surveyID = req.body['surveyID'];
	const trainingData = require(`./smartData/surveyID${surveyID}_Dummy.json`)

	let trainedNet;
	let maxLengthInput = -1;
	var longest;

	longest = trainingData.reduce((a, b) => a.input.length > b.input.length ? a : b).input.length;
	for (let i = 0; i < trainingData.length; i++) {
		trainingData[i].input = adjustSize(trainingData[i].input);
	}

	function adjustSize(string) {
		while (string.length < longest) {
			string += ' ';
		}
		return string;
	}

	function fixLengths(data) {
		var before = data
		for (let i = 0; i < data.length; i++) {
			if (data.length > maxLengthInput) {
				maxLengthInput = data.length;
			}
		}

		for (let i = 0; i < data.length; i++) {
			while (data.length < maxLengthInput) {
				data = data + 0;
			}
		}
		if (data !== before) {
		}
		return Number(data);
	}

	function encode(arg) {
		var encoded = arg.split('').map(x => {
			var item = x.charCodeAt(0) / 255;
			return fixLengths(String(item))
		});
		return encoded;
	}

	function processTrainingData(data) {
		return data.map(d => {
			return {
				input: encode(d.input),
				output: d.output
			}
		})
	}

	function train(data) {
		let net = new brain.NeuralNetwork();
		net.train(processTrainingData(data), {
			iterations: 20000,
			errorThresh: 0.05,
			log: true
		});
		trainedNet = net.toFunction();
		console.log('Finished training...');
	};

	function execute(input) {
		let results = trainedNet(encode(input));
		let output;
		console.log("results", results)
		if (!results.no) {
			console.log('==============convert============')

			for (var i = 0; i < trainingData.length; i++) {
				trainingData[i].output = Object.keys(trainingData[i].output)[0]
			}
			console.log(trainingData)
			let trainedNet;

			function train(data) {
				let net = new brain.recurrent.LSTM();
				net.train(data, {
					iterations: 1000,
					log: true
				});
				trainedNet = net.toFunction();
				console.log('Finished training...');
			};

			function execute(input) {
				let results = trainedNet(input);
				res.status(200).send(results)
				console.log('Finished thinking...');
				return results;
			}

			train(trainingData);
			var input = adjustSize(req.body.input);
			var smartAnswer = execute(input)
			console.log('smartAnswer', smartAnswer);


		} else {
			results.no > results.yes ? output = 'no' : output = 'yes';
			console.log(results)
			res.status(200).send(results)
			return output;
		}
	}

	train(trainingData);
	var input = Object.values(req.body.input).join('');
	var smartAnswer = execute(adjustSize(input))
	console.log('smartAnswer', smartAnswer)

	try { // if dummy data is not existing
		// bring all the thinking data
		var array = require(`./smartData/surveyID${surveyID}_Dummy.json`)

		if (smartAnswer == "yes" || smartAnswer === "no") {
			array.push({
				input: adjustSize(input),
				output: { [smartAnswer]: 1 }
			});
			var data = array;
			fs.writeFileSync(`./smartData/surveyID${surveyID}_Dummy.json`, JSON.stringify(array, null, '  '));
			console.log('run answer =============', smartAnswer)
		}

	} catch { // if no dummy file
		console.log('NO DUMMY DATA')
	}
});
*/




app.post("/smart/answer/final", async (req, res) => {
	console.log('body', req.body)
	var surveyID = req.body['surveyID'];
	const trainingData = require(`./smartData/surveyID${surveyID}_Dummy.json`)

	let trainedNet;
	let maxLengthInput = -1;
	var longest;

	longest = trainingData.reduce((a, b) => a.input.length > b.input.length ? a : b).input.length;
	for (let i = 0; i < trainingData.length; i++) {
		trainingData[i].input = adjustSize(trainingData[i].input);
	}

	function adjustSize(string) {
		while (string.length < longest) {
			string += ' ';
		}
		return string;
	}

	function fixLengths(data) {
		var before = data
		for (let i = 0; i < data.length; i++) {
			if (data.length > maxLengthInput) {
				maxLengthInput = data.length;
			}
		}

		for (let i = 0; i < data.length; i++) {
			while (data.length < maxLengthInput) {
				data = data + 0;
			}
		}
		if (data !== before) {
		}
		return Number(data);
	}

	function encode(arg) {
		var encoded = arg.split('').map(x => {
			var item = x.charCodeAt(0) / 255;
			return fixLengths(String(item))
		});
		return encoded;
	}

	function processTrainingData(data) {
		return data.map(d => {
			return {
				input: encode(d.input),
				output: d.output
			}
		})
	}

	function train(data) {
		let net = new brain.NeuralNetwork();
		net.train(processTrainingData(data), {
			iterations: 1000,
			errorThresh: 0.1,
			log: true
		});
		trainedNet = net.toFunction();
		console.log('Finished training...');
	};

	function execute(input) {
		let results = trainedNet(encode(input));
		let output;
		if (!results.no) {

			for (var i = 0; i < trainingData.length; i++) {
				trainingData[i].output = Object.keys(trainingData[i].output)[0]
			}
			console.log(trainingData)
			let trainedNet;

			function train(data) {
				let net = new brain.recurrent.LSTM();
				net.train(data, {
					iterations: 1000,
					errorThresh: 0.05,
					log: true
				});
				trainedNet = net.toFunction();
				console.log('Finished training...');
			};

			function execute(input) {
				let results = trainedNet(input);
				return results;
			}

			train(trainingData);
			var input = adjustSize(req.body.input.join(' ').toLowerCase());
			var smartAnswer = execute(input)
			smartAnswer.yes < 0.50 ? output = 'No' : output = 'Yes';
			console.log('text', smartAnswer)
			db.addAnswerOfAResult(surveyID, output, (err, result) => {
				if (result) {
					console.log('done!')
				} else {
					console.log('err fillAnswerOfAResult in brainServer',err);
				}
			})
			res.status(200).send(output)
			return output;

		} else {
			results.yes < 0.50 ? output = 'No' : output = 'Yes';
			console.log('numbers', results)
			db.addAnswerOfAResult(`${surveyID}`,`${output}`, (err, result) => {
				if (result) {
					console.log('done!')
				} else {
					console.log('err fillAnswerOfAResult in brainServer',err);
				}
			})
			res.status(200).send([output, results])
			return output;
		}
	}

	train(trainingData);
	var input = Object.values(req.body.input).join(' ');
	var smartAnswer = execute(adjustSize(input.toLowerCase()))
	console.log('smartAnswer', smartAnswer)

});




























// get the smart value
app.post("/answer/smart/get", async (req, res) => {
	surveyID = req.body.surveyID;

	data = require(`./smartData/surveyID${surveyID}_Answers.json`)
	// make up data for training
	var trainingData = data.map(item => (
		{
			input: Object.values(item).slice(1),
			output: item['0']
		}
	))

	// train data with some options
	network.train(trainingData, {
		iterations: 2000, // if you increase time of brain will increase, and accuracy will increase
		//errorThresh: 0.005,   // the acceptable error percentage from training data --> number between 0 and 1
		activation: 'relu' // to read bigger numbers than 1
	});

	// make up new data input	where req.body.input is an object, 
	// key is questionID and value is smartAnswer	
	var input = req.body.input;
	// editedInput is an array of only input values
	var editedInput = Object.values(input);

	// THINK
	const smartAnswer = await network.run(editedInput)
	res.status(200).send(smartAnswer)
});


app.listen(4000, function () {
	console.log('listening on port 4000!');
});

// fs.writeFileSync('./net.json', JSON.stringify(network.toJSON(), null, '  '));
// const textOutput = network.fromJSON(JSON.parse(fs.readFileSync('./net.json', 'utf8')));