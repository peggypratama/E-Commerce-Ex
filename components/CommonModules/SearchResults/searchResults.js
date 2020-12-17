import React, { Component } from "react";
import {
    View,
    YellowBox,
    FlatList,
    Text,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import InternalHeader from '../InternalHeader/internalHeader'
import DefaultAdCard from '../DefaultAdCard/defaultAdCard'

import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class SearchResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ads: this.props.navigation.getParam('results')
        }
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
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

    renderResults = () => {
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
                            data={item}
                            pageType={'normal'}
                            radius={responsiveHeight(3)}
                            thumbnailWidth={responsiveWidth(88.5)}
                            width={responsiveWidth(90)}
                            margin={responsiveHeight(1)}
                            action={this.gotoAd}
                        />}
                    keyExtractor={item => item.docID}
                />
            </View>
        )
    }

    renderSkeleton = () => {
        return (
            <View style={{ flex: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Entypo name={'emoji-sad'} color={'red'} size={responsiveHeight(5)} />
                <Text style={{ fontSize: responsiveFontSize(2), marginVertical: responsiveHeight(2) }}>No results were found</Text>
                <MaterialCommunityIcons name={'lightbulb-on'} color={'#FFFF00'} size={responsiveHeight(7)} />
                <Text style={{ fontSize: responsiveFontSize(2), marginVertical: responsiveHeight(1) }}>I Know</Text>
                <Text onPress={() => {this.props.navigation.navigate('Broadcast')}} style={{ fontSize: responsiveFontSize(2), marginBottom: responsiveHeight(2), color:'#008080' }}>Lets Broadcast</Text>
            </View>
        )
    }

    render() {
        let component;
        if (this.state.ads.length)
            component = this.renderResults()
        else
            component = this.renderSkeleton()
        return (
            <View style={{ flex: 1 }}>
                <InternalHeader name={'Search Results'} flexSize={1} action={() => this.props.navigation.goBack()} />
                <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}>
                    {component}
                </View>
            </View>
        )
    }
}