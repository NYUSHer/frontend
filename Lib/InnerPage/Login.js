import React, { Component } from 'react';
import { TouchableOpacity, Platform, ScrollView, StatusBar, View, Text, Alert, KeyboardAvoidingView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, ExInput, ExInputText, ExHint, ExButton, Br, GlobalFuncs } from "../SubComponents.js";
import { Me, CurrentState, getMe, loginOrRegister, checkEmail, EmailOfflineValidationCheck, PasswdOfflineValidationCheck, getMeInfoFromStorage } from "../Util.js";
// import { setInterval } from 'timers';

const EMAIL_LOGIN_HINT = "You Can Leave PassCode Empty to Do an Email Login.";
const PASS_LOGIN_HINT  = "You Are Now Using PassCode to Login The Service.";
var checkingThread = null;

export class Login extends Component {

    _beforeGoBack() {
        console.log("Activating Login Trigger for " + Object.keys(GlobalFuncs.globalLoginTrigger).length + ".");
        for (var fn in GlobalFuncs.globalLoginTrigger) {
            GlobalFuncs.globalLoginTrigger[fn]();
        }
    }

    _checkStateOfVerify(successCb=()=>{}, failCb=()=>{}) {
        Me.fetchInfo((state, data) => {
            if (state) {
                if (checkingThread != null) {
                    clearInterval(checkingThread);
                    checkingThread = null;
                }
                successCb(state, data);
            } else {
                console.log(data);
                if (data.errorCode != "102") {
                    if (checkingThread != null) {
                        clearInterval(checkingThread);
                        checkingThread = null;
                    }
                    if (data.errorCode != null)
                        failCb(state, data);
                }
            }
        });
    }

    _startVerify() {
        let itvlThis = this;
        if (checkingThread != null) {
            clearInterval(checkingThread);
            checkingThread = null;
        }
        checkingThread = setInterval(() => {
            itvlThis._checkStateOfVerify((state, data) => {
                GlobalFuncs.globalAlert.navAlert("success", "Welcome", `Welcome Back! ${Me.username}.`);
                setTimeout(() => {itvlThis._beforeGoBack(); itvlThis.props.navigation.goBack()}, 500);
            }, (state, data) => {
                GlobalFuncs.globalAlert.navAlert("error", `Error ${data.errorCode}`, data.errorMsg);
                itvlThis.setState({btn: CurrentState == -1 ? false : true});
            });
        }, 1000);
    }

    _onchange(id, text, e) {
        if (id == "passwd") {
            this.setState({passwd: text});
            this.setState({
                hintText: text.length <= 0 ? EMAIL_LOGIN_HINT : PASS_LOGIN_HINT,
                hintColor: text.length <= 0 ? "" : "#44FF44",
            });
        } else if (id == "email") {
            this.setState({
                btn: true,
            });
            this.setState({
                email: text,
            });
            checkEmail(text, (state, data) => {
                if (state) {
                    this.setState({btnword: "Login", func: 1});
                } else {
                    this.setState({btnword: "Register", func: 2});
                }
            });
        }
    }

    _onpress(id) {
        if (id == "login") {
            if (!EmailOfflineValidationCheck(this.state.email)) {
                GlobalFuncs.globalAlert.navAlert("error", "Error", `Invalid Email! Please Check.`);
                return;
            } 
            if (!PasswdOfflineValidationCheck(this.state.passwd)) {
                GlobalFuncs.globalAlert.navAlert("error", "Error", `Invalid Password! Please Check.`);
                return;
            }
            
            loginOrRegister({
                email: this.state.email,
                passwd: this.state.passwd,
            }, (state, data) => {
                if (state == true) {
                    GlobalFuncs.globalAlert.navAlert("success", "Welcome", `Welcome Back! ${Me.username}.`);
                    setTimeout(() => {
                        if (GlobalFuncs.globalDashboardUF != null) {
                            GlobalFuncs.globalDashboardUF();
                        }
                        this._beforeGoBack();
                        this.props.navigation.goBack();
                    }, 500);
                } else if (data.errorCode == 102) {
                    GlobalFuncs.globalAlert.navAlert("warn", "Verifying ...", `Please go and check your mailbox.`);
                    this._startVerify();
                } else {
                    GlobalFuncs.globalAlert.navAlert("error", `Error ${data.errorCode}`, data.errorMsg);
                    this.setState({
                        btnword: this.state.func == 2 ? "Register" : "Login",
                        brn: true,
                    });
                }
                this.setState({btn: CurrentState == -1 ? false : true});
            }, this.state.passwd.length <= 0, this.state.func == 1 ? "login" : "register");
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
            btnword: "Login / Register",
            func: 2,
        }
        
        getMeInfoFromStorage(() => {
            if (Me.email != "") {
                this.setState({
                    email: Me.email,
                    func: 1,
                    btnword: "Login",
                });
                this._email._changeValue(Me.email);
            }
            if (Me.userid != "" && Me.token != "") {
                console.log("Verify Last Login.");
                getMe((state, data) => {
                    this.setState({btn: CurrentState == -1 ? false : true});
                    if (CurrentState == 1) {
                        GlobalFuncs.globalAlert.navAlert("success", "Welcome", `Welcome Back! ${Me.username}.`);
                        setTimeout(() => {this._beforeGoBack(); this.props.navigation.goBack()}, 500);
                    } else if(CurrentState == -1) {
                        GlobalFuncs.globalAlert.navAlert("warn", "Verifying ...", `Please go and check your mailbox.`);
                        this._startVerify();
                    } else {
                        GlobalFuncs.globalAlert.navAlert("error", "Warning", `Last session ends, please login again.`);
                    }
                });
            }
        });
    }

    render() {
        const {
            goBack, state
        } = this.props.navigation;
        return (
            <SubFrame>
                <KeyboardAvoidingView behavior='padding'>
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
                    <ExInput ref={(c) => this._email = c} id="email" name="Email Address" type="email-address" onchange={(a,b,c) => {this._onchange(a,b,c);}} value={this.state.email}/>
                    <Br h={30}/>
                    <ExInputText style={{marginTop: 20}}>Your PassCode:</ExInputText>
                    <ExInput id="passwd" name="Password" type="passwd" onchange={(a,b,c) => {this._onchange(a,b,c);}} value={this.state.passwd}/>
                    <ExHint show={this.state.showHint} text={this.state.hintText} color={this.state.hintColor}/>
                    <Br h={50}/>
                    <ExButton id="login" color={this.state.func == 1 ? "#8F8" : "#FC4"} disabled={!this.state.btn} onpress={(id) => {this._onpress(id);}}>{this.state.btn ? this.state.btnword : "Verifying ..."}</ExButton>
                </KeyboardAvoidingView>
            </SubFrame>
        );
    }
}