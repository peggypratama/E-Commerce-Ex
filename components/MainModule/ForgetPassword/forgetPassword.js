import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { Hoshi } from 'react-native-textinput-effects';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { resetPassword } from '../../Utility/utility';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'

var countdown=null

export default class ForgetPassword extends Component {
    constructor(props){
        super(props)
        this.state={
            email:'',
            errem:'',
            resetDialog:false,
            sentDialog:false,
            timer:30,
            btnDisabled:false,
            btnIndicator:false
        }
        this.initialState=this.state
        this.requestForReset=this.requestForReset.bind(this)
    }

    validate = (text) => {
        this.setState({email:text})
        let regex=/[A-Za-z]+([A-Za-z0-9]|[.]|[_])*[@][A-Za-z]+[.]com$/
        if(regex.test(text))
            this.setState({errem:''})
        else
            this.setState({errem:'Invalid email format'})
    }

    requestForReset = async () => {
        if(this.state.email!='' && this.state.errem=='')
        {
            await resetPassword(this.state.email).then(() => {
                this.setState({timer:30})
                this.setState({btnDisabled:true})
                countdown=setInterval(this.startTimer, 1000)
                this.setState({sentDialog:true})
            }).catch((error) => {
                Alert.alert("Email sending failed");
                console.log(error)
            })
        }
        else
            this.setState({resetDialog:true})
    }

    startTimer = () => {
        this.setState({timer:this.state.timer-1})
        if(this.state.timer==0)
        {
            clearInterval(countdown)
            this.setState({btnDisabled:false})
        }
    }

    render(){
        let btnDisplay;
        if(this.state.btnIndicator)
            btnDisplay=<ActivityIndicator size={responsiveHeight(4)} color={'white'} />
        else
            btnDisplay=<Text style={styles.btnTxt}>Reset Password</Text>

        return(
            <View style={{flex:1}}>

                <DialogBox resetState={() => this.setState({sentDialog:false})} showDialog={this.state.sentDialog} title={'Sending Successful'} description={'The verification email has been sent to you'} />
                <DialogBox resetState={() => this.setState({resetDialog:false})} showDialog={this.state.resetDialog} title={'Reset Failed'} description={'Please enter the email address in the correct format and try again'} />

                <InternalHeader flexSize={1} action={() => {this.setState(this.initialState);this.props.navigation.navigate('Login')}} />

                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.heading}>Forgot your password?</Text>
                </View>

                <View style={{flex:2, alignItems:'center', justifyContent:'center', paddingHorizontal:responsiveWidth(3)}}>
                    <Text style={styles.info}>Please enter your email address below and we will send you the information to recover your account</Text>
                </View>

                <View style={{flex:1, alignItems:'center'}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={styles.txtContainer}>
                            <Hoshi value={this.state.email} onChangeText={text => this.validate(text)} label={'Email'} borderColor={'#008080'} labelStyle={styles.txtLbl} inputStyle={styles.txtInput} style={styles.txt}/>
                            <Text style={styles.error}>{this.state.errem}</Text>
                        </View>
                        <Ionicons style={{marginLeft:responsiveWidth(2)}} name={'ios-mail'} size={responsiveHeight(7)} color={'#008080'} />
                    </View>
                    <TouchableOpacity onPress={this.requestForReset} disabled={this.state.btnDisabled}>
                        <LinearGradient start={{x: 0, y: 0}} end={{x:1.3, y: 0}} colors={['#008080', '#4c516d']} style={styles.btn}>
                            {btnDisplay}
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={[styles.info, {paddingHorizontal:responsiveWidth(7), fontSize:responsiveFontSize(2), marginVertical:responsiveHeight(5), color:'#008080'}]}>If you don't received the mail in <Text style={{color:'#4c516d', fontWeight:'bold'}}>{this.state.timer}</Text> seconds then please try again</Text>
                </View>

                <View style={{flex:6}}></View>

            </View>
        )
    }
}

const styles=StyleSheet.create({
    gradient:{
        flex:1,
        position:'relative', 
        zIndex:1
    },
    heading:{
        fontSize:responsiveFontSize(3),
        fontWeight:'bold'
    },
    info:{
        fontSize:responsiveFontSize(2),
        textAlign:'justify',
        color:'#4c516d'
    },
    txt:{
        width:responsiveWidth(70),
    },
    txtLbl:{
        color:'#4c516d',
        fontSize:responsiveFontSize(1.9)
    },
    txtInput:{
        color:'#01233f', 
        fontSize:responsiveFontSize(2.5),
        fontWeight:"normal",
        paddingRight:responsiveWidth(7)
    },
    txtContainer:{
        marginVertical:responsiveHeight(1),
        paddingHorizontal:responsiveWidth(0),
        paddingVertical:responsiveHeight(0.1)
    },
    error:{
        marginTop:responsiveHeight(0.5),
        color:'red'
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