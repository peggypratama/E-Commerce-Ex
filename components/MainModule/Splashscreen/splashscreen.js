import React,{Component} from 'react';
import {
  View,
  StyleSheet
} from 'react-native';

import { GoogleSignin } from '@react-native-community/google-signin';
import Video from 'react-native-video'
import { responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import * as firebase from 'firebase'


export default class Splash extends Component {

    componentDidMount = () => {
        console.log('rghdfhdf')
    }

    onVideoEnd = async () => {
        var user = firebase.auth().currentUser;
        const googleUser = await GoogleSignin.getCurrentUser();
        if (user || googleUser)
            this.props.navigation.navigate('Main')
        else {
            this.props.navigation.navigate('Login')
        }
        //this.props.navigation.navigate('Login')
    }

    render(){
        return(
            <View style={{height:responsiveHeight(100), width:responsiveWidth(100)}}>
                <Video onEnd={this.onVideoEnd} source={require('./splashVideo.mp4')} muted={true} style={styles.video} resizeMode={"cover"} />
            </View>
        )
    }
}

const styles=StyleSheet.create({ 
    video:{
       flex:1,
        justifyContent: 'center',
    },
})