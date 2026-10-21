import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import appColors from '../../Utilities/appColors'
import { scrnHeight, scrnWidth, widthResponse } from '../../Utilities/helperFunction'
import LottieView from 'lottie-react-native'

const PageLoader = () => {
    const appColor = appColors()

  return (
    <View
        style={{
            width:scrnWidth,
            height:scrnHeight,
            flex:1,
            zIndex:30,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:appColor.loadOverlay
            // backgroundColor:appColor.black,
            // position:'absolute',
            // top:0,
            // right:0,
            // left:0,
            // bottom:0
        }}
    >
      {/* statusbar */}
      <StatusBar barStyle={'dark-content'} translucent backgroundColor={'transparent'} />
      <LottieView
        source={require('../../../assets/lottiefiles/Loader2.json')}
        autoPlay
        style={{
            width: widthResponse ? '100%' : '60%',  //@@
            height:'100%',
        }}
      />
    </View>
  )
}

export default PageLoader

const styles = StyleSheet.create({})