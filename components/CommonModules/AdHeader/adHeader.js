import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    YellowBox
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { getWishlistUsers, isWishlisted, getCurrentUid } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class AdHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            heartColor: '#a3a3a3',
            price: '',
            wishlistStringCount: '0',
            wishlistNumCount: 0,
            uid: '',
            ad: this.props.ad
        }
        this.updateParent = this.props.updateWishlist
        YellowBox.ignoreWarnings(['Setting a timer']);
    }

    componentWillMount = async () => {
        await this.getMetricNumber(this.props.price, '').then(num => this.setState({ price: num }))
        await getCurrentUid().then(async uid => {
            this.setState({ uid: uid })
            await isWishlisted(uid, this.props.adID).then(flag => {
                if (flag)
                    this.setState({ heartColor: 'red' })
            })
        }).catch(err => console.log(err))
    }

    updateWishlistCount = async (type, change) => {
        if (type == 'increment')
            await this.setState({ wishlistNumCount: this.state.wishlistNumCount + 1 })
        else if (type == 'decrement')
            await this.setState({ wishlistNumCount: this.state.wishlistNumCount - 1 })
        await this.getMetricNumber(this.state.wishlistNumCount, 'alpha').then(num => this.setState({ wishlistStringCount: num }))
        this.setState({changeType:change})
    }

    componentDidMount = async () => {
        await firebase.firestore().collection('Wishlist').where('adID', '==', this.props.adID).onSnapshot(async docSnapshot => {
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

    getMetricNumber = async (number, type) => {
        let p = parseFloat(number)
        if (p / 1000000000 > 1)
            if (type != 'alpha')
                p = p / 1000000000 + ' Billion'
            else
                p = p / 1000000000 + 'B'
       
        else if (p / 1000000 > 1)
            if (type != 'alpha')
                p = p / 1000000 + ' Million'
            else
                p = p / 1000000 + 'M'
        return p
    }

    onHeartPress = async () => {
        if (this.state.heartColor == 'red') {
            await firebase.firestore().collection('Wishlist').
                where('userID', '==', this.state.uid).where('adID', '==', this.props.adID).get().then(snapshot => {
                snapshot.docs.forEach(async doc => {
                    if (doc.data().userID == this.state.uid) {
                        await firebase.firestore().collection('Wishlist').doc(doc.id).delete().then(async () => {
                            this.setState({ heartColor: '#a3a3a3' })
                        }).catch(error => { throw error })
                        return
                    }
                }).catch(error => { throw error })
            }).catch(error => console.log(error.message))
        }
        else {
            await firebase.firestore().collection('Wishlist').doc().set({ 'userID': this.state.uid, 'adID': this.props.adID, 'timestamp': firebase.firestore.FieldValue.serverTimestamp() }).then(async () => {
                this.setState({ heartColor: 'red' })
                //this.updateParent(this.state.ad, this.props.adID, 'add')
                return
            }).catch(error => console.log(error.message))
        }
    }

    styles = StyleSheet.create({
        price: {
            fontSize: responsiveFontSize(2.8),
            color: '#008080',
            fontWeight: 'bold'
        },
        title: {
            fontSize: responsiveFontSize(3),
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'justify'
        },
        heart: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
        }
    });

    render() {
        return (
            <View style={{ flex: this.props.flexSize, flexDirection: 'row' }}>
                <View style={{ flex: 8 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: responsiveFontSize(2.6), color: '#66b2b2', fontWeight: 'bold' }}>For {this.props.type}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={this.styles.price}>IDR. {this.state.price}</Text>
                    </View>
                    <View style={{ flex: 1, paddingRight: responsiveWidth(1) }}>
                        <Text numberOfLines={2} style={this.styles.title}>{this.props.title}</Text>
                        
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={this.styles.heart} onPress={this.onHeartPress}>
                        
                        <FontAwesome name={'heart'} color={this.state.heartColor} size={responsiveHeight(3.5)} />
                        <Text style={{ fontSize: responsiveFontSize(1.5) }}>{this.state.wishlistStringCount}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 2 }} />
                </View>
            </View>
        )
    }
}