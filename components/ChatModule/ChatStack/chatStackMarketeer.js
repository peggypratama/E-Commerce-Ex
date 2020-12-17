import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Chat from '../Chat/chat'
import ChatList from '../ChatList/chatList'

const ChatNavigator = createStackNavigator(
    {
        ChatList:ChatList,
        Chat:Chat
    },
    {
        defaultNavigationOptions:
        {
            header: null
        }
    }
);

const ChatContainer = createAppContainer(ChatNavigator);

export default class ChatStack extends React.Component {
    render() {
        return <ChatContainer />;
    }
}