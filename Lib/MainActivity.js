import React, { Component } from 'react';
import { Button, Platform, ScrollView, StatusBar, View, Text } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { TabNavigator, StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dashboard } from "./Dashboard.js";
import { Moment } from "./Moment.js";
import { Forum } from "./Forum.js";
import { globalStyle, GlobalFont, GlobalColor, GlobalFuncs, fontSizeScaler, LightButton } from "./SubComponents.js";
import { Login } from "./InnerPage/Login.js";
import { Me, CurrentState } from "./Util.js";

import PopupDialog, { SlideAnimation, ScaleAnimation, DialogTitle, DialogButton } from 'react-native-popup-dialog';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

const scaleAnimation = new ScaleAnimation();

var that = null;

let tabBarOption = {
    showIcon: true,
    labelStyle: {
        fontSize: 14 * fontSizeScaler,
        fontFamily: GlobalFont,
        color: '#888',
        marginBottom: 5,
    },
    style: {
        height: 60,
        backgroundColor: "#FFF",
    }
}

if (Platform.OS !== "ios") {
    tabBarOption.inactiveTintColor = '#000';
    tabBarOption.activeTintColor = '#999';
    tabBarOption.labelStyle.color = "#000";
}

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
    tabBarPosition: 'bottom',
    showIcon: true,
    swipeEnabled: true,
    backBehavior: 'Main',
    tabBarOptions: tabBarOption,
});

export class MainAppEntryWrapper extends Component {
    componentWillMount() {
        let { navigate } = this.props.navigation;
        GlobalFuncs.globalPopups = navigate;
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
            gesturesEnabled: false,
        },
        cardStyle: {
            backgroundColor: "#FFF",
        },
    }
);

export class MainApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: "green",
            text: "",
            buttons: ["OK", "CANCEL"],
        }
    }

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
        GlobalFuncs.globalAlert = { navAlert: this.navAlert, cancelNavAlert: this.cancelNavAlert };
    }

    componentDidMount() {
        GlobalFuncs.globalDialog = { 
            show: this._showDialog,
            dismiss: this._dismissDialog,
        };
    }

    _dismissDialog() {
        that.buttoncb = {};
        that.popupDialog.dismiss();
    }

    _showDialog(text="", buttoncb={"OK":()=>{}, "CANCEL":()=>{}}, color="green") {
        that.buttoncb = buttoncb;
        let vs = [];
        for (let v in that.buttoncb) {
            vs.push(v);
        }
        that.setState({
            text: text,
            color: color,
            buttons: vs,
        });
        that.popupDialog.show();
    }

    _onDismissed() {
        that.onpress(0);
    }

    onpress(which) {
        if (that.buttoncb[that.state.buttons[which]]) that.buttoncb[that.state.buttons[which]]();
        that._dismissDialog();
    }

    render() {
        return (
        <View style={{flex: 1}}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
            }}>
                <PopupDialog
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                    width={0.8}
                    height={0.3}
                    dialogTitle={<DialogTitle title="NYUSHer" />}
                    dialogAnimation={scaleAnimation}
                    onDismissed={() => {this._onDismissed();}}
                    containerStyle={{
                        zIndex: 101,
                        
                    }}
                >
                    <View style={{ marginHorizontal: 15, marginVertical:30, flex: 1 }}>
                        <Text style={{color: "#333", lineHeight: 20}}>{this.state.text}</Text>
                    </View>
                    <View style={{flexDirection: "row-reverse", height: 50, marginHorizontal: 20}}>
                        <LightButton onpress={() => this.onpress(0)} color={this.state.color}>{this.state.buttons[0]}</LightButton>
                        <LightButton onpress={() => this.onpress(1)}>{this.state.buttons[1]}</LightButton>
                    </View>
                </PopupDialog>
            </View>
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