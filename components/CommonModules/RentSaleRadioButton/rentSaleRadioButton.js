import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class RentSaleRadioButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rentColor: '#a3a3a3',
            saleColor: '#a3a3a3',
            option: ''
        }
        this.updateParent = this.props.updateParent
        this.initialState = this.state
    }

    componentWillMount = () => {
        if (this.props.value == 'Sale')
            this.OnSalePress()
        else if (this.props.value == 'Rent')
            this.OnRentPress()
    }

    async componentDidUpdate(prevProps) {
        if (this.props.value != prevProps.value) {
            if (this.props.value == 'Rent' && this.state.option != 'Rent')
                this.OnRentPress()
            else if (this.props.value == 'Sale' && this.state.option != 'Sale')
                this.OnSalePress()
            else if (this.props.value == '')
                this.setState(this.initialState)
        }
    }

    OnRentPress = () => {
        this.setState({ option: 'Rent' })
        this.updateParent('Rent')
        this.setState({ rentColor: '#008080' })
        this.setState({ saleColor: '#a3a3a3' })
    }

    OnSalePress = () => {
        this.setState({ option: 'Sale' })
        this.updateParent('Sale')
        this.setState({ rentColor: '#a3a3a3' })
        this.setState({ saleColor: '#008080' })
    }

    render() {
        return (
            <View style={{ flex: this.props.flexSize, flexDirection: 'row', height: responsiveHeight(15) }}>
                <View style={styles.radioBtnContainer}>
                    <TouchableOpacity style={[{ backgroundColor: this.state.rentColor }, styles.radioBtn]} onPress={this.OnRentPress}>
                        <Text style={styles.radioBtnTxt}>Rent</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.radioBtnContainer}>
                    <TouchableOpacity style={[{ backgroundColor: this.state.saleColor }, styles.radioBtn]} onPress={this.OnSalePress}>
                        <Text style={styles.radioBtnTxt}>Sale</Text>
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
        borderRadius: responsiveHeight(10),
        height: responsiveHeight(15),
        width: responsiveWidth(30)
    },
    radioBtnContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioBtnTxt: {
        color: 'white',
        fontSize: responsiveFontSize(3)
    }
})