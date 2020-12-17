import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { responsiveHeight, responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import Home from './home'
import AdList from './adList'

const TabNavigator = createMaterialTopTabNavigator(
    {
        Home:Home,
        Ads:AdList
    },
    {
        navigationOptions:{
            swipeEnabled:true,
        },
        tabBarOptions: {
            activeTintColor: 'white',
            inactiveTintColor: 'silver',
            labelStyle: {
                fontSize: responsiveFontSize(2),
            },
            tabStyle: {
                width: responsiveWidth(50),
            },
            style: {
                backgroundColor: '#008080',
            },
            indicatorStyle:{
                backgroundColor:'white',
                height:responsiveHeight(0.4)
            }
        }
    }
);

const Navbar = createAppContainer(TabNavigator) 
export default Navbar