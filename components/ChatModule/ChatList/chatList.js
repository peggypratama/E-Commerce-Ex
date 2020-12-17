import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
  YellowBox,
  RefreshControl
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import MainHeader from '../../CommonModules/MainHeader/mainHeader'
import ChatCard from '../../CommonModules/ChatCard/chatCard'

import { getCurrentUid, getAllChats } from '../../Utility/utility'

export default class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: null, userID: null, isEmpty: true
    }
    YellowBox.ignoreWarnings(['Setting a timer']);
    console.disableYellowBox = true;
  }

  componentWillMount = async () => {
    this.setState({ refreshing: true })
    await getCurrentUid().then(async uid => {
      await getAllChats(uid).then(chats => {
        if (chats) {
          let chatArr = []
          for (var key in chats)
            chatArr.push({ id: key, data: chats[key] })
          this.setState({ chats: chatArr, isEmpty: false })
        }
        else
          this.setState({ chats: [] })
      }).catch(err => { throw err })
    }).catch(err => console.log(err))
    this.setState({ refreshing: false })
  }

  goToChat = obj => {
    this.props.navigation.navigate('Chat', { otherUser: obj })
  }

  renderChats = () => {
    return (
      <View style={{ flex: 7.2 }}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.componentWillMount}
              colors={['#008080', '#4c516d']}
            />}
          extraData={this.state.chats}
          data={this.state.chats}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <ChatCard
              id={item.id}
              data={item.data}
              action={this.goToChat}
            />}
        />
      </View>
    )
  }

  renderText = () => {
    return (
      <View style={{ flex: 7.2, alignItems: 'center', justifyContent: 'center' }} >
        <Text style={{ fontSize: responsiveFontSize(2), color: '#4c516d' }}>You have no chats available</Text>
      </View>
    )
  }

  render() {
    let component;
    if (this.state.isEmpty)
      component = this.renderText()
    else
      component = this.renderChats()
    return (
      <View style={{ flex: 1 }} >
        <MainHeader flexSize={0.9} />
        {component}
      </View>
    );
  }
}