import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    YellowBox
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";

import AntDesign from 'react-native-vector-icons/AntDesign'

import MainHeader from '../../CommonModules/MainHeader/mainHeaderAdmin'
import DefaultAdCard from '../../CommonModules/DefaultAdCard/defaultAdCardAdmin'

import { logout } from '../../Utility/utility'
import { getAllAds } from '../../Utility/utility'

export default class MarketeerAdminDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ads: [],
        }
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = () => {
        getAllAds(val => { this.setState({ ads: val }) })
    }

    signout = async () => {
        await logout().then(() => {
            this.props.navigation.navigate('Login')
        }).catch(err => console.log(err))
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MainHeader flexSize={1} />
                <View style={{ flex: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <FlatList
                        data={this.state.ads}
                        extraData={this.state.ads}
                        initialNumToRender={2}
                        renderItem={({ item }) =>
                            <DefaultAdCard
                                adID={item.docID}
                                data={item.docData}
                                radius={responsiveHeight(2.5)}
                                margin={responsiveHeight(1)}
                                thumbnailWidth={responsiveWidth(88.5)}
                                width={responsiveWidth(90)}
                                action={() => this.props.navigation.navigate('HotAds', { adObj: item.docData, adID: item.docID })}
                            />}
                        keyExtractor={item => item.docID}
                    />
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={this.signout}>
                    <AntDesign name={'logout'} color={'white'} size={responsiveHeight(3)} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logoutBtn: {
        backgroundColor: '#008080',
        position: 'absolute',
        width: responsiveWidth(15.5),
        height: responsiveHeight(8.2),
        borderRadius: responsiveHeight(100),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 15,
        top: responsiveHeight(85.5),
        left: responsiveWidth(5),
    }
});  