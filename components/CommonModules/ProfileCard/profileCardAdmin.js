import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class ProfileCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userObjID: this.props.userObjID,
            userObj: this.props.userObj,
            imageUrl: this.props.imageUrl,
            name: this.props.name,
            userInfoData: null,
        }
    }

    componentDidUpdate = async prevProps => {
        if (this.props.imageUrl != prevProps.imageUrl) {
            await this.setState({ imageUrl: this.props.imageUrl })
        }
        if (this.props.name != prevProps.name) {
            await this.setState({ name: this.props.name })
        }
    }

    renderImage = () => {
        return (
            <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}  >
                <Image style={styles.iconCat} source={{ uri: this.state.imageUrl }} />
            </View>
        )
    }

    renderIcon = () => {
        return (
            <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ backgroundColor: '#008080', borderRadius: responsiveHeight(100), width: responsiveWidth(18), height: responsiveHeight(9), alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesome5 name={'user-tie'} color={'white'} size={responsiveHeight(5)} />
                </View>
            </View>
        )
    }

    onCardPress = () => {
        this.props.action(this.state.userObjID, this.state.userObj)
    }

    render() {
        let image;
        if (this.state.imageUrl == '' || !this.state.imageUrl)
            image = this.renderIcon()
        else
            image = this.renderImage()
        return (
            <TouchableOpacity onPress={this.onCardPress} style={{ flex: 1 }}>
                <View style={styles.menuBox}>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        {image}
                        <View style={{ flex: 1.3, justifyContent: "center" }}>
                            <Text style={styles.txt}>{this.state.name}</Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    menuBox: {
        flex: 1,
        width: responsiveWidth(95),
        height: responsiveHeight(13),
        marginHorizontal: responsiveWidth(2),
        borderRadius: responsiveHeight(3),
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: responsiveHeight(1),
        shadowOffset: {
            height: 20,
            width: -20
        },
        elevation: 3,
    },
    iconCat: {
        height: responsiveHeight(9),
        width: responsiveWidth(18),
        borderRadius: responsiveWidth(80),
        justifyContent: 'center',
        alignItems: 'center',
    },
    txt: {
        fontSize: responsiveFontSize(2.3),
    }
});