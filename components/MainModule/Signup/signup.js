import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import * as firebase from 'firebase'
import 'firebase/firestore'
import { Hoshi } from 'react-native-textinput-effects';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { signup, emailVerification, logout, getUserFirestoreObj, getCurrentUserObj } from '../../Utility/utility';
import LinearGradient from 'react-native-linear-gradient';
import DialogBox from '../../CommonModules/DialogBox/dialogBox'

export default class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '', lastName: '', email: '',
            password: '', confirmPassword: '', phoneNumber: '', address: '', accountn: '', bank: '',

            errfn: '', errln: '', errem: '',
            errps: '', errcps: '', errpn: '',

            formEmptyDialog: false, formErrorDialog: false, btnIndicator: false,
            btnDisabled: false, signupErrorDialog: false, signupError: '',
        }
        this.initialState = this.state
        this.validate = this.validate.bind(this)
        this.goToLogin = this.goToLogin.bind(this)
        this.isFormEmpty = this.isFormEmpty.bind(this)
        this.isErrorFree = this.isErrorFree.bind(this)
    }

    validate(text, type) {
        if (type == 'firstName') {
            this.setState({ firstName: text })
            let msg = this.getMatch(/^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$/, text, "First Name only contains alphabets")
            this.setState({ errfn: msg })
        }
        else if (type == 'lastName') {
            this.setState({ lastName: text })
            let msg = this.getMatch(/^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$/, text, "Last Name only contains alphabets")
            this.setState({ errln: msg })
        }
        else if (type == 'email') {
            this.setState({ email: text })
            let msg = this.getMatch(/[A-Za-z]+([A-Za-z0-9]|[.]|[_])*[@][A-Za-z]+[.]com$/, text, "Email format example abc@abc.com")
            this.setState({ errem: msg })
        }
        else if (type == 'password') {
            this.setState({ password: text })
            let msg = this.getMatch(/^.{8,20}$/, text, "Password must be between 8 to 20 characters")
            this.setState({ errps: msg })
        }
        else if (type == 'confirmPassword') {
            this.setState({ confirmPassword: text })
            if (this.state.password != text)
                this.setState({ errcps: "Does not match password" })
            else
                this.setState({ errcps: "" })
        }
        else if (type == 'phoneNumber') {
            this.setState({ phoneNumber: text })
            let msg = this.getMatch(/[0-9].{11}$/, text, "Phone Number must be between 12 characters")
            this.setState({ errpn: msg })
        }
        else if (type == 'address') {
            this.setState({ address: text })
            let msg = this.getMatch(/[A-Za-z0-9]$/, text, "Email format example abc@abc.com")
            this.setState({ errpn: msg })
        }
    }

    getMatch(regex, text, errMsg) {
        let msg = ''
        if (regex.test(text))
            msg = ""
        else
            msg = errMsg
        return msg
    }

    isFormEmpty() {
        if (this.state.firstName != '' && this.state.lastName != '' && this.state.email != '' && this.state.password != '' && this.state.confirmPassword != '' && this.state.phoneNumber != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    isErrorFree() {
        if (this.state.errfn == '' && this.state.errln == '' && this.state.errem == '' && this.state.errps == '' && this.state.errcps == '' && this.state.errpn == '')
            return true
        this.setState({ formErrorDialog: true })
        return false
    }

    goToLogin = async () => {
        if (!this.isFormEmpty() && this.isErrorFree()) {
            this.setState({ btnDisabled: true })
            this.setState({ btnIndicator: true })
            await signup(this.state.email, this.state.password, this.state.firstName + ' ' + this.state.lastName).then(() => {
                var user = firebase.auth().currentUser;
                if (!user)
                    throw new Exception()
                logout()
                if (getCurrentUserObj()) {
                    firebase.firestore().collection('Users').doc().set({
                        'firstName': this.state.firstName,
                        'lastName': this.state.lastName,
                        'password': this.state.password,
                        'phoneNumber': this.state.phoneNumber,
                        'address': '',
                        'provinceId': '',
                        'provinceName': '',
                        'cityId': '',
                        'cityName': '',
                        'type': 'Super User',
                        'accountn': '',
                        'bank': '',
                        'userID': user.uid,
                        'account': 'local',
                        'email':this.state.email,
                        'disabled':false
                    });
                }
                emailVerification()
                this.setState(this.initialState)
                this.props.navigation.navigate('Login')
            }).catch((error) => {
                this.setState({ signupError: error.message })
                this.setState({ signupErrorDialog: true })
            }
            ).finally(() => {
                this.setState({ btnDisabled: false })
                this.setState({ btnIndicator: false })
            })
        }
    }

    render() {
        let btnDisplay;
        if (this.state.btnIndicator)
            btnDisplay = <ActivityIndicator size={responsiveHeight(4)} color={'white'} />
        else
            btnDisplay = <Text style={styles.btnTxt}>SIGN UP</Text>

        return (
            <View style={{ flex: 1 }}>

                <DialogBox resetState={() => this.setState({ formErrorDialog: false })} showDialog={this.state.formErrorDialog} title={'Sign Up Failed'} description={'The form has not been filled correctly'} />
                <DialogBox resetState={() => this.setState({ formEmptyDialog: false })} showDialog={this.state.formEmptyDialog} title={'Sign Up Failed'} description={'Please fill the form in order to continue'} />
                <DialogBox resetState={() => this.setState({ signupErrorDialog: false })} showDialog={this.state.signupErrorDialog} title={'Sign Up Failed'} description={this.state.signupError} />

                <View style={{ flex: 1 }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={styles.gradient}>
                        <Image style={styles.logo} source={require('../../../Images/textlogo.png')}></Image>
                    </LinearGradient>
                </View>
                <View style={{ flex: 3, alignItems: 'center' }}>
                    <ScrollView style={{ height: responsiveHeight(100), width: responsiveWidth(100) }}>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: responsiveHeight(3) }}>
                            <View style={styles.txtContainer}>
                                <Hoshi onChangeText={text => this.validate(text, "firstName")} label={'First Name'} borderColor={'#008080'} labelStyle={styles.txtLbl} inputStyle={styles.txtInput} style={styles.txt} />
                                <Text style={styles.error}>{this.state.errfn}</Text>
                            </View>
                            <View style={styles.txtContainer}>
                                <Hoshi onChangeText={text => this.validate(text, "lastName")} label={'Last Name'} borderColor={'#008080'} labelStyle={styles.txtLbl} inputStyle={styles.txtInput} style={styles.txt} />
                                <Text style={styles.error}>{this.state.errln}</Text>
                            </View>
                            <View style={styles.txtContainer}>
                                <Hoshi onChangeText={text => this.validate(text, "email")} label={'Email'} borderColor={'#008080'} labelStyle={styles.txtLbl} inputStyle={styles.txtInput} style={styles.txt} />
                                <Text style={styles.error}>{this.state.errem}</Text>
                            </View>
                            <View style={styles.txtContainer}>
                                <Hoshi onChangeText={text => this.validate(text, "phoneNumber")} label={'Phone Number'} borderColor={'#008080'} labelStyle={styles.txtLbl} inputStyle={styles.txtInput} style={styles.txt} />
                                <Text style={styles.error}>{this.state.errpn}</Text>
                            </View>
                            <View style={styles.txtContainer}>
                                <Hoshi onChangeText={text => this.validate(text, "password")} label={'Password'} borderColor={'#008080'} labelStyle={styles.txtLbl} inputStyle={styles.txtInput} style={styles.txt} secureTextEntry={true} />
                                <Text style={styles.error}>{this.state.errps}</Text>
                            </View>
                            <View style={styles.txtContainer}>
                                <Hoshi onChangeText={text => this.validate(text, "confirmPassword")} label={'Confirm Password'} borderColor={'#008080'} labelStyle={styles.txtLbl} inputStyle={styles.txtInput} style={styles.txt} secureTextEntry={true} />
                                <Text style={styles.error}>{this.state.errcps}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={this.goToLogin} disabled={this.state.btnDisabled}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={styles.btn}>
                            {btnDisplay}
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text onPress={() => { this.setState(this.initialState); this.props.navigation.navigate('Login') }} style={{ color: '#4c516d', marginVertical: responsiveHeight(4) }}>Already have an account? <Text style={{ color: '#008080' }}>Login</Text></Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    gradient: {
        position: 'relative',
        zIndex: 1,
        flex: 1,
        borderBottomRightRadius: responsiveWidth(50),
        paddingBottom: responsiveHeight(19),
        paddingHorizontal: responsiveWidth(5)
    },
    logo: {
        width: responsiveWidth(50),
        height: responsiveHeight(30),
        resizeMode: 'contain',
    },
    txt: {
        width: responsiveWidth(85)
    },
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
        paddingHorizontal: responsiveWidth(20),
        paddingVertical: responsiveHeight(0.1)
    },
    error: {
        marginTop: responsiveHeight(0.5),
        color: 'red'
    },
    btn: {
        width: responsiveWidth(86),
        height: responsiveHeight(6.7),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: responsiveWidth(3),
    },
    btnTxt: {
        color: 'white',
        fontSize: responsiveFontSize(2.3),
        letterSpacing: responsiveWidth(0.4),
    },
})