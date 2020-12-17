import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import * as Animatable from 'react-native-animatable'

import { getFirestoreUserByUid } from '../../Utility/utility'

export default class BroadcastCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            data: this.props.data, description: '', cover: ''
        }
    }

    componentWillMount = async () => {
        if (this.props.broadcastID && typeof this.props.broadcastID != 'undefined') {
            if (this.state.data && this.props.broadcastID) {
                await getFirestoreUserByUid(this.state.data.userID).then(userObj => {
                    this.setState({
                        userObj:userObj,
                        cover: this.state.data.photoURL,
                        description: this.state.data.description,
                        isLoading: false,
                    })
                })
            }
        }
    }

    onCardPress = () => {
        this.props.action(this.state.broadcastID, this.state.data, this.state.userObj)
    }

    renderSkeleton = () => {
        return (
            <SkeletonPlaceholder style={{ flex: 1 }} speed={1000}>
                <View style={{ flex: 10 }}>
                    <SkeletonPlaceholder.Item
                        width={this.props.thumbnailWidth}
                        height={responsiveHeight(28)}
                        borderTopRightRadius={this.props.radius}
                        borderTopLeftRadius={this.props.radius}
                    />
                </View>
                <View style={{ flex: 4, justifyContent: 'center' }}>
                    <SkeletonPlaceholder.Item marginVertical={responsiveHeight(0.7)} height={responsiveHeight(1.7)} width={this.props.thumbnailWidth - responsiveWidth(2)} />
                    <SkeletonPlaceholder.Item marginVertical={responsiveHeight(0.7)} height={responsiveHeight(1.7)} width={this.props.thumbnailWidth - responsiveWidth(2)} />
                    <SkeletonPlaceholder.Item marginVertical={responsiveHeight(0.7)} height={responsiveHeight(1.7)} width={this.props.thumbnailWidth - responsiveWidth(2)} />
                </View>
            </SkeletonPlaceholder>
        )
    }

    renderCard = () => {
        return (
            <TouchableOpacity onPress={this.onCardPress} disabled={this.state.isLoading}>
                <View style={{ flex: 10 }}>
                    <Image style={this.styles.thumbnail} source={{ uri: this.state.cover }} />
                </View>
                <View style={{ flex: 4, justifyContent: 'center' }}>
                    <Text numberOfLines={2} ellipsizeMode={'tail'} style={this.styles.info}>{this.state.description}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let component;
        if(this.state.isLoading)
        component=this.renderSkeleton()
        else
        component=this.renderCard()
        return (
            <Animatable.View animation={'bounceIn'} duration={2000} style={this.styles.menuBox} >
                {component}
            </Animatable.View >
        )
    }

    styles = StyleSheet.create({
        menuBox: {
            marginVertical: this.props.margin,
            flex: 1,
            width: this.props.width,
            height: responsiveHeight(40),
            borderRadius: responsiveHeight(3),
            marginHorizontal: responsiveWidth(2),
            paddingVertical: responsiveHeight(.5),
            paddingHorizontal: responsiveWidth(10),
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 3,
        },
        info: {
            fontSize: responsiveFontSize(2.3),
            fontWeight: 'bold',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: responsiveHeight(1),
            paddingHorizontal: responsiveWidth(1)
        },
        thumbnail: {
            flex: 1,
            borderTopRightRadius: this.props.radius,
            borderTopLeftRadius: this.props.radius,
            width: this.props.thumbnailWidth,
            resizeMode: 'cover',
            alignItems: 'center',
            justifyContent: 'center',
        },
    })
}