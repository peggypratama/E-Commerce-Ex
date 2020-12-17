import React, { Component } from 'react'
import {
    Text,
    View,
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import StarRating from 'react-native-star-rating';
import * as Progress from 'react-native-progress';

class RatingBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: this.props.count
        }
    }
    async componentDidUpdate(prevProps) {
        if (this.props.count != prevProps.count) {
            await this.setState({ count: this.props.count })
        }
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Text>{this.props.class}</Text>
                </View>
                <View style={{ flex: 5 }}>
                    <Progress.Bar
                        progress={this.state.count}
                        width={responsiveWidth(35)}
                        color={'#008080'}
                        unfilledColor={'#ebebeb'}
                        borderColor={'#ebebeb'}
                        borderRadius={responsiveWidth(100)}
                    />
                </View>
            </View>
        )
    }
}

export default class RatingAndReviewCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reviewObj: this.props.reviewObj,
            rating: 0, totalReviews: 0,
            classes: [0, 0, 0, 0, 0]
        }
    }

    componentWillMount = () => {
        this.setCard()
    }

    setCard = () => {
        let sum = 0.0, totalReviews = this.state.reviewObj.length;
        this.state.reviewObj.forEach(rev => {
            sum += rev.reviewData.rating
            this.state.classes[parseInt(rev.reviewData.rating) - 1] += 1
        })
        sum = parseFloat(sum)
        for (let i = 0; i < this.state.classes.length; i++) 
            this.state.classes[i] /= totalReviews
        sum /= totalReviews
        sum = sum.toFixed(1)
        this.setState({ rating: sum, totalReviews: totalReviews })
    }

    async componentDidUpdate(prevProps) {
        if (this.props.reviewObj != prevProps.reviewObj) {
            await this.setState({
                reviewObj: this.props.reviewObj,
                classes: [0, 0, 0, 0, 0]
            })
            this.setCard()
        }
    }

    render() {
        return (
            <View style={{ flex: this.props.flexSize, flexDirection: 'row' }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: responsiveFontSize(5), fontWeight: 'bold' }}>{this.state.rating}</Text>
                    </View>
                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={this.state.rating}
                            fullStarColor={'#008080'}
                            starSize={responsiveHeight(3)}
                            starStyle={{ marginHorizontal: responsiveWidth(1) }}
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ marginTop: responsiveHeight(1), color: '#a3a3a3' }}>{this.state.totalReviews}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <RatingBar count={this.state.classes[4]} class={5} />
                    <RatingBar count={this.state.classes[3]} class={4} />
                    <RatingBar count={this.state.classes[2]} class={3} />
                    <RatingBar count={this.state.classes[1]} class={2} />
                    <RatingBar count={this.state.classes[0]} class={1} />
                </View>

            </View>
        )
    }
}