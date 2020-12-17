import React, { Component } from "react";
import { Text, View, TextInput, StyleSheet, Image, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";

import DefaultAdCard from '../DefaultAdCard/defaultAdCard'
import AdHeading from '../AdHeading/adHeading'

import { getRecommendedAds } from '../../Utility/utility'

export default class RecommendedAds extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ads: []
        }
    }

    componentWillMount = async () => {
        if (this.props.adObj) {
            await getRecommendedAds(this.props.adObj["adID"], this.props.adObj, this.props.adObj["Category"], this.props.adObj["Type"]).then(ads => {
                this.setState({ ads: ads })
            }).catch(err => console.log(err))
        }
    }

    renderAds = () => {
        return (
            <View style={{flex:1}}>
                <AdHeading fontSize={3} name={'Similar Ads'} margin={responsiveHeight(3)} />
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
                            width={responsiveWidth(90)}
                            margin={responsiveHeight(1)}
                            action={this.props.action}
                        />}
                    keyExtractor={item => item.docID}
                />
            </View>
        )
    }

    render() {
        let ads;
        if(this.state.ads.length)
        ads=this.renderAds()
        else
        ads=null
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: responsiveWidth(100) }}>
                {ads}
            </View>
        )
    }
}