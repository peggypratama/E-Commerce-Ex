import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import AdList from '../AdList/Adlist'
import Houses from '../add/newHouseAd'
import Vehicles from '../add/newVehicleAd'
import HardwareElectronics from '../add/newElectronicHardwareAd'
import LocationPicker from '../../CommonModules/LocationPicker/locationPicker'
import Deal from '../Deal/Deal'

const AdNavigator = createStackNavigator(
    {
        AdList: AdList,
        Houses: Houses,
        Vehicles: Vehicles,
        HardwareElectronics: HardwareElectronics,
        LocationPicker:LocationPicker,
        Deal:Deal
    },
    {
        defaultNavigationOptions:
        {
            header: null
        }
    }
);

const AdContainer = createAppContainer(AdNavigator);

export default class AdStack extends React.Component {
    render() {
        return <AdContainer />;
    }
}