import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default class SelectedPictures extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uri: this.props.uri,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.uri != prevProps.uri)
          this.setState({ uri: this.props.uri })
      }

    renderSkeleton = () => {
        return (
            <SkeletonPlaceholder style={{ flex: 1 }} speed={1000}>
                <View style={{ flex: 1 }}>
                    <SkeletonPlaceholder.Item
                        width={responsiveWidth(this.props.width)}
                        height={responsiveHeight(this.props.height)}
                        borderRadius={responsiveWidth(this.props.radius)}
                    />
                </View>
            </SkeletonPlaceholder>
        )
    }

    renderImage() {
        return (
            <View style={{ flex: 1 }}>
                <Image source={{ uri: this.state.uri, isStatic: true }} style={this.styles.img} />
            </View>
        )
    }

    render() {
        let image;
        if (this.state.uri)
            image = this.renderImage()
        else
            image = this.renderSkeleton()
        return (
            <View style={this.styles.container}>
                {image}
            </View>
        )
    }

    styles = StyleSheet.create({
        container: {
            width: responsiveWidth(this.props.width),
            height: responsiveHeight(this.props.height),
            marginVertical:responsiveHeight(this.props.margin)
        },
        img: {
            flex: 1,
            resizeMode: 'cover',
            width: responsiveWidth(this.props.width),
            borderRadius: responsiveWidth(this.props.radius)
        }
    })
}