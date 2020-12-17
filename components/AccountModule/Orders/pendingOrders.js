import React, { Component } from "react";
import {
    View,
    YellowBox,
    FlatList,
    Text,
    ActivityIndicator
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import isEqual from 'lodash.isequal'

import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'
import DefaultAdCard from '../../CommonModules/DefaultAdCard/defaultAdCard'

import { getCurrentUid, deleteAdImage } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class MyAds extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ads: [], temp: {}, isLoading: true, userID: '',
        }
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = () => {
        this.initMyAds().then(async () => {
            await firebase.firestore().collection('Orders').where('CostUid', '==', this.state.userID).onSnapshot(async docSnapshot => {
                if (this.state.isLoading)
                    return
                changes = docSnapshot.docChanges()
                for (let i = 0; i < changes.length; i++) {
                    let change = changes[i]
                    let temp = this.state.ads
                    if (change.type == 'modified') {
                        for (let i = 0; i < temp.length; i++) {
                            if (!isEqual(temp[i].docData, change.doc.data()))
                                temp[i].docData = change.doc.data()
                        }
                        //temp.unshift({ docID: change.doc.id, docData: change.doc.data() })
                    }
                    else if (change.type == 'removed')
                        temp = temp.filter(ele => { return ele.docID != change.doc.id })
                    this.setState({ ads: temp })
                    break;
                }
                /*docSnapshot.docChanges().forEach(change => {
                    let temp = this.state.ads
                    if (change.type == 'modified') {
                        for (let i = 0; i < temp.length; i++) {
                            if (!isEqual(temp[i].docData, change.doc.data()))
                                temp[i].docData = change.doc.data()
                        }
                        //temp.unshift({ docID: change.doc.id, docData: change.doc.data() })
                    }
                    else if (change.type == 'removed')
                        temp = temp.filter(ele => { return ele.docID != change.doc.id })
                    this.setState({ ads: temp })
                })*/
            })
            this.setState({ isLoading: false })
        })
    }

    componentWillUnmount = () => {
        firebase.firestore().collection('Orders').where('CostUid', '==', this.state.userID).onSnapshot(() => { })
    }

    initMyAds = async () => {
        await getCurrentUid().then(async uid => {
            await firebase.firestore().collection('Orders').where('CostUid', '==', uid).get().then(async snapshot => {
                this.setState({ userID: uid })
                snapshot.docs.forEach(doc => {
                    let arr = [...this.state.ads]
                    arr.push({ docID: doc.id, docData: doc.data() })
                    this.setState({ ads: arr })
                })
            })
        })
    }

    onDeletePress = async item => {
        this.setState({ temp: item })
        await deleteAdImage(item.docData['imageUrlOrder']).then(async () => {
            await firebase.firestore().collection('Orders').doc(item.docID).delete().catch(error => console.log(error.message))
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
            <View style={{ flex: 10, alignItems: 'center', justifyContent: 'center' }}>
                <FlatList
                    data={this.state.ads}
                    extraData={this.state.ads}
                    initialNumToRender={2}
                    refreshing={true}
                    renderItem={({ item }) =>
                        <DefaultAdCard
                            adID={item.docID}
                            data={item.docData}
                            radius={responsiveHeight(2.5)}
                            margin={responsiveHeight(1)}
                            thumbnailWidth={responsiveWidth(88.5)}
                            width={responsiveWidth(90)}
                            type={'my ads'}
                            pageType={'edit ads'}
                            action={this.gotoAd}
                            enableDeleteBuy={true}
                            onDeletePress={() => this.onDeletePress(item)}
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
            <View style={{ flex: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: responsiveFontSize(2), marginBottom: responsiveHeight(2) }}>Your ads will be shown here</Text>
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
                {component}
            </View>
        )
    }
}