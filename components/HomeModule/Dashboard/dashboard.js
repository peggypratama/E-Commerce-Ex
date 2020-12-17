import React, { Component } from "react";
import { Text, View, TextInput, StyleSheet, Image, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import MainHeader from '../../CommonModules/MainHeader/mainHeader'
import CategoryButton from './categoryButton'
import RentSaleButton from './rentSaleButton'
import DefaultAdCard from '../../CommonModules/DefaultAdCard/defaultAdCard'
import dashboardStyles from '../../CommonStyles/dashboardStyles'

import { FloatingAction } from "react-native-floating-action";

import { getDashboardAds, getHotAds, getFirestoreUserByUid } from '../../Utility/utility'

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filePath: {}, type: 'Rent', category: '', ads: [],
      hotAds: [], tempAllAds: [], tempHotAds: [], refreshing: true,
      isLoading: true
    };
    this.actions = [
      {
        text: "New Electronic Device",
        icon: <MaterialIcons name={'speaker'} color={'white'} size={responsiveHeight(3)} />,
        name: "Electronic Device",
        position: 2,
        color: '#008080',
        textBackground: '#4c516d',
        textColor: 'white'
      },
      {
        text: "New Hardware",
        icon: <Octicons name={'tools'} color={'white'} size={responsiveHeight(2.6)} />,
        name: "Hardware",
        position: 1,
        color: '#008080',
        textBackground: '#4c516d',
        textColor: 'white'
      },
      {
        text: "New House",
        icon: <Ionicons name={'ios-home'} color={'white'} size={responsiveHeight(3)} />,
        name: "NewHouseAd",
        position: 3,
        color: '#008080',
        textBackground: '#4c516d',
        textColor: 'white'
      },
      {
        text: "New Vehicle",
        icon: <Fontisto name={'car'} color={'white'} size={responsiveHeight(3)} />,
        name: "NewVehicleAd",
        position: 4,
        color: '#008080',
        textBackground: '#4c516d',
        textColor: 'white'
      }
    ];
  }

  componentWillMount = async () => {
    await getDashboardAds().then(async ads => {
      this.setState({ ads: ads })
      let arr = []
      await ads.forEach(async obj => {
        await getHotAds(obj.docID, obj.docData).then(hotObj => {
          if (hotObj) {
            arr.push(hotObj)
            this.setState({ hotAds: arr })
          }
        })
      })
      this.filterAds()
    })
    await getFirestoreUserByUid(this.state.adObj['uid']).then(async user => {
      this.setState({ adUserFirestoreObj: user[1] })
    }).catch(err => console.log(err))
  }

  filterAds = () => {
    let ta =  this.state.ads.filter(ele => { return ele.docData['Type'] == this.state.type })
    let tha = this.state.hotAds.filter(ele => { return ele.docData['Type'] == this.state.type })
    if (this.state.category != '') {
      ta = ta.filter(ele => { return ele.docData['Category'] == this.state.category })
      tha = tha.filter(ele => { return ele.docData['Category'] == this.state.category })
    }
    this.setState({
      tempAllAds: ta,
      tempHotAds: tha
    })
  }

  gotoAd = (adObj, reviewObj, myReview, updateReviews, pageType, adID) => {
    this.props.navigation.navigate('Ads', {
      'adObj': adObj,
      'reviewObj': reviewObj,
      'myReview': myReview,
      'updateReviews': updateReviews,
      'pageType': pageType,
    })
  }

  renderAllAds = () => {
    let margin = 2
    if (this.state.tempHotAds.length)
      margin = -2
    return (
      <View style={[dashboardStyles.card, { marginTop: responsiveHeight(margin) }]}>
        <Text style={[dashboardStyles.cardTitle, { marginBottom: responsiveHeight(1) }]}>Other Ads</Text>
        <FlatList
          data={this.state.tempAllAds}
          extraData={this.state.tempAllAds}
          initialNumToRender={2}
          refreshing={true}
          renderItem={({ item }) =>
            <DefaultAdCard
              adID={item.docID}
              data={item.docData}
              pageType={'normal'}
              radius={responsiveHeight(3)}
              thumbnailWidth={responsiveWidth(88.5)}
              width={responsiveWidth(90)}
              margin={responsiveHeight(1)}
              action={this.gotoAd}
            />}
          keyExtractor={item => item.docID}
        />
      </View>
    )
  }

  renderHotAds = () => {
    return (
      <View style={dashboardStyles.card}>
        <Text style={dashboardStyles.cardTitle}>Hot Ads</Text>
        <View style={[dashboardStyles.cardHeader, { height: responsiveHeight(35) }]}>
          <FlatList
            horizontal={true}
            data={this.state.tempHotAds}
            extraData={this.state.tempHotAds}
            initialNumToRender={2}
            refreshing={true}
            renderItem={({ item }) =>
              <DefaultAdCard
                adID={item.docID}
                data={item.docData}
                pageType={'normal'}
                radius={responsiveHeight(3)}
                thumbnailWidth={responsiveWidth(52.5)}
                width={responsiveWidth(54)}
                action={this.gotoAd}
              />}
            keyExtractor={item => item.docID}
          />
        </View>
      </View>
    )
  }

  render() {
    let ads, hotAds;
    if (this.state.tempHotAds.length)
      hotAds = this.renderHotAds()
    else
      hotAds = null
    if (this.state.tempAllAds.length)
      ads = this.renderAllAds()
    else
      ads = null
    return (
      <View style={{ flex: 1 }}>
        <ParallaxScrollView
          backgroundColor="white"
          isLoading={true}
          refreshing={true}
          contentBackgroundColor="transparent"
          parallaxHeaderHeight={responsiveHeight(25)}
          stickyHeaderHeight={responsiveHeight(9.9)}
          contentContainerStyle={{ flex: 1 }}
          renderForeground={() => (
            <CategoryButton
              flexSize={1}
              value={this.state.category}
              updateParent={async val => {
                await this.setState({ category: val })
                this.filterAds()
              }}
            />
          )}
          renderFixedHeader={() => (
            <MainHeader
              flexSize={1}
              enablelogin={true}
              enableSearch={true}
              loginAction={() => this.props.navigation.navigate('Login')}
              searchAction={() => this.props.navigation.navigate('Search')}
            />
          )}
        >
          <View style={{ flex: 1 }}>
            <RentSaleButton
              value={this.state.type}
              updateParent={async val => {
                await this.setState({ type: val })
                this.filterAds()
              }}
              flexSize={1}
            />
            {hotAds}
            {ads}
          </View>



        </ParallaxScrollView>

        <FloatingAction
          buttonSize={responsiveHeight(8)}
          style={styles.floatingDock}
          color={'#008080'}
          actions={this.actions}
          onPressItem={name => {
            if (name == 'Electronic Device' || name == 'Hardware')
              this.props.navigation.navigate('NewElectronicHardwareAd', { 'category': name })
            else
              this.props.navigation.navigate(name)
          }}
          distanceToEdge={responsiveWidth(5)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  floatingDock: {
    backgroundColor: '#008080',
    position: 'absolute',
    width: responsiveWidth(14.5),
    height: responsiveHeight(7.5),
    borderRadius: responsiveHeight(10),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 15,
    top: responsiveHeight(80),
    left: responsiveWidth(81),
  },
  floatingDockContent: {
    backgroundColor: '#008080',
    position: 'absolute',
    width: responsiveWidth(14.5),
    height: responsiveHeight(7.5),
    borderRadius: responsiveHeight(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesHeading: {
    flex: 1,
    paddingLeft: responsiveWidth(4),
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#008080'
  },
  menuBoxCat: {
    backgroundColor: "white",
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: .2,
    borderRadius: 50,
    shadowOffset: {
      height: 2,
      width: -2
    },
    elevation: 4,
  },
  iconCat: {
    width: responsiveWidth(8),
    height: responsiveHeight(4),
  },
  info: {
    paddingVertical: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.5),
  },
})