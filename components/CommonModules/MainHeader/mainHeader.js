import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'

export default class MainHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.loginAction=this.props.loginAction
        this.searchAction=this.props.searchAction
    }
    getFlexSize = () => { return this.props.flexSize }

    styles = StyleSheet.create({
        iconContainer:{
            flex:1, 
            alignItems:'center', 
            justifyContent:'center'
        }
    })

    render() {
        let searchOption, loginOption;
        if(this.props.enableSearch)
            searchOption=<MaterialIcons name={'search'} color={'white'} size={responsiveHeight(4)} />
        if(this.props.enablelogin)
            loginOption=<AntDesign name={'user'} color={'white'} size={responsiveHeight(4)} />
        return (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={{ flex: this.getFlexSize(), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={this.loginAction} style={{height:0, width:0}} disabled={!this.props.enablelogin} style={this.styles.iconContainer}>
                    {loginOption}
                </TouchableOpacity>
                <View style={{ flex: 3, alignItems:'center', justifyContent:'center' }}>
                    <Image style={{ flex:1, width:responsiveWidth(35) }} source={require('../../../Images/textlogo.png')} />
                </View>
                <TouchableOpacity onPress={this.searchAction} style={{height:0, width:0}} disabled={!this.props.enableSearch} style={this.styles.iconContainer}>
                    {searchOption}
                </TouchableOpacity>
            </LinearGradient>
        )
    }
}