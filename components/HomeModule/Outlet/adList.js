import React, { Component } from "react";
import { Text, View, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList, YellowBox, Modal } from 'react-native';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import DefaultAdCard from '../../CommonModules/DefaultAdCard/defaultAdCard'

import { getOutletAds } from '../../Utility/utility'

export default class RentDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            outletID: this.props.screenProps['outlet'].docID,
            ads: []
        }
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
        console.log(this.state.outletID)
        if (this.state.outletID)
            await getOutletAds(this.state.outletID, val => this.setState({ ads: val })).catch(err => console.log(err))
    }

    render() {
        return (
            <View style={{ flex: 1, paddingVertical:responsiveHeight(2) }}>
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
                            radius={responsiveHeight(2.5)}
                            thumbnailWidth={responsiveWidth(93.5)}
                            width={responsiveWidth(95)}
                            action={this.props.screenProps['navAd']}
                        />}
                    keyExtractor={item => item.docID}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
});  