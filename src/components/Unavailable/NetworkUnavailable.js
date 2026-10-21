import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import {
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import appColors from '../../Utilities/appColors';
import LottieView from 'lottie-react-native';

const NetworkUnavailable = () => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  return (
    <View
      style={[
        commenStyle.container,
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={'transparent'}
        translucent
      />
      <LottieView
        source={require('../../../assets/lottiefiles/unavailable.json')}
        autoPlay={true}
        loop={true}
        style={{
          width: scrnWidth - 100,
          height: scrnWidth - 100,
        }}
      />
      <Text
        style={[
          {
            fontSize: fontScalling(widthResponse ? 3.2 : 2.8),
            fontFamily: appFont.lB,
            color: appColor.black,
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: fontScalling(1.5),
          },
        ]}>
        Network <Text style={{color: appColor.primary}}>Unavailable!!!</Text>
      </Text>
      <Text>Please connect to the Network</Text>
    </View>
  );
};

export default NetworkUnavailable;

const styles = StyleSheet.create({});
