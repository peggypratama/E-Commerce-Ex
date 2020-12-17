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
            rentColor: '#008080', 
            saleColor: 'white',
            rentFontColor:'#008080',
            saleFontColor:'#4c516d',
            option: ''
        }
        this.updateParent = this.props.updateParent
        this.initialState = this.state
    }

    componentWillMount = () => {
        if (this.props.value == 'akun')
            this.OnSalePress()
        else if (this.props.value == 'toko')
            this.OnRentPress()
    }

    async componentDidUpdate(prevProps) {
        if (this.props.value != prevProps.value) {
            if (this.props.value == 'toko' && this.state.option != 'toko')
                this.OnRentPress()
            else if (this.props.value == 'akun' && this.state.option != 'akun')
                this.OnSalePress()
            else if (this.props.value == '')
                this.setState(this.initialState)
        }
    }

    OnRentPress = () => {
        this.setState({ 
            option: 'Rent',
            rentColor: '#008080', 
            saleColor: 'white',
            rentFontColor:'#008080',
            saleFontColor:'#4c516d'
        })
        this.updateParent('Rent')
    }

    OnSalePress = () => {
        this.setState({ 
            option: 'Sale',
            rentColor: 'white',
            saleColor: '#008080',
            rentFontColor:'#4c516d',
            saleFontColor:'#008080'
        })
        this.updateParent('Sale')
    }

    render() {
        return (
            <View style={{ elevation:1, flex: this.props.flexSize, flexDirection: 'row', height: responsiveHeight(7), borderTopColor:'#c6c8cc', borderTopWidth:responsiveWidth(0.3) }}>
                <View style={styles.radioBtnContainer}>
                    <TouchableOpacity style={[{ borderBottomColor: this.state.rentColor }, styles.radioBtn]} onPress={this.OnRentPress}>
                        <Text style={[styles.radioBtnTxt, {color:this.state.rentFontColor}]}>Rent</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.radioBtnContainer}>
                    <TouchableOpacity style={[{ borderBottomColor: this.state.saleColor }, styles.radioBtn]} onPress={this.OnSalePress}>
                        <Text style={[styles.radioBtnTxt, {color:this.state.saleFontColor}]}>Sale</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    radioBtn: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#4c516d',
        width: responsiveWidth(50),
        borderBottomWidth:responsiveWidth(1)
    },
    radioBtnContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioBtnTxt: {
        color: 'white',
        fontSize: responsiveFontSize(2)
    }
})