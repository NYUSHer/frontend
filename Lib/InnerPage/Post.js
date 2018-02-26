import React, { Component } from 'react';
import { TouchableOpacity, Button, Platform, ScrollView, StatusBar, View, Text, Image, KeyboardAvoidingView} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, SubFrame, GlobalFont, globalStyle, UserShownRow, ExInput, GlobalColor, fontSizeScaler } from "../SubComponents.js";

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

    constructor(props) {
        super(props);
        this.state = {
            commentText: "Write a comment.",
        }
    } 

    _oninputend(id, text, that) {
        if (!this._comment || !text) return;
        
        this.setState({
            commentText: text,
        });
        this._comment.setState({text: ""});
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
                            name='ios-arrow-down'
                            size={40}
                            style={{ color: "#000" }}
                        />
                    </TouchableOpacity>
                    <View style={[{flexDirection: "row", marginTop: 30, marginBottom: 10,}]}>
                    {/* <Text style={{fontSize: 30 * fontSizeScaler, fontFamily: GlobalFont, width: 20}}>{this.props.data.id}</Text> */}
                    {/* <Image style={{width: 40, height: 40, borderRadius: 20}} source={{uri: state.params.raw.img}}/> */}
                        <View style={{marginLeft: 15}}>
                            <Text style={{fontFamily: GlobalFont, fontWeight: "bold", fontSize: 32 * fontSizeScaler,}} numberOfLines={1}>{state.params.raw.title}</Text>
                        </View>
                    </View>
                </View>
                {/* <Text style={[{fontSize: 12 * fontSizeScaler, fontFamily: GlobalFont, marginBottom: 20,}, globalStyle.center]} numberOfLines={1}>{state.params.raw.content}</Text> */}
                <UserShownRow style={{marginHorizontal: 30, marginTop: -10}} userid={state.params.raw.author} />

                <Text style={[{flex: 1, fontSize: 18 * fontSizeScaler, fontFamily: GlobalFont, marginBottom: 20,}, globalStyle.center]}>{state.params.raw.content}</Text>

                <KeyboardAvoidingView style={{
                        paddingBottom: 8
                    }} behavior='position'>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            onPress={() => {}}
                        >
                        <Ionicons
                                // name='ios-redo'
                                name='ios-log-in'
                                size={30}
                                style={{ color: GlobalColor.blue, paddingTop: 5, marginRight: -15, marginLeft: 15 }}
                            />
                        </TouchableOpacity>
                        <ExInput oninputend={(a,b,c) => {this._oninputend(a,b,c);}} innerstyle={{fontWeight: "100", fontSize: 18 * fontSizeScaler}} style={{flex: 1}} ref={(c) => this._comment = c} id="comment" name={this.state.commentText} type="email-address" />
                        <TouchableOpacity
                        onPress={() => {}}
                        >
                        <Ionicons
                                name='ios-redo-outline'
                                size={30}
                                style={{ color: "#0E0", paddingTop: 5, marginLeft: -15, marginRight: 15 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={[{fontSize: 12 * fontSizeScaler, fontFamily: GlobalFont,color: "#666", marginHorizontal: 15}]} numberOfLines={1}>The Thread is open for comment.</Text>
                </KeyboardAvoidingView>
            </SubFrame>
        );
    }
}