import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {scrnWidth} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';

const Empty = () => {
  const appColor = appColors();
  return (
    <View
      style={{
        flex: 1,
        zIndex: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColor.bgWhite,
      }}>
      {/* statusbar */}
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={'transparent'}
      />
      <LottieView
        source={require('../../../assets/lottiefiles/Empty1.json')}
        autoPlay
        loop={false}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({});
