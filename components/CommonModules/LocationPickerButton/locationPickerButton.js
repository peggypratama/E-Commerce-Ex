import React, { Component } from 'react';
import { View, Platform, StyleSheet, TouchableOpacity } from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions'

export default class LocationPickerButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            marker: null,
            initialPosition: null
        }
        this.default = this.state.initialPosition
    }

    componentDidUpdate(prevProps) {
        if (this.props.latLong != prevProps.latLong) {
            if (this.props.latLong) {
                this.setState({
                    initialPosition: {
                        latitude: this.props.latLong.latitude,
                        longitude: this.props.latLong.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }, marker: this.props.latLong
                })
            }
            else
                this.setState({ initialPosition: this.default, marker: null })
        }
    }

    async componentWillMount() {
        if (Platform.OS === 'ios')
            await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        else
            await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        Geolocation.getCurrentPosition(position => {
            let initialPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
            if (this.props.latLong) {
                this.setState({
                    initialPosition: {
                        latitude: this.props.latLong.latitude,
                        longitude: this.props.latLong.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }, marker: this.props.latLong
                })
            }
            this.setState({ initialPosition: initialPosition })
        }, error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 10000 })
    }

    styles = StyleSheet.create({
        btn: {
            height: responsiveHeight(this.props.height),
            width: responsiveWidth(this.props.width),
            borderColor: '#008080',
            borderWidth: responsiveWidth(0.5),
            borderRadius: responsiveWidth(1),
        },
        map: {
            height: responsiveHeight(this.props.height - 0.5),
            width: responsiveWidth(this.props.width - 1)
        }
    })

    render() {
        let marker;
        if (this.state.marker)
            marker = <Marker coordinate={this.state.marker} />
        return (
            <View style={{ flex: this.props.flexSize, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={this.props.action} style={this.styles.btn}>
                    <MapView
                        style={this.styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={this.state.initialPosition}
                        region={this.state.initialPosition}
                        loadingEnabled={true}
                        loadingIndicatorColor={'red'}
                        scrollEnabled={false}
                        ref={map => (this.map = map)}
                    >
                        {marker}
                    </MapView>
                </TouchableOpacity>

            </View>
        )
    }
}