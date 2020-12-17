import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
    AsyncStorage
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import SearchInput, { createFilter } from 'react-native-search-filter'
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { getAllAds } from '../../Utility/utility'

const KEYS_TO_FILTERS = ['Title', 'Description'];

export default class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyword: '', searchResults: [], isLoading: true, filteredResults: []
        }
    }

    componentWillMount = async () => {
        await getAllAds(val => this.setState({ searchResults: val })).then(() => {
            this.setState({ isLoading: false })
        }).catch(err => console.log(err))
    }

    renderSearchContent = () => {
        if (this.state.keyword == '') {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={styles.image} source={require('../../../Images/search.png/')} />
                    <Text>Type your desired item in search bar</Text>
                </View>
            )
        }
        else if (!this.state.isLoading) {
            let filteredResults = this.state.searchResults.filter(createFilter(this.state.keyword, KEYS_TO_FILTERS))
            AsyncStorage.setItem('results', JSON.stringify(filteredResults))
            return (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={filteredResults}
                        extraData={filteredResults}
                        renderItem={({ item }) => this.renderSearchItem(item)}
                        keyExtractor={item => item}
                    />
                </View>
            )
        }
    }

    renderSearchItem = item => {
        return (
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onSearchPress(item['title'])}>
                <View style={styles.resultContainer}>
                    <Text numberOfLines={1}>{item['Title']}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    onSearchPress = async () => {
        let results = await AsyncStorage.getItem('results')
        this.props.navigation.navigate('SearchResults', {results:JSON.parse(results)})
    }

    render() {
        let component;
        component = this.renderSearchContent()
        return (
            <Animatable.View animation={'slideInLeft'} duration={300} style={{ flex: 1 }}>

                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.3, y: 0 }} colors={['#008080', '#4c516d']} style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center' }}>
                        <View style={styles.inputContainer}>
                            <View style={{ justifyContent: 'center', paddingHorizontal: responsiveWidth(1.5) }}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ paddingHorizontal: responsiveWidth(3), flex: 1, justifyContent: 'center' }}>
                                    <FontAwesome5 name={'arrow-left'} color={'black'} size={responsiveHeight(3)} />
                                </TouchableOpacity>
                            </View>
                            <SearchInput
                                returnKeyType={'search'}
                                onSubmitEditing={this.onSearchPress}
                                style={{ flex: 1, width: responsiveWidth(73) }}
                                clearIcon={this.state.keyword !== '' && <FontAwesome name={'remove'} color={'black'} size={responsiveHeight(3)} />}
                                clearIconViewStyles={{ left: responsiveWidth(73), top: responsiveHeight(1.4), position: 'absolute' }}
                                onChangeText={txt => this.setState({ keyword: txt })}
                                placeholder="Search"
                            />
                        </View>
                    </View>
                </LinearGradient>

                <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}>
                    {component}
                </View>

            </Animatable.View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: responsiveFontSize(3),
        color: 'white'
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        height: responsiveHeight(6),
        width: responsiveWidth(95),
        margin: 5,
        flexDirection: 'row',
    },
    image: {
        height: responsiveHeight(12),
        width: responsiveWidth(24),
        margin: responsiveHeight(2),
        resizeMode: 'contain'
    },
    resultContainer: {
        borderBottomWidth: responsiveWidth(0.5),
        borderColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1),
        flex: 1,
        justifyContent: 'center',
        width: responsiveWidth(100),
        height: responsiveHeight(8)
    }
});