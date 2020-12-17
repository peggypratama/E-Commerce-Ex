import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';

import { Kohana } from 'react-native-textinput-effects';
import { responsiveHeight, responsiveWidth, responsiveFontSize, useResponsiveFontSize } from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import * as Animatable from 'react-native-animatable';

export default class CustomFeature extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.updateParentTitle = this.props.updateParentTitle
        this.updateParentDescription = this.props.updateParentDescription
        this.deleteFeature=this.props.deleteFeature
    }

    async componentDidUpdate(prevProps) {
        if (this.props.title != prevProps.title)
            await this.updateParentTitle(this.props.title)
        if (this.props.description != prevProps.description)
            await this.updateParentDescription(this.props.description)
    }

    delete = async () => {
        await this.AnimationRef.fadeOutRight()
        this.deleteFeature()
    }

    render() {
        return (
            <Animatable.View ref={ref => this.AnimationRef = ref} animation={'fadeInLeft'} duration={800} style={[{ flex: this.props.flexSize }, styles.box]}>
                <KeyboardAvoidingView style={styles.txtContainer}>
                    <Kohana onChangeText={text => this.updateParentTitle(text)} value={this.props.title} style={styles.txt} label={'Title'} iconClass={MaterialIcons} iconName={'title'} iconColor={'#008080'} inputPadding={responsiveWidth(1)} labelStyle={styles.lbl} inputStyle={styles.input} />
                </KeyboardAvoidingView>
                <KeyboardAvoidingView style={styles.txtContainer}>
                    <Kohana onChangeText={text => this.updateParentDescription(text)} value={this.props.description} style={styles.txt} label={'Description'} iconClass={MaterialIcons} iconName={'description'} iconColor={'#008080'} inputPadding={responsiveWidth(1)} labelStyle={styles.lbl} inputStyle={styles.input} />
                </KeyboardAvoidingView>
                <TouchableOpacity onPress={this.delete} style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <Entypo name={'circle-with-cross'} size={responsiveHeight(4)} color={'red'} />
                </TouchableOpacity>
            </Animatable.View>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        paddingVertical: responsiveHeight(1),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(1)
    },
    txt: {
        borderColor: '#dcdcdc',
        borderWidth: responsiveWidth(0.8),
        borderRadius: responsiveWidth(3),
        marginHorizontal: responsiveWidth(1)
    },
    txtContainer: {
        flex: 5,
    },
    lbl: {
        color: '#008080',
        fontSize: responsiveFontSize(2.1)
    },
    input: {
        color: '#4c516d',
        fontSize: responsiveFontSize(2.1)
    }
})