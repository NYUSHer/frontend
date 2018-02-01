import React, { Component } from 'react';
import { Button, Platform, ScrollView, StatusBar, View, Text } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dashboard } from "./Dashboard.js";
import { Moment } from "./Moment.js";
import { Forum } from "./Forum.js";
import { globalStyle, GlobalFont } from "./SubComponents.js";
import { Login } from "./InnerPage/Login.js";
import { Me, CurrentState } from "./Util.js";

export const MainAppEntry = TabNavigator({
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
            fontFamily: GlobalFont,
            marginBottom: 5,
        },
        style: {
            height: 60,
            backgroundColor: "#FFF",
        }
    },
});

export class MainAppEntryWrapper extends Component {
    componentWillMount() {
        let { navigate } = this.props.navigation;
        if ( CurrentState != 1) {
            navigate("Login");
        }
    }
    
    render() {
        return (<MainAppEntry />);
    }
}

export const MainApp = StackNavigator(
    {
        MainScreen: {
            screen: MainAppEntryWrapper,
        },
        Login: {
            screen: Login,
            path: 'login',
        },
    },
    {
        initialRouteName: 'MainScreen',
        headerMode: 'none',
        mode: 'modal',
        navigationOptions: {
            // gesturesEnabled: false,
        },
        cardStyle: {
            backgroundColor: "#FFF",
        },
    }
);