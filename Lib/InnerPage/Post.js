import React, { Component } from 'react';
import { Button, Platform, ScrollView, StatusBar, View, Text, Image} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, GlobalFont, globalStyle } from "../SubComponents.js";

export class Post extends Component {
    static navigationOptions = {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
              name={focused ? 'ios-home' : 'ios-home-outline'}
              size={26}
              style={{ color: tintColor }}
            />
        ),
    };
    
    render() {
        const {
            goBack, state
        } = this.props.navigation;
        
        return (
            <SubFrame>
                <View style={[{flexDirection: "row", marginTop: 30, marginBottom: 10,}, globalStyle.center]}>
                    {/* <Text style={{fontSize: 30, fontFamily: GlobalFont, width: 20}}>{this.props.data.id}</Text> */}
                    <Image style={{width: 40, height: 40, borderRadius: 20}} source={{uri: state.params.raw.img}}/>
                    <View style={{marginLeft: 15}}>
                        <Text style={{fontSize: 18, fontFamily: GlobalFont, fontWeight: "bold", fontSize: 32,}} numberOfLines={1}>{state.params.raw.title}</Text>
                    </View>
                </View>
                <Text style={[{fontSize: 12, fontFamily: GlobalFont, marginBottom: 20,}, globalStyle.center]} numberOfLines={1}>{state.params.raw.content}</Text>
            </SubFrame>
        );
    }
}