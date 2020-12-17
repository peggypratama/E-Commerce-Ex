import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { responsiveHeight, responsiveWidth,responsiveFontSize } from 'react-native-responsive-dimensions';

export default class Chat extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>

        
          <LinearGradient start={{x: 0, y: 0}} end={{x:1.3, y: 0}} colors={['#008080', '#4c516d']} style={{flex:0.50, justifyContent:'center',flexDirection:'row'}}>
          <View style={{flex:1, justifyContent:'center', position:'relative', zIndex:2}}>
           <TouchableOpacity onPress={() => this.props.navigation.navigate('Account')} style={{paddingHorizontal:responsiveWidth(3)}}>
              <FontAwesome5 name={'arrow-left'} color={'#ffffff'} size={responsiveHeight(4)}/>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1.5, justifyContent:'center'}}>
            <Text style={styles.text}>About Us</Text>
          </View>
          </LinearGradient>
         
         
          <View style={{flex:5.5 ,paddingVertical:responsiveHeight(2)}}>
              <ScrollView>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>It’s often the first stop in any user’s journey through a website or blog.</Text>
          <Text style={styles.txt}>It also shouldn’t be their last, because first impressions count online just as much as they do in the real world.</Text>
          <Text style={styles.txt}>If your visitors aren’t impressed, you can expect them to leave without reading your awesome content or completing a conversion action (e.g., signing up for your newsletter, making a purchase).</Text>
          <Text style={styles.txt}>What Makes a Solid ‘About Us’ Page?</Text>
          <Text style={styles.txt}>Informative. It doesn’t always have to tell the whole story, but it should at least provide people with an idea of who and what you are.</Text>
          <Text style={styles.txt}>Contain social proof, testimonials, and some personal information that viewers can relate to such as education, family, etc.</Text>
          <Text style={styles.txt}>Useful and engaging.</Text>
          <Text style={styles.txt}>Easy to navigate and accessible on any device.</Text>
          <Text style={styles.txt}>That may all sound complicated, but it really isn’t.</Text>
          <Text style={styles.txt}>The main purpose of your About Us page is to give visitors a glimpse into the identity of either a person or business.</Text>
          <Text style={styles.txt}>As users discover your brand, they need to distinguish what sets you apart and makes you… you.</Text>
          <Text style={styles.txt}>This often requires finding the right balance between compelling content and a design carefully planned to look the part.</Text>
          <Text style={styles.txt}>Conveying your identity in a fun and approachable – but also reliable and informative – way is challenging.</Text>
          <Text style={styles.txt}>If you know who you are and your goal for your site, the About Us page should come naturally.</Text>
          <Text style={styles.txt}>However, if you’re looking for some inspiration, you can always check out these 25 examples of creative and engaging About Us pages.</Text>
          <Text style={styles.txt}>These excellent examples will help you build a personal and engaging website journey.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          <Text style={styles.txt}>About Us page is vital.</Text>
          </ScrollView>
          </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  text:{
    fontSize:responsiveFontSize(3),
    color:'white'
  },
  iconCat: {
    height:responsiveHeight(10),
    width:responsiveWidth(20),
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center' 
  },
  box:{
    flex: 0.5,
    backgroundColor:'white',
    borderColor:'#989898',
    borderTopWidth:1,
  },
  txt:{
    fontSize:responsiveFontSize(1.9)
  }
});  