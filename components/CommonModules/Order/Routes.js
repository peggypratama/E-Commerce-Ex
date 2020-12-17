import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Modal,
    KeyboardAvoidingView,
    YellowBox,
    Button,
} from 'react-native';

import {
    Container, Header, Left, Body, Title, Subtitle, Right, Content, Card, CardItem,
    Item, Picker,  Icon, Label, Input
} from 'native-base';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import LinearGradient from 'react-native-linear-gradient';
import Home from './pages/Home'
import Detail from './pages/Detail';
import {KEY, URL} from './utils/Const';
import ImageView from "react-native-image-viewing";
import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'
import DefaultTextInput from '../../CommonModules/DefaultTextInput/defaultTextInput'
import PostButton from '../../CommonModules/PostButton/postButton';
import ChangeProfilePhotoButton from '../../CommonModules/ChangeProfilePhotoButton/changeProfilePhotoButton'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'
import {
    getUserFirestoreObj, getFirestoreUserByUid, getCurrentUserObj,
    uploadProfilePhoto, getCurrentUid,
} from '../../Utility/utility'
import { Actions } from 'react-native-router-flux';




class Routes extends Component {
    render() {
        return (
            <Router>
                <Scene key='root' hideNavBar={true}>
                    <Scene key='route' component={App}  />
                   
                    <Scene key='home' component={Home} initial={true} />
                    <Scene key='detail' component={Detail} />
                </Scene>
            </Router>
        );
    }
}





class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            provinces:[], originCities: [], destinationCities: [],
            selectedOriginProvince: null, selectedOriginCity: null, selectedDestinationProvince: null,
            selectedDestinationCity: null, weight: 0, courier: null,

            pageType: this.props.navigation.getParam('pageType'),
            userFirestoreObj: null, adUserFirestoreObj: null,
            adObj: this.props.navigation.getParam('adObj'),

            currentUserID: null, messages: [],
            otherUserID: this.props.navigation.getParam('otherUser').userID,
            otherUserPhoto: null, otherUserData: null, 

            userAuthObj: null, userFirestoreObj: null, userObjID: '',
            account: this.props.navigation.getParam('account'), displayImage: false,
            formEmptyDialog: false, formErrorDialog: false,
            imageUrl: '', imageObj: null,
            firstName: '', lastName: '', phoneNumber: '', bank: '', accountn: '',
            errfn: false, errln: false, errpn: false,

            emaill: '',
        }
        this.updateParentReviews = this.props.navigation.getParam('updateReviews')
        this.updateAdList = this.props.navigation.getParam('updateAdList')
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
        if (!this.updatePrentReviews)
          this.updatePrentReviews = () => console.log('updateParentReview()')
        if (!this.updateAdList)
          this.updateAdList = () => console.log('updateAdList()')
        await getFirestoreUserByUid(this.state.adObj['uid']).then(async user => {
          this.setState({ adUserFirestoreObj: user[1] })
        }).catch(err => console.log(err))
        let otherUser = this.props.navigation.getParam('otherUser')
        this.setState({
          otherUserData: otherUser,
             otherUserPhoto: otherUser['photoURL'],
          emaill: otherUser.email
        })
        await getCurrentUid().then(uid => this.setState({ currentUserID: uid }))
       
        await getUserFirestoreObj().then(async user => {
            await this.setState({
                userFirestoreObj: user[1],
                userObjID: user[0],
                userAuthObj: await getCurrentUserObj()
            })
            await this.setState({
                imageUrl: this.state.userAuthObj.photoURL,
                firstName: this.state.userFirestoreObj.firstName,
                lastName: this.state.userFirestoreObj.lastName,
                phoneNumber: this.state.userFirestoreObj.phoneNumber,
                accountn: this.state.userFirestoreObj.accountn,
                bank: this.state.userFirestoreObj.bank
            })
        }).catch(error => console.log(error.message))
    }

    gotoAd = (adObj, reviewObj, myReview, updateReviews, pageType) => {
        Actions.home({
          'adObj': adObj,
          'reviewObj': reviewObj,
          'myReview': myReview,
          'updateReviews': updateReviews,
          'pageType': pageType,
        })
    }


    
    render() {
        return (
            
            <View>
   
                <Modal>
              
                    <Text>Tes</Text>
                    <Text>{this.state.firstName}</Text>
                    <Text>{this.state.otherUserData}</Text>
                    <Text>{this.state.adObj['Price']}</Text>
                    <View style={{ flex: 0.1 }}>
                    <Button title="Button" onPress={this.gotoAd}></Button>
                        
                </View>
                </Modal>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    gradient: {
      flex: 0.1,
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

export default Routes;