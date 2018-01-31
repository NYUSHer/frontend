import React, { Component } from 'react';
import { Button, Platform, ScrollView, StatusBar, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame } from "./SubComponents.js";

export class Dashboard extends Component {
    static navigationOptions = {
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
              name={focused ? 'ios-barcode' : 'ios-barcode-outline'}
              size={26}
              style={{ color: tintColor }}
            />
        ),
      };
    render() {
        const {
            navigate
        } = this.props.navigation;
        return ( 
            <SubFrame>
                <Title value="Dashboard"></Title>
            </SubFrame>
        );
    }
}

