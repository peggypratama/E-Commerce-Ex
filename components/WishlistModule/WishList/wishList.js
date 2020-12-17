import React, { Component, useEffect } from 'react';
import {
  View,
  YellowBox,
  FlatList,
  Text,
  ActivityIndicator
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MainHeader from '../../CommonModules/MainHeader/mainHeader'
import DefaultAdCard from '../../CommonModules/DefaultAdCard/defaultAdCard'

import { getCurrentUid } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class Wishlist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ads: [],
      db: firebase.firestore(),
      wishlistListner: firebase.firestore().collection('Wishlist'),
      uid: '',
      isLoading: true,
    }
    YellowBox.ignoreWarnings(['Setting a timer']);
    console.disableYellowBox = true;
  }

  componentWillMount = async () => {
    await getCurrentUid().then(async uid => {
      await this.setState({ uid: uid })
      await this.addWishlistListner(this.state.db.collection('Wishlist').where('userID', '==', uid))
      await this.initWishlist().then(() => this.setState({ isLoading: false }))
    }).catch(error => console.log('Wishlist ', error))
  }

  addWishlistListner = async ref => {
    ref.onSnapshot(async docSnapshot => {
      console.log('Received doc snapshot: ');
      await docSnapshot.docChanges().forEach(async change => {
        if (this.state.isLoading)
          return
        let tempArr = this.state.ads
        if (change.type == 'added') {
          tempArr = tempArr.filter(ele => { return ele.docID != change.doc.data().adID })
          await this.state.db.collection('Ads').doc(change.doc.data().adID).get().then(doc => {
            tempArr.unshift({ docID: doc.id, docData: doc.data() })
          })
        }
        else if (change.type == 'removed') {
          console.log('romived')
          tempArr = tempArr.filter(ele => { return ele.docID != change.doc.data().adID })
        }
        this.setState({ ads: tempArr })
      })
    }, err => {
      console.log(`Encountered error: ${err}`);
    });
  }

  initWishlist = async () => {
    await this.state.wishlistListner.get().then(async snapshot => {
      snapshot.docs.forEach(async wishlistDoc => {
        await this.state.db.collection('Ads').doc(wishlistDoc.data().adID).get().then(async doc => {
          let temp = { docID: doc.id, docData: doc.data() }
          let arr = [...this.state.ads]
          arr.push(temp)
          await this.setState({ ads: arr })
        })
      })
    })
  }

  gotoAd = (adObj, reviewObj, myReview, updateReviews, pageType) => {
    this.props.navigation.navigate('Ads', {
      'adObj': adObj,
      'reviewObj': reviewObj,
      'myReview': myReview,
      'updateReviews': updateReviews,
      'pageType': pageType,
    })
  }

  renderWishlist = () => {
    return (
      <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center' }}>
        <FlatList
          data={this.state.ads}
          extraData={this.state.ads}
          initialNumToRender={2}
          refreshing={true}
          renderItem={({ item }) =>
            <DefaultAdCard
              adID={item.docID}
              data={item.docData}
              pageType={'normal'}
              radius={responsiveHeight(3)}
              thumbnailWidth={responsiveWidth(88.5)}
              margin={responsiveHeight(1)}
              width={responsiveWidth(90)}
              action={this.gotoAd}
            />}
          keyExtractor={item => item.docID}
        />
      </View>
    )
  }

  renderSkeleton = () => {
    let comp;
    if (this.state.isLoading) {
      comp = <ActivityIndicator size={responsiveHeight(10)} color={'#008080'} />
    }
    return (
      <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: responsiveFontSize(2), marginBottom: responsiveHeight(2) }}>Your wishlisted items will be shown here</Text>
        {comp}
      </View>
    )
  }

  render() {
    let component;
    if (this.state.ads.length)
      component = this.renderWishlist()
    else
      component = this.renderSkeleton()
    return (
      <View style={{ flex: 1 }}>
        <MainHeader flexSize={1} />
        {component}
      </View>
    );
  }
}  