import React, { Component } from 'react'
import { View } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import AdHeading from '../AdHeading/adHeading'
import AddRatingSection from './addRatingSection'
import MyReview from './myReview'

export default class MyReviewSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayReview: true,
            reviewObj: this.props.reviewObj,
            adID: this.props.adID,
            type: 'edit',
            heading: 'Your Rating and Review'
        }
        this.updateParentReviews=this.props.updateParent
    }

    componentWillMount = () => {
        if (!this.state.reviewObj)
            this.initReviewSection()
    }

    initReviewSection = () => {
        this.setState({
            reviewObj: null,
            displayReview: false,
            type: 'add',
            heading: 'Rate this Ad'
        })
    }

    editPress = () => {
        this.setState({ displayReview: false, type: 'edit', heading: 'Edit your Review' })
    }

    updateMyReviewSection = (obj, type) => {
        if (type == 'add' || type == 'edit') {
            this.setState({
                reviewObj: obj,
                displayReview: true,
                type: 'edit',
                heading: 'Your Rating and Review'
            })
            this.updateParentReviews(obj, type)
        }
        else if (type == 'delete'){
            this.initReviewSection()
            this.updateParentReviews(obj, 'delete')
        }
    }

    render() {
        let section;
        if (this.state.displayReview)
            section = <MyReview onEditPress={this.editPress} updateParent={this.updateMyReviewSection} reviewObj={this.state.reviewObj} />
        else
            section = <AddRatingSection review={this.state.reviewObj} type={this.state.type} updateParent={this.updateMyReviewSection} adID={this.state.adID} />
        return (
            <View style={{ flex: this.props.flexSize }}>
                <AdHeading fontSize={3} name={this.state.heading} margin={responsiveHeight(2)} />
                {section}
            </View>
        )
    }
}