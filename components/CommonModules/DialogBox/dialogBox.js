import React,{Component} from 'react';
import { StyleSheet } from 'react-native';

import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Dialog from 'react-native-dialog'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class DialogBox extends Component {
    constructor(props){
        super(props)
        this.state={
            showDialog:this.props.showDialog
        }
        this.resetState=this.props.resetState
    }

    componentDidUpdate(prevProps){
        if (this.props.showDialog != prevProps.showDialog)
            this.setState({showDialog:this.props.showDialog})
    }

    onButtonPress = () => {
        this.setState({showDialog:false})
        this.resetState()
    }

    render() {
        return(
            <Dialog.Container visible={this.state.showDialog} headerStyle={styles.dialogHeader} contentStyle={styles.dialogContent} footerStyle={styles.dialogFooter}>
                <Dialog.Title style={{marginBottom:responsiveHeight(2)}}>
                    <MaterialIcons name={'error-outline'} color={'red'} size={responsiveHeight(8)} />
                </Dialog.Title>
                <Dialog.Title style={{color:'#008080', marginBottom:responsiveHeight(1)}}>{this.props.title}</Dialog.Title>
                <Dialog.Description style={{color:'#4c516d', alignItems:'center', textAlign:'justify', marginVertical:responsiveHeight(2)}}>{this.props.description}</Dialog.Description>
                <LinearGradient start={{x: 0, y: 0}} end={{x:1.3, y: 0}} colors={['#008080', '#4c516d']} style={{borderRadius:10}}>
                    <Dialog.Button onPress={this.onButtonPress} style={[styles.dialogBtn, {color:'white'}]} label={'OK'}/>
                </LinearGradient>
            </Dialog.Container>
        )
    }
}

const styles=StyleSheet.create({
    dialogHeader:{
        alignItems:'center',
        justifyContent:'center'
    },
    dialogContent:{
        alignItems:'center',
        borderRadius:10,
    },
    dialogFooter:{
        alignItems:'center',
        width:responsiveWidth(80)
    },
    dialogBtn:{
        fontSize:responsiveFontSize(2),
        width:responsiveWidth(80),
    }
})