import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';

import { Kohana } from 'react-native-textinput-effects';
import { responsiveHeight, responsiveWidth, responsiveFontSize, useResponsiveFontSize } from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import * as Animatable from 'react-native-animatable';

export default class CustomBank extends Component {
    constructor(props) {
        super(props)
        this.state = {
            description: this.props.value,
            title: this.props.value,
        }
        this.updateParentTitle = this.props.updateParentTitle
        this.updateParentDescription = this.props.updateParentDescription
        this.deleteFeature=this.props.deleteFeature
    }

    async componentDidUpdate(prevProps) {
        if (this.props.title != prevProps.title)
            await this.updateParentTitle(this.props.title)
        if (this.props.description != prevProps.description)
            await this.updateParentDescription(this.props.description)
    }
    componentWillMount = () => {
        if (!this.state.description)
            this.setState({ description: '' })
        else if (!this.state.title)
            this.setState({ title: '' })
    }

    async componentDidUpdate(prevProps) {
        if (this.props.value != prevProps.value)
            await this.setState({ description: this.props.value })
        else  if (this.props.value != prevProps.value)
            await this.setState({ title: this.props.value })
    }

    delete = async () => {
        await this.AnimationRef.fadeOutRight()
        this.deleteFeature()
    }

    updatetitle = text => {
        this.setState({ title: text })
        this.updateParentTitle(text)
    }

    styles = StyleSheet.create({
        container: {
            flex: this.props.flexSize,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: this.props.margin
        },
        label: {
            fontWeight: 'bold',
            fontSize: responsiveFontSize(2.5),
            marginBottom: responsiveHeight(1)
        },
        input: {
            flex: 1,
            paddingHorizontal: responsiveWidth(2),
            width: responsiveWidth(90),
            borderWidth: responsiveWidth(1),
            borderRadius: responsiveWidth(3),
            borderColor: '#dcdcdc',
            height: this.props.height
        }
    })

    updatedescription = text => {
        this.setState({ description: text })
        this.updateParentDescription(text)
    }


    getBorderColor = () => {
        if (this.state.description != '')
            return '#008080'
        return '#dcdcdc'
    }

    getLabelColor = () => {
        if (this.state.description != '')
            return '#bababa'
        return '#008080'
    }

    render() {
        var borderColor = this.getBorderColor()
        var labelColor = this.getLabelColor()
                return (
            <Animatable.View ref={ref => this.AnimationRef = ref} animation={'fadeInLeft'} duration={800} style={[{ flex: 1 }, styles.box]}>
                <KeyboardAvoidingView style={styles.txtContainer}>
                <Kohana
                                onChangeText={text => this.updatetitle(text)}
                                value={this.state.title}
                                style={styles.txt}
                                label={'Title'} iconClass={MaterialIcons}
                                iconName={'title'}
                                iconColor={'#008080'} inputPadding={responsiveWidth(1)}
                                labelStyle={styles.lbl}
                                inputStyle={styles.input} />
                </KeyboardAvoidingView>
                <KeyboardAvoidingView style={styles.txtContainer}>
                            <Kohana
                                onChangeText={text => this.updatedescription(text)}
                                value={this.state.description}
                                style={styles.txt}
                                label={'Desc'} iconClass={MaterialIcons}
                                iconName={'title'}
                                iconColor={'#008080'} inputPadding={responsiveWidth(1)}
                                labelStyle={styles.lbl}
                                inputStyle={styles.input} />
                </KeyboardAvoidingView>
                <TouchableOpacity onPress={this.delete} style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <Entypo name={'circle-with-cross'} size={responsiveHeight(4)} color={'red'} />
                </TouchableOpacity>
            </Animatable.View>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        paddingVertical: responsiveHeight(1),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(1)
    },
    txt: {
        borderColor: '#dcdcdc',
        borderWidth: responsiveWidth(0.8),
        borderRadius: responsiveWidth(3),
        marginHorizontal: responsiveWidth(1)
    },
    txtContainer: {
        flex: 5,
    },
    lbl: {
        color: '#008080',
        fontSize: responsiveFontSize(2.1)
    },
    input: {
        color: '#4c516d',
        fontSize: responsiveFontSize(2.1)
    }
})