import React, { Component } from 'react';
import { View, Platform, Alert, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions'
import DialogBox from '../../CommonModules/DialogBox/dialogBox'

export default class LocationPicker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            marker: null, initialPosition: null, markerDialog: false,
        }
        if (!this.props.updateParent)
            this.updateParent = this.props.navigation.getParam('updateParent')
        else
            this.updateParent = this.props.updateParent
    }

    componentDidUpdate(prevProps) {
        if (this.props.marker != prevProps.marker)
            this.setState({ marker: this.props.marker })
    }

    componentWillMount() {
        if (!this.props.marker)
            this.setState({ marker: this.props.navigation.getParam('marker') })
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

    selectLocation = async () => {
        if (!this.state.marker)
            this.setState({ markerDialog: true })
        else {
            this.updateParent(this.state.marker)
            this.props.navigation.goBack()
        }
    }

    render() {
        let marker;
        if (this.state.marker)
            marker = <Marker coordinate={this.state.marker} />
        return (
            <View style={{ flex: 1 }}>
                <Modal>
                    <DialogBox resetState={() => this.setState({ markerDialog: false })} showDialog={this.state.markerDialog} title={'Location Selection Failed'} description={'Please tap on the location in order to continue'} />
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
                        showsMyLocationButton={true}
                        followsUserLocation={true}
                        loadingEnabled={true}
                        loadingIndicatorColor={'red'}
                        onPress={coords => this.setState({ marker: coords.nativeEvent.coordinate })}
                    >
                        {marker}
                    </MapView>

                    <View style={styles.btnContainer}>
                        <TouchableOpacity onPress={this.selectLocation} style={[styles.btn, { backgroundColor: '#4285F4' }]}>
                            <Text style={styles.btnTxt}>Confirm Location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[styles.btn, { backgroundColor: '#DB4437' }]}>
                            <Text style={styles.btnTxt}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

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