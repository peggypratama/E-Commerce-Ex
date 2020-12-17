import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

import WishList from '../WishList/wishList'
import Ads from '../../CommonModules/Ads/ads'
import Search from '../../CommonModules/Search/search'

const wishlistStack= createStackNavigator(
  {
    WishList:WishList,
    Ads:Ads,
    Search:Search,
  },
  {
    defaultNavigationOptions:
    {
      header:null
    }
  }
);
const WishlistNavigator=createAppContainer(wishlistStack)

export default class WishlistStack extends Component {
  render(){
    return(
      <WishlistNavigator/>
    )
  }
}