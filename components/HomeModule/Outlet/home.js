import React, { Component } from "react";
import { Text, View, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList, YellowBox, Modal } from 'react-native';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import StoreImage from '../../CommonModules/StoreImage/storeImage'
import LocationViewer from '../../CommonModules/LocationViewer/locationViewer'
import AdHeading from '../../CommonModules/AdHeading/adHeading'

export default class RentDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            storeData:this.props.screenProps['outlet'].docData,
        }
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    renderStoreInfo() {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <StoreImage uri={this.state.storeData.coverURL} height={25} width={95} radius={3} margin={1} />
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <StoreImage uri={this.state.storeData.logoURL} height={10} width={20} radius={3} margin={1} />
                    </View>
                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                        <Text numberOfLines={2} style={{ fontSize: responsiveFontSize(2.6) }}>{this.state.storeData.name}</Text>
                    </View>
                </View>
                <AdHeading fontSize={2.7} name={'Location'} margin={responsiveHeight(2)} />
                <LocationViewer height={responsiveHeight(25)} width={responsiveWidth(95)} latlong={this.state.storeData.location} />
            </View>
        )
    }

    render() {
        let storeInfo;
        if (this.state.storeData)
            storeInfo = this.renderStoreInfo()
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    {storeInfo}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});  