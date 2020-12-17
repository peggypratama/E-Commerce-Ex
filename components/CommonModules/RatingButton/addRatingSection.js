import React, { Component } from 'react'
import { View } from 'react-native';

import DescriptionSection from '../DescriptionSection/descriptionSection'
import PostButton from '../PostButton/postButton'
import StarRating from 'react-native-star-rating';
import * as Animatable from 'react-native-animatable';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

import { getCurrentUserObj, getCurrentUid } from '../../Utility/utility'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default class AddRatingSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            starCount: 0,
            reviewSection: false,
            review: '',
            reviewObj: this.props.review,
            type: this.props.type
        }
        this.updateParent = this.props.updateParent
    }

    componentWillMount = () => {
        if (this.props.type == 'edit') {
            this.setState({
                starCount: this.state.reviewObj.reviewData.rating,
                review: this.state.reviewObj.reviewData.review,
                reviewSection: true,
                type: this.props.type
            })
        }
        else
            this.setState({ starCount: 0, review: '' })
    }

    componentDidUpdate(prevProps) {
        if (this.props.review != prevProps.review)
            this.setState({ reviewObj: this.props.review })
        if (this.props.type != prevProps.type)
            this.setState({ type: this.props.type })
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating,
            reviewSection: true
        });
    }

    updateRatingAndReview = async () => {
        if (this.state.type == 'add') {
            await this.getReviewObject('add').then(async reviewObj => {
                let newObj=reviewObj
                newObj.timestamp=firebase.firestore.Timestamp.fromDate(new Date())
                await firebase.firestore().collection('Ratings and Reviews').add(reviewObj).then(async ref => {
                    let temp = { reviewID: ref.id, reviewData: reviewObj }
                    this.updateParent(temp, 'add')
                })
            }).catch(err => console.log(err))
        }
        else if (this.state.type == 'edit') {
            await this.getReviewObject('edit').then(async reviewObj => {
                await firebase.firestore().collection('Ratings and Reviews').doc(this.state.reviewObj.reviewID).set(reviewObj).then(() => {
                    let temp = { reviewID: this.state.reviewObj.reviewID, reviewData: reviewObj }
                    this.updateParent(temp, 'edit')
                })
            }).catch(err => console.log(err))
        }
    }

    getReviewObject = async () => {
        let reviewObj;
        await getCurrentUserObj().then(obj => {
            let today = new Date()
            reviewObj = {
                'review': this.state.review, 'rating': this.state.starCount, 'userID': obj.uid,
                'name':obj.displayName, 'imageUrl':obj.photoURL,
                'adID': this.props.adID, 'timestamp': firebase.firestore.FieldValue.serverTimestamp(),
                'date': today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear()
            }
        }).catch(err => { throw err })
        return reviewObj
    }

    renderReviewSection = () => {
        return (
            <Animatable.View animation={'slideInLeft'} duration={500} style={{ flex: 2 }}>
                <View style={{ flex: 3 }}>
                    <DescriptionSection
                        updateParent={val => this.setState({ review: val })}
                        value={this.state.review}
                        height={responsiveHeight(8)}
                        label={'Review'}
                        margin={responsiveHeight(2)}
                        placeholder={'Optional'}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <PostButton action={this.updateRatingAndReview} buttonText={'Post'} />
                </View>
            </Animatable.View>
        )
    }

    render() {
        let reviewSection;
        if (this.state.reviewSection == true)
            reviewSection = this.renderReviewSection()
        else
            reviewSection = null
        return (
            <View style={{ flex: this.props.flex }}>
                <View style={{ flex: 2, paddingVertical: responsiveHeight(1), marginBottom: responsiveHeight(2) }}>
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={this.state.starCount}
                        fullStarColor={'#008080'}
                        starSize={responsiveHeight(4)}
                        starStyle={{ marginHorizontal: responsiveWidth(1) }}
                        selectedStar={rating => this.onStarRatingPress(rating)}
                    />
                </View>
                {reviewSection}
            </View >
        )
    }
}