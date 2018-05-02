import React, { Component } from 'react';
import { Easing, Animated, WebView, Button, Platform, ScrollView, StatusBar, View, Text, TextInput, Image, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, UserAvatar, GlobalFont, GlobalFuncs, globalStyle, fontSizeScaler } from "./SubComponents.js";
import { Me } from "./Util.js";

var dthat = null;

export class UserFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: Me.avatar,
            username: Me.username,
            text: Me.username,
        };
    }

    _changeInfo() {
        dthat.setState({
            avatar: Me.avatar,
            username: Me.username,
            text: Me.username || "Anonymous"
        });
    }

    _logout() {
        Me.clear();
        if (GlobalFuncs.globalAlert) {
            GlobalFuncs.globalAlert.navAlert("success", "LogOut", `Logout Complete, Hope to see you again.`);
        }
        if (GlobalFuncs.globalPopups) {
            GlobalFuncs.globalPopups("Login");
        }
    }

    _onchange(text) {
        this.setState({text: text});
    }

    _oninputend() {
        if (this._input)
            this._input.focus();
        if (this.state.text != Me.username) {
            Me.username = this.state.text;
            Me.setInfo((state, data) => {
                this._changeInfo();
            });
        }
    }

    componentWillMount() {
        dthat = this;
        GlobalFuncs.globalDashboardUF = this._changeInfo;
    }

    render() {
        return (
            <KeyboardAvoidingView behavior='padding'>
                <View style={{
                    alignSelf: 'stretch',
                    height: 55,
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    marginHorizontal: 15,
                    marginRight: 30
                }}>
                    <UserAvatar uri={Me.avatar || Me.username}/>
                    <View style={{marginLeft: 15, flex: 1}}>
                        <TextInput 
                            allowFontScaling={false}
                            ref={(c) => this._input = c}
                            autoCapitalize = {"none"}
                            style={{marginTop: 8, fontSize: 18 * fontSizeScaler, fontFamily: GlobalFont}}
                            numberOfLines={1}
                            placeholder={"Your Name"}
                            autoCorrect={false}
                            keyboardType={"email-address"}
                            multiline={false}
                            onChangeText={(e) => {this._onchange(e)}}
                            onEndEditing={() => {this._oninputend()}}
                            value={this.state.text}
                        />
                    </View>
                    <TouchableHighlight underlayColor="rgba(255, 100, 0, 0.7)" style={globalStyle.pill} onPress={() => {this._logout();}}><Text style={{color: "#FFFFFF"}}>LogOut</Text></TouchableHighlight>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const webViewContainerStyle = {
    width: "84%",
    height: 0,
    shadowColor: "black",
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 25,
    shadowOpacity: .2,
    marginTop: 20,
    borderRadius: 5,
    // overflow: "hidden",
    marginLeft: "8%",
}

const webViewStyle = {
    width: "100%",
    height: "100%",
    borderRadius: 5,
}

export class MyWeb extends Component {

    state = {
        animatedHeight: new Animated.Value(0),
        show: false,
    }

    onNavigationStateChange(navState) {
        if (navState.url != this.props.uri) {
            this.startAnimation(400);
            this.setState({show: true});
        } else {
            this.startAnimation();
            this.setState({show: false});
        }
        
    }

    startAnimation(value=null) {
        value = value ? value : this.props.defaultHeight;
        Animated.timing(this.state.animatedHeight, {
            toValue: value,
            duration: 300,
            easing: Easing.linear,
        }).start();
    }

    render() {return (
        <Animated.View style={[webViewContainerStyle, {height: this.state.animatedHeight}]}>
            <WebView source={{uri: this.props.uri}} 
                    style={webViewStyle}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}/>
        </Animated.View>
    )}

}

export class Dashboard extends Component {

    static navigationOptions = {
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
              name={focused ? 'ios-browsers' : 'ios-browsers-outline'}
              size={26 * fontSizeScaler}
              style={{ color: tintColor }}
            />
        ),
    };
    
    render() {
        const {
            navigate
        } = this.props.navigation;
        return (
            <View style={{
                flexWrap:'nowrap',
                justifyContent:'center',
                alignItems:'stretch',
                flex:1,
            }}>
                <SubFrame style={{alignSelf: 'stretch', flex: 1,}}>
                    <Title value="Dashboard"></Title>
                    <MyWeb uri="https://nyu.nekoyu.cc:6681/widgets/sp/#1"  defaultHeight={120}/>
                    <MyWeb uri="https://nyu.nekoyu.cc:6681/widgets/bus/#1" defaultHeight={160}/>
                </SubFrame>
                <UserFrame style={{background: "#FFF"}}/>
            </View>
        );
    }
}

