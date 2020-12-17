import React, { Component } from 'react';
import {
    Container, Header, Left, Body, Title, Subtitle, Right, Content, Card, CardItem,
    Item, Picker, Button, Icon, Label, Input
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {KEY, URL} from '../utils/Const';
import {  Image,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Modal,
    YellowBox,
    Alert,
    StyleSheet,
    KeyboardAvoidingView
} from 'react-native'
    
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ImageView from "react-native-image-viewing";

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import LinearGradient from 'react-native-linear-gradient';
import AdHeading from '../../AdHeading/adHeading'
import AdHeader from '../../AdHeader/adHeader'
import StickyHeader from '../../AdStickyHeader/adStickyHeader'
import AdFooter from '../../AdFooter/adFooter'
import AdFooterr from '../../AdFooter/adFooterr'
import AdDescription from '../../AdDescription/adDescription'
import RatingAndReviewCard from '../../RatingAndReviewCard/ratingAndReviewCard'
import UserRatingAndReview from '../../UserRatingAndReview/userRatingAndReview'
import DefaultAdCard from '../../DefaultAdCard/defaultAdCard'
import RatingButton from '../../RatingButton/ratingButton'
import FeatureSection from '../../InAdFeatureSection/inAdFeatureSection'
import LocationViewer from '../../LocationViewer/locationViewer'
import RecommendedAds from '../../RecommendedAds/recommendedAds'

import {
    getUserFirestoreObj, getFirestoreUserByUid, getCurrentUserObj, uploadProfilePhoto,
    getCurrentUid,
} from '../../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

class Home extends Component {
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
            //otherUserID: this.props.navigation.getParam('otherUser').userID,
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
    //        otherUserPhoto: otherUser['photoURL'],
     //     emaill: otherUser.email
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
    
    componentDidMount(){
        this._onLoadProvince();
    }

    _onLoadProvince = () => {
        fetch(`${URL}/province`,{
            method:'GET',
            headers: {
                'key': KEY
            }
        })
        .then(res => res.json())
        .then(resData => {
            //console.log(resData);
            let status = resData.rajaongkir.status.code;
            if(status === 200){
                this.setState({
                    provinces:resData.rajaongkir.results
                })
            }
        });
    }

    _onOriginProvinceChange = (val) => {
        this.setState({
            selectedOriginProvince: val
        }, () => {
            fetch(`${URL}/city?province=${this.state.selectedOriginProvince.province_id}`, {
                method: 'GET',
                headers : {
                    'key': KEY
                }
            })
            .then(res => res.json())
            .then(resData => {
                let status = resData.rajaongkir.status.code;
                if(status === 200){
                    this.setState({
                        originCities: resData.rajaongkir.results
                    })
                }
            });
        });
    }

    _onDestinationProvinceChange = (val) => {
        this.setState({
            selectedDestinationProvince: val
        }, () => {
            fetch(`${URL}/city?province=${this.state.selectedDestinationProvince.province_id}`, {
                method: 'GET',
                headers : {
                    'key': KEY
                }
            })
            .then(res => res.json())
            .then(resData => {
                let status = resData.rajaongkir.status.code;
                if(status === 200){
                    this.setState({
                        destinationCities: resData.rajaongkir.results
                    })
                }
            });
        });
    }

    _onNavigationToDetail = () => {
        if(this.state.selectedOriginCity == null || this.state.selectedDestinationCity == null || this.state.weight == 0 || this.state.courier == null ){
            alert('Mohon lengkapi data!');
        }else{
            let params = {
                originCity: this.state.selectedOriginCity.city_id,
                destinationCity: this.state.selectedDestinationCity.city_id,
                weight: this.state.weight,
                courier: this.state.courier
            }
            Actions.detail({data: params});
        }
    }

    onBackPress = async () => {
        if (this.state.pageType == 'normal') {
          await this.updateParentReviews()
        }
        this.props.navigation.goBack()
    }
    
    // renderImage = () => {
    //     return (
    //       <View>
    //         <TouchableWithoutFeedback onPress={() => this.setState({ displayImage: true })}>
    //           <Image source={{ uri: this.state.adObj["imageUrl"], width: responsiveWidth(100), height: responsiveHeight(35) }} />
    //         </TouchableWithoutFeedback>
    //       </View>
    //     )
    // }
    
    render() {
        let {provinces, selectedOriginProvince, originCities, selectedOriginCity, selectedDestinationProvince, destinationCities, selectedDestinationCity, courier} = this.state;

        let provinceItems = <View></View>;
        if(provinces){
            provinceItems = provinces.map(prov => {
                return(
                    <Picker.Item 
                        key={prov.province_id}
                        label={prov.province}
                        value={prov}/>
                );
            });
        }

        let originCityItems = <View></View>;
        if(originCities){
            originCityItems = originCities.map(city => {
                return(
                    <Picker.Item
                        key={city.city_id}
                        label={city.city_name}
                        value={city}/>
                )
            });
        }

        let destinationCityItems = <View></View>;
        if(destinationCities){
            destinationCityItems = destinationCities.map(city => {
                return(
                    <Picker.Item
                        key={city.city_id}
                        label={city.city_name}
                        value={city}/>
                )
            });
        }

        return (
            <View style={{ flex: 1 }}>
                
        {/* <Modal presentationStyle={'overFullScreen'} visible={this.state.displayImage} transparent={false}>
          <ImageView images={[{ uri: this.state.adObj["imageUrl"] }]} imageIndex={0} visible={this.state.displayImage} onRequestClose={() => this.setState({ displayImage: false })} presentationStyle={'overFullScreen'} animationType={'fade'} />
        </Modal> */}


        <Modal>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={styles.gradient}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ paddingHorizontal: responsiveWidth(3), flex: 1 }}>
              <FontAwesome5 name={'arrow-left'} color={'#ffffff'} size={responsiveHeight(4)} />
            </TouchableOpacity>
            <KeyboardAvoidingView style={{ flexDirection: 'row', flex: 2, alignItems: 'center' }}>
            
            </KeyboardAvoidingView>
            <KeyboardAvoidingView style={{ flex: 8, justifyContent: 'center' }}>
              <Text numberOfLines={1} style={{ fontSize: responsiveFontSize(2.5), color: 'white', paddingHorizontal: responsiveWidth(2) }}>Text</Text>
            </KeyboardAvoidingView>
          </LinearGradient>

                <Content padder>
                    {/* Card Input Data Asal */}
                    <Card>
                        <CardItem header>
                            <Text>Alamat Asal</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Item picker>
                                    <Picker
                                    mode="dropdown"
                                    style={{
                                        width: undefined
                                    }}
                                    selectedValue={selectedOriginProvince}
                                    onValueChange={this._onOriginProvinceChange}>
                                        <Picker.Item label="Pilih Provinsi" value="" />
                                        {provinceItems}
                                    </Picker>
                                </Item>
                                <Item picker style={{marginTop:15}}>
                                <Picker
                                    mode="dropdown"
                                    style={{
                                        width: undefined
                                    }}
                                    selectedValue={selectedOriginCity}
                                    onValueChange={val => this.setState({selectedOriginCity: val})}
                                    enabled={selectedOriginProvince == "" ? false : true}>
                                        <Picker.Item label="Pilih Kabupaten/Kota" value="" />
                                        {originCityItems}
                                    </Picker>
                                </Item>
                            </Body>
                        </CardItem>
                    </Card>
                        <Text>{this.state.phoneNumber}</Text>
                        <Text>kntl</Text>
                    {/* Card Input Data Tujuan */}
                    <Card>
                        <CardItem header>
                            <Text>Alamat Tujuan</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Item picker>
                                    <Picker
                                    mode="dropdown"
                                    style={{
                                        width: undefined
                                    }}
                                    selectedValue={selectedDestinationProvince}
                                    onValueChange={this._onDestinationProvinceChange}>
                                        <Picker.Item label="Pilih Provinsi" value="" />
                                        {provinceItems}
                                    </Picker>
                                </Item>
                                <Item picker style={{marginTop:15}}>
                                    <Picker
                                        mode="dropdown"
                                        style={{
                                            width: undefined
                                        }}
                                        selectedValue={selectedDestinationCity}
                                        onValueChange={val => this.setState({selectedDestinationCity : val})}
                                        enabled={selectedDestinationProvince == '' ? false : true}>
                                        <Picker.Item label="Pilih Kabupaten/Kota" value="" />
                                        {destinationCityItems}
                                    </Picker>
                                </Item>
                            </Body>
                        </CardItem>
                    </Card>

                    {/* Card Input Data Berat */}
                    <Card>
                        <CardItem header>
                            <Text>Berat Paket</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Item floatingLabel>
                                    <Label>Grams</Label>
                                    <Input maxLength={6} onChangeText={val => this.setState({weight: val})}/>
                                </Item>
                            </Body>
                        </CardItem>
                    </Card>

                    {/* Card Input Data Kurir */}
                    <Card>
                        <CardItem header>
                            <Text>Kurir</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Item picker>
                                    <Picker
                                        mode="dropdown"
                                        style={{
                                            width: undefined
                                        }}
                                        selectedValue={courier}
                                        onValueChange={val => this.setState({courier: val})}>
                                        <Picker.Item label="Pilih Kurir" value="" />
                                        <Picker.Item label="JNE" value="jne" />
                                        <Picker.Item label="TIKI" value="tiki" />
                                        <Picker.Item label="POS INDO" value="pos" />
                                    </Picker>
                                </Item>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>

                <View>
                    <Button style={{margin:10, backgroundColor:'#9b59b6'}} block onPress={this._onNavigationToDetail}>
                        <Text style={{color:'#fff', fontWeight:'500'}}>Cek Ongkir</Text>
                    </Button>
                </View>
                </Modal>
                </View>
        );
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

export default Home;