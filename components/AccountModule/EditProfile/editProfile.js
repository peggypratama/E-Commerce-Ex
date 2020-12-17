import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Modal,
    ScrollView,
    YellowBox,
} from 'react-native';

import {
    Container, Header, Left, Body, Title, Subtitle, Right, Content, Card, CardItem, Text, Item,
    Picker, Button, Icon, Label, Input
} from 'native-base'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import ImageView from "react-native-image-viewing";
import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'
import DefaultTextInput from '../../CommonModules/DefaultTextInput/defaultTextInput'
import PostButton from '../../CommonModules/PostButton/postButton';
import ChangeProfilePhotoButton from '../../CommonModules/ChangeProfilePhotoButton/changeProfilePhotoButton'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'

import { getCurrentUserObj, getUserFirestoreObj, uploadProfilePhoto } from '../../Utility/utility'
import {KEY, URL} from '../../CommonModules/Order/utils/Const';
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userAuthObj: null, userFirestoreObj: null, userObjID: '',
            account: this.props.navigation.getParam('account'), displayImage: false,
            formEmptyDialog: false, formErrorDialog: false,
            imageUrl: '', imageObj: null,
            firstName: '', lastName: '', phoneNumber: '', bank: '', accountn: '', address: '',
            cityId: '', cityName: '', provinceId: '', provinceName: '', 
            errfn: false, errln: false, errpn: false,

            provinces:[],
            originCities: [],
            destinationCities: [],
            selectedOriginProvince: null,
            selectedOriginCity: null,
            selectedDestinationProvince: null,
            selectedDestinationCity: null,
            
        }
        this.updateParent = this.props.navigation.getParam('updateParent')
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
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
                bank: this.state.userFirestoreObj.bank,
                address: this.state.userFirestoreObj.address,
                cityId: this.state.userFirestoreObj.cityId,
                cityName: this.state.userFirestoreObj.cityName,
                provinceId: this.state.userFirestoreObj.provinceId,
                provinceName: this.state.userFirestoreObj.provinceName,
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

    renderImage = () => {
        return (
            <TouchableOpacity onPress={() => this.setState({ displayImage: true })} style={{ flex: 3.5, alignItems: 'center', justifyContent: 'center' }}  >
                <Image style={styles.iconCat} source={{ uri: this.state.imageUrl }} />
            </TouchableOpacity>
        )
    }

    renderIcon = () => {
        return (
            <View style={{ flex: 3.5, alignItems: 'center', justifyContent: 'center' }}>
                <View style={[{ backgroundColor: '#008080' }, styles.iconCat]}>
                    <FontAwesome5 name={'user-tie'} color={'white'} size={responsiveHeight(8)} />
                </View>
            </View>
        )
    }

    renderName = () => {
        return (
            <View>
                <DefaultTextInput name={'First Name'} value={this.state.firstName} errorMessage={'First Name only contains alphabets'} setErrorState={(val) => this.setState({ errfn: val })} setValueState={(val) => this.setState({ firstName: val })} regex={/^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$/} width={90} />
                <DefaultTextInput marginVertical={responsiveHeight(2)} name={'Last Name'} value={this.state.lastName} errorMessage={'Last Name only contains alphabets'} setErrorState={(val) => this.setState({ errln: val })} setValueState={(val) => this.setState({ lastName: val })} regex={/^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z]*)*$/} width={90} />
            </View>
        )
    }

    isLocalFormEmpty = () => {
        if (this.state.firstName != '' && this.state.lastName != '' && this.state.phoneNumber != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    isLocalErrorFree = () => {
        if (!this.state.errfn && !this.state.errln && !this.state.errpn)
            return true
        this.setState({ formErrorDialog: true })
        return false
    }

    isGoogleFormEmpty = () => {
        if (this.state.phoneNumber != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    isGoogleErrorFree = () => {
        if (!this.state.errpn)
            return true
        this.setState({ formErrorDialog: true })
        return false
    }

    editProfile = async () => {
        if (this.state.account == 'google') {
            if (!this.isGoogleFormEmpty() && this.isGoogleErrorFree()) {
                this.state.userFirestoreObj.phoneNumber = this.state.phoneNumber
                await firebase.firestore().collection('Users').doc(this.state.userObjID).set(this.state.userFirestoreObj).then(() => {
                    this.props.navigation.goBack()
                })
            }
        }
        else if (this.state.account == 'local') {
            if (!this.isLocalFormEmpty() && this.isLocalErrorFree()) {
                this.state.userFirestoreObj.firstName = this.state.firstName
                this.state.userFirestoreObj.lastName = this.state.lastName
                this.state.userFirestoreObj.phoneNumber = this.state.phoneNumber
                this.state.userFirestoreObj.accountn = this.state.accountn
                this.state.userFirestoreObj.bank = this.state.bank
                this.state.userFirestoreObj.photoURL = this.state.imageUrl
                this.state.userFirestoreObj.cityId = this.state.selectedOriginCity.city_id
                this.state.userFirestoreObj.cityName = this.state.selectedOriginCity.city_name
                this.state.userFirestoreObj.provinceId = this.state.selectedOriginProvince.province_id
                this.state.userFirestoreObj.provinceName = this.state.selectedOriginProvince.province
                this.state.userFirestoreObj.address = this.state.address
                if (this.state.imageObj && this.state.imageUrl != '') {
                    var imgUrl = await uploadProfilePhoto(this.state.imageObj, this.state.userAuthObj.uid)
                    this.state.userFirestoreObj.photoURL = this.state.imageUrl
                    await this.state.userAuthObj.updateProfile({ photoURL: imgUrl })
                }
                await this.state.userAuthObj.updateProfile({ displayName: this.state.firstName + ' ' + this.state.lastName })
                await firebase.firestore().collection('Users').doc(this.state.userObjID).set(this.state.userFirestoreObj).then(async () => {
                    await this.updateParent(this.state.userFirestoreObj.photoURL, this.state.firstName + ' ' + this.state.lastName)
                    this.props.navigation.goBack()
                })
            }
        }
    }

    render() {
        let image, name, changePhoto, bottomView, textFlex = 5;
        let { provinces, selectedOriginProvince, originCities, selectedOriginCity,
            selectedDestinationProvince, destinationCities, selectedDestinationCity, courier } = this.state;
        if (this.state.imageUrl == '' || !this.state.imageUrl)
            image = this.renderIcon()
        else
            image = this.renderImage()
        if (this.state.account == 'google') {
            console.log('in')
            textFlex = 2
            name = null
            changePhoto = null
            bottomView = <View style={{ flex: 2 }} />
        }
        else {
            textFlex = 5
            name = this.renderName()
            changePhoto = <ChangeProfilePhotoButton updateParent={val => this.setState({ imageUrl: val.uri, imageObj: val })} />
            bottomView = null
        }

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

        return (
            <View style={{ flex: 1, }}>
                <Modal>
                <DialogBox resetState={() => this.setState({ formErrorDialog: false })} showDialog={this.state.formErrorDialog} title={'Login Failed'} description={'The form has not been filled correctly'} />
                <DialogBox resetState={() => this.setState({ formEmptyDialog: false })} showDialog={this.state.formEmptyDialog} title={'Login Failed'} description={'Please fill the form in order to continue'} />
                <Modal presentationStyle={'overFullScreen'} visible={this.state.displayImage} transparent={false}>
                <ImageView images={[{ uri: this.state.imageUrl }]} imageIndex={0} visible={this.state.displayImage} onRequestClose={() => this.setState({ displayImage: false })} presentationStyle={'overFullScreen'} animationType={'fade'} />
                </Modal>

                <InternalHeader action={() => this.props.navigation.goBack()} name={'Edit Profile'} flexSize={1} />

                {image}

                {changePhoto}

                <View style={{ flex: textFlex }}>
                <ScrollView style={{ height: responsiveHeight(100), width: responsiveWidth(100) }}>
                    {name}
                    <DefaultTextInput name={'Phone Number'} value={this.state.phoneNumber} errorMessage={'Invalid phone number format'} setErrorState={(val) => this.setState({ errpn: val })} setValueState={(val) => this.setState({ phoneNumber: val })} regex={/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/} width={90} />
                    <DefaultTextInput name={'Name Bank'} value={this.state.bank} errorMessage={'only contains alphabets'} setErrorState={(val) => this.setState({ errpn: val })} setValueState={(val) => this.setState({ bank: val })} regex={/[A-Z]$/} width={90} />
                    <DefaultTextInput name={'Number Account'} value={this.state.accountn} errorMessage={'Invalid Number Account format'} setErrorState={(val) => this.setState({ errpn: val })} setValueState={(val) => this.setState({ accountn: val })} regex={/[0-9]$/} width={90} />
                    <DefaultTextInput name={'Address'} value={this.state.address} errorMessage={'only contains alphabets'} setErrorState={(val) => this.setState({ errpn: val })} setValueState={(val) => this.setState({ address: val })} regex={/[A-Za-z]$/} width={90} />    
                    <Card>
                                <CardItem>
                                    <Body>
                                        <Text style={{fontSize: 18}}>
                                            Province  : {this.state.provinceName}
                                        </Text>
                                        <Text style={{fontSize: 18}}>
                                            City          : {this.state.cityName}
                                        </Text>
                                     
                                    </Body>
                                </CardItem>
                        </Card>
                        
                        <Card>
                                <CardItem>
                                    <Body>
                                        <Text style={{fontSize: 18}}>
                                            Change To :
                                        </Text>
                                    </Body>
                                </CardItem>
                        </Card>
                        
                    <Card>
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
                                        <Picker.Item label="Select Province" value="" />
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
                                        <Picker.Item label="Select City" value="" />
                                        {originCityItems}
                                    </Picker>
                                </Item>
                            </Body>
                        </CardItem>
                    </Card>  
                
                    
                </ScrollView>
                </View>

                <View style={{ flex: 1.5 }}>
                    <PostButton action={this.editProfile} flexSize={1} buttonText={'UPDATE'} />
                </View>

                {bottomView}
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    iconCat: {
        height: responsiveHeight(15),
        width: responsiveWidth(30),
        borderRadius: responsiveHeight(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
});