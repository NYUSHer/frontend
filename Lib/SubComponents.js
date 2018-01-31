import React, { Component } from 'react';
import { Button, StyleSheet, TouchableHighlight, Platform, ScrollView, StatusBar, View, Text, Image } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SortableListView from 'react-native-sortable-listview'

export class SubFrame extends Component {
    render() {
        return (
            <ScrollView style={{marginTop:20, marginBottom:60}}>{this.props.children}</ScrollView>
        );
    }
}

export class Title extends Component {
    render() {
        return ( 
            <Text style={styles.Title}>{this.props.value}</Text>
        );
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
                    padding: 10,
                    paddingHorizontal: 40,
                    backgroundColor: "#FFFFFF",
                    borderBottomWidth: 1,
                    borderColor: '#FAFAFA'
                }}
                onPress={this._onPress}>
                <View>
                    
                    <Text style={{fontSize: 18}}>{this.props.data.title}</Text>
                    <Text style={{fontSize: 12}}>{this.props.data.content}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

export class PostListView extends Component {
    
    componentWillMount() {
        this.setState({
            data: this.props.data,
        });
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
                // onRowMoved={e => {
                //     order.splice(e.to, 0, order.splice(e.from, 1)[0]);
                //     this.forceUpdate();
                // }}
                renderRow={row => <ListRowComponent data={row} func={this.props.func}/>}
            />
        )
    }
}

export const globalStyle = StyleSheet.create({
    navTag: {
        fontFamily: "QuickSand"
    }
});

const styles = StyleSheet.create({
    Title: {
        margin: 30,
        marginBottom: 10,
        fontWeight: "bold",
        fontSize: 32,
        color: "#35A7FF",
        // fontFamily: "QuickSand"
    },
});