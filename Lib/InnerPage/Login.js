import React, { Component } from 'react';
import { TouchableOpacity, Platform, ScrollView, StatusBar, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame } from "../SubComponents.js";
import { Me, CurrentState, getMe } from "../Util.js";

export class Login extends Component {
    render() {
        const {
            goBack, state
        } = this.props.navigation;
        return (
            <SubFrame>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity
                        onPress={() => { goBack(); }}
                        style={{
                            margin: 30,
                            marginBottom: 20,
                            marginRight: 0,
                        }}
                    >
                        <Ionicons
                            name='ios-arrow-back'
                            size={40}
                            style={{ color: "#35A7FF" }}
                        />
                    </TouchableOpacity>
                    <Title value="Login"></Title>
                </View>
            </SubFrame>
        );
    }
}