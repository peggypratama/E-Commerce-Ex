import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

import Chat from '../Chat/chat'
import ChatList from '../ChatList/chatList'
import Search from '../../CommonModules/Search/search'

const chatStack= createStackNavigator(
  {
    ChatList:ChatList,
    Chat:Chat,
    Search:Search,
  },
  {
    defaultNavigationOptions:
    {
      header:null
    }
  }
);
const ChatNavigator=createAppContainer(chatStack)

export default class ChatStack extends Component {
  render(){
    return(
      <ChatNavigator/>
    )
  }
}