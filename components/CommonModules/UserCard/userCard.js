import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    FlatList,
    Image
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import LinearGradient from 'react-native-linear-gradient'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default class UserCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUrl: '', backgroundColor: 'red', name: 'hello world',
            email: 'Tes14@gmail.com'
        }
    }
    renderImage = () => {
        return (
            <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}  >
                <Image style={this.styles.iconCat} source={{ uri: this.state.imageUrl }} />
            </View>
        )
    }

    renderIcon = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ backgroundColor: '#008080', borderRadius: responsiveHeight(100), width: responsiveWidth(20), height: responsiveHeight(10), alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesome5 name={'user-tie'} color={'white'} size={responsiveHeight(5)} />
                </View>
            </View>
        )
    }

    render() {
        let image;
        if (this.state.imageUrl == '' || !this.state.imageUrl)
            image = this.renderIcon()
        else
            image = this.renderImage()
        return (
            <View style={this.styles.container}>
                <View style={[{ backgroundColor: this.state.backgroundColor }, this.styles.upperCard]}>
                    {image}
                    <View style={{ flex: 1.3 }}>
                        <Text style={this.styles.name}>{this.state.name}</Text>
                    </View>
                </View>
                <View style={this.styles.lowerCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={this.styles.lowerCardHeadings}>User Type :<Text style={this.styles.lowerCardTxt}> {this.state.email}</Text></Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={this.styles.lowerCardHeadings}>User Type :<Text style={this.styles.lowerCardTxt}> {this.state.email}</Text></Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={this.styles.lowerCardHeadings}>User Type :<Text style={this.styles.lowerCardTxt}> {this.state.email}</Text></Text>
                    </View>
                </View>
            </View>
        )
    }

    styles = StyleSheet.create({
        container: {
            flex: this.props.flexSize,
            height: responsiveHeight(33),
            width: this.props.width,
            elevation: 3,
            borderRadius: responsiveHeight(3)
        },
        upperCard: {
            flex: 1,
            flexDirection: 'row',
            borderRadius: responsiveHeight(3),
            paddingBottom: responsiveHeight(4),
            justifyContent: 'center',
            alignItems: 'center'
        },
        name: {
            fontSize: responsiveFontSize(2.5),
        },
        lowerCard: {
            flex: 1,
            backgroundColor: 'white',
            marginTop: responsiveHeight(-5),
            borderRadius: responsiveHeight(3),
            justifyContent: 'center',
            paddingHorizontal: responsiveWidth(5),
            paddingVertical: responsiveHeight(1)
        },
        lowerCardHeadings: {
            fontWeight: 'bold'
        },
        lowerCardTxt: {
            fontWeight: 'normal'
        },
        iconCat: {
            height: responsiveHeight(10),
            width: responsiveWidth(20),
            borderRadius: responsiveWidth(80),
            justifyContent: 'center',
            alignItems: 'center',
        },
    })
}