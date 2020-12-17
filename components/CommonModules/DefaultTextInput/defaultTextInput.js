import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text } from 'react-native';

import { Hoshi } from 'react-native-textinput-effects'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import * as Animatable from 'react-native-animatable'


export default class DefaultFeature extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            errorMessage: '',
        }
        this.setValueState = this.props.setValueState
        this.setErrorState = this.props.setErrorState
    }

    async componentDidUpdate(prevProps) {
        if (this.props.value != prevProps.value) {
            await this.setState({ value: this.props.value })
            if (this.state.value == '')
                await this.setState({ errorMessage: '' })
        }
    }

    validate = (text) => {
        this.setState({ value: text })
        this.setValueState(text)
        if (this.props.regex.test(text)) {
            this.setState({ errorMessage: '' })
            this.setErrorState(false)
        }
        else {
            this.setState({ errorMessage: this.props.errorMessage })
            this.setErrorState(true)
        }
    }

    styles = StyleSheet.create({
        txtLbl: {
            color: '#4c516d',
            fontSize: responsiveFontSize(1.9)
        },
        txtInput: {
            color: '#01233f',
            fontSize: responsiveFontSize(2.5),
            fontWeight: "normal",
            paddingRight: responsiveWidth(7)
        },
        txtContainer: {
            flex:this.props.flexSize,
            marginHorizontal: responsiveWidth((100 - this.props.width) / 2),
            justifyContent: 'center',
            marginVertical: this.props.marginVertical,
            paddingVertical: responsiveHeight(0.1)
        },
        error: {
            marginTop: responsiveHeight(0.6),
            fontSize: responsiveFontSize(1.4),
            color: 'red'
        },
    })

    render() {
        let error = null;
        if (this.state.errorMessage !== '')
            error = <Animatable.Text animation={'zoomIn'} duration={700} style={this.styles.error}>{this.state.errorMessage}</Animatable.Text>
        else
            error = null
        return (
            <KeyboardAvoidingView style={this.styles.txtContainer}>
                <Hoshi
                    value={this.state.value}
                    onChangeText={text => this.validate(text)}
                    label={this.props.name}
                    borderColor={'#008080'}
                    labelStyle={this.styles.txtLbl}
                    inputStyle={this.styles.txtInput}
                    style={{ width: responsiveWidth(this.props.width) }}
                    secureTextEntry={this.props.secureTextEntry}
                />
                <KeyboardAvoidingView style={{ alignItems: 'flex-start', paddingHorizontal: responsiveWidth(4.6) }}>
                    {error}
                </KeyboardAvoidingView>
            </KeyboardAvoidingView>
        )
    }
}