import React, { Component } from 'react';
import { Button, StyleSheet, TouchableOpacity, RefreshControl, TouchableHighlight, Platform, ScrollView, StatusBar, View, Text, Image, TextInput, PixelRatio } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SortableListView from 'react-native-sortable-listview'

export const GlobalFuncs = {
    globalAlert: null,
    globalDashboardUF: null,
    globalPopups: null,
};
export const GlobalFont = (Platform.OS === 'ios' ? "QuickSand" : "Quicksand-Bold");
export const GlobalColor = {
    "blue"  : "#35A7FF",
    "red"   : "#FF5964",
    "yellow": "#FFE74C",
    "yellow_dark": "#FFA72C",
    "orange": "rgb(255, 100, 0)",
}
export const fontSizeScaler = Platform.OS === 'ios' ? 1 : (PixelRatio.get() / PixelRatio.getFontScale());

export const randomColor = function() {
    return `rgb(${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)})`;
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

    render() {
        if (this.props.uri.indexOf("://") >= 0) {
            return (
                <TouchableHighlight
                    underlayColor="rgba(255, 255, 255, 0.1)"
                    onPress={() => {this._onpress();}}>
                    <Image
                        style={{
                            width: this.props.size || 40,
                            height: this.props.size || 40,
                            borderRadius: 20}}
                        source={{uri: this.props.uri}}
                    />
                </TouchableHighlight>
            );
        } else {
            let word = this.props.uri ? this.props.uri[0].toLocaleUpperCase() : "";
            let rndColor = randomColor();
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
                    <Image style={{width: 40, height: 40, borderRadius: 20}} source={{uri: this.props.data.img}}/>
                    <View style={{marginLeft: 15}}>
                        <Text allowFontScaling={false} style={{fontSize: 18 * fontSizeScaler, fontFamily: GlobalFont}} numberOfLines={1}>{this.props.data.title}</Text>
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

    render() {
        return (
            <View>
                <TextInput 
                    allowFontScaling={false}
                    autoCapitalize = {"none"}
                    style={styles.ExInput}
                    placeholder={this.props.name}
                    autoCorrect={false}
                    keyboardType={this.props.type == "passwd" ? "email-address" : this.props.type}
                    secureTextEntry={this.props.type == "passwd" ? true : false}
                    multiline={false}
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

export class Br extends Component {
    render() {
        return (
            <View style={{height: this.props.h}}></View>
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
});