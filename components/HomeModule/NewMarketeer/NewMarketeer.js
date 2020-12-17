import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    YellowBox
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";

import InternalHeader from '../../CommonModules/InternalHeader/reverseInternalHeader'
import DefaultTextInput from '../../CommonModules/DefaultTextInput/defaultTextInput'
import PostButton from '../../CommonModules/PostButton/postButton'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'

import { setUserFirestoreObj,signup, getCurrentUid } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class NewMarketeer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '', lastName: '', email: '', password: '', phoneNumber: '',
            type: 'Marketeer', account: 'local',
        }
        this.initialState = this.state
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    isFormEmpty = () => {
        if (this.state.email != '' && this.state.firstName != '' && this.state.lastName != '' && this.state.phoneNumber != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    addMarketeer = async () => {
        if (!this.isFormEmpty()) {
            await this.generatePassword().then(async pass => {
                this.setState({ password: pass })
                let obj = {
                    email: this.state.email, password: this.state.password, firstName: this.state.firstName,
                    lastName: this.state.lastName, disabled: false, account: 'local', type: "Marketeer", phoneNumber: this.state.phoneNumber
                }
                await signup(this.state.email, this.state.password, this.state.firstName + ' ' + this.state.lastName).then(async () => {
                    await getCurrentUid().then(async uid => {
                        obj.userID = uid
                        await setUserFirestoreObj(obj)
                        this.goToDashboard()
                    })
                })
            }).catch(err => console.log(err))
        }
    }

    goToDashboard = () => {
        this.setState(this.initialState)
        this.props.navigation.goBack()
    }

    generatePassword = async () => {
        let pass = ""
        for (let i = 0; i < 8; i++)
            pass += '1';//Math.floor((Math.random() * 10) + 1);
        return pass
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <DialogBox resetState={() => this.setState({ formEmptyDialog: false })} showDialog={this.state.formEmptyDialog} title={'Register Failed'} description={'Please fill the form in order to continue'} />
                <InternalHeader flexSize={1} name={'New Marketeer'} action={this.goToDashboard} />
                <View style={{ flex: 10 }}>
                    <View style={{ flex: 4 }}>
                        <DefaultTextInput marginVertical={responsiveHeight(2)} name={'First Name'} value={this.state.firstName} errorMessage={'First Name only contains alphabets'} setErrorState={(val) => this.setState({ errfn: val })} setValueState={(val) => this.setState({ firstName: val })} regex={/^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$/} width={90} />
                        <DefaultTextInput marginVertical={responsiveHeight(2)} name={'Last Name'} value={this.state.lastName} errorMessage={'Last Name only contains alphabets'} setErrorState={(val) => this.setState({ errln: val })} setValueState={(val) => this.setState({ lastName: val })} regex={/^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$/} width={90} />
                        <DefaultTextInput marginVertical={responsiveHeight(2)} name={'Email'} value={this.state.email} errorMessage={'Invalid email address format'} setErrorState={(val) => this.setState({ errem: val })} setValueState={(val) => this.setState({ email: val })} regex={/[A-Za-z]+([A-Za-z0-9]|[.]|[_])*[@][A-Za-z]+[.]com$/} width={90} />
                        <DefaultTextInput marginVertical={responsiveHeight(2)} name={'Phone Number'} value={this.state.phoneNumber} errorMessage={'Correct format : xxxx xxxxxxx'} setErrorState={(val) => this.setState({ errpn: val })} setValueState={(val) => this.setState({ phoneNumber: val })} regex={/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/} width={90} />
                    </View>
                    <View style={{ flex: 0.8 }}>
                        <PostButton flexSize={1} buttonText={'REGISTER'} action={this.addMarketeer} />
                    </View>
                    <View style={{ flex: 1 }} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    floatingDock: {
        backgroundColor: '#008080',
        position: 'absolute',
        width: responsiveWidth(14.5),
        height: responsiveHeight(7.5),
        borderRadius: responsiveHeight(10),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 15,
        top: responsiveHeight(80),
        left: responsiveWidth(81),
    },
});  