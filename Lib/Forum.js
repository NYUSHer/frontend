import React, { Component } from 'react';
import { Alert, Button, Platform, ScrollView, StatusBar, View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Title, PostListView, SubFrame, ExPill, GlobalFuncs, fontSizeScaler } from "./SubComponents.js";
import { Post } from "./InnerPage/Post.js";
import { PostApi } from "./Util.js";
import { EditPost } from "./InnerPage/EditPost.js";

let forumData = {};
let latestTags = [];
let postlist = null;
var forumLen = 0;
var limit = 15;
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
// forumLayoutUnitTest(12);

var forumTageUnitTest = function () {
    latestTags = [
        "CS 249",
        "Book Resell",
        "Mac Rent",
        "Math",
        "药丸💊",
        "Answer",
    ];
}
forumTageUnitTest();

var fetchData = (offset, limit, callback=() => {}, clear=false) => {
    (new PostApi).fetchList(offset, limit, (data) => {
        let count = parseInt(data.count);
        if (clear) {
            for (var k in forumData) {
                delete forumData[k];
            }
        }
        for (let i = 0; i < count; i++) {
            let d = data.postlist[i];
            forumData[-d.pid] = {
                title: d.title,
                id: d.pid,
                content: d.content.trim().substr(0, 50),
                img: d.user_avatar || d.user_name,//"https://storage-1.nya.vc/3n6EvDoG",
                author: d.authorid,
            }
        }
        forumLen = Object.keys(forumData).length;
        postlist.setState({
            data: forumData
        })
        console.log(`fetched data from ${offset} to ${offset + limit}`);
        console.log(data);

        callback();
    });
} 

var refreshForumList = (callback) => {
    forumLen = 0;
    moreForumList(callback, true);
}

var moreForumList = (callback, clear=false) => {
    console.log(`fetching data from ${forumLen} to ${forumLen + limit}`);
    fetchData(forumLen, limit, callback, clear);
}

if (!("forum" in GlobalFuncs.globalLoginTrigger)) {
    console.log("Register forum in Login Trigger.");
    GlobalFuncs.globalLoginTrigger["forum"] = refreshForumList;
}

export class ForumList extends Component {
    static navigationOptions = {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
              name={focused ? 'ios-home' : 'ios-home-outline'}
              size={26 * fontSizeScaler}
              style={{ color: tintColor }}
            />
        ),
    };

    constructor() {
        super();
        this.state = {
            data: forumData, //this.props.data
            tags: latestTags,
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

    _onPress(id) {
        console.log(id);
    }

    render() {
        ForumNavigator = this.props.navigation;
        let counter = 0;
        return (
            <SubFrame>
                <Title value="Forum" btn="+" onpress={() => {this.props.navigation.navigate("EditPost", {})}}/>
                <ScrollView 
                horizontal={true}
                keyboardShouldPersistTaps="never"
                style={{
                    flexDirection: "row",
                    marginHorizontal: 30,
                    marginVertical: 3,
                    maxHeight: 35,
                    marginTop: -10}}>
                    {this.state.tags.map((item) => {
                        return (
                            <ExPill id={counter} key={counter++} onpress={(id) => {this._onPress(id);}}>{item}</ExPill>
                        );
                    })}
                </ScrollView>
                <PostListView ref={(c) => postlist = c} onmore={(cb) => {moreForumList(cb);}} onrefresh={(cb) => {refreshForumList(cb);}} data={this.state.data} func={(e) => this._onSelect(e)}/>
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