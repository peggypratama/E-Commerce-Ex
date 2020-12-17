import React, { Component } from 'react';
import {
    Container, Header, Left, Body, Title, Right, Item,
    Subtitle, Content, List, ListItem, Thumbnail, Card, CardItem, Picker,
} from 'native-base';
import NumberFormat from 'react-number-format';
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
    FlatList, Alert
} from 'react-native';

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
import UploadPictures from '../../CommonModules/UploadPictures/uploadPictures';

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

import { URL, KEY, LOGO } from '../Order/utils/Const';
import {
    getCurrentUid, getData, addToArray, getUserFirestoreObj, uploadAdImage,
    getFirestoreUserByUid, getCurrentUserObj, uploadProfilePhoto
} from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

class Delivery extends Component {
    constructor(props) {
        super(props);
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
            isLoading: true,

            courier: this.props.navigation.getParam('courier'),
            originCities: this.props.navigation.getParam('originCities'),
            destinationCities: this.props.navigation.getParam('destinationCities'),
            weight: this.props.navigation.getParam('weight'),


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
                userAuthObj: await getCurrentUserObj()
            })
            await this.setState({
                //  imageUrl: this.state.userAuthObj.photoURL,
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
                name: this.state.firstName + ' ' + this.state.lastName,

            })
        }).catch(error => console.log(error.message))

        let temp = this.props.navigation.getParam('info')

    }

    componentDidMount() {
        this._checkOngkir();
        this._onLoadProvince();
    }

    _checkOngkir = () => {

        let params = this.state;
        const formData = new URLSearchParams();
        formData.append('origin', params.originCities);
        formData.append('destination', params.destinationCities);
        formData.append('weight', params.weight);
        formData.append('courier', params.courier);



        fetch(`${URL}/cost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'key': KEY
            },
            body: formData.toString()
        })
            .then(res => res.json())
            .then(resData => {
                let status = resData['rajaongkir']['status']['code'];
                if (status === 200) {
                    this.setState({
                        results: resData['rajaongkir']['results'][0]['costs']
                    })
                }
            });
    }

    _onLoadProvince = () => {
        fetch(`${URL}/province`, {
            method: 'GET',
            headers: {
                'key': KEY
            }
        })
            .then(res => res.json())
            .then(resData => {
                //console.log(resData);
                let status = resData.rajaongkir.status.code;
                if (status === 200) {
                    this.setState({
                        provinces: resData.rajaongkir.results
                    })
                }
            });
    }

    _onOriginProvinceChange = (val) => {
        this.setState({
            selectedOriginProvince: val
        }, () => {
            fetch(`${URL}/city?province=${this.state.selectedOriginProvince.province_id}`, {
                method: 'GET',
                headers: {
                    'key': KEY
                }
            })
                .then(res => res.json())
                .then(resData => {
                    let status = resData.rajaongkir.status.code;
                    if (status === 200) {
                        this.setState({
                            originCities: resData.rajaongkir.results
                        })
                    }
                });
        });
    }

    onBackPress = async () => {
        if (this.state.pageType == 'normal') {
            await this.updateParentReviews()
        }
        this.props.navigation.goBack()
    }
    render() {
        let { results } = this.state;
        let { courier, weight, originCities, destinationCities } = this.state

        let constItem = <View></View>;

        if (results) {
            constItem = results.map(item => {
                return (
                    <View>

                        <ListItem avatar key={new Date().getMilliseconds + Math.random()}>
                            <Content>
                                <Card>
                                    <CardItem button onPress={() => this.props.navigation.navigate('BuyOrder', {
                                        'otherUser': this.state.adUserFirestoreObj,
                                        'originCities': this.state.adObj['CityId'],
                                        'destinationCities': this.state.cityId,
                                        'weight': this.state.adObj['Weight'],
                                        'courier': this.state.courier,
                                        'adObj': this.state.adObj,
                                        'value': item.cost[0].value,
                                        'itemDescription': item.description,
                                        'etd': item.cost[0].etd
                                    }
                                    )}>

                                        <Left>
                                            <Thumbnail source={{
                                                uri: LOGO[courier]
                                            }} />
                                        </Left>
                                        <Body>
                                            <Text>{item.service}</Text>

                                            <Text note>{item.description}</Text>
                                            <Text note>{weight / 1000}Kg</Text>
                                            <Text note>{item.cost[0].etd} {courier != 'pos' ? 'HARI' : null}</Text>
                                        </Body>
                                        <Right>
                                            <NumberFormat
                                                value={item.cost[0].value}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                prefix={'Rp.'}
                                                renderText={value => <Text>{value}</Text>}
                                            />
                                        </Right>
                                    </CardItem>
                                </Card>
                            </Content>
                        </ListItem>

                    </View>
                );
            });
        }

        return (
            <View style={{ flex: 1 }}>
                <Modal>
                    <StickyHeader
                        action={this.onBackPress}
                        scrollToTop={() => this.scrollListReftop.scrollTo({ x: 0, y: 0, animated: true })}
                    />

                    <Content>
                        <List>
                            {constItem}
                      
                        </List>


                    </Content>
                </Modal>
            </View>
        );
    }
}

export default Delivery;