import React, { Component } from 'react'
import {
    Image,
    Text,
    View,
    StyleSheet,
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import StarRating from 'react-native-star-rating';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import * as firebase from 'firebase'
import 'firebase/firestore'

export default class UserRatingAndReview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lines: 2, read: 'Read More',
            name: this.props.name, rating: this.props.rating, review: this.props.review,
            imageUrl: this.props.imageUrl, date: this.props.date
        }
    }

    componentDidUpdate = prevProps => {
        if (this.props.review != prevProps.review)
            this.setState({ review: this.props.review })
        if (this.props.name != prevProps.name)
            this.setState({ name: this.props.name })
        if (this.props.rating != prevProps.rating)
            this.setState({ rating: this.props.rating })
        if (this.props.imageUrl != prevProps.imageUrl)
            this.setState({ imageUrl: this.props.imageUrl })
        if (this.props.date != prevProps.date)
            this.setState({ date: this.props.date })
    }

    onReadPress = () => {
        if (this.state.read == 'Read More')
            this.setState({ read: 'Read Less', lines: 2000000 })
        else
            this.setState({ read: 'Read More', lines: 2 })
    }

    renderImage = () => {
        return (
            <View style={styles.iconContainer}>
                <Image style={styles.iconCat} source={{ uri: this.props.imageUrl }} />
            </View>
        )
    }

    renderIcon = () => {
        return (
            <View style={styles.iconContainer}>
                <View style={[{ backgroundColor: '#008080' }, styles.iconCat]}>
                    <FontAwesome5 name={'user-tie'} color={'white'} size={responsiveHeight(3)} />
                </View>
            </View>
        )
    }

    renderReview = () => {
        return (
            <View style={{ flex: 3 }}>
                <Text style={styles.txt} numberOfLines={this.state.lines}>{this.state.review}</Text>
                <Text onPress={this.onReadPress} style={{ color: '#008080', fontWeight: 'bold', marginTop: responsiveHeight(0.5) }}>{this.state.read}</Text>
            </View>
        )
    }

    render() {
        let image, review;
        if (this.state.imageUrl == '' || !this.state.imageUrl)
            image = this.renderIcon()
        else
            image = this.renderImage()
        if (this.props.review != '')
            review = this.renderReview()
        else
            review = null
        return (
            <View style={{ flex: this.props.flexSize, paddingVertical: responsiveHeight(1) }}>
                <View style={{ flex: 2, flexDirection: 'row', paddingVertical: responsiveHeight(1) }}>
                    {image}
                    <View style={{ flex: 5, justifyContent: 'center', paddingLeft: responsiveWidth(1) }}>
                        <Text style={{ fontSize: responsiveFontSize(2.2) }} numberOfLines={1}>{this.state.name}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', paddingVertical: responsiveHeight(1) }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}  >
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={this.state.rating}
                            fullStarColor={'#008080'}
                            starSize={responsiveHeight(2)}
                        />
                    </View>
                    <View style={{ flex: 2, paddingLeft: responsiveWidth(4) }}>
                        <Text style={styles.txt}>{this.state.date}</Text>
                    </View>
                </View>
                {review}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    iconContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    iconCat: {
        height: responsiveHeight(6),
        width: responsiveWidth(12),
        borderRadius: responsiveWidth(80),
        justifyContent: 'center',
        alignItems: 'center',
    },
    txt: {
        color: '#8c8c8c',
        fontSize: responsiveFontSize(1.9)
    }
});