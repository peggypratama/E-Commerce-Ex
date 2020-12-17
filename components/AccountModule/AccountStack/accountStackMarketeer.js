import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Account from '../Account/accountMarketeer'
import EditProfile from '../EditOutlet/editOutlet'
import ChangePassword from '../ChangePassword/changePassword'
import EditOutlet from '../EditOutlet/editOutlet'
import LocationPicker from '../../CommonModules/LocationPicker/locationPicker'


const AccountNavigator = createStackNavigator(
    {
        Account: Account,
        EditProfile: EditProfile,
        ChangePassword: ChangePassword,
        EditOutlet: EditOutlet,
        LocationPicker: LocationPicker,
    },
    {
        defaultNavigationOptions:
        {
            header: null
        }
    }
);

const AccountContainer = createAppContainer(AccountNavigator);

export default class AccountStack extends React.Component {
    render() {
        return <AccountContainer />;
    }
}