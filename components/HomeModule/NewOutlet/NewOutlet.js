import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    YellowBox
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";

import InternalHeader from '../../CommonModules/InternalHeader/reverseInternalHeader'
import DefaultTextInput from '../../CommonModules/DefaultTextInput/defaultTextInput'
import PostButton from '../../CommonModules/PostButton/postButton'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'
import SelectedImage from '../../CommonModules/SelectedImage/selectedImage'
import UploadPictures from '../../CommonModules/UploadPictures/uploadPictures'
import CategoryRadioButtons from '../../CommonModules/CategoryRadioButton/categoryRadioButton'
import LocationPickerButton from '../../CommonModules/LocationPickerButton/locationPickerButton'

import * as firebase from 'firebase'
import 'firebase/firestore'
import { getFirestoreUserByEmail, setStore, addStore,uploadStoreImages } from '../../Utility/utility'

export default class NewOutlet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            coverPath: '', logoPath: '', name: '',
            email: '', category: '', location: null,
        }
        this.initialState = this.state
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    isFormEmpty = () => {
        if (this.state.category != '' && this.state.email != '' && this.state.name != '' && this.state.logoPath && this.state.coverPath)
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    addOutlet = async () => {
        if (!this.isFormEmpty()) {
            await getFirestoreUserByEmail(this.state.email).then(async userObj => {
                let outletObj = {
                    marketeerID: userObj.docData.userID, marketeerEmail: userObj.docData.email,
                    name: this.state.name, category: this.state.category, location: this.state.location
                }
                await addStore(outletObj).then(async ref => {
                    await uploadStoreImages(this.state.coverPath, ref).then(async coverUrl => {
                        outletObj.coverURL = coverUrl
                        await uploadStoreImages(this.state.logoPath, ref).then(async logoUrl => {
                            outletObj.logoURL = logoUrl
                            setStore(ref, outletObj).then(() => {
                                this.goToDashboard()
                            })
                        })
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
        let cover, logo;
        if (this.state.coverPath)
            cover = <SelectedImage width={responsiveWidth(100)} height={responsiveHeight(25)} resetParent={() => this.setState({ coverPath: null })} flexSize={3} filepath={this.state.coverPath} />
        else
            cover = <UploadPictures width={responsiveWidth(100)} height={responsiveHeight(25)} placeholder={'cover'} updateParent={(cover) => this.setState({ coverPath: cover })} />
        if (this.state.logoPath)
            logo = <SelectedImage width={responsiveWidth(30)} height={responsiveHeight(15)} resetParent={() => this.setState({ logoPath: null })} flexSize={1} filepath={this.state.logoPath} />
        else
            logo = <UploadPictures width={responsiveWidth(30)} height={responsiveHeight(15)} placeholder={'logo'} updateParent={(cover) => this.setState({ logoPath: cover })} />
        return (
            <View style={{ flex: 1 }}>
                <DialogBox resetState={() => this.setState({ formEmptyDialog: false })} showDialog={this.state.formEmptyDialog} title={'Register Failed'} description={'Please fill the form in order to continue'} />
                <InternalHeader flexSize={1} name={'New Outlet'} action={this.goToDashboard} />
                <View style={{ flex: 11 }}>
                    <ScrollView>
                        {cover}
                        <View style={{ flex: 1.5, flexDirection: 'row', paddingVertical: responsiveHeight(2) }}>
                            <View style={{ flex: 1 }} />
                            {logo}
                            <View style={{ flex: 1 }} />
                        </View>
                        <CategoryRadioButtons margin={responsiveHeight(2)} flexSize={3} value={this.state.category} updateParent={(val) => this.setState({ category: val })} />

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginVertical: responsiveHeight(1) }}>
                            <DefaultTextInput marginVertical={responsiveHeight(2)} name={'Outlet Name'} value={this.state.name} errorMessage={'Invalid Outlet Name'} setErrorState={(val) => this.setState({ errnm: val })} setValueState={(val) => this.setState({ name: val })} regex={/^([a-zA-Z0-9]|[ ])+$/} width={90} />
                            <DefaultTextInput marginVertical={responsiveHeight(2)} name={'Marketeer Email'} value={this.state.email} errorMessage={'Invalid email address format'} setErrorState={(val) => this.setState({ errem: val })} setValueState={(val) => this.setState({ email: val })} regex={/[A-Za-z]+([A-Za-z0-9]|[.]|[_])*[@][A-Za-z]+[.]com$/} width={90} />
                        </View>
                        <LocationPickerButton margin={responsiveHeight(2)} height={20} width={90} latLong={this.state.location} action={() => this.props.navigation.navigate('LocationPicker', { 'updateParent': val => this.setState({ location: val }), 'marker': this.state.location })} />
                        <PostButton flexSize={1} buttonText={'REGISTER'} action={this.addOutlet} />
                    </ScrollView>
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