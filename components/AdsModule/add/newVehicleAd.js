import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, AsyncStorage, YellowBox } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import { getCurrentUid,getUserFirestoreObj,uploadAdImage, deleteAdImage } from '../../Utility/utility'

import * as firebase from 'firebase'
import 'firebase/firestore'

import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import InternalHeader from '../../CommonModules/InternalHeader/reverseInternalHeader'
import DefaultFeature from '../../CommonModules/DefaultFeature/defaultFeature'
import DefaultRadioFeature from '../../CommonModules/DefaultRadioFeature/defaultRadioFeature'
import UploadPictures from '../../CommonModules/UploadPictures/uploadPictures';
import DescriptionSection from '../../CommonModules/DescriptionSection/descriptionSection'
import PostButton from '../../CommonModules/PostButton/postButton';
import SelectedImage from '../../CommonModules/SelectedImage/selectedImage'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'
import LocationPickerButton from '../../CommonModules/LocationPickerButton/locationPickerButton'
import RentSaleRadioButton from '../../CommonModules/RentSaleRadioButton/rentSaleRadioButton'
import AdHeading from '../../CommonModules/AdHeading/adHeading'

export default class NewVehicleAd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imagePath: null, formEmptyDialog: false, formErrorDialog: false,
            oldImageUrl: null, pageType: 'New ', buttonText: 'POST',
            description: '', title: '', rentSale: '',
            price: '', location: null,

            modelYear: '', transmission: '', color: '', mileage: '',

            airConditioning: 'Yes', alloyRims: 'Yes', centralLocking: 'Yes',
            airbags: 'Yes', mediaPlayer: 'Yes',

            errmy: false, errtrns: false, errcol: false, errmil: false
        }
        this.initState = this.state
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
        storeObj = await AsyncStorage.getItem('storeObj');
        storeObj = JSON.parse(storeObj)
        this.setState({ storeObj: storeObj })
        let temp = this.props.navigation.getParam('info')
        if (temp) {
            temp = temp.obj
            this.setState({
                imagePath: { uri: temp['imageUrl'] }, title: temp['Title'], oldImageUrl: { uri: temp['imageUrl'] },
                description: temp['Description'], price: temp['Price'], pageType: 'Edit ',
                location: temp['Location'], rentSale: temp['Type'], buttonText: 'EDIT',

                modelYear: temp['Model Year'], transmission: temp['Transmission'], color: temp['Color'],
                mileage: temp['Mileage'], airConditioning: temp['Air Conditioning'], alloyRims: temp['Alloy Rims'],
                centralLocking: temp['Central Locking'], airbags: temp['Airbags'], mediaPlayer: temp['Media Player'],
            })
        }
    }

    isFormEmpty = () => {
        if (this.state.location && this.state.rentSale != '' && this.state.price != '' && this.state.imagePath && this.state.title != '' && this.state.description != '' && this.state.modelYear != '' && this.state.transmission != '' && this.state.color != '' && this.state.mileage != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    isErrorFree = () => {
        if (!this.state.errmy && !this.setState.errtrns && !this.state.errcol && !this.state.errmil)
            return true
        this.setState({ formErrorDialog: true })
        return false
    }

    getAdObj = uid => {
        let adObj = {
            'Title': this.state.title, 'Description': this.state.description, 'uid': uid, 'Price': this.state.price, 'timestamp': firebase.firestore.FieldValue.serverTimestamp(),
            'outletID': this.state.storeObj.docID, 'Category': 'Vehicles', 'Type': this.state.rentSale, 'Location': this.state.location,
            'Deliverable': false,

            'Model Year': this.state.modelYear, 'Transmission': this.state.transmission, 'Color': this.state.color,
            'Mileage': this.state.mileage, 'Air Conditioning': this.state.airConditioning, 'Alloy Rims': this.state.alloyRims,
            'Central Locking': this.state.centralLocking, 'Airbags': this.state.airbags, 'Media Player': this.state.mediaPlayer,
        }
        return adObj
    }

    postAd = async () => {
        try {
            await getCurrentUid().then(async uid => {
                const db = firebase.firestore()
                let adObj = this.getAdObj(uid)
                await db.collection('Ads').add(adObj).then(async ref => {
                    await uploadAdImage(this.state.imagePath, 'Vehicles', uid, ref.id).then(async imageUrl => {
                        adObj.imageUrl = imageUrl
                        adObj.timestamp = firebase.firestore.FieldValue.serverTimestamp()
                        await db.collection('Ads').doc(ref.id).set(adObj).then(() => {
                            this.setState(this.initState)
                            this.props.navigation.navigate('Dashboard')
                        }).catch(error => this.setPostError(error))
                    }).catch(error => this.setPostError(error))
                }).catch(error => this.setPostError(error))
            }).catch(error => console.log(error.message))
        }
        catch (error) {
            console.log(error)
        }
    }

    editAd = async () => {
        let info = this.props.navigation.getParam('info')
        let uid = info.obj['uid'], adID = info.obj.adID
        let adObj = this.getAdObj(uid)
        if (this.state.oldImageUrl.uri != this.state.imagePath.uri) {
            await deleteAdImage(this.state.oldImageUrl.uri).then(async () => {
                await uploadAdImage(this.state.imagePath, this.state.category, uid, adID).then(async imageUrl => {
                    adObj.imageUrl = imageUrl
                }).catch(error => { throw error })
            }).catch(error => console.log(error.message))
        }
        else
            adObj.imageUrl = this.state.oldImageUrl.uri
        await firebase.firestore().collection('Ads').doc(adID).set(adObj).then(() => {
            info.updateCard(adObj)
            this.setState(this.initState)
            this.props.navigation.goBack()
        }).catch(error => console.log(error.message))
    }

    buttonAction = async () => {
        if (!this.isFormEmpty() && this.isErrorFree()) {
            if (this.state.buttonText == 'EDIT')
                await this.editAd()
            else {
                await getUserFirestoreObj().then(async userObj => {
                    console.log('add ad', userObj[1].type)
                    if (userObj[1].phoneNumber == '') {
                        this.props.navigation.navigate('EditProfile', { 'account': userObj[1].account, 'updateParent': () => console.log('None') })
                        return
                    }
                    await this.postAd()
                }).catch(error => console.log(error.message))
            }
        }
    }

    render() {
        let img;
        if (this.state.imagePath)
            img = <SelectedImage resetParent={() => this.setState({ imagePath: null })} flexSize={4} filepath={this.state.imagePath} />
        else
            img = <UploadPictures flexSize={4} updateParent={(img) => this.setState({ imagePath: img })} />
        return (
            <View style={{ flex: 1 }}>
                <DialogBox resetState={() => this.setState({ formErrorDialog: false })} showDialog={this.state.formErrorDialog} title={'Posting Failed'} description={'The form has not been filled correctly'} />
                <DialogBox resetState={() => this.setState({ formEmptyDialog: false })} showDialog={this.state.formEmptyDialog} title={'Posting Failed'} description={'Please fill the form in order to continue'} />
                <InternalHeader name={this.state.pageType + 'Vehicle'} flexSize={1.3} action={() => { this.setState(this.initState); this.props.navigation.goBack() }} />
                {img}
                <KeyboardAvoidingView style={{ flex: 9 }}>
                    <ScrollView>
                        <AdHeading fontSize={2.5} name={'For'} margin={responsiveHeight(3)} />
                        <RentSaleRadioButton value={this.state.rentSale} updateParent={(val) => this.setState({ rentSale: val })} flexSize={1} />
                        <DescriptionSection value={this.state.title} margin={responsiveHeight(3)} label={'Title'} height={responsiveHeight(8)} updateParent={(text) => this.setState({ title: text })} flexSize={8} />
                        <DescriptionSection value={this.state.description} label={'Description'} height={responsiveHeight(20)} updateParent={(text) => this.setState({ description: text })} flexSize={8} />
                        <DescriptionSection keyboardType={'phone-pad'} value={this.state.price} margin={responsiveHeight(3)} label={'Price in PKR'} height={responsiveHeight(7)} updateParent={(text) => this.setState({ price: text })} flexSize={8} />

                        <AdHeading fontSize={2.5} name={'Feature'} margin={responsiveHeight(2)} />
                        <DefaultFeature value={this.state.modelYear} errorMessage={'e.g. 2010'} setErrorState={(val) => this.setState({ errmy: val })} setValueState={(val) => this.setState({ modelYear: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Model Year'} iconClass={Foundation} iconName={'calendar'} />
                        <DefaultFeature value={this.state.transmission} errorMessage={'e.g. Manual or Automatic'} setErrorState={(val) => this.setState({ errtrns: val })} setValueState={(val) => this.setState({ transmission: val })} regex={/[A-Z][a-z]+$/} flexSize={1} name={'Transmission'} iconClass={FontAwesome} iconName={'gears'} />
                        <DefaultFeature value={this.state.color} errorMessage={'e.g. Red, Gun Metallic, etc.'} setErrorState={(val) => this.setState({ errcol: val })} setValueState={(val) => this.setState({ color: val })} regex={/^[a-zA-Z0-9_ ]+$/} flexSize={1} name={'Color'} iconClass={Ionicons} iconName={'md-color-palette'} />
                        <DefaultFeature value={this.state.mileage} errorMessage={'e.g. 1000, 2000, 3000, etc'} setErrorState={(val) => this.setState({ errmil: val })} setValueState={(val) => this.setState({ mileage: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Mileage in Km'} iconClass={Ionicons} iconName={'ios-speedometer'} />
                        <DefaultRadioFeature value={this.state.airConditioning} updateParent={(val) => this.setState({ airConditioning: val })} flexSize={1} name={'Air Conditioning'} icon={<MaterialCommunityIcons name={'air-filter'} color={'#008080'} size={responsiveHeight(4)} />} />
                        <DefaultRadioFeature value={this.state.alloyRims} updateParent={(val) => this.setState({ alloyRims: val })} flexSize={1} name={'Alloy Rims'} icon={<MaterialCommunityIcons name={'circle-slice-8'} color={'#008080'} size={responsiveHeight(4)} />} />
                        <DefaultRadioFeature value={this.state.centralLocking} updateParent={(val) => this.setState({ centralLocking: val })} flexSize={1} name={'Central Locking'} icon={<MaterialCommunityIcons name={'car-key'} color={'#008080'} size={responsiveHeight(4)} />} />
                        <DefaultRadioFeature value={this.state.airbags} updateParent={(val) => this.setState({ airbags: val })} flexSize={1} name={'Airbags'} icon={<MaterialCommunityIcons name={'airbag'} color={'#008080'} size={responsiveHeight(4)} />} />
                        <DefaultRadioFeature value={this.state.mediaPlayer} updateParent={(val) => this.setState({ mediaPlayer: val })} flexSize={1} name={'Media Player'} icon={<MaterialCommunityIcons name={'music-box'} color={'#008080'} size={responsiveHeight(4)} />} />

                        <AdHeading fontSize={2.5} name={'Location'} margin={responsiveHeight(2)} />
                        <LocationPickerButton height={20} width={90} latLong={this.state.location} action={() => this.props.navigation.navigate('LocationPicker', { 'updateParent': val => this.setState({ location: val }), 'marker': this.state.location })} />
                        <PostButton buttonText={this.state.buttonText} action={this.buttonAction} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}