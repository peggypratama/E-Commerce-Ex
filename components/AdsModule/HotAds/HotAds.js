import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    YellowBox
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import DatePicker from 'react-native-datepicker'

import InternalHeader from '../../CommonModules/InternalHeader/reverseInternalHeader'
import StoreImage from '../../CommonModules/StoreImage/storeImage'
import PostButton from '../../CommonModules/PostButton/postButton'

import { getHotAd, setHotAd, updateHotAd } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class MarketeerAdminDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            adObj: this.props.navigation.getParam('adObj'),
            adID: this.props.navigation.getParam('adID'),
            minDate: '', maxDate: '', exists: false
        }
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
        await getHotAd(this.state.adID).then(obj => {
            if (obj) {
                this.setState({
                    startingDate: new Date(obj.startingDate),
                    endingDate: new Date(obj.endingDate),
                    exists: true
                })
            }
            let currDate = new Date()
            let currDay = currDate.getDate() + 1
            let currMonth = currDate.getMonth() + 1
            let currYear = currDate.getFullYear() - 5
            this.setState({ minDate: currYear + "-" + currMonth + '-' + currDay })
            currYear += 5
            currMonth += 3
            if (currMonth > 12) {
                currMonth = currMonth % 12
                currYear++
            }
            this.setState({ maxDate: currYear + "-" + currMonth + '-' + currDay })
        }).catch(err => console.log(err))
    }

    setHotAd = async () => {
        let obj = {
            startingDate: this.state.startingDate.toISOString(),
            endingDate: this.state.endingDate.toISOString()
        }
        if (!this.state.exists) {
            console.log('in')
            await setHotAd(this.state.adID, obj).then(() => {
                this.props.navigation.goBack()
            }).catch(err => Alert.alert(err))
        } else {
            await updateHotAd(this.state.adID, obj).then(() => {
                this.props.navigation.goBack()
            }).catch(err => Alert.alert(err))
        }
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <InternalHeader name={'Hot Ad'} flexSize={1} action={() => this.props.navigation.goBack()} />
                <View style={{ flex: 11, alignItems: 'center', justifyContent: 'center' }}>
                    <ScrollView>
                        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                            <StoreImage uri={this.state.adObj.imageUrl} height={30} width={95} radius={3} margin={1} />
                            <Text style={styles.title}>{this.state.adObj['Title']}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', marginVertical: responsiveHeight(2), width: responsiveWidth(100) }}>
                            <View style={{ flex: 1 }}>
                                <DatePicker
                                    style={{ width: responsiveWidth(48) }}
                                    date={this.state.startingDate}
                                    mode="date"
                                    placeholder="Select starting date"
                                    format="YYYY-MM-DD"
                                    minDate={this.state.minDate}
                                    maxDate={this.state.maxDate}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: responsiveHeight(0.5),
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginLeft: responsiveWidth(10),
                                            height: responsiveHeight(4.5),
                                            borderRadius: responsiveWidth(1)
                                        }
                                    }}
                                    onDateChange={(date) => { this.setState({ startingDate: new Date(date) }) }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <DatePicker
                                    style={{ width: responsiveWidth(48) }}
                                    date={this.state.endingDate}
                                    mode="date"
                                    placeholder="Select ending date"
                                    format="YYYY-MM-DD"
                                    minDate={this.state.minDate}
                                    maxDate={this.state.maxDate}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: responsiveHeight(0.5),
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            marginLeft: responsiveWidth(10),
                                            height: responsiveHeight(4.5),
                                            borderRadius: responsiveWidth(1)
                                        }
                                    }}
                                    onDateChange={(date) => { this.setState({ endingDate: new Date(date) }) }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <PostButton flexSize={1} buttonText={'DONE'} action={this.setHotAd} />
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        marginVertical: responsiveHeight(1),
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        textAlign: 'center'
    }
});  