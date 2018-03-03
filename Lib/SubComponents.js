import React, { Component } from 'react';
import { Dimensions, Button, StyleSheet, TouchableOpacity, RefreshControl, TouchableHighlight, Platform, ScrollView, StatusBar, View, Text, Image, TextInput, PixelRatio } from 'react-native';
import { User, Me } from "./Util.js";

import Ionicons from 'react-native-vector-icons/Ionicons';
import SortableListView from 'react-native-sortable-listview';
// import { CachedImage, ImageCache } from 'react-native-img-cache';
import Forge from 'node-forge';

export const GlobalFuncs = {
    globalAlert: null,
    globalDashboardUF: null,
    globalPopups: null,
    globalDialog: null,
    globalLoginTrigger: {},
};
export const GlobalFont = (Platform.OS === 'ios' ? "QuickSand" : "Quicksand-Bold");
export const GlobalColor = {
    "blue"  : "#35A7FF",
    "red"   : "#FF5964",
    "yellow": "#FFE74C",
    "yellow_dark": "#FFA72C",
    "orange": "rgb(255, 100, 0)",
}

const deviceWidth  = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const fontScale  = PixelRatio.getFontScale();
const pixelRatio = PixelRatio.get();
const w2 = 750  / 2;
const h2 = 1334 / 2;
const scale = Math.min(deviceHeight / h2, deviceWidth / w2);
export const fontSizeScaler = Platform.OS === 'ios' ? 1 : (1 / (scale * pixelRatio / fontScale / 2) / 1.3333);

console.log("fontScale: " + fontSizeScaler);
console.log("clearCache.");
if (typeof ImageCache !== "undefined") ImageCache.get().clear();

export var storagedColor = {};
export const randomColor = function(key) {
    if (key in storagedColor) return storagedColor[key];
    storagedColor[key] = generateColorByName(key + "FRONTEND");
    return storagedColor[key];
}

export var generateColorByName = function(name) {
    let hash = Forge.md.md5.create();
    hash.update(name);
    let hashstr = hash.digest().toHex();

    return `rgb(${parseInt("0x" + hashstr.substr(0,2))},${parseInt("0x" + hashstr.substr(2,2))},${parseInt("0x" + hashstr.substr(4,2))})`;
}

export const whiteRate = function(c) {
    let begin = c.search(/\(/);
    let end = c.search(/\)/);
    let colors = c.substring(begin + 1, end).split(",");
    let v = 0;
    for (var i = 0; i < colors.length; i++) {
        v += parseInt(colors[i]) / 255 / colors.length;
    }
    return v;
}

export class SubFrame extends Component {
    render() {
        return (
            <View 
                style={{marginTop:20, marginBottom:0, flex: 1}}
            >
                {this.props.children}
            </View>
        );
    }
}

export class Title extends Component {
    _renderBtn() {
        if (this.props.btn) {
            return (
                <TouchableHighlight
                    underlayColor="#FFF"
                    style={{
                        
                    }}
                    onPress={() => {if(this.props.onpress){this.props.onpress();}}}>
                    <Text 
                        allowFontScaling={false}
                        style={[styles.Title, {
                        color: GlobalColor.orange,
                    }]}>{this.props.btn}</Text>
                </TouchableHighlight>
            )
        }
    }
    render() {
        return (
            <View style={{
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                flexDirection: 'row',
            }}>
                <Text allowFontScaling={false} style={styles.Title}>{this.props.value}</Text>
                {this._renderBtn()}
            </View>
        );
    }
}

export class UserAvatar extends Component {
    _onpress() {
        if (this.props.onpress) {
            this.props.onpress();
        }
        console.log("Avatar on Press.");
    }

    returnWrapper() {
        if (typeof CachedImage !== "undefined") {
            return (
                <CachedImage
                    style={{
                        width: this.props.size || 40,
                        height: this.props.size || 40,
                        borderRadius: 20}}
                    source={{uri: this.props.uri}}
                />
            )
        } else {
            return (
                <Image
                    style={{
                        width: this.props.size || 40,
                        height: this.props.size || 40,
                        borderRadius: 20}}
                    source={{uri: this.props.uri}}
                />
            )
        }
    }

