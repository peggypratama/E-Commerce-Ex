import React, { Component } from 'react';
import {
    View,
    FlatList,
    AsyncStorage,
    StyleSheet,
    RefreshControl,
    YellowBox
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { FloatingAction } from "react-native-floating-action";

import MainHeader from '../../CommonModules/MainHeader/mainHeader'
import DefaultAdCard from '../../CommonModules/DefaultAdCard/defaultAdCardMarketeer'

import { getAds } from '../../Utility/utility'

export default class AdList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ads: [], storeObj: null, refreshing: false
        }
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
        this.setState({ refreshing: true })
        try {
            storeObj = await AsyncStorage.getItem('storeObj');
            storeObj = JSON.parse(storeObj)
            this.setState({ storeObj: storeObj })
            await getAds(storeObj.docID, (val) => this.setState({ ads: val }))
        } catch (err) {
            console.log(err)
        } finally {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
    }

    onDeletePress = async item => {
        this.setState({ temp: item })
        await deleteAdImage(item.docData['imageUrl']).then(async () => {
            await firebase.firestore().collection('Ads').doc(item.docID).delete().catch(error => console.log(error.message))
        })
    }

    onDealPress = item => {
        this.props.navigation.navigate('Deal', { ad: item, pageType: 'New' })
    }

    gotoAd = (adObj, updateCard) => {
        let temp = {
            'obj': adObj,
            'updateCard': updateCard,
        }
        this.props.navigation.navigate(adObj['Category'], { 'category': adObj['Category'], 'info': temp })

    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MainHeader flexSize={1} />
                <View style={{ flex: 8 }}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.componentWillMount}
                                colors={['#008080', '#4c516d']}
                            />}
                        data={this.state.ads}
                        extraData={this.state.ads}
                        initialNumToRender={2}
                        refreshing={this.state.refreshing}
                        renderItem={({ item }) =>
                            <DefaultAdCard
                                adID={item.docID}
                                data={item.docData}
                                radius={responsiveHeight(2.5)}
                                margin={responsiveHeight(1)}
                                thumbnailWidth={responsiveWidth(88.5)}
                                width={responsiveWidth(90)}
                                action={this.gotoAd}
                                onDeletePress={() => this.onDeletePress(item)}
                                onDealPress={() => this.onDealPress(item)}
                            />}
                        keyExtractor={item => item.docID}
                    />
                </View>
                <FloatingAction
                    animated={false}
                    showBackground={false}
                    buttonSize={responsiveHeight(8)}
                    style={styles.floatingDock}
                    color={'#008080'}
                    onPressMain={() => {
                        if (this.state.storeObj.docData.category == 'Hardware' || this.state.storeObj.docData.category == 'Electronics')
                            this.props.navigation.navigate('HardwareElectronics')
                        else
                            this.props.navigation.navigate(this.state.storeObj.docData.category)
                    }}
                    distanceToEdge={responsiveWidth(5)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    floatingDock: {
        backgroundColor: '#008080',
        position: 'absolute',
        width: responsiveWidth(14.5),
        height: responsiveHeight(7.5),
        borderRadius: responsiveHeight(10),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 15,
        top: responsiveHeight(80),
        left: responsiveWidth(81),
    },
});  