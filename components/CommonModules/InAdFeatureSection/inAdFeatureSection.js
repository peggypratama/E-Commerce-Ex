import React, { Component } from 'react'
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { Table, Row } from 'react-native-table-component';

import Foundation from 'react-native-vector-icons/Foundation'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'

import DefaultFeature from '../InAdFeature/inAdDefaultFeature'
import AdHeading from '../AdHeading/adHeading'

export default class InAdFeatureSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            features: null,
            adObj: this.props.adObj,
            type: '',
        }
    }

    componentWillMount = async () => {
        if (this.state.adObj["Category"] == "Vehicles") {
            this.setState({
                features: [
                    { icon: <Foundation style={{ flex: 1 }} name={'calendar'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Model Year', value: this.state.adObj["Model Year"] },
                    { icon: <FontAwesome style={{ flex: 1 }} name={'gears'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Transmission', value: this.state.adObj["Transmission"] },
                    { icon: <Ionicons style={{ flex: 1 }} name={'md-color-palette'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Color', value: this.state.adObj["Color"] },
                    { icon: <Ionicons style={{ flex: 1 }} name={'ios-speedometer'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Mileage', value: this.state.adObj["Mileage"] },
                    { icon: <MaterialCommunityIcons name={'air-filter'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Air Conditioning', value: this.state.adObj["Air Conditioning"] },
                    { icon: <MaterialCommunityIcons name={'circle-slice-8'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Alloy Rims', value: this.state.adObj["Alloy Rims"] },
                    { icon: <MaterialCommunityIcons name={'car-key'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Central Locking', value: this.state.adObj['Central Locking'] },
                    { icon: <MaterialCommunityIcons name={'airbag'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Air Bags', value: this.state.adObj['Airbags'] },
                    { icon: <MaterialCommunityIcons name={'music-box'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Media Player', value: this.state.adObj['Media Player'] },
                ],
            })
        }
        else if (this.state.adObj["Category"] == "Houses") {
            this.setState({
                features: [
                    { icon: <Foundation style={{ flex: 1 }} name={'calendar'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Completion Year', value: this.state.adObj["Completion Year"] },
                    { icon: <MaterialCommunityIcons style={{ flex: 1 }} name={'tape-measure'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Size', value: this.getMetricHouseSize(this.state.adObj["Marhalas"]) },
                    { icon: <Feather name={'layers'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Floors', value: this.state.adObj["Floors"] },
                    { icon: <Ionicons name={'ios-bed'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Bedrooms', value: this.state.adObj["Bedrooms"] },
                    { icon: <FontAwesome name={'bath'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Bathrooms', value: this.state.adObj["Bathrooms"] },
                    { icon: <FontAwesome5 name={'parking'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Parking Spaces', value: this.state.adObj["Parking Spaces"] },
                    { icon: <MaterialCommunityIcons name={'stove'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Kitchens', value: this.state.adObj["Kitchens"] },
                    { icon: <Ionicons name={'md-tv'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Lounge Rooms', value: this.state.adObj["Lounge Rooms"] },
                    { icon: <MaterialCommunityIcons name={'sofa'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Drawing Rooms', value: this.state.adObj["Drawing Rooms"] },
                    { icon: <FontAwesome5 name={'box'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Store Rooms', value: this.state.adObj["Store Rooms"] },
                    { icon: <Ionicons name={'ios-snow'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Central Cooling', value: this.state.adObj["Central Cooling"] },
                    { icon: <MaterialCommunityIcons name={'air-filter'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Central Heating', value: this.state.adObj["Central Heating"] },
                    { icon: <Entypo name={'tree'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Lawns', value: this.state.adObj["Lawn"] },
                    { icon: <Entypo name={'tree'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Backyards', value: this.state.adObj["Backyard"] },
                    { icon: <MaterialCommunityIcons name={'satellite-uplink'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Cable', value: this.state.adObj["Cable"] },
                    { icon: <Ionicons name={'ios-globe'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Internet', value: this.state.adObj["Internet"] },
                    { icon: <MaterialCommunityIcons name={'water-pump'} color={'#008080'} size={responsiveHeight(4)} />, name: 'Boaring', value: this.state.adObj["Boaring"] },
                ]
            })
        }
        else if (this.state.adObj["Category"] == "Hardware" || this.state.adObj["Category"] == "Electronics")
            this.setState({ features: this.state.adObj["Features"] })
        this.setState({ type: this.state.adObj["Category"] })
    }

    getMetricHouseSize = size => {
        let metricSize = parseFloat(size) / 20.0
        if (metricSize >= 1 && metricSize < 2)
            return metricSize.toString() + ' Kanal'
        else if (metricSize >= 2)
            return metricSize.toString() + ' Kanals'
        return size + ' Marhalas'
    }

    renderDefaultFeatures = () => {
        return (
            <View style={{ flex: 1 }}>
                <AdHeading fontSize={3} name={'Features'} margin={responsiveHeight(2)} />
                <FlatList
                    numColumns={3}
                    data={this.state.features}
                    renderItem={({ item }) =>
                        <DefaultFeature
                            icon={item.icon}
                            name={item.name}
                            value={item.value}
                        />}
                    keyExtractor={item => item.name}
                />
            </View>
        )
    }

    renderCustomFeatures = () => {
        return (
            <View style={{ flex: 1, marginBottom: responsiveHeight(2) }}>
                <AdHeading fontSize={3} name={'Features'} margin={responsiveHeight(2)} />
                <Table>
                    <FlatList
                        data={this.state.features}
                        renderItem={({ item, index }) =>
                            <Row
                                key={index}
                                data={[item.title, item.description]}
                                widthArr={[responsiveWidth(45), responsiveWidth(45)]}
                                style={[styles.row, index % 2 && { backgroundColor: 'white' }]}
                                textStyle={styles.text}
                            />}
                        keyExtractor={item => item.id}
                    />
                </Table>
            </View>
        )
    }

    render() {
        let component;
        if (this.state.type == 'Vehicles' || this.state.type == 'Houses')
            component = this.renderDefaultFeatures()
        else if (this.state.adObj["Features"].length)
            component = this.renderCustomFeatures()
        else
            component = null
        return (
            <View style={{ flex: this.props.flexSize }}>
                {component}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        paddingHorizontal: responsiveWidth(2),
        fontSize: responsiveFontSize(2)
    },
    row: {
        flex: 1,
        backgroundColor: '#66b2b2',
        paddingVertical: responsiveHeight(1),
        justifyContent: 'center',
        alignItems: 'center'
    }
});