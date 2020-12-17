import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    AsyncStorage,
    YellowBox,
    RefreshControl
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { LineChart } from 'react-native-chart-kit'

import MainHeader from '../../CommonModules/MainHeader/mainHeader'
import StoreImage from '../../CommonModules/StoreImage/storeImage'
import InfoBox from '../../CommonModules/InfoBox/infoBox'

import * as firebase from 'firebase'
import { getStore, getOrders,getCurrentUid } from '../../Utility/utility'
import { predict, getRefinedOrders, getDefaultData, getDefaultLabels } from '../../Utility/salesPrediction'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            storeID: null, storeData: null,
            chartConfig: {
                backgroundColor: "#f2f2f2",
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: responsiveWidth(100),
                },
                propsForDots: {
                    r: responsiveHeight(0.2),
                    strokeWidth: responsiveWidth(1),
                    stroke: "#008080"
                },
                propsForLabels: {
                    fontSize: responsiveFontSize(1.5)
                }
            }
        }
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = () => {
        this.setState({ refreshing: true })
        getCurrentUid().then(async uid => {
            await getStore(uid).then(async obj => {
                await AsyncStorage.setItem('storeObj', JSON.stringify(obj));
                this.setState({ storeID: obj.docID, storeData: obj.docData })
                await getOrders(obj.docID).then(async ord => {
                    if (ord.list.length) {
                        await getRefinedOrders(ord).then(async newOrderObj => {
                            let profits = newOrderObj.list;
                            let config = {
                                predictionSteps: 3,
                                step: 3,
                                serie: profits
                            }
                            console.log('if ', profits)
                            await predict(config).then(predictionObj => {
                                console.log(predictionObj.serie)
                                let d = {
                                    labels: newOrderObj.labels.slice(0, profits.length),
                                    datasets: [{ data: predictionObj.serie }]
                                }
                                this.setState({
                                    orders: this.getMetricNumber(newOrderObj.orders),
                                    profit: this.getMetricNumber(newOrderObj.profit),
                                    data: d,
                                    orderObj: newOrderObj
                                })
                            })
                        })
                    }
                    else {
                        let d = {
                            labels: getDefaultLabels(),
                            datasets: [{ data: getDefaultData() }]
                        }
                        this.setState({
                            orders: this.getMetricNumber(0),
                            profit: this.getMetricNumber(0),
                            data: d,
                            orderObj: ord
                        })
                    }
                })
            })
            this.setState({ refreshing: false })
        }).catch(err => console.log(err))
    }

    getMetricNumber = number => {
        let p = parseFloat(number)
        if (p / 1000000000 > 1)
            p = p / 1000000000 + ' Trillions'
        else if (p / 10000000 > 1)
            p = p / 10000000 + ' Million'
        return p
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
            </View>
        )
    }

    renderStats = () => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ marginVertical: responsiveHeight(2), flexDirection: 'row', paddingHorizontal: responsiveWidth(2.5) }}>
                    <InfoBox height={responsiveHeight(8)} heading={'Total Orders'} value={this.state.orders} />
                    <InfoBox height={responsiveHeight(8)} heading={'Total Profit'} value={'Rs. ' + this.state.profit} />
                </View>
                <View style={{ marginVertical: responsiveHeight(2), flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ScrollView>
                        <LineChart
                            data={this.state.data}
                            width={responsiveWidth(100)}
                            height={responsiveHeight(50)}
                            verticalLabelRotation={30}
                            chartConfig={this.state.chartConfig}
                            fromZero={true}
                            style={{ borderRadius: responsiveHeight(4) }}
                        />
                    </ScrollView>
                </View>
            </View>
        )
    }

    render() {
        let storeInfo, stats;
        if (this.state.storeData)
            storeInfo = this.renderStoreInfo()
        if (this.state.orderObj)
            stats = this.renderStats()
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MainHeader flexSize={1} />
                <View style={{ flex: 8, alignItems: 'center' }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.componentWillMount}
                                colors={['#008080', '#4c516d']}
                            />}
                    >
                        {storeInfo}
                        {stats}
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
})