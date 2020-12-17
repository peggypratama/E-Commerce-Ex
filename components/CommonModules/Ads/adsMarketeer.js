import React, { Component } from 'react'
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Modal, TextInput,
  YellowBox,
  Alert,
  StyleSheet,
  KeyboardAvoidingView
} from 'react-native';

import {
  Container, Header, Left, Body, Title, Subtitle, Right, Content, Card, CardItem,
  Item, Picker, Button, Icon, Label, List,
} from 'native-base';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ImageView from "react-native-image-viewing";

import AdHeading from '../AdHeading/adHeading'
import AdHeader from '../AdHeader/adHeader'
import StickyHeader from '../AdStickyHeader/adStickyHeader'
import AdFooter from '../AdFooter/adFooter'
import AdFooterr from '../AdFooter/adFooterr'
import { Actions } from 'react-native-router-flux';
import PostButton from '../PostButton/postButton'
import AdDescription from '../AdDescription/adDescription'
import RatingAndReviewCard from '../RatingAndReviewCard/ratingAndReviewCard'
import UserRatingAndReview from '../UserRatingAndReview/userRatingAndReview'
import DefaultAdCard from '../DefaultAdCard/defaultAdCard'
import RatingButton from '../RatingButton/ratingButton'
import FeatureSection from '../InAdFeatureSection/inAdFeatureSection'
import LocationViewer from '../LocationViewer/locationViewer'
import DescriptionSection from '../../CommonModules/DescriptionSection/descriptionSection'
import RecommendedAds from '../RecommendedAds/recommendedAds'

import { getUserFirestoreObj, getFirestoreUserByUid, getCurrentUid } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class Ads extends Component {

  constructor(props) {
    super(props)
    this.state = {

      userFirestoreObj: null,
      adUserFirestoreObj: null,
      buttonText: 'POST',
    
     
      adObj: this.props.navigation.getParam('adObj'),
    }
    this.updateParentReviews = this.props.navigation.getParam('updateReviews')
    this.updateAdList = this.props.navigation.getParam('updateAdList')
    YellowBox.ignoreWarnings(['Setting a timer']);
    console.disableYellowBox = true;
  }

  componentWillMount = async () => {

    await getUserFirestoreObj().then(user => this.setState({ userFirestoreObj: user[1] }))
    await getFirestoreUserByUid(this.state.adObj['MarketeerID']).then(async user => {
      this.setState({ adUserFirestoreObj: user[1] })
    }).catch(err => console.log(err))
  }



  renderImage = () => {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => this.setState({ displayImage: true })}>
          <Image source={{ uri: this.state.adObj["imageUrl"], width: responsiveWidth(100), height: responsiveHeight(35) }} />
        </TouchableWithoutFeedback>
      </View>
    )
  }



  onBackPress = async () => {
    if (this.state.pageType == 'normal') {
      await this.updateParentReviews()
    }
    this.props.navigation.goBack()
  }

  getAdOrder = uid => {

    let AdOrder = {
      'Title': this.state.adObj['Title'],
      'Price': this.state.adObj['Price'],
      'MarketeerID': uid,
      'CostCityID': this.state.adObj['CostCityID'],
      'imageUrl': this.state.adObj['imageUrl'],
      'imageUrlOrder': this.state.adObj['imageUrlOrder'],
      'CostCityName': this.state.adObj['CostCityName'],
      'Courier': this.state.adObj['Courier'],
      'DeliveryDesc': this.state.adObj['DeliveryDesc'],
      'DeliveryCost': this.state.adObj['DeliveryCost'],
      'Weight': this.state.adObj['Weight'],
      'CostUid': this.state.adObj['CostUid'],
      'Address': this.state.adObj['Address'],
      
      'OriginCityId': this.state.adObj['OriginCityId'],
      'OriginCityName': this.state.adObj['OriginCityName'],
      'OriginProvinceName': this.state.adObj['OriginProvinceName'],
      'OriginProvinceId': this.state.adObj['OriginProvinceId'],
      'Costumer': this.state.adObj['Costumer'],
      'ProvinceCostName': this.state.adObj['ProvinceCostName'],
      'ProvinceCostId': this.state.adObj['ProvinceCostId'],
      'Etd': this.state.adObj['Etd'],
      'Total': this.state.adObj['Total'],
      'timestamp': firebase.firestore.FieldValue.serverTimestamp(),
      'Delivery': 'true',
      'ShipmentNumber': this.state.ShipmentNumber,
    }
    return AdOrder
}

buttonAction = async () => {
  try {
      await getCurrentUid().then(async uid => {
          const db = firebase.firestore()
          let adOrders = this.getAdOrder(uid)
          await db.collection('Delivery').add(adOrders).then(async ref => {
           
                  await db.collection('Delivery').doc(ref.id).set(adOrders).then(() => {
                      this.setState(this.initState)
                      this.props.navigation.goBack()
                  }).catch(error => this.setPostError(error))
              
          }).catch(error => this.setPostError(error))
      }).catch(error => console.log(error.message))
  }
  catch (error) {
      console.log(error)
  }
}
  
  onLoginPress = () => {
    Alert.alert("LOGIN")
    console.log("Ask me later pressed")
  }

  render() {

    return (
      <View style={{ flex: 1 }}>

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
              <View style={{ flex: 1, paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveHeight(2) }}>
                <Card>
                  <CardItem header>
                    <Text style={{ fontSize: 18 }}>Payment</Text>
                  </CardItem>
                  <CardItem>
                    <Body>

                      <Text style={{ fontSize: 18 }}>
                        Courier      : {this.state.adObj['Courier']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        description      : {this.state.adObj['DeliveryDesc']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        Cost      : Rp {this.state.adObj['DeliveryCost']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        estimate      : {this.state.adObj['Etd']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        weight      : {this.state.adObj['Weight'] / 1000} Kg
                                        </Text>
                      <Text style={{ fontSize: 18 }}>
                        Total      : Rp {this.state.adObj['Total']}
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
                        Province  : {this.state.adObj['ProvinceCostName']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        City          : {this.state.adObj['CostCityName']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        Address        : {this.state.adObj['Address']}
                      </Text>
<Text></Text>
                      <Text style={{ fontSize: 18 }}>Payment</Text>
                      <Text></Text>
                <TouchableOpacity onPress={() => this.renderImage2()}>
                      <Image source={{ uri: this.state.adObj["imageUrlOrder"],width: responsiveWidth(80), height: responsiveHeight(35) }} />
                      </TouchableOpacity>
                    </Body>


                  </CardItem>
                </Card>
             
                  
                 
                <View>
                    <DescriptionSection value={this.state.ShipmentNumber}
                    label={'shipment number'} height={responsiveHeight(8)}
                    updateParent={(text) => this.setState({ ShipmentNumber: text })} flexSize={8} />

                  <Text></Text>
                </View>
              
                  
                <PostButton buttonText={this.state.buttonText} action={this.buttonAction} />
              
              </View>
            </ParallaxScrollView>
          </View>



        </Modal>
      </View>
    )
  }
}

