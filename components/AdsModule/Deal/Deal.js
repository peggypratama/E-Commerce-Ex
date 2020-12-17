import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    AsyncStorage,
    YellowBox
} from 'react-native';

import AdHeading from '../../CommonModules/AdHeading/adHeading'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'
import InternalHeader from '../../CommonModules/InternalHeader/internalHeader'
import DealTypeRadioButton from '../../CommonModules/DealTypeRadioButtons/DealTypeRadioButtons'
import DefaultTextInput from '../../CommonModules/DefaultTextInput/defaultTextInput'
import DefaultFeature from '../../CommonModules/DefaultFeature/defaultFeature'
import PostButton from '../../CommonModules/PostButton/postButton'

import { responsiveWidth, responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import * as firebase from 'firebase'
import 'firebase/firestore'
import { addOrder } from '../../Utility/utility'

export default class Deal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            adData: this.props.navigation.getParam('ad'), adObj: null,
            adID: '', pageType: this.props.navigation.getParam('pageType'),
            comission: '', storeObj: null, discount: ''
        }
        this.initState = this.state
        YellowBox.ignoreWarnings(['Setting a timer']);
        console.disableYellowBox = true;
    }

    componentWillMount = async () => {
        this.setState({
            adData: this.props.navigation.getParam('ad'),
            pageType: this.props.navigation.getParam('pageType'),
        })
        storeObj = await AsyncStorage.getItem('storeObj');
        storeObj = JSON.parse(storeObj)
        this.setState({ storeObj: storeObj })
    }

    getDealObj = () => {
        let obj = {
            storeID: this.state.storeObj.docID, adID: this.state.adData.docID,
            type: this.state.type, price: parseFloat(this.state.adData.docData['Price']),
        }
        if (this.state.discount != '') {
            obj.discount = parseFloat(this.state.discount)
            obj.profit = obj.price - obj.discount
        }
        else
            obj.profit = obj.price
        if (this.state.type == 'Comission') {
            obj.comission = parseFloat(this.state.comission)
            obj.profit = obj.price / 100 * obj.comission
        }
        obj.timestamp = firebase.firestore.FieldValue.serverTimestamp()
        return obj
    }



    deal = async () => {
        if (!this.isFormEmpty() && this.isErrorFree()) {
            let dealObj = this.getDealObj()
            await addOrder(dealObj).then(ref => {
                console.log(ref)
                this.goToAdList()
            }).catch(err => console.log(err))
        }
    }

    isFormEmpty = () => {
        if (this.state.type != '')
            if (this.state.type == 'Comission' && this.state.comission != '')
                return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    isErrorFree = () => {
        if (!this.state.errcm && !this.state.errds) {
            if (this.state.comission != '') {
                if (parseFloat(this.state.comission) > 0 && parseFloat(this.state.comission) < 100)
                    return true
                else {
                    this.setState({ formErrorDialog: true })
                    return false
                }
            }
            if (this.state.discount != '') {
                if (parseFloat(this.state.discount) > 0 && parseFloat(this.state.discount) < parseFloat(this.state.adData.docData['Price']))
                    return true
                else {
                    this.setState({ formErrorDialog: true })
                    return false
                }
            }
            return true
        }
        this.setState({ formErrorDialog: true })
        return false
    }

    goToAdList = () => {
        this.setState(this.initState);
        this.props.navigation.goBack()
    }

    render() {
        let comission;
        if (this.state.type == 'Comission')
            comission = <DefaultFeature keyboardType={'phone-pad'} value={this.state.comission} errorMessage={'Comission must be a percentage'} setErrorState={(val) => this.setState({ errcm: val })} setValueState={(val) => this.setState({ comission: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Comission'} iconClass={MaterialIcons} iconName={'attach-money'} />

        else
            comission = null
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {/* <DialogBox resetState={() => this.setState({ formErrorDialog: false })} showDialog={this.state.formErrorDialog} title={'Deal Failed'} description={'The form has not been filled correctly'} />
                <DialogBox resetState={() => this.setState({ formEmptyDialog: false })} showDialog={this.state.formEmptyDialog} title={'Deal Failed'} description={'Please fill the form in order to continue'} /> */}
                <InternalHeader name={this.state.pageType + ' Deal'} flexSize={1} action={this.goToAdList} />
                <KeyboardAvoidingView style={{ flex: 8, paddingVertical: responsiveHeight(6) }}>
                    <ScrollView style={{ flex: 1 }}>
                        <AdHeading name={'Price'} fontSize={responsiveFontSize(0.4)} flexSize={1} margin={responsiveHeight(1)} />
                        <Text style={{ fontSize: responsiveFontSize(2.3), textAlign: 'center', marginBottom: responsiveHeight(2.5) }}>Rp. {this.state.adData.docData['Title']}</Text>
                        <AdHeading name={'Deal Type'} fontSize={responsiveFontSize(0.4)} flexSize={1} />
                        <View style={{ width: responsiveWidth(100) }}>
                            <DealTypeRadioButton value={this.state.type} updateParent={(val) => this.setState({ type: val })} />
                        </View>
                        <DefaultFeature keyboardType={'phone-pad'} value={this.state.discount} errorMessage={'Discount must be a number'} setErrorState={(val) => this.setState({ errds: val })} setValueState={(val) => this.setState({ discount: val })} regex={/^\s*[+-]?\s*(?:\d{1,3}(?:(,?)\d{3})?(?:\1\d{3})*(\.\d*)?|\.\d+)\s*$/} flexSize={1} name={'Discount'} iconClass={MaterialIcons} iconName={'money-off'} />

                        {comission}
                        <PostButton flexSize={1} buttonText={'DONE'} action={this.deal} />

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
})