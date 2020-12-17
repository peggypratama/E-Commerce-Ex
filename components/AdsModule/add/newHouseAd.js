import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, AsyncStorage, YellowBox } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import { getCurrentUid,getUserFirestoreObj,uploadAdImage, deleteAdImage } from '../../Utility/utility'

import * as firebase from 'firebase'
import 'firebase/firestore'

import Foundation from 'react-native-vector-icons/Foundation'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'

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

export default class NewHouseAd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imagePath: null, formEmptyDialog: false, formErrorDialog: false,
            pageType: 'New ', buttonText: 'POST', oldImageUrl: null,
            description: '', title: '', price: '', location: null,
            postErrorDialog: false, postErrorMessage: '', rentSale: '',

            completionYear: '', marhalas: '', floors: '', bedrooms: '',
            bathrooms: '', parkingSpc: '', kitchens: '',
            lounges: '', drawingRooms: '', stores: '',

            cntrlCooling: 'Yes', cntrlHeating: 'Yes', lawn: 'Yes',
            backyard: 'Yes', cable: 'Yes', internet: 'Yes', boaring: 'Yes',

            errcy: false, errmar: false, errflr: false, errbed: false,
            errbath: false, errprk: false, errkit: false,
            errlou: false, errdrw: false, errstr: false
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

                completionYear: temp['Completion Year'], marhalas: temp['Marhalas'], floors: temp['Floors'],
                bedrooms: temp['Bedrooms'], bathrooms: temp['Bathrooms'], parkingSpc: temp['Parking Spaces'],
                kitchens: temp['Kitchens'], lounges: temp['Lounge Rooms'], drawingRooms: temp['Drawing Rooms'],
                stores: temp['Store Rooms'], cntrlCooling: temp['Central Cooling'], cntrlHeating: temp['Central Heating'],
                lawn: temp['Lawn'], backyard: temp['Backyard'], cable: temp['Cable'],
                internet: temp['Internet'], boaring: temp['Boaring'],
            })
        }
    }

    isFormEmpty = () => {
        if (this.state.imagePath && this.state.location && this.state.rentSale != '' && this.state.title != '' && this.state.description != '' && this.state.price != '' && this.state.completionYear != '' && this.state.marhalas != '' && this.state.floors != '' && this.state.bedrooms != '' && this.state.bathrooms != '' && this.state.parkingSpc != '' && this.state.kitchens != '' && this.state.lounges != '' && this.state.drawingRooms != '' && this.state.stores != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    isErrorFree = () => {
        if (!this.state.errcy && !this.setState.errmar && !this.state.errflr && !this.state.errbed && !this.state.errbath && !this.state.errprk && !this.state.errkit && !this.state.errlou && !this.state.errdrw && !this.state.errstr)
            return true
        this.setState({ formErrorDialog: true })
        return false
    }

    setPostError = error => {
        this.setState({
            postErrorMessage: error.message,
            postErrorDialog: true,
        })
    }

    getAdObj = uid => {
        let adObj = {
            'Title': this.state.title, 'Description': this.state.description, 'uid': uid, 'Type': this.state.rentSale, 'timestamp': firebase.firestore.FieldValue.serverTimestamp(),
            'outletID': this.state.storeObj.docID, 'Category': 'Houses', 'Price': this.state.price, 'Location': this.state.location,
            'Deliverable': false,

            'Completion Year': this.state.completionYear, 'Marhalas': this.state.marhalas, 'Floors': this.state.floors, 'Bedrooms': this.state.bedrooms,
            'Bathrooms': this.state.bathrooms, 'Parking Spaces': this.state.parkingSpc, 'Kitchens': this.state.kitchens,
            'Lounge Rooms': this.state.lounges, 'Drawing Rooms': this.state.drawingRooms, 'Store Rooms': this.state.stores,

            'Central Cooling': this.state.cntrlCooling, 'Central Heating': this.state.cntrlHeating, 'Lawn': this.state.lawn,
            'Backyard': this.state.backyard, 'Cable': this.state.cable, 'Internet': this.state.internet, 'Boaring': this.state.boaring
        }
        return adObj
    }

    postAd = async () => {
        await getCurrentUid().then(async uid => {
            const db = firebase.firestore()
            let adObj = this.getAdObj(uid)
            await db.collection('Ads').add(adObj).then(async ref => {
                await uploadAdImage(this.state.imagePath, 'Houses', uid, ref.id).then(async imageUrl => {
                    adObj.imageUrl = imageUrl
                    adObj.timestamp = firebase.firestore.FieldValue.serverTimestamp()
                    await db.collection('Ads').doc(ref.id).set(adObj).then(() => {
                        this.setState(this.initState)
                        this.props.navigation.navigate('Dashboard')
                    })
                })
            })
        }).catch(error => this.setPostError(error))
    }

    editAd = async () => {
        let info = this.props.navigation.getParam('info')
        let uid = info.obj['uid'], adID = info.obj.adID
        let adObj = this.getAdObj(uid)
        if (this.state.oldImageUrl.uri != this.state.imagePath.uri) {
            await deleteAdImage(this.state.oldImageUrl.uri).then(async () => {
                await uploadAdImage(this.state.imagePath, this.state.category, uid, adID).then(async imageUrl => {
                    adObj.imageUrl = imageUrl
                })
            }).catch(error => console.log(error.message))
        }
        else
            adObj.imageUrl = this.state.oldImageUrl.uri
        adObj.timestamp = firebase.firestore.FieldValue.serverTimestamp()
        adObj.adID = adID
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
                <DialogBox resetState={() => this.setState({ postErrorDialog: false })} showDialog={this.state.postErrorDialog} title={'Posting Failed'} description={this.state.postErrorMessage} />
                <InternalHeader name={this.state.pageType + 'House'} flexSize={1.3} action={() => { this.setState(this.initState); this.props.navigation.goBack() }} />
                {img}
                <KeyboardAvoidingView style={{ flex: 9 }}>
                    <ScrollView>
                        <AdHeading fontSize={2.5} name={'For'} margin={responsiveHeight(1)} />
                        <RentSaleRadioButton value={this.state.rentSale} updateParent={(val) => this.setState({ rentSale: val })} flexSize={1} />
                        <DescriptionSection value={this.state.title} margin={responsiveHeight(3)} label={'Title'} height={responsiveHeight(8)} updateParent={(text) => this.setState({ title: text })} flexSize={8} />
                        <DescriptionSection value={this.state.description} label={'Description'} height={responsiveHeight(20)} updateParent={(text) => this.setState({ description: text })} flexSize={8} />
                        <DescriptionSection keyboardType={'phone-pad'} value={this.state.price} margin={responsiveHeight(2)} label={'Price in PKR'} height={responsiveHeight(7)} updateParent={(text) => this.setState({ price: text })} flexSize={8} />

                        <AdHeading fontSize={2.5} name={'Features'} margin={responsiveHeight(1)} />
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.completionYear} errorMessage={'e.g. 2010'} setErrorState={(val) => this.setState({ errcy: val })} setValueState={(val) => this.setState({ completionYear: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Completion Year'} iconClass={Foundation} iconName={'calendar'} />
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.marhalas} errorMessage={'e.g. 1, 2, 3'} setErrorState={(val) => this.setState({ errmar: val })} setValueState={(val) => this.setState({ marhalas: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Size in Marhalas'} iconClass={MaterialCommunityIcons} iconName={'tape-measure'} />
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.floors} errorMessage={'e.g. 1, 2, 3'} setErrorState={(val) => this.setState({ errflr: val })} setValueState={(val) => this.setState({ floors: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Floors'} iconClass={Feather} iconName={'layers'} />
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.bedrooms} errorMessage={'e.g. 1, 2, 3'} setErrorState={(val) => this.setState({ errbed: val })} setValueState={(val) => this.setState({ bedrooms: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Bedrooms'} iconClass={Ionicons} iconName={'ios-bed'} />
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.bathrooms} errorMessage={'e.g. 1, 2, 3'} setErrorState={(val) => this.setState({ errbath: val })} setValueState={(val) => this.setState({ bathrooms: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Bathrooms'} iconClass={FontAwesome} iconName={'bath'} />
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.parkingSpc} errorMessage={'e.g. 1, 2, 3'} setErrorState={(val) => this.setState({ errprk: val })} setValueState={(val) => this.setState({ parkingSpc: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Parking Spaces'} iconClass={FontAwesome5} iconName={'parking'} />
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.kitchens} errorMessage={'e.g. 1, 2, 3'} setErrorState={(val) => this.setState({ errkit: val })} setValueState={(val) => this.setState({ kitchens: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Kitchens'} iconClass={MaterialCommunityIcons} iconName={'stove'} />
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.lounges} errorMessage={'e.g. 1, 2, 3'} setErrorState={(val) => this.setState({ errlou: val })} setValueState={(val) => this.setState({ lounges: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Lounge Rooms'} iconClass={Ionicons} iconName={'md-tv'} />
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.drawingRooms} errorMessage={'e.g. 1, 2, 3'} setErrorState={(val) => this.setState({ errdrw: val })} setValueState={(val) => this.setState({ drawingRooms: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Drawing Rooms'} iconClass={MaterialCommunityIcons} iconName={'sofa'} />
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.stores} errorMessage={'e.g. 1, 2, 3'} setErrorState={(val) => this.setState({ errstr: val })} setValueState={(val) => this.setState({ stores: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Store Rooms'} iconClass={FontAwesome5} iconName={'box'} />
                        <DefaultRadioFeature value={this.state.cntrlCooling} updateParent={(val) => this.setState({ cntrlCooling: val })} flexSize={1} name={'Central Cooling'} icon={<Ionicons name={'ios-snow'} color={'#008080'} size={responsiveHeight(4)} />} />
                        <DefaultRadioFeature value={this.state.cntrlHeating} updateParent={(val) => this.setState({ cntrlHeating: val })} flexSize={1} name={'Central Heating'} icon={<MaterialCommunityIcons name={'air-filter'} color={'#008080'} size={responsiveHeight(4)} />} />
                        <DefaultRadioFeature value={this.state.lawn} updateParent={(val) => this.setState({ lawn: val })} flexSize={1} name={'Lawn'} icon={<Entypo name={'tree'} color={'#008080'} size={responsiveHeight(4)} />} />
                        <DefaultRadioFeature value={this.state.backyard} updateParent={(val) => this.setState({ backyard: val })} flexSize={1} name={'Backyard'} icon={<Entypo name={'tree'} color={'#008080'} size={responsiveHeight(4)} />} />
                        <DefaultRadioFeature value={this.state.cable} updateParent={(val) => this.setState({ cable: val })} flexSize={1} name={'Cable'} icon={<MaterialCommunityIcons name={'satellite-uplink'} color={'#008080'} size={responsiveHeight(4)} />} />
                        <DefaultRadioFeature value={this.state.internet} updateParent={(val) => this.setState({ internet: val })} flexSize={1} name={'Internet'} icon={<Ionicons name={'ios-globe'} color={'#008080'} size={responsiveHeight(4)} />} />
                        <DefaultRadioFeature value={this.state.boaring} updateParent={(val) => this.setState({ boaring: val })} flexSize={1} name={'Boaring'} icon={<MaterialCommunityIcons name={'water-pump'} color={'#008080'} size={responsiveHeight(4)} />} />

                        <AdHeading fontSize={2.5} name={'Location'} margin={responsiveHeight(2)} />
                        <LocationPickerButton height={20} width={90} latLong={this.state.location} action={() => this.props.navigation.navigate('LocationPicker', { 'updateParent': val => this.setState({ location: val }), 'marker': this.state.location })} />
                        <PostButton buttonText={this.state.buttonText} action={this.buttonAction} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}