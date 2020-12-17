import React, { Component } from 'react';
import { View, Platform, Alert, StyleSheet, Linking } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';
import getDirections from 'react-native-google-maps-directions'
import { request, PERMISSIONS } from 'react-native-permissions'

export default class LocationViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            marker: this.props.latlong,
            initialPosition: null,
            currLoc: null
        }
    }

    componentWillMount() {
        this.requestLoctaionPermission()
    }

    requestLoctaionPermission = async () => {
        if (Platform.OS === 'ios') {
            var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            if (response === 'granted')
                this.locateCurrentPosition()
        } else {
            var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            if (response === 'granted')
                this.locateCurrentPosition()
        }
    }

    locateCurrentPosition = () => {
        Geolocation.getCurrentPosition(position => {
            this.setState({
                currLoc: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            })
            if (!this.state.marker) {
                var initialPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            }
            else {
                var initialPosition = {
                    latitude: this.state.marker.latitude,
                    longitude: this.state.marker.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            }
            this.setState({ initialPosition: initialPosition })
        }, error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 10000 })
    }

    onMapPress = () => {
        /*const url = Platform.select({
            ios: "maps:" + this.state.marker.latitude + "," + this.state.marker.longitude + "?q=" + 'Location',
            android: "geo:" + this.state.marker.latitude + "," + this.state.marker.longitude + "?q=" + 'Location'
        });*/
        const data = {
            source: {
                latitude: this.state.currLoc.latitude,
                longitude: this.state.currLoc.longitude
            },
            destination: {
                latitude: this.state.marker.latitude,
                longitude: this.state.marker.longitude
            },
            params: [
                {
                    key: "travelmode",
                    value: "driving"        // may be "walking", "bicycling" or "transit" as well
                },
                {
                    key: "dir_action",
                    value: "navigate"       // this instantly initializes navigation using the given travel mode
                }
            ],
            waypoints: [
            ]
        }
        getDirections(data)
    }

    render() {
        return (
            <View style={{ flex: this.props.flexSize, height: this.props.height, width: this.props.width }}>
                <MapView
                    style={{ flex: 11 }}
                    provider={PROVIDER_GOOGLE}
                    ref={map => this._map = map}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    showsPointsOfInterest={true}
                    showsCompass={false}
                    initialRegion={this.state.initialPosition}
                    region={this.state.initialPosition}
                    showsMyLocationButton={true}
                    followsUserLocation={true}
                    loadingEnabled={true}
                    loadingIndicatorColor={'red'}
                    onPress={this.onMapPress}
                >
                    <Marker coordinate={this.state.marker} />
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    btnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    btn: {
        borderWidth: responsiveWidth(0.2),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#a3a3a3',
    },
    btnTxt: {
        color: 'white',
        fontWeight: 'bold'
    }
})