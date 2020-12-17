import React, { Component } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    FlatList,
    AsyncStorage,
    YellowBox
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import CustomFeature from '../../CommonModules/CustomFeature/customFeature'
import NewFeatureButton from '../../CommonModules/NewFeatureButton/newFeatureButton'
import InternalHeader from '../../CommonModules/InternalHeader/reverseInternalHeader'
import UploadPictures from '../../CommonModules/UploadPictures/uploadPictures';
import DescriptionSection from '../../CommonModules/DescriptionSection/descriptionSection'
import PostButton from '../../CommonModules/PostButton/postButton';
import SelectedImage from '../../CommonModules/SelectedImage/selectedImage'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'
import LocationPickerButton from '../../CommonModules/LocationPickerButton/locationPickerButton'
import RentSaleRadioButton from '../../CommonModules/RentSaleRadioButton/rentSaleRadioButton'
import AdHeading from '../../CommonModules/AdHeading/adHeading'

import { getCurrentUid,getUserFirestoreObj,uploadAdImage, deleteAdImage } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class NewElectronicHardwareAd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imagePath: null,
            description: '', title: '', rentSale: '',
            price: '', location: null, category: 'Hardware',
            features: [], featureItr: 0,
            formEmptyDialog: false, formErrorDialog: false,
            buttonText: 'POST', oldImageUrl: null, pageType: 'New '
        }
        this.arrFeatures = []
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
                features: temp['Features'], featureItr: temp['Features'][temp['Features'].length - 1].id,
                location: temp['Location'], rentSale: temp['Type'], buttonText: 'EDIT', category: temp['Category']
            })
        }
    }

    addFeature = async () => {
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
        if (this.state.location && this.state.rentSale != '' && this.state.price != '' && this.state.imagePath && this.state.title != '' && this.state.description != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    getAdObj = uid => {
        let adObj = {
            'Title': this.state.title, 'Description': this.state.description, 'uid': uid, 'Price': this.state.price,
            'outletID': this.state.storeObj.docID, 'Category': this.state.category, 'Type': this.state.rentSale, 'Location': this.state.location,
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
                <InternalHeader name={this.state.pageType + this.props.navigation.getParam('category')} flexSize={1.3} action={() => { this.setState(this.initState); this.props.navigation.goBack() }} />
                {img}
                <KeyboardAvoidingView style={{ flex: 9 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <AdHeading fontSize={2.5} name={'For'} margin={responsiveHeight(3)} />
                        <RentSaleRadioButton value={this.state.rentSale} updateParent={(val) => this.setState({ rentSale: val })} flexSize={1} />
                        <DescriptionSection value={this.state.title} margin={responsiveHeight(3)} label={'Title'} height={responsiveHeight(8)} updateParent={(text) => this.setState({ title: text })} flexSize={8} />
                        <DescriptionSection value={this.state.description} label={'Description'} height={responsiveHeight(20)} updateParent={(text) => this.setState({ description: text })} flexSize={8} />
                        <DescriptionSection keyboardType={'phone-pad'} value={this.state.price} margin={responsiveHeight(3)} label={'Price in PKR'} height={responsiveHeight(7)} updateParent={(text) => this.setState({ price: text })} flexSize={8} />

                        <AdHeading fontSize={2.5} name={'Features'} margin={responsiveHeight(1)} />
                        <FlatList
                            data={this.state.features}
                            renderItem={({ item }) =>
                                <CustomFeature
                                    deleteFeature={() => {
                                        this.arrFeatures = this.state.features.filter(ele => { return ele.id != item.id })
                                        this.setState({ features: this.arrFeatures })
                                    }}
                                    id={item.id}
                                    updateParentTitle={val => item.title = val}
                                    updateParentDescription={val => item.description = val}
                                    title={item.title}
                                    description={item.description}
                                    flexSize={1}
                                />}
                            keyExtractor={item => item.id}
                            extraData={this.state.features}
                        />

                        <View style={{ flex: 1 }}>
                            <NewFeatureButton flexSize={1} action={this.addFeature} />
                        </View>

                        <AdHeading fontSize={2.5} name={'Location'} margin={responsiveHeight(2)} />
                        <LocationPickerButton height={20} width={90} latLong={this.state.location} action={() => this.props.navigation.navigate('LocationPicker', { 'updateParent': val => this.setState({ location: val }), 'marker': this.state.location })} />
                        <PostButton buttonText={this.state.buttonText} action={this.buttonAction} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}