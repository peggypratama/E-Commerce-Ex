import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Modal,
    KeyboardAvoidingView,
    YellowBox,
    TouchableWithoutFeedback,
    FlatList, Alert, ScrollView
} from 'react-native';

import {
    Container, Header, Left, Body, Title, Subtitle, Right, Content, Card, CardItem,
    Item, Picker, Button, Icon, Label, List,
} from 'native-base';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { GiftedChat, Send, InputToolbar, Composer, Bubble } from 'react-native-gifted-chat'
import AdHeading from '../AdHeading/adHeading'
import AdHeader from '../AdHeader/adHeaderOrder'
import StickyHeader from '../AdStickyHeader/AdStickyHeaderOrder'
import AdFooter from '../AdFooter/adFooter'
import AdFooterr from '../AdFooter/adFooterr'
import { Actions } from 'react-native-router-flux';
import AdDescription from '../AdDescription/adDescription'
import SelectedImage from '../../CommonModules/SelectedImage/selectedImage'
import UploadPictures from '../../CommonModules/UploadPictures/uploadPicturesTransfer';

import RatingAndReviewCard from '../RatingAndReviewCard/ratingAndReviewCard'
import UserRatingAndReview from '../UserRatingAndReview/userRatingAndReview'
import DefaultAdCard from '../DefaultAdCard/defaultAdCard'
import RatingButton from '../RatingButton/ratingButton'
import FeatureSection from '../InAdFeatureSection/inAdFeatureSection'
import LocationViewer from '../LocationViewer/locationViewer'
import RecommendedAds from '../RecommendedAds/recommendedAds'
import ImageView from "react-native-image-viewing";
import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'
import DefaultTextInput from '../../CommonModules/DefaultTextInput/defaultTextInput'
import PostButton from '../../CommonModules/PostButton/postButton';
import ChangeProfilePhotoButton from '../../CommonModules/ChangeProfilePhotoButton/changeProfilePhotoButton'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'

import { KEY, URL } from '../Order/utils/Const';
import {
    getCurrentUid, getData, addToArray, getUserFirestoreObj, uploadAdImage,
    getFirestoreUserByUid, getCurrentUserObj, uploadProfilePhoto
} from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'


