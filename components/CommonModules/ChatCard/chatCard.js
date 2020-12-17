import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { getFirestoreUserByUid } from '../../Utility/utility'

export default class ChatCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: this.props.data, id: this.props.id,
            userObj: null, lastTxt: null, isLoading: true, isPic: false
        }
    }

    componentWillMount = async () => {
        await getFirestoreUserByUid(this.state.id).then(async user => {
            let userData = user[1]
            if ('photoURL' in userData)
                this.setState({ isPic: true })
            this.setState({
                userObj: userData,
                lastTxt: this.state.chats[this.state.chats.length - 1].text,
                name: userData.firstName + ' ' + userData.lastName,
                isLoading: false
            })
        }).catch(err => console.log(err))
    }

    renderSkeleton = () => {
        return (
            <SkeletonPlaceholder speed={1000}>
                <View style={styles.row}>
                    <SkeletonPlaceholder.Item
                        width={responsiveWidth(16)}
                        height={responsiveHeight(8)}
                        borderRadius={responsiveHeight(100)}
                    />
                    <View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
                        <View style={styles.nameContainer}>
                            <SkeletonPlaceholder.Item marginVertical={responsiveHeight(0.7)} height={responsiveHeight(1.7)} width={responsiveWidth(75)} />
                        </View>
                        <View style={styles.msgContainer}>
                            <SkeletonPlaceholder.Item marginVertical={responsiveHeight(0.7)} height={responsiveHeight(1.7)} width={responsiveWidth(75)} />
                        </View>
                    </View>
                </View>
            </SkeletonPlaceholder>
        )
    }

    renderIcon = () => {
        return (
            <View style={{ backgroundColor: '#008080', borderRadius: responsiveHeight(100), width: responsiveWidth(15), height: responsiveHeight(8), alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome5 name={'user-tie'} color={'white'} size={responsiveHeight(4)} />
            </View>
        )
    }

    renderCard = () => {
        let img;
        if (this.state.isPic)
            img = <Image source={{ uri: this.state.userObj['photoURL'] }} style={styles.pic} />
        else
            img = this.renderIcon()
        return (
            <TouchableOpacity onPress={() => this.props.action(this.state.userObj)} disabled={this.state.isLoading}>
                <View style={styles.row}>
                    {img}
                    <View style={{ flex: 1 }}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">{this.state.name}</Text>
                        </View>
                        <View style={styles.msgContainer}>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.msgTxt}>{this.state.lastTxt}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let component;
        if (this.state.isLoading)
            component = this.renderSkeleton()
        else
            component = this.renderCard()
        return (
            <View>
                {component}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#DCDCDC',
        borderBottomWidth: 1,
        paddingHorizontal: responsiveWidth(1.5),
        paddingVertical: responsiveHeight(1.5),
    },
    pic: {
        borderRadius: responsiveHeight(100),
        width: responsiveWidth(15),
        height: responsiveWidth(15),
        resizeMode: 'cover',
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: responsiveWidth(80),
    },
    nameTxt: {
        marginLeft: responsiveWidth(4),
        fontWeight: '600',
        color: '#222',
        fontSize: responsiveFontSize(2.5),
    },
    msgContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    msgTxt: {
        fontWeight: '400',
        color: 'gray',
        fontSize: responsiveFontSize(1.5),
        marginLeft: responsiveWidth(4),
    }
}); 