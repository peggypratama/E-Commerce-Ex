import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import marketeerAdminDashbord from '../BroadcastList/boradcastList'
import hotAds from '../BroadcastInfo/broadcastInfo'

const AuthNavigator = createStackNavigator(
    {
        marketeerAdminDashbord: marketeerAdminDashbord,
        hotAds: hotAds
    },
    {
        defaultNavigationOptions:
        {
            header: null
        }
    }
);

const AuthContainer = createAppContainer(AuthNavigator);

export default class AuthStack extends React.Component {
    render() {
        return <AuthContainer />;
    }
}