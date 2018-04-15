/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { MainApp } from './Lib/MainActivity.js';

export default MainEntry = () => {
    AppRegistry.registerComponent('NYUSHer', () => MainApp);
};
