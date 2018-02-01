import React, { Component } from 'react';
import { TouchableOpacity, Button, Platform, ScrollView, StatusBar, View, Text, Image} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, GlobalFont, globalStyle } from "../SubComponents.js";

var goBackToList = null;
export class Post extends Component {
    static navigationOptions = {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
              name={focused ? 'ios-arrow-down' : 'ios-arrow-down-outline'}
              size={26}
              style={{ color: tintColor }}
            />
        ),
        tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
            if (previousScene.index == scene.index) {
                if (goBackToList) goBackToList();
            } else {
                jumpToIndex(scene.index);
            }
        }
    };

    render() {
        const {
            goBack, state
        } = this.props.navigation;
        goBackToList = this.props.navigation.goBack;
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
                            style={{ color: "#000" }}
                        />
                    </TouchableOpacity>
                    <View style={[{flexDirection: "row", marginTop: 30, marginBottom: 10,}]}>
                    {/* <Text style={{fontSize: 30, fontFamily: GlobalFont, width: 20}}>{this.props.data.id}</Text> */}
                    <Image style={{width: 40, height: 40, borderRadius: 20, marginLeft: 10}} source={{uri: state.params.raw.img}}/>
                    <View style={{marginLeft: 5}}>
                        <Text style={{fontSize: 18, fontFamily: GlobalFont, fontWeight: "bold", fontSize: 32,}} numberOfLines={1}>{state.params.raw.title}</Text>
                    </View>
                </View>
                </View>
                <Text style={[{fontSize: 12, fontFamily: GlobalFont, marginBottom: 20,}, globalStyle.center]} numberOfLines={1}>{state.params.raw.content}</Text>
            </SubFrame>
        );
    }
}