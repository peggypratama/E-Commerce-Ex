import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import UserRatingAndReview from '../UserRatingAndReview/userRatingAndReview'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import * as firebase from 'firebase'
import 'firebase/firestore'

export default class MyReview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userReviewObj: this.props.reviewObj,
            disableBtn: false, editLoading: false, deleteLoading: false,
        }
        this.updateParent = this.props.updateParent
        this.editPressed = this.props.onEditPress
    }

    onEditPress = () => {
        this.setState({ disableBtn: true, editLoading: true })
        this.editPressed()
        this.setState({ disableBtn: false, editLoading: false })
    }

    onDeletePress = async () => {
        this.setState({ disableBtn: true, deleteLoading: true })
        this.updateParent(this.state.userReviewObj, 'delete')
        await firebase.firestore().collection('Ratings and Reviews').doc(this.state.userReviewObj.reviewID).delete()
        this.setState({ disableBtn: false, deleteLoading: false })
    }

    styles = StyleSheet.create({
        txt: {
            color: '#008080',
            fontSize: responsiveFontSize(2.2),
            fontWeight: 'bold',
            textAlign: 'center',
        },
        btn: {
            width: responsiveWidth(30),
            borderWidth: responsiveWidth(0.5),
            borderColor: '#008080',
            borderRadius: responsiveWidth(2),
            alignItems: 'center',
            justifyContent: 'center'
        }
    });

    render() {
        let editDisplay, deleteDisplay, indicator = <ActivityIndicator size={responsiveHeight(2.5)} color="#008080" />;
        if (this.state.editLoading)
            editDisplay = indicator
        else
            editDisplay = <Text style={this.styles.txt}>Edit</Text>
        if (this.state.deleteLoading)
            deleteDisplay = indicator
        else
            deleteDisplay = <Text style={this.styles.txt}>Delete</Text>
        return (
            <View style={{ flex: this.props.flexSize }}>
                <UserRatingAndReview
                    flexSize={1}
                    name={this.state.userReviewObj.reviewData.name}
                    rating={this.state.userReviewObj.reviewData.rating}
                    review={this.state.userReviewObj.reviewData.review}
                    imageUrl={this.state.userReviewObj.reviewData.imageUrl}
                    date={this.state.userReviewObj.reviewData.date}
                />
                <View style={{ flex: 1, flexDirection: 'row', paddingVertical: responsiveHeight(1), justifyContent: 'space-evenly' }}>
                    <TouchableOpacity onPress={this.onEditPress} disabled={this.state.disableBtn} style={this.styles.btn}>
                        {editDisplay}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onDeletePress} style={this.styles.btn} disabled={this.state.disableBtn}>
                        {deleteDisplay}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}