import React, { Component } from 'react';
import { Button, Platform, ScrollView, StatusBar, View, Text } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { TabNavigator, StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dashboard } from "./Dashboard.js";
import { Moment } from "./Moment.js";
import { Forum } from "./Forum.js";
import { globalStyle, GlobalFont, GlobalColor, GlobalFuncs } from "./SubComponents.js";
import { Login } from "./InnerPage/Login.js";
import { Me, CurrentState } from "./Util.js";

var that = null;

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
    // tabBarPosition: 'bottom',
    showIcon: true,
    swipeEnabled: true,
    backBehavior: 'Main',
    tabBarOptions: {
        activeTintColor: Platform.OS === 'ios' ? '#FF5964' : '#FFF',
        labelStyle: {
            fontSize: 14,
            fontFamily: GlobalFont,
            // color: '#888',
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

export const MainAppWithoutInfo = StackNavigator(
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

export class MainApp extends Component {
    navAlert(type, title, text) {
        if (that) that.dropdown.alertWithType(type, title, text);
    }

    cancelNavAlert() {
        if (that) that.dropdown.close();
    }

    handleClose(data) {

    }

    componentWillMount() {
        that = this;
        GlobalFuncs.globalAlert = { navAlert: this.navAlert, cancelNavAlert: this.cancelNavAlert }
    }

    render() {
        return (
        <View style={{flex: 1}}>
            <MainAppWithoutInfo />
            <DropdownAlert
                ref={ref => this.dropdown = ref}
                containerStyle={{
                    backgroundColor: GlobalColor.blue,
                }}
                showCancel={false}
                onClose={data => this.handleClose(data)}
            />
        </View>);
    }
}