/** @format */
import React from 'react';
import { AppRegistry } from "react-native";
import { Provider } from 'react-redux';
import App from "./App";
import configureStore from './store/configureStore'
import { name as appName } from "./app.json";
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');

const store = configureStore();

const RNRedux = () => (
    <Provider store={store}>
        <App />
    </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);