    render() {
        if (this.props.uri.indexOf("://") >= 0) {
            return (
                <TouchableHighlight
                    underlayColor="rgba(255, 255, 255, 0.1)"
                    onPress={() => {this._onpress();}}>
                    {this.returnWrapper()}
                </TouchableHighlight>
            );
        } else {
            let word = this.props.uri ? this.props.uri[0].toLocaleUpperCase() : "";
            let rndColor = randomColor(this.props.uri);
            let wtRate = whiteRate(rndColor);
            return (
                <TouchableHighlight
                    underlayColor={rndColor}
                    style={{
                        width: this.props.size || 40,
                        height: this.props.size || 40,
                        borderRadius: 20,
                        justifyContent: "center",
                        backgroundColor: rndColor,
                    }}
                    onPress={() => {this._onpress();}}>
                    <Text 
                        allowFontScaling={false}
                        style={{
                            fontFamily: GlobalFont,
                            textAlign: "center",
                            fontSize: 20 * fontSizeScaler,
                            color: wtRate > 0.5 ? "#000" : "#FFF",
                    }}>{word}</Text>
                </TouchableHighlight>
            )
        }
    }
}

export class PostToolRow extends Component {
    generateControlPanel() {
        this.isGenerate = false;
        if (this.props.uid == Me.userid) {
            this.isGenerate = true;
            return (
                <View style={{flexDirection: "row-reverse"}}>
                    <TouchableOpacity
                        onPress={() => {this.props.control(this.props.pid, "delete", this.props.role);}}
                        style={{marginRight: this.props.style ? 0 : 30}}
                    >
                    <Ionicons
                            name='ios-trash-outline'
                            size={23}
                            style={{ color: "red", paddingTop: 5, marginRight: 15, marginBottom: 5 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {this.props.control(this.props.pid, "edit", this.props.role);}}
                    >
                    <Ionicons
                            name='ios-create-outline'
                            size={23}
                            style={{ color: "#AAA", paddingTop: 5, marginRight: 15, marginBottom: 5 }}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    render() {
        return(
            <View style={[{flexDirection: "row-reverse"}]}>
                {this.generateControlPanel()}
                <TouchableOpacity
                    onPress={() => {this.props.control(this.props.pid, "reply", this.props.role);}}
                    style={{marginRight: (this.isGenerate || this.props.style) ? 0 : 30}}
                >
                <Ionicons
                        name='ios-undo-outline'
                        size={23}
                        style={{ color: GlobalColor.blue, paddingTop: 5, marginRight: 15, marginBottom: 5 }}
                    />
                </TouchableOpacity>
                <Text style={[{ flex:1, color: "#CCC", marginLeft: 30, paddingTop: 10 }, this.props.style]}>{this.props.cate}</Text>
            </View>
        );
    }
}

export class UserShownRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: new User(),
            username: "",
            avatar: "",
        };
    }

    componentDidMount() {
        this.state.user.userid = this.props.userid;
        this.state.user.fetchInfo((state, data) => {
            // console.log(this.state.user);
            this.setState({
                username: this.state.user.username,
                avatar: this.state.user.avatar,
            });
        });
    }

    _changeInfo() {
        dthat.setState({
            avatar: this.state.user.avatar,
            username: this.state.user.username
        });
    }

    render() {
        return (
            <View style={[{
                alignSelf: 'stretch',
                height: 55,
                justifyContent: 'flex-start',
                flexDirection: 'row',
                marginHorizontal: 15,
                marginRight: 30
            }, this.props.style]}>
                <UserAvatar uri={this.state.avatar || this.state.username || "Anonymous"}/>
                <View style={{marginLeft: 15, flex: 1}}>
                    <Text 
                        allowFontScaling={false}
                        style={{marginTop: 8, fontSize: 18 * fontSizeScaler, fontFamily: GlobalFont}}
                        numberOfLines={1}
                        multiline={false}
                    >{this.state.username}{this.props.addons || ""}</Text>
                </View>
            </View>
        )
    }
}

export class ListRowComponent extends Component {
    _onPress = () => {
        this.props.func(this.props.data);
    };

