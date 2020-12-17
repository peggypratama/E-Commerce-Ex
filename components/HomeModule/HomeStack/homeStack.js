import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { Router, Scene, Stack } from 'react-native-router-flux';

import Dashboard from '../Dashboard/dashboard'
import Ads from '../../CommonModules/Ads/ads'
import NewElectronicHardwareAd from '../NewElectronicHardwareAd/newElectronicHardwareAd'
import NewVehicleAd from '../NewVehicleAd/newVehicleAd'
import NewHouseAd from '../NewHouseAd/newHouseAd'
import Broadcast from '../../BroadcastModule/Broadcast/broadcast'
import Search from '../../CommonModules/Search/search'
import LocationPicker from '../../CommonModules/LocationPicker/locationPicker'
import LocationPickerMaps from '../../CommonModules/LocationPickerButton/locationPickerMaps'
import RatingsAndReviews from '../../CommonModules/RatingsAndReviews/ratingsAndReviews'
import EditProfile from '../../AccountModule/EditProfile/editProfile'
import Chat from '../../ChatModule/Chat/chat'
import Outlet from '../Outlet/outlet'
import SearchResults from '../../CommonModules/SearchResults/searchResults'
import Login from '../../MainModule/Login/login'
import Signup from '../../MainModule/Signup/signup';
import EmailVerification from '../../MainModule/EmailVerification/emailVerification'
import Route from '../../CommonModules/Order/Routes'
import MainStack from '../../MainModule/MainStack/mainStack'
import DeliveredOrders from '../../AccountModule/Orders/pendingOrders';
import Order from '../../CommonModules/Order/Order'
import Delivery from '../../CommonModules/Delivery/delivery'
import BuyOrder from '../../CommonModules/buyOrder/buyOrder'


const dashboardStack= createStackNavigator(
  {
    Dashboard: Dashboard,
    EditProfile:EditProfile,
    NewVehicleAd: NewVehicleAd,
    Login: Login,
    Signup: Signup,
    Route: Route,
    BuyOrder: BuyOrder,
    EmailVerification:EmailVerification,
    NewHouseAd:NewHouseAd,
    Broadcast:Broadcast,
    Search:Search,
    Ads: Ads,
    Order: Order,
    Delivery: Delivery,
    NewElectronicHardwareAd:NewElectronicHardwareAd,
    LocationPicker: LocationPicker,
    LocationPickerMaps: LocationPickerMaps,
    RatingsAndReviews:RatingsAndReviews,
    Chat:Chat,
    Outlet:Outlet,
    SearchResults:SearchResults,
  },
  {
    defaultNavigationOptions:
    {
      header:null
    }
  }
);



const DashboardNavigator = createAppContainer(dashboardStack)
 
export default class DashboardStacks extends Component {
  render(){
    return (
      
 <DashboardNavigator/>
    )
  }
}