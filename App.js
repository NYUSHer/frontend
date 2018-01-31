/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { MainApp } from './Lib/MainActivity.js';
import { Font } from 'expo';

export default class App extends Component {
    state = {
        fontLoaded: false,
    };

    async componentDidMount() {
        await Font.loadAsync({
            'QuickSand': require('./assets/fonts/Quicksand-Bold.ttf'),
            'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
        });
        this.setState({ fontLoaded: true });
    }

    render() {
        return this.state.fontLoaded ? (<MainApp />) : null;
    }
};