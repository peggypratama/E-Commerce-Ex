import React, { Component } from "react";
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
//import DeliveredOrders from './buyer'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MyAds from './myAdsStack'
import Buyer from './buyerStack'

const TabNavigator = createMaterialTopTabNavigator(
    {
        MyAdverstisement:{
            screen:MyAds,
            navigationOptions:{
                tabBarLabel:"My Advertisment",
                tabBarIcon:({tintColor}) => (
                    <MaterialCommunityIcons name={'truck-delivery'} color={tintColor} size={responsiveHeight(3.5)}/>
                )
            }
        },
        Delivered:{
            screen:Buyer,
            navigationOptions:{
                tabBarLabel:"Buyer",
                tabBarIcon:({tintColor}) => (
                    <MaterialCommunityIcons name={'truck-check'} color={tintColor} size={responsiveHeight(3.5)}/>
                )
            }
        },
    },
    {
        swipeEnabled:true,
        tabBarOptions: {
            showIcon:true,
            activeTintColor: '#008080',
            inactiveTintColor: '#4c516d',
            labelStyle: {
                fontSize: responsiveFontSize(1.5),
            },
            tabStyle: {
                width: responsiveWidth(50),
                height:responsiveHeight(8)
            },
            style: {
                backgroundColor: 'white',
                borderWidth:responsiveWidth(0.3),
                borderTopColor:'#c6c8cc',
                borderRightColor:'transparent',
                borderLeftColor:'transparent',
                borderBottomColor:'transparent',
            },
            indicatorStyle:{
                backgroundColor:'#008080',
                height:responsiveHeight(0.5)
            }
        }
    }
);

const Navbar = createAppContainer(TabNavigator) 
export default Navbar