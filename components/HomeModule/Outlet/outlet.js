import React, { Component } from "react";
import { Text, View, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList, YellowBox, Modal } from 'react-native';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import NavBar from './navbar'

import { getOutlet } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class RentDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            marketeer: this.props.navigation.getParam('marketeer'),
            outlet: null
        }
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
        await getOutlet(this.state.marketeer.userID).then(outlet => {
            this.setState({ outlet: outlet })
        }).catch(err => console.log(err))
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

    renderNavBar = () => {
        return (
            <View style={{ flex: 1 }}>
                <NavBar screenProps={{ 'navAd': this.gotoAd, 'outlet': this.state.outlet, 'marketeer': this.state.marketeer }} />
            </View>
        )
    }

    render() {
        let nav;
        if (this.state.outlet)
            nav = this.renderNavBar()
        else
            nav = null
        return (
            <View style={{ flex: 1 }}>
                <Modal>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', backgroundColor: '#008080' }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ paddingHorizontal: responsiveWidth(3), flex: 1, justifyContent: 'center' }}>
                                <FontAwesome5 name={'arrow-left'} color={'#ffffff'} size={responsiveHeight(4)} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 5, justifyContent: 'center', marginLeft: responsiveWidth(2) }}>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.text}>{'Outlet Details'}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 9 }}>
                        {nav}
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: responsiveFontSize(2.5),
        color: 'white'
    },
});  