export default class BuyOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
            originCity: '', destinationCity: '', currentUserID: null, messages: [],
            otherUserPhoto: null, otherUserData: null, imageUrll: null,

            userAuthObj: null, userFirestoreObj: null, userObjID: '',
            account: this.props.navigation.getParam('account'), displayImage: false,
            formEmptyDialog: false, formErrorDialog: false,
            imageUrl: '', imageObj: null, oldImageUrl: null, imagePath: null,
            firstName: '', lastName: '', phoneNumber: '', bank: '', accountn: '', cityname: '',
            errfn: false, errln: false, errpn: false,
            results: [], provinceId: '', provinceName: '',
            features: null, pageType: this.props.navigation.getParam('pageType'),
            ratingsAndReviews: this.props.navigation.getParam('reviewObj'),
            userFirestoreObj: null,
            adUserFirestoreObj: null, refreshing: true,
            isLoading: true, name: '',

            courier: this.props.navigation.getParam('courier'),
            originCities: this.props.navigation.getParam('originCities'),
            destinationCities: this.props.navigation.getParam('destinationCities'),
            weight: this.props.navigation.getParam('weight'),
            value: this.props.navigation.getParam('value'),
            itemDescription: this.props.navigation.getParam('itemDescription'),
            etd : this.props.navigation.getParam('etd'),

            userReviewObj: this.props.navigation.getParam('myReview'),
            adObj: this.props.navigation.getParam('adObj'),
            buttonText: 'POST', pageType: 'New ',
            title: '', price: '', provinces: [], selectedOriginProvince: null,
            selectedOriginCity: null, selectedDestinationProvince: null,
            selectedDestinationCity: null, Biaya: null
        }
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
        let otherUser = this.props.navigation.getParam('otherUser')
        this.setState({
            otherUserData: otherUser,
            // otherUserPhoto: otherUser['photoURL']
        })

        await getCurrentUid().then(uid => this.setState({ currentUserID: uid }))
        if (!this.updatePrentReviews)
            this.updatePrentReviews = () => console.log('updateParentReview()')
        if (!this.updateAdList)
            this.updateAdList = () => console.log('updateAdList()')
        await getUserFirestoreObj().then(user => this.setState({ userFirestoreObj: user[1] }))

        await getFirestoreUserByUid(this.state.adObj['uid']).then(async user => {
            this.setState({ adUserFirestoreObj: user[1] })
        }).catch(err => console.log(err))
        
        await getUserFirestoreObj().then(async user => {
            await this.setState({
                userFirestoreObj: user[1],
                userObjID: user[0],
              //  userAuthObj: await getCurrentUserObj()
            })
            await this.setState({
            //    imageUrl: this.state.userAuthObj.photoURL,
                firstName: this.state.userFirestoreObj.firstName,
                lastName: this.state.userFirestoreObj.lastName,
                cityId: this.state.userFirestoreObj.cityId,
                cityName: this.state.userFirestoreObj.cityName,
                phoneNumber: this.state.userFirestoreObj.phoneNumber,
                accountn: this.state.userFirestoreObj.accountn,
                bank: this.state.userFirestoreObj.bank,

                address: this.state.userFirestoreObj.address,
                provinceId: this.state.userFirestoreObj.provinceId,
                provinceName: this.state.userFirestoreObj.provinceName,
                name: this.state.adUserFirestoreObj.firstName + ' ' +this.state.adUserFirestoreObj.lastName

            })
        }).catch(error => console.log(error.message))

        let temp = this.props.navigation.getParam('info')

    }

    componentDidMount = async () => {
        await firebase.firestore().collection('Wishlist')
            .where('adID', '==', this.props.adID)
            .onSnapshot(async docSnapshot => {
            //console.log('Adheader ', this.props.adID, 'received doc snapshot: ');
            await docSnapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    this.updateWishlistCount('increment', change.type)
                }
                else if (change.type === 'modified') {
                    if (this.state.changeType != 'added') 
                        this.updateWishlistCount('increment',change.type)
                }
                else if (change.type === 'removed') {
                    this.updateWishlistCount('decrement',change.type)
                }
                return
            })
        })
    }


    onBackPress = async () => {
        if (this.state.pageType == 'normal') {
            await this.updateParentReviews()
        }
        this.props.navigation.goBack()
    }

    getAdOrder = uid => {
        let price = parseInt(this.state.adObj['Price'])
        let ongkir = this.state.value
        let total = ongkir + price
        let AdOrder = {
            'Title': this.state.adObj['Title'], 'Price': this.state.adObj['Price'],
            'MarketeerID': this.state.otherUserData['userID'],
            'CostCityID': this.state.cityId,
            'imageUrl': this.state.adObj['imageUrl'],
            'CostCityName': this.state.cityName,
            'Courier': this.state.courier,
            'DeliveryDesc': this.state.itemDescription,
            'DeliveryCost': this.state.value,
            'Weight': this.state.adObj['Weight'],
            'CostUid': uid,
            'Address': this.state.address,
            
            'OriginCityId': this.state.adObj['CityId'],
            'OriginCityName': this.state.adObj['CityName'],
            'OriginProvinceName': this.state.adObj['ProvinceName'],
            'OriginProvinceId': this.state.adObj['ProvinceId'],
            'Costumer': this.state.name,
            'ProvinceCostName': this.state.provinceName,
            'ProvinceCostId': this.state.provinceId,
            'Etd': this.state.etd,
            'Total': total,
            'timestamp': firebase.firestore.FieldValue.serverTimestamp(),
        }
        return AdOrder
    }

    buttonAction = async () => {
        try {
            await getCurrentUid().then(async uid => {
                const db = firebase.firestore()
                let adOrders = this.getAdOrder(uid)
                await db.collection('Orders').add(adOrders).then(async ref => {
                    await uploadAdImage(this.state.imagePath, 'Orders', uid, ref.id).then(async imageUrlOrder => {
                        adOrders.imageUrlOrder = imageUrlOrder
                        adOrders.timestamp = firebase.firestore.FieldValue.serverTimestamp()
                        await db.collection('Orders').doc(ref.id).set(adOrders).then(() => {
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



    setPostError = error => {
        this.setState({
            postErrorMessage: error.message,
            postErrorDialog: true,
        })
    }



    render() {
        let weight = this.state.adObj['Weight']
        let price = parseInt(this.state.adObj['Price'])
        let ongkir = this.state.value
        let total = ongkir + price

        let img;
        if (this.state.imagePath)
            img = <SelectedImage resetParent={() => this.setState({ imagePath: null })} flexSize={4} filepath={this.state.imagePath} />
        else
            img = <UploadPictures flexSize={4} updateParent={(img) => this.setState({ imagePath: img })} />

        return (
            <View style={{ flex: 1 }}>
                <Modal>



                    <View style={{ flex: 1 }}>
                        <DialogBox resetState={() => this.setState({ formErrorDialog: false })} showDialog={this.state.formErrorDialog} title={'Posting Failed'} description={'The form has not been filled correctly'} />
                        <DialogBox resetState={() => this.setState({ formEmptyDialog: false })} showDialog={this.state.formEmptyDialog} title={'Posting Failed'} description={'Please fill the form in order to continue'} />
                        <DialogBox resetState={() => this.setState({ postErrorDialog: false })} showDialog={this.state.postErrorDialog} title={'Posting Failed'} description={this.state.postErrorMessage} />
                        <InternalHeader name="Order Payment" flexSize={1.3} action={() => { this.setState(this.initState); this.props.navigation.goBack() }} />
                        {img}

                        <KeyboardAvoidingView style={{ flex: 9 }}>
                            <ScrollView style={{ flex: 1 }}>
                                
                                <Card>
                                    <CardItem header>
                                        <Text style={{ fontSize: 18 }}>Payment</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                            <Text></Text>
                                            <Text style={{ fontSize: 18 }}>
                                                Bank      : {this.state.adObj['Bank']}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                Account Number       : {this.state.adObj['Accountn']}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                Account Name      : {this.state.name}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                Courier      : {this.state.courier}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                description      : {this.state.itemDescription}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                Cost      : Rp {this.state.value}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                estimate      : {this.state.etd} 
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                Total      : Rp {total}
                                            </Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                                <Card>
                                    <CardItem header>
                                        <Text style={{ fontSize: 18 }}>delivery origin</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                            <Text style={{ fontSize: 18 }}>
                                                Province  : {this.state.adObj['ProvinceName']}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                City          : {this.state.adObj['CityName']}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                Price          : Rp {this.state.adObj['Price']}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                weight      : {this.state.adObj['Weight'] / 1000} Kg
                                        </Text>
                                        </Body>

                                    </CardItem>
                                </Card>

                                <Card>
                                    <CardItem header>
                                        <Text style={{ fontSize: 18 }}>delivery destination</Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body>


                                            <Text style={{ fontSize: 18 }}>
                                                Province  : {this.state.provinceName}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                City          : {this.state.cityName}
                                            </Text>
                                            <Text style={{ fontSize: 18 }}>
                                                Address          : {this.state.address}
                                            </Text>
                                        </Body>
                                    </CardItem>
                                </Card>



                                <PostButton buttonText={this.state.buttonText} action={this.buttonAction} />
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>

                </Modal>


            </View>
        )
    }
}