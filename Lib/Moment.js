import React, { Component } from 'react';
import { Button, Platform, ScrollView, StatusBar, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, fontSizeScaler } from "./SubComponents.js";

export class Moment extends Component {
    static navigationOptions = {
        tabBarLabel: 'Moment',
        tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
              name={focused ? 'ios-ionic' : 'ios-ionic-outline'}
              size={26 * fontSizeScaler}
              style={{ color: tintColor }}
            />
        ),
    };
    render() {
        const {
            goBack
        } = this.props.navigation;
        return ( 
            <SubFrame>
                <Title value="Moment"></Title>
            </SubFrame>
        );
    }
}