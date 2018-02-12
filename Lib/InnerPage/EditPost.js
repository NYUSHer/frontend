import React, { Component } from 'react';
import { TouchableOpacity, Button, Platform, ScrollView, StatusBar, View, Text, Image} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, GlobalFont, globalStyle, UserShownRow, ExInput, ExInputMulti } from "../SubComponents.js";
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
                    {/* <Text style={{fontSize: 30, fontFamily: GlobalFont, width: 20}}>{this.props.data.id}</Text> */}
                    {/* <Image style={{width: 40, height: 40, borderRadius: 20}} source={{uri: state.params.raw.img}}/> */}
                        <View style={{marginLeft: 15}}>
                            <ExInput ref={(c) => this._title = c} id="title" name="Post Title Here     " type="email-address" />
                            {/* <Text style={{fontSize: 18, fontFamily: GlobalFont, fontWeight: "bold", fontSize: 32,}} numberOfLines={1}>New Post</Text> */}
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
                <UserShownRow style={{marginHorizontal: 30, marginTop: -10}} userid={Me.userid} />
                <ExInputMulti ref={(c) => this._title = c} id="content" name="Post Content" type="email-address" height={500} />
            </SubFrame>
        );
    }
}

