import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';

import { Akira } from 'react-native-textinput-effects';
import { responsiveHeight, responsiveWidth, responsiveFontSize, useResponsiveFontSize } from 'react-native-responsive-dimensions';

export default class DescriptionSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            description: this.props.value,
        }
        this.updateParent = this.props.updateParent
    }

    componentWillMount = () => {
        if (!this.state.description)
            this.setState({ description: '' })
    }

    async componentDidUpdate(prevProps) {
        if (this.props.value != prevProps.value)
            await this.setState({ description: this.props.value })
    }

    update = text => {
        this.setState({ description: text })
        this.updateParent(text)
    }

    styles = StyleSheet.create({
        container: {
            flex: this.props.flexSize,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: this.props.margin
        },
        label: {
            fontWeight: 'bold',
            fontSize: responsiveFontSize(2.5),
            marginBottom: responsiveHeight(1)
        },
        input: {
            flex: 1,
            paddingHorizontal: responsiveWidth(2),
            width: responsiveWidth(90),
            borderWidth: responsiveWidth(1),
            borderRadius: responsiveWidth(3),
            borderColor: '#dcdcdc',
            height: this.props.height
        }
    })

    getBorderColor = () => {
        if (this.state.description != '')
            return '#008080'
        return '#dcdcdc'
    }

    getLabelColor = () => {
        if (this.state.description != '')
            return '#bababa'
        return '#008080'
    }

    render() {
        var borderColor = this.getBorderColor()
        var labelColor = this.getLabelColor()
        return (
            <KeyboardAvoidingView style={this.styles.container}>
                <Text style={[this.styles.label, { color: labelColor }]}>{this.props.label}</Text>
                <TextInput
                    placeholder={this.props.placeholder}
                    style={[this.styles.input, { borderColor: borderColor }]}
                    multiline={true}
                    numberOfLines={10}
                    underlineColorAndroid={'transparent'}
                    onChangeText={text => this.update(text)}
                    value={this.state.description}
                    keyboardType={this.props.keyboardType}
                />
            </KeyboardAvoidingView>
        )
    }
}