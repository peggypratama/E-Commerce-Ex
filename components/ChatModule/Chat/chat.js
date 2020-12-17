import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
  YellowBox
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { GiftedChat, Send, InputToolbar, Composer, Bubble } from 'react-native-gifted-chat'

import { getCurrentUid, getData, addToArray } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserID: null, messages: [], otherUserID: this.props.navigation.getParam('otherUser').userID,
      otherUserPhoto: null, otherUserData: null, 
    }
    YellowBox.ignoreWarnings(['Setting a timer']);
    console.disableYellowBox = true;
  }

  componentWillMount = async () => {
    let otherUser = this.props.navigation.getParam('otherUser')
    this.setState({
      otherUserData: otherUser,
      otherUserPhoto: otherUser['photoURL']
    })
    await getCurrentUid().then(uid => this.setState({ currentUserID: uid }))
    this.getMessages().catch(err => console.log(err))
  }

  getMessages = async () => {
    let friendID = this.state.otherUserID
    await getData("Chats", this.state.currentUserID, friendID).then(async messages => {
      if (messages)
        await this.setState({ messages: messages });
      else
        return 0;
      let that = this;
      firebase.firestore().collection("Chats").doc(this.state.currentUserID).onSnapshot(doc => {
        that.setState({ messages: doc.data()[friendID].reverse() });
      });
    });
  }

  onSend = async (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages,
        messages)
    }));
    messages[0].createdAt = Date.parse(messages[0].createdAt)
    await addToArray("Chats", this.state.currentUserID,
      this.state.otherUserID, messages[0]);
    messages[0].user._id = 2;
    await addToArray("Chats",
      this.state.otherUserID,
      this.state.currentUserID, messages[0]);
    messages[0].user._id = 1;
  }

  renderDate = (date) => {
    return (
      <Text style={styles.time}>
        {date}
      </Text>
    );
  }

  render() {
    let img = <Image style={styles.iconCat} source={require('../../../Images/user.png')} />;
    if (this.state.otherUserPhoto)
      img = <Image style={styles.iconCat} source={{ uri: this.state.otherUserPhoto }} />;
      console.log('send ', this.state.messages)
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}  >
        <Modal>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={styles.gradient}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ paddingHorizontal: responsiveWidth(3), flex: 1 }}>
              <FontAwesome5 name={'arrow-left'} color={'#ffffff'} size={responsiveHeight(4)} />
            </TouchableOpacity>
            <KeyboardAvoidingView style={{ flexDirection: 'row', flex: 2, alignItems: 'center' }}>
              {img}
            </KeyboardAvoidingView>
            <KeyboardAvoidingView style={{ flex: 8, justifyContent: 'center' }}>
              <Text numberOfLines={1} style={{ fontSize: responsiveFontSize(2.5), color: 'white', paddingHorizontal: responsiveWidth(2) }}>{this.state.otherUserData.firstName + ' ' + this.state.otherUserData.lastName}</Text>
            </KeyboardAvoidingView>
          </LinearGradient>

          <View style={styles.container}>

            <GiftedChat
              messages={this.state.messages}
              isAnimated={true}
              scrollToBottom={true}
              alwaysShowSend={true}
              renderSend={props => {
                return (
                  <Send {...props} containerStyle={{ justifyContent: 'center', alignItems: 'center' }} >
                    <View style={styles.sendBtnContainer}>
                      <FontAwesome name={'send'} color={'#008080'} size={responsiveHeight(3.5)} />
                    </View>
                  </Send>
                )
              }}
              renderInputToolbar={(props) => (
                <InputToolbar
                  {...props}
                  containerStyle={{
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  primaryStyle={{ paddingTop: responsiveWidth(1) }}
                />
              )}
              renderBubble={(props) => (
                <Bubble
                  {...props}
                  containerStyle={{
                    left: { marginLeft:responsiveWidth(-12) },
                    right: {},
                  }}
                  wrapperStyle={{
                    left: { },
                    right: { backgroundColor: '#008080' },
                  }}
                />
              )}
              renderComposer={(props) => (
                <Composer
                  {...props}
                  textInputStyle={{
                    color: '#222B45',
                    backgroundColor: '#EDF1F7',
                    borderRadius: responsiveWidth(2),
                    borderColor: '#EDF1F7',
                    borderWidth: responsiveWidth(1),
                    justifyContent: 'center',
                  }}
                />
              )}
              onSend={messages => this.onSend(messages)}
              user={{ _id: 1, }}
            />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row'
  },
  sendBtnContainer: {
    height: responsiveHeight(6),
    width: responsiveWidth(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCat: {
    height: responsiveHeight(7),
    width: responsiveWidth(14),
    borderRadius: 50,
  },
  container: {
    flex: 9
  },
});  