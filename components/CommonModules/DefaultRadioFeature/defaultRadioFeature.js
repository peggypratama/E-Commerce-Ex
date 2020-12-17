import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

export default class DefaultRadioFeature extends Component {
    constructor(props) {
        super(props)
        this.state = {
            yesColor: '#008080',
            noColor: '#a3a3a3',
            option: 'Yes'
        }
        this.updateParent = this.props.updateParent
    }

    componentWillMount = () => {
        if (this.props.value == 'Yes')
            this.OnYesPress()
        else if (this.props.value == 'No')
            this.OnNoPress()
    }

    componentDidUpdate(prevProps) {
        if (this.props.value != prevProps.value) {
            if (this.props.value == 'Yes' && this.state.option != 'Yes')
                this.OnYesPress()
            else if (this.props.value == 'No' && this.state.option != 'No')
                this.OnNoPress()
        }
    }

    OnYesPress = () => {
        this.setState({ option: 'Yes' })
        this.updateParent('Yes')
        this.setState({ yesColor: '#008080' })
        this.setState({ noColor: '#a3a3a3' })
    }

    OnNoPress = () => {
        this.setState({ option: 'No' })
        this.updateParent('No')
        this.setState({ yesColor: '#a3a3a3' })
        this.setState({ noColor: '#008080' })
    }

    render() {
        return (
            <View style={{ flex: this.props.flexSize, marginVertical: responsiveHeight(1.4), flexDirection: 'row', height: responsiveHeight(6) }}>
                <View style={styles.iconContainer}>{this.props.icon}</View>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{this.props.name}</Text>
                </View>
                <View style={styles.radioBtnContainer}>
                    <TouchableOpacity style={[{ backgroundColor: this.state.yesColor }, styles.radioBtn]} onPress={this.OnYesPress}>
                        <Text style={styles.radioBtnTxt}>Yes</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.radioBtnContainer}>
                    <TouchableOpacity style={[{ backgroundColor: this.state.noColor }, styles.radioBtn]} onPress={this.OnNoPress}>
                        <Text style={styles.radioBtnTxt}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    iconContainer: {
        flex: 0.97,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: responsiveWidth(2)
    },
    nameContainer: {
        flex: 3,
        justifyContent: 'center',
        borderColor: '#f2f2f2',
        borderLeftWidth: responsiveWidth(0.3)
    },
    name: {
        color: '#696969',
        paddingLeft: responsiveWidth(4),
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold'
    },
    radioBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#4c516d',
        borderRadius: responsiveHeight(1)
    },
    radioBtnContainer: {
        flex: 2,
        paddingHorizontal: responsiveWidth(1),
        paddingVertical: responsiveHeight(1)
    },
    radioBtnTxt: {
        color: 'white'
    }
})