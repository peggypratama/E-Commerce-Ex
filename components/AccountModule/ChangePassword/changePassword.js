import React, { Component } from 'react';
import { View,YellowBox } from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'
import DefaultTextInput from '../../CommonModules/DefaultTextInput/defaultTextInput'
import PostButton from '../../CommonModules/PostButton/postButton';
import DialogBox from '../../CommonModules/DialogBox/dialogBox'

import { getUserFirestoreObj, changePassword } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userObj: null, userObjID: '',
            oldPassword: '', newPassword: '', confirmNewPassword: '', tempOldPass: '',
            errop: false, errnp: false, errcnp: false,
            formEmptyDialog: false, formErrorDialog: false, noMatchDialog: false, incorrectOldPassDialog: false
        }
        this.initialState = this.state
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
        await getUserFirestoreObj().then(async user => {
            await this.setState({
                userObjID: user[0],
                userObj: user[1],
                tempOldPass: user[1].password
            })
        })
    }

    setNewPassword = async () => {
        if (!this.isFormEmpty() && this.isErrorFree()) {
            if (this.state.newPassword != this.state.confirmNewPassword)
                this.setState({ noMatchDialog: true })
            else if (this.state.oldPassword != this.state.tempOldPass)
                this.setState({ incorrectOldPassDialog: true })
            else {
                this.state.userObj.password = this.state.newPassword
                await changePassword(this.state.oldPassword, this.state.newPassword).then(async () => {
                    await firebase.firestore().collection('Users').doc(this.state.userObjID).set(this.state.userObj).then(() => {
                        this.setState(this.initialState)
                        this.props.navigation.navigate('Account')
                    }).catch(error => console.log('changePass ', error.message))
                }).catch(error => console.log(error.message))
            }
        }
    }

    isFormEmpty = () => {
        if (this.state.oldPassword != '' && this.state.newPassword != '' && this.state.confirmNewPassword != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    isErrorFree = () => {
        if (!this.state.errop && !this.state.errnp && !this.state.errcnp)
            return true
        this.setState({ formErrorDialog: true })
        return false
    }

    render() {
        return (
            <View style={{ flex: 1, }}>
                <DialogBox resetState={() => this.setState({ formErrorDialog: false })} showDialog={this.state.formErrorDialog} title={'Password Change Failed'} description={'The form has not been filled correctly'} />
                <DialogBox resetState={() => this.setState({ formEmptyDialog: false })} showDialog={this.state.formEmptyDialog} title={'Password Change Failed'} description={'Please fill the form in order to continue'} />
                <DialogBox resetState={() => this.setState({ noMatchDialog: false })} showDialog={this.state.noMatchDialog} title={'Password Change Failed'} description={'New Password and Confirm New Password does not match'} />
                <DialogBox resetState={() => this.setState({ incorrectOldPassDialog: false })} showDialog={this.state.incorrectOldPassDialog} title={'Password Change Failed'} description={'The old password is incorrect'} />

                <InternalHeader action={() => { this.setState(this.initialState); this.props.navigation.navigate('Account') }} name={'Change Password'} flexSize={0.7} />

                <View style={{ flex: 5 }}>
                    <DefaultTextInput secureTextEntry={true} flexSize={0.5} marginVertical={responsiveHeight(0)} name={'Old Password'} value={this.state.oldPassword} errorMessage={'Password must contain atleast 8 characters'} setErrorState={(val) => this.setState({ errop: val })} setValueState={(val) => this.setState({ oldPassword: val })} regex={/^.{8,30}$/} width={90} />
                    <DefaultTextInput secureTextEntry={true} flexSize={0.5} marginVertical={responsiveHeight(0)} name={'New Password'} value={this.state.newPassword} errorMessage={'Password must contain atleast 8 characters'} setErrorState={(val) => this.setState({ errnp: val })} setValueState={(val) => this.setState({ newPassword: val })} regex={/^.{8,30}$/} width={90} />
                    <DefaultTextInput secureTextEntry={true} flexSize={0.5} marginVertical={responsiveHeight(0)} name={'Confirm New Password'} value={this.state.confirmNewPassword} errorMessage={'Password must contain atleast 8 characters'} setErrorState={(val) => this.setState({ errcnp: val })} setValueState={(val) => this.setState({ confirmNewPassword: val })} regex={/^.{8,30}$/} width={90} />
                    <PostButton action={this.setNewPassword} flexSize={0.4} buttonText={'CHANGE PASSWORD'} />
                </View>

                <View style={{ flex: 2 }} />

            </View>
        );
    }
}