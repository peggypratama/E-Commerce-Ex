import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class DealTypeRadioButtons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dealColor: '#a3a3a3',
            ComissionColor: '#a3a3a3',
            option: ''
        }
        this.updateParent = this.props.updateParent
        this.initialState = this.state
    }

    componentWillMount = () => {
        if (this.props.value == 'Full Deal')
            this.onDealPress()
        else if (this.props.value == 'Commission')
            this.OnComissionPress()
    }

    async componentDidUpdate(prevProps) {
        if (this.props.value != prevProps.value) {
            if (this.props.value == 'Full Deal' && this.state.option != 'Full Deal')
                this.onDealPress()
            else if (this.props.value == 'Comission' && this.state.option != 'Comission')
                this.OnComissionPress()
            else if (this.props.value == '')
                this.setState(this.initialState)
        }
    }

    onDealPress = () => {
        this.setState({ option: 'Full Deal' })
        this.updateParent('Full Deal')
        this.setState({ dealColor: '#008080' })
        this.setState({ ComissionColor: '#a3a3a3' })
    }

    OnComissionPress = () => {
        this.setState({ option: 'Comission' })
        this.updateParent('Comission')
        this.setState({ dealColor: '#a3a3a3' })
        this.setState({ ComissionColor: '#008080' })
    }

    render() {
        return (
            <View style={{ flex: this.props.flexSize, flexDirection: 'row', height: responsiveHeight(15) }}>
                <View style={styles.radioBtnContainer}>
                    <TouchableOpacity style={[{ backgroundColor: this.state.dealColor }, styles.radioBtn]} onPress={this.onDealPress}>
                        <Text style={styles.radioBtnTxt}>Full Deal</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.radioBtnContainer}>
                    <TouchableOpacity style={[{ backgroundColor: this.state.ComissionColor }, styles.radioBtn]} onPress={this.OnComissionPress}>
                        <Text style={styles.radioBtnTxt}>Comission</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    radioBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#4c516d',
        borderRadius: responsiveHeight(1),
        height: responsiveHeight(5),
        width: responsiveWidth(40),
    },
    radioBtnContainer: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioBtnTxt: {
        color: 'white',
        fontSize: responsiveFontSize(2.3)
    }
})