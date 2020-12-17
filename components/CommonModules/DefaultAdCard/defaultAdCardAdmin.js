import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import * as Animatable from 'react-native-animatable'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { getCurrentUid } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class DefaultAdCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data, userID: '', listening: false,
      db: firebase.firestore().collection('Ratings and Reviews'), changeType: '',
      reviews: [], rating: 0,
      component: this.renderSkeleton(), isLoading: true, deleteBtn: null,
    }
    console.disableYellowBox = true;
  }

  componentWillMount = async () => {
    if (this.props.adID && typeof this.props.adID != 'undefined') {
      this.getRating().then(async () => {
        if (this.state.data && this.props.adID)
          await this.initCard()
        let temp = this.state.data
        temp.adID = this.props.adID
        this.setState({
          isLoading: false,
          component: this.renderCard(),
        })
      }).catch(err => console.log('AdCard ', err))
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.data != this.props.data) {
      this.setState({ data: this.props.data })
    }
  }

  initCard = async () => {
    await this.setRating().then(async () => {
      await this.getMetricNumber(this.state.data['Price']).then(p => {
        this.setState({
          title: this.state.data['Title'],
          price: p,
          cover: this.state.data['imageUrl']
        })
      })
    })
  }

  setRating = async () => {
    if (this.state.reviews && this.state.reviews.length) {
      let sum = 0.0
      this.state.reviews.forEach(rev => {
        sum += rev.reviewData.rating
      })
      sum = parseFloat(sum)
      sum = sum / this.state.reviews.length
      sum = sum.toFixed(1)
      this.setState({ rating: sum })
    }
    else {
      this.setState({ rating: 0 })
    }
  }

  getRating = async () => {
    await getCurrentUid().then(async uid => {
      await this.state.db.where('adID', '==', this.props.adID).get().then(async reviews => {
        let tempR = []
        reviews.docs.forEach(doc => {
          let temp = { reviewID: doc.id, reviewData: doc.data() }
          tempR.push(temp)
          this.setState({ reviews: tempR })
        })
      })
    })
  }

  getMetricNumber = async number => {
    let p = parseFloat(number)
    if (p / 1000000000 > 1)
      p = p / 1000000000 + ' trillions'
    else if (p / 1000000 > 1)
      p = p / 1000000 + ' Million'
    return p
  }

  updateReviews = async () => {
    await this.getRating().then(async () => {
      this.setRating()
    })
  }

  updateCard = adObj => {
    this.setState({ data: adObj })
  }

  onCardPress = () => {
      this.props.action()
  }

  renderSkeleton = () => {
    return (
      <SkeletonPlaceholder style={{ flex: 1 }} speed={1000}>
        <View style={{ flex: 7 }}>
          <SkeletonPlaceholder.Item
            width={this.props.thumbnailWidth}
            height={responsiveHeight(22)}
            borderTopRightRadius={this.props.radius}
            borderTopLeftRadius={this.props.radius}
          />
        </View>
        <View style={{ flex: 4 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <SkeletonPlaceholder.Item height={responsiveHeight(1.7)} width={this.props.thumbnailWidth - responsiveWidth(2)} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <SkeletonPlaceholder.Item height={responsiveHeight(1.7)} width={this.props.thumbnailWidth - responsiveWidth(10)} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <SkeletonPlaceholder.Item height={responsiveHeight(1.7)} width={this.props.thumbnailWidth - responsiveWidth(20)} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <SkeletonPlaceholder.Item height={responsiveHeight(1.7)} width={responsiveWidth(15)} />
          </View>
        </View>
      </SkeletonPlaceholder>
    )
  }

  renderCard = () => {
    return (
      <TouchableOpacity onPress={this.onCardPress}>
        <View style={{ flex: 7 }}>
          <Image style={this.styles.thumbnail} source={{ uri: this.state.cover }} />
        </View>
        <View style={{ flex: 4, flexDirection: 'row' }}>
          <View style={{ flex: 4 }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={this.styles.info}>{this.state.title} </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={this.styles.price}>Rp. {this.state.price} </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={[this.styles.price, {color:'#006666'}]}>For {this.state.data['Type']}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={this.styles.rating}>{this.state.rating}</Text>
              <Fontisto name={'star'} color={'#008080'} size={responsiveHeight(1.5)} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Animatable.View animation={'bounceIn'} duration={2000} style={this.styles.menuBox} >
        {this.state.component}
      </Animatable.View >
    )
  }

  styles = StyleSheet.create({
    menuBox: {
      marginVertical: this.props.margin,
      flex: 1,
      width: this.props.width,
      height: responsiveHeight(37),
      borderRadius: responsiveHeight(3),
      marginHorizontal: responsiveWidth(2),
      paddingVertical: responsiveHeight(.5),
      paddingHorizontal: responsiveWidth(10),
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
    },
    info: {
      fontSize: responsiveFontSize(2.3),
      fontWeight: 'bold',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: responsiveHeight(1),
      paddingHorizontal: responsiveWidth(1)
    },
    price: {
      fontSize: responsiveFontSize(2),
      fontWeight: 'bold',
      color: 'green',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: responsiveHeight(1),
      paddingHorizontal: responsiveWidth(1)
    },
    rating: {
      fontSize: responsiveFontSize(1.8),
      fontWeight: 'bold',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: responsiveHeight(1),
      paddingHorizontal: responsiveWidth(1)
    },
    thumbnail: {
      flex: 1,
      borderTopRightRadius: this.props.radius,
      borderTopLeftRadius: this.props.radius,
      width: this.props.thumbnailWidth,
      resizeMode: 'cover',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
}