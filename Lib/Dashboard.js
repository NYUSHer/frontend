import React, { Component } from 'react';
import { Button, Platform, ScrollView, StatusBar, View, Text, TextInput, Image, TouchableHighlight } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, UserAvatar, GlobalFont, GlobalFuncs, globalStyle } from "./SubComponents.js";
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
        if (GlobalFuncs.globalPopups) {
            GlobalFuncs.globalPopups("Login");
        }
    }

    _onchange(text) {
        this.setState({text: text});
    }

    _oninputend() {
        console.log(this.state.text);
        if (this._input)
            this._input.focus();
    }

    componentWillMount() {
        dthat = this;
        GlobalFuncs.globalDashboardUF = this._changeInfo;
    }

    render() {
        return (
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
                        ref={(c) => this._input = c}
                        autoCapitalize = {"none"}
                        style={{marginTop: 8, fontSize: 18, fontFamily: GlobalFont}}
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
        )
    }
}

export class Dashboard extends Component {
    static navigationOptions = {
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
              name={focused ? 'ios-browsers' : 'ios-browsers-outline'}
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
            <View style={{
                flexWrap:'nowrap',
                justifyContent:'center',
                alignItems:'stretch',
                flex:1,
            }}>
                <SubFrame style={{alignSelf: 'stretch', flex: 1,}}>
                    <Title value="Dashboard"></Title>
                </SubFrame>
                <UserFrame/>
            </View>
        );
    }
}