    render() {
      return (
            <TouchableHighlight
                underlayColor='#F4F4F4'
                style={{
                    paddingVertical: 10,
                    backgroundColor: "#FFFFFF",
                    borderBottomWidth: 1,
                    borderColor: '#FAFAFA'
                }}
                onPress={this._onPress}>
                <View style={{flexDirection: "row", marginHorizontal: 30, marginRight: 70}}>
                    {/* <Text style={{fontSize: 30 * fontSizeScaler, fontFamily: GlobalFont, width: 20}}>{this.props.data.id}</Text> */}
                    <UserAvatar uri={this.props.data.img}/>
                    <View style={{marginLeft: 15}}>
                        <Text allowFontScaling={false} style={{fontSize: 18 * fontSizeScaler, fontFamily: GlobalFont, fontWeight: "bold"}} numberOfLines={1}>{this.props.data.title}</Text>
                        <Text allowFontScaling={false} style={{fontSize: 12 * fontSizeScaler, fontFamily: GlobalFont}} numberOfLines={1}>{this.props.data.content}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

export class PostListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            refreshing: false,
            loadMore: false,
        };
    }
    
    _onRefresh() {
        this.setState({refreshing: true});
        if (this.props.onrefresh) {
            this.props.onrefresh(() => {
                this.setState({refreshing: false});
            })
        }
    }

    _onScroll(event) {
        if(this.state.loadMore){
            return;
        }
        let y = event.nativeEvent.contentOffset.y;
        let height = event.nativeEvent.layoutMeasurement.height;
        let contentHeight = event.nativeEvent.contentSize.height;
        if(y+height>=contentHeight-20){
            this.setState({
                loadMore: true
            });
            if (this.props.onmore) {
                this.props.onmore(() => {
                    this.setState({loadMore: false});
                });
            }
        }
    }

    render() {
        let order = Object.keys(this.props.data);
        return (
            <SortableListView
                style={{
                    flex: 1,
                    marginBottom: 0,
                }}
                data={this.state.data}
                order={order}
                onScroll={this._onScroll.bind(this)}
                scrollEventThrottle={50}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
                // onRowMoved={e => {
                //     order.splice(e.to, 0, order.splice(e.from, 1)[0]);
                //     this.forceUpdate();
                // }}
                renderRow={row => <ListRowComponent data={row} func={this.props.func}/>}
            />
        )
    }
}

export class ExInput extends Component {
    constructor(props) {
        super(props);
        this.state = { text: this.props.value || "" };
    }

    _onchange(text) {
        this.setState({text: text});
        if (this.props.onchange) {
            this.props.onchange(this.props.id, text, this);
        }
    }

    _focus() {
        this._instance.focus();
    }

    _changeValue(v) {
        this.setState({text: v});
    }

    _oninputend() {
        if (this.props.oninputend) {
            this.props.oninputend(this.props.id, this.state.text, this);
        }
    }

    render() {
        return (
            <View style={this.props.style}>
                <TextInput 
                    allowFontScaling={false}
                    autoCapitalize={"none"}
                    ref={(c) => this._instance = c}
                    style={[styles.ExInput, this.props.innerstyle]}
                    placeholder={this.props.name}
                    autoCorrect={false}
                    keyboardType={this.props.type == "passwd" ? "default" : this.props.type}
                    secureTextEntry={this.props.type == "passwd" ? true : false}
                    multiline={false}
                    onEndEditing={() => {this._oninputend()}}
                    onChangeText={(e) => {this._onchange(e)}}
                    value={this.state.text}
                />
            </View>
        )
    }
}

export class ExInputMulti extends Component {
    constructor(props) {
        super(props);
        this.state = { text: this.props.value };
    }

    _onchange(text) {
        this.setState({text: text});
        if (this.props.onchange) {
            this.props.onchange(this.props.id, text, this);
        }
    }

    _changeValue(v) {
        this.setState({text: v});
    }

    // _onContentSizeChange(event) {
    //     this.setState({height: event.nativeEvent.contentSize.height});
    //     if (this.props.onchangeheight) this.props.onchangeheight();
    // }

