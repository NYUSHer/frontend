import React, { Component } from 'react';
import { Button, Platform, ScrollView, StatusBar, View, Text } from 'react-native';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dashboard } from "./Dashboard.js";
import { Moment } from "./Moment.js";
import { Forum } from "./Forum.js";
import { globalStyle } from "./SubComponents.js";

export const MainApp = TabNavigator({
    Dashboard: {
        screen: Dashboard
    },
    Main: {
        screen: Forum
    },
    Moment: {
        screen: Moment
    }
},{
    initialRouteName: 'Main',
    animationEnabled: true,
    swipeEnabled: true,
    backBehavior: 'Main',
    tabBarOptions: {
        activeTintColor: Platform.OS === 'ios' ? '#FF5964' : '#FFF',
        labelStyle: {
            fontSize: 14,
            fontFamily: "QuickSand",
            marginBottom: 5,
        },
        style: {
            height: 0,
            backgroundColor: "#FFF",
        }
    },
});