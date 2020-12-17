import React, { Component } from 'react'
import {
    View,
    FlatList,
    Modal
} from 'react-native';

import InternalHeader from '../InternalHeader/internalHeader'
import RatingAndReviewCard from '../RatingAndReviewCard/ratingAndReviewCard'
import UserRatingAndReview from '../UserRatingAndReview/userRatingAndReview'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export default class RatingsAndReviews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ratingsAndReviews: null
        }
        this.allReviews = [
            { rating: 3.5, name: 'hello', review: 'ujghvhjvhjjhjfjfjjfyfftrrhrdgdrdrdrrddrrdyrdgdfgfdgfdgfdfdgfdgfdgfdgfdgfdgfdgfdgsgsgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 2, name: 'hello', review: '', imageUrl: ``, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
            { rating: 5, name: 'hello', review: 'gsgsfggggggggggggggggggggggggggggggggggggggggggggjjjjjjjjjjjjjjjjjkjjjjjjjjjjjjjdgdggdgdgdffgrdfgrd', imageUrl: `https://placekitten.com/414/350`, date: '11/12/2020' },
        ]
    }

    componentWillMount = async () => {
        this.setState({ ratingsAndReviews: this.allReviews })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Modal style={{ flex: 1 }} presentationStyle={'fullScreen'}>
                    <InternalHeader action={() => this.props.navigation.goBack()} name={'Ratings and Reviews'} flexSize={1.1} />
                    <View style={{ flex: 2, paddingVertical: responsiveHeight(2) }}>
                        <RatingAndReviewCard flexSize={2} />
                    </View>
                    <View style={{ flex: 10 }}>
                        <FlatList
                            style={{ paddingHorizontal: responsiveWidth(5) }}
                            data={this.state.ratingsAndReviews}
                            extraData={this.state.ratingsAndReviews}
                            renderItem={({ item }) =>
                                <UserRatingAndReview
                                    name={item.name}
                                    rating={item.rating}
                                    review={item.review}
                                    imageUrl={item.imageUrl}
                                    date={item.date}
                                />}
                            keyExtractor={item => item.name}
                        />
                    </View>
                </Modal>
            </View>
        )
    }
}