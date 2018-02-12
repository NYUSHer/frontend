import React, { Component } from 'react';
import { TouchableOpacity, Button, Platform, ScrollView, StatusBar, View, Text, Image, KeyboardAvoidingView} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, GlobalFont, globalStyle, UserShownRow, ExInput, ExInputMulti, fontSizeScaler } from "../SubComponents.js";
import { Me } from "../Util.js";

var goBackToList = null;
export class EditPost extends Component {
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

    constructor(props) {
        super(props);
        this.state = {
            modifiedTime: new Date().toTimeString(),
        }
    }

    _submit() {

    }

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
                            marginRight: -10,
                            paddingHorizontal: 10
                        }}
                    >
                        <Ionicons
                            name='ios-close'
                            size={40}
                            style={{ color: "#000" }}
                        />
                    </TouchableOpacity>
                    <View style={[{flexDirection: "row", marginTop: 30, marginBottom: 10, flex: 1}]}>
                    {/* <Text style={{fontSize: 30 * fontSizeScaler, fontFamily: GlobalFont, width: 20}}>{this.props.data.id}</Text> */}
                    {/* <Image style={{width: 40, height: 40, borderRadius: 20}} source={{uri: state.params.raw.img}}/> */}
                        <View style={{marginLeft: 15}}>
                            <ExInput ref={(c) => this._title = c} id="title" name="Post Title Here     " type="email-address" />
                            {/* <Text style={{fontSize: 18 * fontSizeScaler, fontFamily: GlobalFont, fontWeight: "bold", fontSize: 32 * fontSizeScaler,}} numberOfLines={1}>New Post</Text> */}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{
                            margin: 30,
                            marginBottom: 20,
                            marginLeft: 10,
                            marginRight: 30,
                            paddingHorizontal: 10
                        }}
                        onPress={() => {this._submit();}}>
                        <Ionicons
                            name='ios-checkmark'
                            size={40}
                            style={{ color: "#0E0" }}
                        />
                    </TouchableOpacity>
                </View>
                <UserShownRow style={{marginHorizontal: 30, marginTop: -10, backgroundColor: "#FFF"}} userid={Me.userid} />
                <KeyboardAvoidingView behavior='height' style={{flex: 1}}>
                    <ExInputMulti style={{flex: 1}}ref={(c) => this._title = c} id="content" name={"Post Content Here..." + String.fromCharCode(10) + String.fromCharCode(10) + "Press 'x' to cancel," + String.fromCharCode(10) + "Press '√' to submit."} type="email-address" />
                    <Text style={[{fontSize: 12 * fontSizeScaler, fontFamily: GlobalFont, marginBottom: 20, paddingBottom: 10,}, globalStyle.center]} numberOfLines={1}>At {new Date().toTimeString()}</Text>
                </KeyboardAvoidingView>
            </SubFrame>
            
        );
    }
}

