import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { Hoshi } from 'react-native-textinput-effects';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { responsiveHeight, responsiveWidth,responsiveFontSize } from 'react-native-responsive-dimensions';
import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'

export default class ContactUs extends Component {
  render() {
    return (
      <View style={{ flex: 1}}>
        
        <InternalHeader name={'Contact Us'} flexSize={1} action={() => this.props.navigation.navigate('Settings')}/>
        
        <View style={{flex:2, alignItems:'center', justifyContent:'center', marginHorizontal:responsiveWidth(15)}}>
            <Text style={{ textAlign:'justify',color:'#4c516d'}} >We Rixby are open to any and all inquries and suggestion you may have.</Text>
        </View>

        <View style={styles.txtContainer}>
            <Hoshi text ="Message" label='Write your Message' borderColor='#008080' labelStyle={styles.txtLbl} inputStyle={styles.txtInput} style={styles.txt} multiline={true} numberOfLines={5} />
        </View>

        <View style={{alignItems:'center'}}>
        <TouchableOpacity>
            <LinearGradient start={{x: 0, y: 0}} end={{x:1.3, y: 0}} colors={['#008080', '#4c516d']} style={styles.btn}>
                <Text style={styles.btnTxt}>Send</Text>
            </LinearGradient>
        </TouchableOpacity>
        </View>
    
        <View style={{flex:3.5}} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
    text:{
        fontSize:responsiveFontSize(3),
        color:'white'
    },
    iconCat: {
        height:responsiveHeight(10),
        width:responsiveWidth(20),
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center' 
    },
    box:{
        flex: 0.5,
        backgroundColor:'white',
        borderColor:'#989898',
        borderTopWidth:1,
    },
    txt:{
        fontSize:responsiveFontSize(2.9),
        height:responsiveHeight(30)
    },
    btn:{
        width:responsiveWidth(70),
        height:responsiveHeight(6.2),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        paddingHorizontal:responsiveWidth(3),
        marginVertical:responsiveHeight(10)
    },
    btnTxt:{
        color:'white', 
        fontSize:responsiveFontSize(2.3),
        letterSpacing:responsiveWidth(0.2),
    },
    txtContainer:{
        marginVertical:responsiveHeight(1),
        paddingHorizontal:responsiveWidth(8),
        paddingVertical:responsiveHeight(0.1),
    },
    btnTxt:{
        color:'white', 
        fontWeight:'bold', 
        fontSize:responsiveFontSize(2.3),
        letterSpacing:responsiveWidth(0.2)
    },
    txtLbl:{
        color:'#4c516d',
        fontSize:responsiveFontSize(1.9),
        height:responsiveHeight(30)
    },
    txtInput:{
        color:'#01233f', 
        fontSize:responsiveFontSize(2.5),
        fontWeight:"normal",
        paddingRight:responsiveWidth(7),
        paddingVertical:responsiveHeight(1.5)
    },
});  