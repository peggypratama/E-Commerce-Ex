import React, { Component } from "react";
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import ChatStack from '../../ChatModule/ChatStack/chatStack'
import AccountStack from '../../AccountModule/AccountStack/accountStack'
import WishlistStack from '../../WishlistModule/WishlistStack/wishlistStack'
import HomeStack from '../../HomeModule/HomeStack/homeStack'
import Home from "../../HomeModule/HomeMarketeer/HomeMarketeer";
import { Dimensions } from "react-native";

const TabNavigator = createBottomTabNavigator(
{
    Home:{
        screen:HomeStack,
        navigationOptions:{
            tabBarLabel:"Home",
            tabBarIcon:({tintColor}) => (
                <Entypo name={'home'} color={tintColor} size={responsiveHeight(3)}/>
            )
        }
    },
    Chats:{
        screen:ChatStack,
        navigationOptions:{
            tabBarLabel:"Chats",
            tabBarIcon:({tintColor}) => (
                <MaterialIcons name={'chat'} color={tintColor} size={responsiveHeight(3)}/>
            )
        }
    },
    Wishlist:{
        screen:WishlistStack,
        navigationOptions:{
            tabBarLabel:"Wishlist",
            tabBarIcon:({tintColor}) => (
                <Ionicons name={'md-heart'} color={tintColor} size={responsiveHeight(3)}/>
            )
        }
    },
    Account:{
        screen:AccountStack,
        navigationOptions:{
            tabBarLabel:"Account",
            tabBarIcon:({tintColor}) => (
                <MaterialCommunityIcons name={'account-tie'} color={tintColor} size={responsiveHeight(4)}/>
            )
        }
    },
},
    
{
    tabBarOptions:{
        activeTintColor: '#008080',
        inactiveTintColor:'#4c516d',
        showIcon:true,
        style:{
            backgroundColor:'white',
            borderWidth:0
        }
    }
}
);

var { height, width } = Dimensions.get('window');

const MyDrawerNavigator = createDrawerNavigator({
    
    Home: {
        screen: HomeStack,
        navigationOptions:{
            drawerLabel:"Home",
            drawerIcon:({tintColor}) => (
                <Entypo name={'home'} color={tintColor} size={responsiveHeight(3)}/>
            )
        }
    },
    Chat: {
        screen: ChatStack,
        navigationOptions:{
            drawerLabel:"Chats",
            drawerIcon:({tintColor}) => (
                <MaterialIcons name={'chat'} color={tintColor} size={responsiveHeight(3)}/>
            )
        }
    },
    Wishlist: {
        screen: WishlistStack,
        navigationOptions:{
            drawerLabel:"Wishlist",
            drawerIcon:({tintColor}) => (
                <Ionicons name={'md-heart'} color={tintColor} size={responsiveHeight(3)}/>
            )
        }

    },
    Account: {
        screen: AccountStack,
        navigationOptions:{
            drawerLabel:"Account",
            drawerIcon:({tintColor}) => (
                <MaterialCommunityIcons name={'account-tie'} color={tintColor} size={responsiveHeight(4)}/>
            )
        }
    },
   
  });

const MyApp = createAppContainer(MyDrawerNavigator);

export default class Drawer extends Component{
    closeDrawer = () => {
        this.drawer._root.close()
      };
      openDrawer = () => {
        this.drawer._root.open()
      };
    render() {
        return (
            <MyApp/>
        )
    }
}