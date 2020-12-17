import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

import Account from '../Account/account'
import Settings from '../Settings/settings'
import AboutUs from '../AboutUs/aboutUs'
import PrivacyPolicy from '../PrivacyPolicy/privacyPolicy'
import NotificationSettings from '../NotificationSettings/notificationSettings'
import Orders from '../Orders/orders'
import ContactUs from '../ContactUs/contactUs'
import EditProfile from '../EditProfile/editProfile'
import ChangePassword from '../ChangePassword/changePassword'
import MyAds from '../MyAds/ads'
import Houses from '../../HomeModule/NewHouseAd/newHouseAd'
import Vehicles from '../../HomeModule/NewVehicleAd/newVehicleAd'
import Electronics from '../../HomeModule/NewElectronicHardwareAd/newElectronicHardwareAd'
import Hardware from '../../HomeModule/NewElectronicHardwareAd/newElectronicHardwareAd'
import LocationPicker from '../../CommonModules/LocationPicker/locationPicker'
import Login from '../../MainModule/Login/login';
import Outlet from '../../MainModule/MainStack/marketeerStack'
import Dashboard from '../../HomeModule/Dashboard/dashboard';
import Ads from '../../CommonModules/Ads/ads'

const accountStack= createStackNavigator(
  {
    Account:Account,
    //Login: Login,
    Settings: Settings,
    Outlet: Outlet,
    Ads: Ads,
    Dashboard: Dashboard,
    AboutUs:AboutUs,
    PrivacyPolicy:PrivacyPolicy,
    NotificationSettings:NotificationSettings,
    Orders:Orders,
    ContactUs:ContactUs,
    EditProfile:EditProfile,
    ChangePassword:ChangePassword,
    MyAds:MyAds,
    Houses:Houses,
    Vehicles:Vehicles,
    Electronics:Electronics,
    Hardware:Hardware,
    LocationPicker:LocationPicker,
  },
  {
    defaultNavigationOptions:
    {
      header:null
    }
  }
);
const AccountNavigator=createAppContainer(accountStack)

export default class AccountStack extends Component {
  render(){
    return(
      <AccountNavigator/>
    )
  }
}