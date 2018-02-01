import React, { Component } from 'react';
import { Button, Platform, ScrollView, StatusBar, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame } from "../SubComponents.js";

export class Login extends Component {
    render() {
        const {
            goBack, state
        } = this.props.navigation;
        return (
            <SubFrame>
                <Title value={state.params.user.id}></Title>
            </SubFrame>
        );
    }
}