import React, { Component } from 'react';
import { Alert, Button, Platform, ScrollView, StatusBar, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, PostListView, SubFrame } from "./SubComponents.js";
import { Post } from "./InnerPage/Post.js";
import { EditPost } from "./InnerPage/EditPost.js";

let forumData = {};
var forumLen = 0;
export var ForumNavigator = null;

var forumLayoutUnitTest = (num=3) => {
    for (var i = forumLen; i < forumLen + num; i++) {
        forumData[i] = {
            title: "This is the title " + (i + 1),
            id: i,
            content: "this is a bref content. this is a bref content. this is a bref content.",
            img: "https://storage-1.nya.vc/3n6EvDoG",
            author: i % 4 + 1,
        };
    }
    forumLen += num;
}
forumLayoutUnitTest(12);

var refreshForumList = (callback) => {
    for (var i = 0; i < forumLen; i++) {
        delete forumData[i];
    }
    forumLen  = 0;
    forumLayoutUnitTest(12);
    callback();
}

var moreForumList = (callback) => {
    if (forumLen > 50) {
        callback();
        return;
    }
    forumLayoutUnitTest();
    callback();
}

export class ForumList extends Component {
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

    constructor() {
        super();
        this.state = {
            data: forumData, //this.props.data
        };
    }

    _onSelect(e) {
        // forumData[e.id].title = "Clicked.";
        this.setState({
            data: forumData
        })
        this.props.navigation.navigate("Post", {id: e.id, raw: e});
        // ForumNavigator.navigate("Post", {id: e.id});
    }

    render() {
        ForumNavigator = this.props.navigation;
        return (
            <SubFrame>
                <Title value="Forum" btn="+" onpress={() => {this.props.navigation.navigate("EditPost", {})}}/>
                <PostListView onmore={(cb) => {moreForumList(cb);}} onrefresh={(cb) => {refreshForumList(cb);}} data={this.state.data} func={(e) => this._onSelect(e)}/>
            </SubFrame>
        );
    }
}

export const Forum = StackNavigator(
    {
        Index: {
            screen: ForumList,
        },
        Post: {
            screen: Post,
            path: 'post/:id',
        },
        EditPost: {
            screen: EditPost,
            path: 'post/new',
        }
    },
    {
        initialRouteName: 'Index',
        headerMode: 'none',
        mode: 'modal',
        cardStyle: {
            backgroundColor: "#FFF",
        },
    }
);