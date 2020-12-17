import { StyleSheet } from 'react-native'
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const dashboardStyles=StyleSheet.create({
    addCard:{
        height:100,
        width:responsiveWidth(45),
        marginVertical:responsiveHeight(0.5)
    },
    floatingDock:{
        backgroundColor:'red',
        position: 'absolute',
        width:responsiveWidth(15),
        height:responsiveHeight(7.5),
        borderRadius:responsiveHeight(10),
        alignItems: 'center',
        justifyContent: 'center',
        elevation:15,
        top:responsiveHeight(10),
        left:responsiveWidth(81), 
    },
    card:{
        flex:1,
        shadowColor: '#00000021',
        shadowOffset: {
          width: 0,
          height: responsiveHeight(1),
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        backgroundColor:"white",
        marginHorizontal: responsiveWidth(2),
        paddingVertical:responsiveHeight(1),
        marginVertical:responsiveHeight(2)
    },
    relatedAdsCard:{
        justifyContent:'center',
        alignItems:'center'
    },
    cardHeader:{
        height:responsiveHeight(30),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'stretch',
        paddingVertical:responsiveHeight(2),
        paddingHorizontal: responsiveWidth(3),
    },
    cardTitle:{
        flex:1,
        fontSize:responsiveFontSize(2),
        color:"#4c516d",
        fontWeight:'bold',
        paddingHorizontal:responsiveWidth(4.5)
    },
    menuBox:{
        flex:1,
        width:responsiveWidth(30),
        height:responsiveHeight(18),
        borderRadius:responsiveHeight(1),
        marginHorizontal:responsiveWidth(1),
        paddingVertical:responsiveHeight(2),
        alignItems:'center',
        justifyContent:'center',
        shadowColor:'black',
        shadowOpacity: .2,
        shadowOffset: {
            height:2,
            width:-2
        },
        elevation:4,
    },
    info:{
        flex:1,
        fontSize:responsiveFontSize(1.8),
        alignItems:'center',
        justifyContent:'center',
        textAlign:'center',
        paddingHorizontal:responsiveWidth(2)
    },
    thumbnail: {
        flex:3,
        resizeMode:'contain',
    },
});

export default dashboardStyles