import React, { Component } from 'react';
import { TouchableOpacity, Platform, ScrollView, StatusBar, View, Text, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, ExInput, ExInputText, ExHint, ExButton, Br } from "../SubComponents.js";
import { Me, CurrentState, getMe, login } from "../Util.js";

const EMAIL_LOGIN_HINT = "You Can Leave PassCode Empty to Do an Email Login.";
const PASS_LOGIN_HINT  = "You Are Now Using PassCode to Login The Service.";

export class Login extends Component {
    _onchange(id, text, e) {
        if (id == "passwd") {
            this.setState({
                hintText: text.length <= 0 ? EMAIL_LOGIN_HINT : PASS_LOGIN_HINT,
                hintColor: text.length <= 0 ? "" : "#44FF44",
            });
        } else if (id == "email") {
            this.setState({email: text});
        } else if (id == "passwd") {
            this.setState({passwd: text});
        }
    }

    _onpress(id) {
        if (id == "login") {
            login({
                email: this.state.email,
                passwd: this.state.passwd,
            }, (state, data) => {
                if (state == true || state == false) {
                    this.props.navigation.goBack();
                } else if (data.errorCode == 102) {
                    this.setState({btn: CurrentState == -1 ? false : true});
                } else {
                    Alert.alert("Error", data.errorMsg);
                }
                this.setState({btn: CurrentState == -1 ? false : true});
            }, this.state.passwd.length <= 0);
        }
    }

    constructor() {
        super();
        this.state = {
            showHint: true,
            hintText: EMAIL_LOGIN_HINT,
            hintColor: "",
            email: "",
            passwd: "",
            btn: CurrentState == -1 ? false : true,
        }
        Me.uid=1;
        Me.token="123123123123";
        getMe((state, data) => {
            // Alert.alert("Error", data.errorMsg);
            this.setState({btn: CurrentState == -1 ? false : true});
        });
    }

    render() {
        const {
            goBack, state
        } = this.props.navigation;
        return (
            <SubFrame>
                {/* <View style={{flexDirection: "row"}}>
                    <TouchableOpacity
                        onPress={() => { goBack(); }}
                        style={{
                            margin: 30,
                            marginBottom: 20,
                            marginRight: -20,
                            paddingHorizontal: 10
                        }}
                    >
                        <Ionicons
                            name='ios-arrow-back'
                            size={40}
                            style={{ color: "#35A7FF" }}
                        />
                    </TouchableOpacity>
                    <Title value="Login"></Title>
                </View> */}
                <Title value="Login" style={{textAlign: "center"}}></Title>
                <Br h={50}/>
                <ExInputText>Your E-mail:</ExInputText>
                <ExInput id="email" name="Email Address" type="email-address" onchange={(a,b,c) => {this._onchange(a,b,c);}} value={this.state.email}/>
                <Br h={30}/>
                <ExInputText style={{marginTop: 20}}>Your PassCode:</ExInputText>
                <ExInput id="passwd" name="Password" type="passwd" onchange={(a,b,c) => {this._onchange(a,b,c);}} value={this.state.passwd}/>
                <ExHint show={this.state.showHint} text={this.state.hintText} color={this.state.hintColor}/>
                <Br h={50}/>
                <ExButton id="login" disabled={!this.state.btn} onpress={(id) => {this._onpress(id);}}>{this.state.btn ? "Login" : "Verifying ..."}</ExButton>
            </SubFrame>
        );
    }
}