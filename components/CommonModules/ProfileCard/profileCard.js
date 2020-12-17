import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class ProfileCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUrl: this.props.imageUrl,
            name: this.props.name
        }
    }

    componentDidUpdate = async prevProps => {
        if (this.props.imageUrl != prevProps.imageUrl){
            await this.setState({ imageUrl: this.props.imageUrl })
        }
        if (this.props.name != prevProps.name){
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
                <View style={{ backgroundColor: '#008080', borderRadius: responsiveHeight(100), width: responsiveWidth(20), height: responsiveHeight(10), alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesome5 name={'user-tie'} color={'white'} size={responsiveHeight(5)} />
                </View>
            </View>
        )
    }

    render() {
        let image;
        if (this.state.imageUrl == '' || !this.state.imageUrl)
            image = this.renderIcon()
        else
            image = this.renderImage()
        return (
            <View style={styles.menuBox}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {image}
                    <View style={{ flex: 1.2, justifyContent: "center" }}>
                        <Text style={styles.txt}>{this.state.name}</Text>
                    </View>
                    <View style={{ flex: 0.5, justifyContent: "center", alignItems: 'center' }}  >
                        <TouchableOpacity onPress={this.props.action}>
                            <AntDesign style={styles.footericonCat} name={'edit'} color={'black'} size={responsiveHeight(4)} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    menuBox: {
        flex: 2,
        flexDirection: 'row',
        width: responsiveWidth(95),
        marginHorizontal: responsiveWidth(2),
        borderRadius: responsiveHeight(3),
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: responsiveHeight(2),
        shadowOffset: {
            height: 20,
            width: -20
        },
        elevation: 5,
    },
    iconCat: {
        height: responsiveHeight(10),
        width: responsiveWidth(20),
        borderRadius: responsiveWidth(80),
        justifyContent: 'center',
        alignItems: 'center',
    },
    txt: {
        fontSize: responsiveFontSize(2.9),
    }
});