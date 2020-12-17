import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import LinearGradient from 'react-native-linear-gradient'
import InternalHeader from '../../CommonModules/InternalHeader/internalHeader' 
import { emailVerification } from '../../Utility/utility'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'

var countdown=null;

export default class EmailVerification extends Component {
  constructor(props){
    super(props)
    this.state={
      sentDialog:false,
      timer:30,
      btnDisabled:false,
      btnIndicator:false
    }
  }

  componentDidMount = async () => {
    await this.requestForResend()
  }

  requestForResend = async () => {
    await emailVerification().then(() => {
      this.setState({btnIndicator:true})
      this.setState({timer:30})
      this.setState({btnDisabled:true})
      countdown=setInterval(this.startTimer, 1000)
      this.setState({sentDialog:true})
    }).catch((error) => {
        console.log(error)
    })
  }

  startTimer = () => {
    this.setState({timer:this.state.timer-1})
    if(this.state.timer==0)
    {
        clearInterval(countdown)
        this.setState({btnDisabled:false})
        this.setState({btnIndicator:false})
    }
  }

  render() {
    let btnDisplay;
      if(this.state.btnIndicator)
          btnDisplay=<ActivityIndicator size={responsiveHeight(4)} color={'white'} />
      else
          btnDisplay=<Text style={styles.btnTxt}>Resend Email</Text>

    return ( 
      <View style={{flex:1}}>

        <DialogBox resetState={() => this.setState({ sentDialog:false })} showDialog={this.state.sentDialog} title={'Sending Successful'} description={'The verification email has been sent to you'} />


        <InternalHeader action={() => this.props.navigation.navigate('Login')} name={'Email Verification'} flexSize={1} />

        <View style={{flex:3, alignItems:'center', justifyContent:'center', paddingHorizontal:responsiveWidth(6)}}>
            <Text style={styles.info}>An email verification message has been sent to you. Open the email to verify your account. After that you can go back and login. In case you do not recieve the email please press the button below : </Text>
        </View>
        <View style={{alignItems:'center', flex:2}}>
          <TouchableOpacity onPress={this.requestForResend} disabled={this.state.btnDisabled}>
              <LinearGradient start={{x: 0, y: 0}} end={{x:1.3, y: 0}} colors={['#008080', '#4c516d']} style={styles.btn}>
                  {btnDisplay}
              </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{flex:5, alignItems:'center', paddingHorizontal:responsiveWidth(6)}}>
          <Text style={styles.info}>If you don't received the mail in <Text style={{color:'#4c516d', fontWeight:'bold'}}>{this.state.timer}</Text> seconds then please try again</Text>
        </View>
        <View style={{flex:5, alignItems:'center', paddingHorizontal:responsiveWidth(6)}}>
          <Text style={styles.info}>Press Back if you have verified your account to login</Text>
        </View>
      </View>
    )
  }
}

const styles=StyleSheet.create({
  info:{
    fontSize:responsiveFontSize(2),
    textAlign:'justify',
    color:'#4c516d'
  },
  btn:{
    width:responsiveWidth(70),
    height:responsiveHeight(6.2),
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    paddingHorizontal:responsiveWidth(3),
    marginVertical:responsiveHeight(3)
  },
  btnTxt:{
      color:'white', 
      fontSize:responsiveFontSize(2.3),
      letterSpacing:responsiveWidth(0.2),
  },
})