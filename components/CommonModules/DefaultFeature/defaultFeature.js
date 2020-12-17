import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';

import { Fumi } from 'react-native-textinput-effects'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import * as Animatable from 'react-native-animatable'


export default class DefaultFeature extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            errorMessage: '',
        }
        this.setValueState = this.props.setValueState
        this.setErrorState = this.props.setErrorState
    }

    componentWillMount = () => {
        if (!this.state.value)
            this.setState({ value: '' })
    }

    async componentDidUpdate(prevProps) {
        if (this.props.value != prevProps.value) {
            await this.setState({ value: this.props.value })
            if(this.state.value == '')
                await this.setState({errorMessage:''})
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

    render() {
        let error = null;
        if (this.state.errorMessage !== '')
            error = <Animatable.Text animation={'zoomIn'} duration={700} style={{ color: 'red', paddingLeft: responsiveWidth(17), fontSize: responsiveFontSize(1.2) }}>{this.state.errorMessage}</Animatable.Text>
        else
            error = null
        return (
            <KeyboardAvoidingView style={{ flex: this.props.flexSize }}>
                <Fumi
                    label={this.props.name}
                    iconClass={this.props.iconClass}
                    iconName={this.props.iconName}
                    iconColor={'#008080'}
                    iconSize={responsiveHeight(3)}
                    inputPadding={responsiveHeight(3)}
                    labelStyle={{ fontSize: responsiveFontSize(2) }}
                    inputStyle={{ fontSize: responsiveFontSize(2), color: '#4c516d' }}
                    onChangeText={text => this.validate(text)}
                    value={this.state.value}
                    keyboardType={this.props.keyboardType}
                />
                {error}
            </KeyboardAvoidingView>
        )
    }
}