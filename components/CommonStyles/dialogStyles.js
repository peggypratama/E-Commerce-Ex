import { StyleSheet } from 'react-native'
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const dialogStyles=StyleSheet.create({
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
    },
});

export default dialogStyles