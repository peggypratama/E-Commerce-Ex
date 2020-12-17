import React, { Component } from 'react'
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
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
import {Actions} from 'react-native-router-flux';
import AdDescription from '../AdDescription/adDescription'
import RatingAndReviewCard from '../RatingAndReviewCard/ratingAndReviewCard'
import UserRatingAndReview from '../UserRatingAndReview/userRatingAndReview'
import DefaultAdCard from '../DefaultAdCard/defaultAdCard'
import RatingButton from '../RatingButton/ratingButton'
import FeatureSection from '../InAdFeatureSection/inAdFeatureSection'
import LocationViewer from '../LocationViewer/locationViewer'
import RecommendedAds from '../RecommendedAds/recommendedAds'

import { getUserFirestoreObj, getFirestoreUserByUid } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class Ads extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
 
      userFirestoreObj: null,
      adUserFirestoreObj: null,
 
        adObj: this.props.navigation.getParam('adObj'),
    }
    this.updateParentReviews = this.props.navigation.getParam('updateReviews')
    this.updateAdList = this.props.navigation.getParam('updateAdList')
    YellowBox.ignoreWarnings(['Setting a timer']);
    console.disableYellowBox = true;
  }

  componentWillMount = async () => {

    await getUserFirestoreObj().then(user => this.setState({ userFirestoreObj: user[1] }))
    await getFirestoreUserByUid(this.state.adObj['uid']).then(async user => {
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

  renderImage2 = () => {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => this.setState({ displayImage: true })}>
          <Image source={{ uri: this.state.adObj["imageUrlOrder"], width: responsiveWidth(100), height: responsiveHeight(35) }} />
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


  render() {

    return (
      <View style={{ flex: 1 }}>

        <Modal presentationStyle={'overFullScreen'} visible={this.state.displayImage} transparent={false}>
          <ImageView images={[{ uri: this.state.adObj["imageUrl"] }]} imageIndex={0} visible={this.state.displayImage}
            onRequestClose={() => this.setState({ displayImage: false })} presentationStyle={'overFullScreen'}
            animationType={'fade'} />
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
                        Courier             : {this.state.adObj['Courier']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        description      : {this.state.adObj['DeliveryDesc']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        Cost                 : Rp {this.state.adObj['DeliveryCost']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        estimate          : {this.state.adObj['Etd']} Day
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        weight              : {this.state.adObj['Weight'] / 1000} Kg
                                        </Text>
                                        <Text style={{ fontSize: 18 }}>
                        name goods     : {this.state.adObj['Title']}
                                        </Text>
                                        <Text style={{ fontSize: 18 }}>
                        Price                 : Rp {this.state.adObj['Price']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        Total                 : Rp {this.state.adObj['Total']}
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
                        Name       : {this.state.adObj['Costumer']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        Province  : {this.state.adObj['ProvinceCostName']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        City          : {this.state.adObj['CostCityName']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        Address   : {this.state.adObj['Address']}
                      </Text>
                    </Body>
                  </CardItem>
                            </Card>
                            
                            <Card>
                  <CardItem header>
                    <Text style={{ fontSize: 18 }}>delivery info</Text>
                  </CardItem>
                  <CardItem>
                    <Body>

                    <Text style={{ fontSize: 18 }}>
                        DeliveryShipment   : {this.state.adObj['ShipmentNumber']}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        Delivery Status       : {this.state.adObj['Delivery']}
                      </Text>
                      <Text></Text>
                      <Text style={{ fontSize: 18 }}>Payment</Text>

                      <TouchableOpacity onPress={() => this.renderImage2()}>
                      <Image source={{ uri: this.state.adObj["imageUrlOrder"],width: responsiveWidth(80), height: responsiveHeight(35) }} />
                      </TouchableOpacity>

                    </Body>
                  </CardItem>
                </Card>

              </View>
            </ParallaxScrollView>
          </View>

          

        </Modal>
      </View>
    )
  }
}

