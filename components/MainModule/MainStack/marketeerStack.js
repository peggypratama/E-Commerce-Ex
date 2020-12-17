import React, { Component } from "react";
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'

import Home from '../../HomeModule/HomeMarketeer/HomeMarketeer'
import ChatStack from '../../ChatModule/ChatStack/chatStackMarketeer'
import AdStack from '../../AdsModule/AdStack/AdStack'
import AccountStack from '../../AccountModule/AccountStack/accountStackMarketeer'

const TabNavigator = createBottomTabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                tabBarLabel: "Home",
                tabBarIcon: ({ tintColor }) => (
                    <Entypo name={'home'} color={tintColor} size={responsiveHeight(3)} />
                )
            }
        },
        Chats: {
            screen: ChatStack,
            navigationOptions: {
                tabBarLabel: "Chats",
                tabBarIcon: ({ tintColor }) => (
                    <MaterialIcons name={'chat'} color={tintColor} size={responsiveHeight(3)} />
                )
            }
        },
        Ads: {
            screen: AdStack,
            navigationOptions: {
                tabBarLabel: "Ads",
                tabBarIcon: ({ tintColor }) => (
                    <Ionicons name={'md-list-box'} color={tintColor} size={responsiveHeight(3)} />
                )
            }
        },
        Account: {
            screen: AccountStack,
            navigationOptions: {
                tabBarLabel: "Account",
                tabBarIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons name={'account-tie'} color={tintColor} size={responsiveHeight(4)} />
                )
            }
        },
    },
    {
        tabBarOptions: {
            activeTintColor: '#008080',
            inactiveTintColor: '#4c516d',
            showIcon: true,
            style: {
                backgroundColor: 'white',
                borderWidth: 0
            }
        }
    }
);

const MainTab = createAppContainer(TabNavigator);

export default class Dashboard extends Component {
    render() {
        return (
            <MainTab />
        )
    }
}