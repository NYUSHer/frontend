import React, { Component } from 'react';
import { Button, Platform, ScrollView, StatusBar, View, Text, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, GlobalFont, GlobalFuncs } from "./SubComponents.js";
import { Me } from "./Util.js";

var dthat = null;

export class UserFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: Me.avatar,
            username: Me.username,
        };
    }

    _changeInfo() {
        dthat.setState({
            avatar: Me.avatar,
            username: Me.username,
        });
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
                <Image style={{width: 40, height: 40, borderRadius: 20}} source={{uri: this.state.avatar || "https://storage-1.nya.vc/3n6EvDoG"}}/>
                <View style={{marginLeft: 15}}>
                    <Text style={{marginTop: 8, fontSize: 18, fontFamily: GlobalFont}} numberOfLines={1}>{this.state.username || "Anonymous"}</Text>
                </View>
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

