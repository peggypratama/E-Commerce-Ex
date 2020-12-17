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
  FlatList, Alert
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

import { KEY, URL } from '../Order/utils/Const';
import {
  getCurrentUid, getData, addToArray, getUserFirestoreObj, uploadAdImage,
  getFirestoreUserByUid, getCurrentUserObj, uploadProfilePhoto
} from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'


export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserID: null, messages: [],
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
      userReviewObj: this.props.navigation.getParam('myReview'),
      adObj: this.props.navigation.getParam('adObj'),
      buttonText: 'POST', pageType: 'New ', weight: '',
      title: '', price: '', provinces: [], originCities: [],
      destinationCities: [], selectedOriginProvince: null,
      selectedOriginCity: null, selectedDestinationProvince: null,
      selectedDestinationCity: null, weight: 0, courier: null, Biaya: null
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
        imageUrl: this.state.userAuthObj.photoURL,
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



  onBackPress = async () => {
    if (this.state.pageType == 'normal') {
      await this.updateParentReviews()
    }
    this.props.navigation.goBack()
  }

  getAdord = uid => {
    let adOrd = {
      'Tite': this.state.adObj['Title'], 'Price': this.state.adObj['Price'],
      'MarketeerID': this.state.otherUserData['userID'],
      'DestinationCityID': this.state.selectedDestinationCity.city_id,
      'DestinationCityName': this.state.selectedDestinationCity.city_name,
      'Courier': this.state.courier, 'Uid': uid, 'OriginCityId': this.state.adObj['OriginCityId'],
      'OriginCityName': this.state.adObj['OriginCityName'], 'ProvinceId': this.state.selectedDestinationProvince.province_id,
      'ProvinceName': this.state.selectedDestinationProvince.province,
      'timestamp': firebase.firestore.FieldValue.serverTimestamp(),
    }
    return adOrd
  }

  setPostError = error => {
    this.setState({
      postErrorMessage: error.message,
      postErrorDialog: true,
    })
  }

  isFormEmpty = () => {

    if (this.state.address != '' && this.state.provinceId != '' && this.state.phoneNumber != ''
      && this.state.provinceName != '' && this.state.cityName != '' && this.state.cityId != '')
      return false
    this.setState({ formEmptyDialog: true })
    return true
  }


  buttonProfile = async () => {
    await getUserFirestoreObj().then(async userObj => {
      console.log('add ad', userObj[1].type)

      this.props.navigation.navigate('EditProfile', { 'account': userObj[1].account, 'updateParent': () => console.log('None') })
      return

    }).catch(error => console.log(error.message))
  }

  buttonAction = async () => {

    if (this.state.buttonText == 'EDIT')
      await this.editAd()
    else {
      await getUserFirestoreObj().then(async userObj => {
        console.log('add ad', userObj[1].type)
        if (userObj[1].phoneNumber == '' || userObj[1].provinceId == '' || userObj[1].cityName == '' ||
          userObj[1].provinceName == '' ||
          userObj[1].cityId == ''
        ) {
          Alert.alert('Please insert Complete information for your account')
          this.props.navigation.navigate('EditProfile', { 'account': userObj[1].account, 'updateParent': () => console.log('None') })
          return
        }
        await this.postAd()
      }).catch(error => console.log(error.message))
    }

  }

  postAd = () => {

    let params = {
      originCities: this.state.adObj['CityId'],
      destinationCities: this.state.cityId,
      weight: this.state.adObj['Weight'],
      courier: this.state.courier
    }
    this.props.navigation.navigate('Delivery', {
      'otherUser': this.state.adUserFirestoreObj,
      'originCities': this.state.adObj['CityId'],
      'destinationCities': this.state.cityId,
      'weight': this.state.adObj['Weight'],
      'courier': this.state.courier,
      'adObj': this.state.adObj,
    })
  }

  renderImage = () => {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => this.setState({ displayImage: true })}>
          <Image source={{ uri: this.state.adObj['imageUrl'], width: responsiveWidth(100), height: responsiveHeight(35) }} />
        </TouchableWithoutFeedback>
      </View>

    )
  }

  render() {
    let weight = this.state.adObj['Weight']

    return (
      <View style={{ flex: 1 }}  >
        <Modal presentationStyle={'overFullScreen'} visible={this.state.displayImage} transparent={false}>
          <ImageView images={[{ uri: this.state.adObj["imageUrl"] }]} imageIndex={0} visible={this.state.displayImage} onRequestClose={() => this.setState({ displayImage: false })} presentationStyle={'overFullScreen'} animationType={'fade'} />
        </Modal>

        <Modal visible={!this.state.displayImage} style={{ flex: 1 }} presentationStyle={'fullScreen'}>
          <View style={{ flex: 12 }}>
            <ParallaxScrollView
              ref={ref => this.scrollListReftop = ref}
              parallaxHeaderHeight={responsiveHeight(35)}
              stickyHeaderHeight={responsiveHeight(8)}
              renderForeground={this.renderImage}
              renderStickyHeader={() =>
                <StickyHeader
                  action={this.onBackPress}
                  scrollToTop={() => this.scrollListReftop.scrollTo({ x: 0, y: 0, animated: true })}
                />}
            >
              <View style={{ flex: 1, paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveHeight(1) }}>
                <AdHeader price={this.state.adObj["Price"]} title={this.state.adObj["Title"]} />

              </View>
              <View>
              

                <Card>
                  <CardItem header>
                    <Text style={{ fontSize: 18 }}>Address</Text>
                  </CardItem>
                  <CardItem>
                    <Body>

                      <Text style={{ fontSize: 18 }}>
                        Address  : {this.state.address}
                      </Text>
                      <Text></Text>
                      <Text style={{ fontSize: 18 }}>
                        PhoneNumber  : {this.state.phoneNumber}
                      </Text><Text></Text>
                      <Text style={{ fontSize: 18 }}>
                        Province  : {this.state.provinceName}
                      </Text><Text></Text>
                      <Text style={{ fontSize: 18 }}>
                        City          : {this.state.cityName}
                      </Text><Text></Text>

                    </Body>
                  </CardItem>
                </Card>
                <Card>
                  <CardItem button onPress={this.buttonProfile}>
                    <Body>
                      <Text style={{}}>
                        Edit Profile
                      </Text>
                    </Body>
                  </CardItem>
                </Card>


              </View>

              <View>

                <Card>
                  <CardItem header>
                    <Text>Courier</Text>

                  </CardItem>
                  <CardItem>
                    <Body>
                      <Item picker>
                        <Picker
                          mode="dropdown"
                          style={{
                            width: undefined
                          }}
                          selectedValue={this.state.courier}
                          onValueChange={val => this.setState({ courier: val })}>
                          <Picker.Item label="Select Courier" value="" />
                          <Picker.Item label="JNE" value="jne" />
                          <Picker.Item label="TIKI" value="tiki" />
                          <Picker.Item label="POS INDO" value="pos" />
                        </Picker>
                      </Item>

                    </Body>
                  </CardItem>
                </Card>

                <List>

                </List>
                <View style={{ flex: 1.5 }}>
                  <PostButton buttonText={this.state.buttonText} action={this.buttonAction} />
                </View>
              </View>
            </ParallaxScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gradient: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row'
  },
  sendBtnContainer: {
    height: responsiveHeight(6),
    width: responsiveWidth(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCat: {
    height: responsiveHeight(7),
    width: responsiveWidth(14),
    borderRadius: 50,
  },
  container: {
    flex: 9
  },
});  