    render() {
        return (
            <View style={this.props.style}>
                <TextInput 
                    allowFontScaling={false}
                    style={[styles.ExInput, {
                        fontWeight: "100",
                        flex: 1,
                    }]}
                    placeholder={this.props.name}
                    autoCorrect={true}
                    keyboardType={"default"}
                    multiline={true}
                    // onContentSizeChange={this._onContentSizeChange.bind(this)}
                    onChangeText={(e) => {this._onchange(e)}}
                    value={this.state.text}
                />
            </View>
        )
    }
}

export class ExInputText extends Component {
    render() {
        return (
            <View>
                <Text
                    allowFontScaling={false}
                    selectable={true}
                    style={styles.ExInputText}
                >{this.props.children}</Text>
            </View>
        )
    }
}

export class ExHint extends Component {
    render() {
        return (
            <View>
                <Text
                    allowFontScaling={false}
                    style={[styles.ExHint, {color: this.props.color ? this.props.color : GlobalColor.yellow_dark}]}
                    // numberOfLines={2}
                >{this.props.hasOwnProperty("show") ? (this.props.show == false ? "" : this.props.text) : this.props.text}</Text>
            </View>
        )
    }
}

export class ExButton extends Component {
    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => { if (this.props.onpress) this.props.onpress(this.props.id); }}
                    style={[styles.ExButton, {backgroundColor: this.props.color ? this.props.color : "#DDD"}]}
                    disabled={this.props.disabled ? this.props.disabled : false}
                >
                    <Text allowFontScaling={false} style={styles.ExButtonText}>{this.props.children}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export class ExPill extends Component {
    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => { if (this.props.onpress) this.props.onpress(this.props.id); }}
                    style={[styles.ExPill, {backgroundColor: generateColorByName(this.props.children.toString())}]}
                    disabled={this.props.disabled ? this.props.disabled : false}
                >
                    <Text allowFontScaling={false} style={styles.ExPillText}>{this.props.children}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export class Br extends Component {
    render() {
        return (
            <View style={{height: this.props.h}}></View>
        )
    }
}

export class LightButton extends Component {
    onpress() {
        if (this.props.onpress) this.props.onpress();
    }

    render() {
        return (
            <TouchableOpacity
                onPress = {() => {this.onpress();}}
            >
                <Text style={{
                    fontWeight: "100",
                    fontSize: 18 * fontSizeScaler,
                    marginHorizontal: 10,
                    marginVertical: 5,
                    color: this.props.color ? this.props.color : "#888"
                }}>
                    {this.props.children}
                </Text>
            </TouchableOpacity>
        )
    }
}

export const globalStyle = StyleSheet.create({
    navTag: {
        fontFamily: GlobalFont
    },
    center: {
        marginHorizontal: 30,
        marginRight: 70,
    },
    pill: {
        backgroundColor: "rgba(255, 100, 0, 1)",
        borderRadius: 15,
        height: 30,
        justifyContent: "center",
        paddingHorizontal: 15,
        marginTop: 5,
    }
});

const styles = StyleSheet.create({
    Title: {
        margin: 30,
        marginBottom: 20,
        fontWeight: "bold",
        fontSize: 32 * fontSizeScaler,
        color: "#35A7FF",
        flex: 1,
        // fontFamily: GlobalFont
    },
    ExInput: {
        height: 40,
        fontFamily: GlobalFont,
        fontWeight: "bold",
        marginHorizontal: 30,
        fontSize: 22 * fontSizeScaler,
    },
    ExInputText: {
        height: 20,
        fontFamily: GlobalFont,
        fontWeight: "bold",
        color: "#888",
        marginHorizontal: 30,
        fontSize: 18 * fontSizeScaler,
    },
    ExHint: {
        height: 50,
        fontFamily: GlobalFont,
        color: GlobalColor.yellow_dark,
        marginHorizontal: 30,
        fontSize: 16 * fontSizeScaler,
    },
    ExButton: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DDD",
        marginHorizontal: 30,
        borderRadius: 8,
    },
    ExButtonText: {
        color: "#FFF",
        fontSize: 22 * fontSizeScaler,
        fontWeight: "bold",
        fontFamily: GlobalFont,
        marginHorizontal: "auto",
    },
    ExPill: {
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DDD",
        marginHorizontal: 5,
        marginBottom: 5,
        borderRadius: 25,
    },
    ExPillText: {
        color: "#FFF",
        fontSize: 14 * fontSizeScaler,
        fontWeight: "500",
        fontFamily: GlobalFont,
        marginHorizontal: 10,
    },
});