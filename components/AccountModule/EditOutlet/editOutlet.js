import React, { Component } from 'react';
import {
    View,
    ScrollView,
    AsyncStorage,
    YellowBox
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";

import InternalHeader from '../../CommonModules/InternalHeader/reverseInternalHeader'
import PostButton from '../../CommonModules/PostButton/postButton'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'
import SelectedImage from '../../CommonModules/SelectedImage/selectedImage'
import UploadPictures from '../../CommonModules/UploadPictures/uploadPictures'
import LocationPickerButton from '../../CommonModules/LocationPickerButton/locationPickerButton'

import { getCurrentUid } from '../../Utility/utility'
import { getFirestoreUserByEmail, setStore, addStore, getStore, updateStore } from '../../Utility/utility'
import { uploadStoreImages, deleteAdImage } from '../../Utility/utility'

export default class EditOutlet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            coverPath: '', logoPath: '',
            storeObj: null, location: null,
        }
        this.initialState = this.state
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
        await getCurrentUid().then(async uid => {
            await getStore(uid).then(storeObj => {
                let storeData = storeObj.docData
                this.setState({
                    storeObj: storeObj,
                    coverPath: { uri: storeData.coverURL },
                    logoPath: { uri: storeData.logoURL },
                    location: storeData.location
                })
            })
        }).catch(err => console.log(err))
    }

    isFormEmpty = () => {
        if (this.state.category != '' && this.state.email != '' && this.state.name != '' && this.state.logoPath && this.state.coverPath)
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    editOutlet = async () => {
        try {
            if (!this.isFormEmpty()) {
                let storeObj = {
                    location: this.state.location,
                    coverURL: this.state.coverPath.uri,
                    logoURL: this.state.logoPath.uri
                }
                if (this.state.coverPath.uri != this.state.storeObj.docData.coverURL) {
                    await this.replaceImage(this.state.storeObj.docData.coverURL, this.state.coverPath).then(url => {
                        storeObj.coverURL = url
                    }).catch(err => { throw err })
                }
                if (this.state.logoPath.uri != this.state.storeObj.docData.logoURL) {
                    await this.replaceImage(this.state.storeObj.docData.logoURL, this.state.logoPath).then(url => {
                        storeObj.logoURL = url
                    }).catch(err => { throw err })
                }
                await updateStore(this.state.storeObj.docID, storeObj).then(() => {
                    this.goToDashboard()
                }).catch(err => { throw err })
            }
        } catch (err) { console.log(err) }
    }

    replaceImage = async (oldUrl, newResponse) => {
        let url;
        await deleteAdImage(oldUrl).then(async () => {
            await uploadStoreImages(newResponse, this.state.storeObj.docID).then(async imageUrl => {
                url = imageUrl
            })
        }).catch(error => { return null })
        return url
    }

    goToDashboard = () => {
        this.setState(this.initialState)
        this.props.navigation.goBack()
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
                <InternalHeader flexSize={1} name={'Edit Outlet'} action={this.goToDashboard} />
                <View style={{ flex: 11, alignItems: 'center' }}>
                    <ScrollView>
                        {cover}
                        <View style={{ alignItems: 'center', marginVertical: responsiveHeight(3) }}>
                            {logo}
                        </View>
                        <LocationPickerButton margin={responsiveHeight(2)} height={20} width={90} latLong={this.state.location} action={() => this.props.navigation.navigate('LocationPicker', { 'updateParent': val => this.setState({ location: val }), 'marker': this.state.location })} />
                        <PostButton flexSize={1} buttonText={'EDIT'} action={this.editOutlet} />
                    </ScrollView>
                </View>
            </View>
        )
    }
}