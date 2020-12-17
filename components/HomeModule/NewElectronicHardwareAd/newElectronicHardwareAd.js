import React, { Component } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    FlatList, Alert, Text, Modal
} from 'react-native';



import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import CustomFeature from '../../CommonModules/CustomFeature/customFeature'
import NewFeatureButton from '../../CommonModules/NewFeatureButton/newFeatureButton'
import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'
import UploadPictures from '../../CommonModules/UploadPictures/uploadPictures';
import DescriptionSection from '../../CommonModules/DescriptionSection/descriptionSection'
import PostButton from '../../CommonModules/PostButton/postButton';
import SelectedImage from '../../CommonModules/SelectedImage/selectedImage'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'
import LocationPickerButton from '../../CommonModules/LocationPickerButton/locationPickerButton'
import RentSaleRadioButton from '../../CommonModules/RentSaleRadioButton/rentSaleRadioButton'
import AdHeading from '../../CommonModules/AdHeading/adHeading'

import { uploadAdImage, getCurrentUid, deleteAdImage, getUserFirestoreObj,getCurrentUserObj } from '../../Utility/utility'


import * as firebase from 'firebase'
import 'firebase/firestore'

export default class NewElectronicHardwareAd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imagePath: null,
            description: '', title: '', rentSale: '',userFirestoreObj: null,
            price: '', location: null, category: 'Hardware',
            features: [], featureItr: 0,
            formEmptyDialog: false, formErrorDialog: false, weight:'',
            buttonText: 'POST', oldImageUrl: null, pageType: 'New '
        }
        this.arrFeatures = []
        this.initState = this.state
        console.disableYellowBox = true;
    }


    componentWillMount = async () => {
        let temp = this.props.navigation.getParam('info')
        if (temp) {
            temp = temp.obj
            this.setState({
                imagePath: { uri: temp['imageUrl'] }, title: temp['Title'], oldImageUrl: { uri: temp['imageUrl'] },
                description: temp['Description'], price: temp['Price'], pageType: 'Edit ', weight: temp['Weight'],
               //features: temp['Features'], featureItr: temp['Features'][temp['Features'].length - 1].id,
                location: temp['Location'], rentSale: temp['Type'], buttonText: 'EDIT', category: temp['Category']
            })
        }

        await getUserFirestoreObj().then(async user => {
            await this.setState({
                userFirestoreObj: user[1],
                userObjID: user[0],
                userAuthObj: await getCurrentUserObj()
            })
            await this.setState({
                imageUrl: this.state.userAuthObj.photoURL,
                firstName: this.state.userFirestoreObj.firstName,
                lastName: this.state.userFirestoreObj.lastName,
                cityId: this.state.userFirestoreObj.cityId,
                cityName: this.state.userFirestoreObj.cityName, 
                phoneNumber: this.state.userFirestoreObj.phoneNumber,
                accountn: this.state.userFirestoreObj.accountn,
                bank: this.state.userFirestoreObj.bank,
                provinceId: this.state.userFirestoreObj.provinceId,
                provinceName: this.state.userFirestoreObj.provinceName,
                name: this.state.firstName + ' ' + this.state.lastName,
                
            })
        })
    }



    
    addFeature = async () => {
        this.arrFeatures.push({ title: '', description: '', id: this.state.featureItr });
        await this.setState({ features: [...this.arrFeatures], featureItr: ++this.state.featureItr })
    }

    addBank = async () => {
        this.arrFeatures.push({ title: '', description: '', id: this.state.featureItr });
        await this.setState({ features: [...this.arrFeatures], featureItr: ++this.state.featureItr })
    }

    isFormEmpty = () => {
        for (let i = 0; i < this.state.features.length; i++) {
            if (!(this.state.features[i].title != '' && this.state.features[i].description != '')) {
                this.setState({ formEmptyDialog: true })
                return true
            }
        }
        if (this.state.location && this.state.price != '' && this.state.imagePath && this.state.title != '' && this.state.description != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    getAdObj = uid => {
        let adObj = {
            'Title': this.state.title, 'Description': this.state.description,
            'uid': uid, 'Price': this.state.price,
            'Weight': this.state.weight, 'CityId': this.state.cityId,
            'CityName': this.state.cityName, 'Accountn': this.state.accountn,
            'ProvinceId': this.state.provinceId, 'ProvinceName': this.state.provinceName,
            'Bank': this.state.bank,
            'outletID': '', 'Category': this.state.category, 'Type': 'Rent', 'Location': this.state.location,
            'Features': this.state.features, 'Deliverable': false, 'timestamp': firebase.firestore.FieldValue.serverTimestamp(),
        }
        return adObj
    }

    postAd = async () => {
        await getCurrentUid().then(async uid => {
       
            const db = firebase.firestore()
            if (this.props.navigation.getParam('category') != 'Hardware')
                this.setState({ category: 'Electronics' })
            let adObj = this.getAdObj(uid)
            await db.collection('Ads').add(adObj).then(async ref => {
                await uploadAdImage(this.state.imagePath, this.state.category, uid, ref.id).then(async imageUrl => {
                    adObj.imageUrl = imageUrl
                    adObj.timestamp = firebase.firestore.FieldValue.serverTimestamp()
                    await db.collection('Ads').doc(ref.id).set(adObj).then(() => {
                        this.setState(this.initState)
                        this.props.navigation.goBack()
                    }).catch(error => console.log(error.message))
                }).catch(error => console.log(error.message))
            }).catch(error => console.log(error.message))
        }).catch(error => console.log(error.message))
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
        if (!this.isFormEmpty()) {
            if (this.state.buttonText == 'EDIT')
                await this.editAd()
            else {
                await getUserFirestoreObj().then(async userObj => {
                    console.log('add ad', userObj[1].type)
                    if (userObj[1].phoneNumber == '' || userObj[1].provinceId == '' || userObj[1].cityName == '' ||
                        userObj[1].bank == '' || userObj[1].provinceName == '' ||
                        userObj[1].accountn == '' || userObj[1].cityId == ''   
                    ) {
                        Alert.alert('Please insert Complete information for your account')
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
                <Modal>
                <DialogBox resetState={() => this.setState({ formErrorDialog: false })} showDialog={this.state.formErrorDialog} title={'Posting Failed'} description={'The form has not been filled correctly'} />
                <DialogBox resetState={() => this.setState({ formEmptyDialog: false })} showDialog={this.state.formEmptyDialog} title={'Posting Failed'} description={'Please fill the form in order to continue'} />
                <DialogBox resetState={() => this.setState({ postErrorDialog: false })} showDialog={this.state.postErrorDialog} title={'Posting Failed'} description={this.state.postErrorMessage} />
                <InternalHeader name={this.state.pageType + this.props.navigation.getParam('category')} flexSize={1.3} action={() => { this.setState(this.initState); this.props.navigation.goBack() }} />
                {img}
                
                <KeyboardAvoidingView style={{ flex: 9 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <DescriptionSection value={this.state.title} margin={responsiveHeight(3)} label={'Title'} height={responsiveHeight(8)} updateParent={(text) => this.setState({ title: text })} flexSize={8} />
                        <DescriptionSection value={this.state.description} label={'Description'} height={responsiveHeight(20)} updateParent={(text) => this.setState({ description: text })} flexSize={8} />
                        <DescriptionSection keyboardType={'phone-pad'} value={this.state.price} margin={responsiveHeight(3)} label={'Price in IDR'} height={responsiveHeight(7)} updateParent={(text) => this.setState({ price: text })} flexSize={8} />
                        <DescriptionSection keyboardType={'phone-pad'} value={this.state.weight} margin={responsiveHeight(3)} label={'Weight(gram)'} height={responsiveHeight(7)} updateParent={(text) => this.setState({ weight: text })} flexSize={8} />
                            
                  
                        <AdHeading fontSize={2.5} name={'Location'} margin={responsiveHeight(2)} />
                        <LocationPickerButton height={20} width={90} latLong={this.state.location} action={() => this.props.navigation.navigate('LocationPicker', { 'updateParent': val => this.setState({ location: val }), 'marker': this.state.location })} />
                        <PostButton buttonText={this.state.buttonText} action={this.buttonAction} />
                    </ScrollView>
                    </KeyboardAvoidingView>
                    </Modal>
            </View>
        )
    }
}