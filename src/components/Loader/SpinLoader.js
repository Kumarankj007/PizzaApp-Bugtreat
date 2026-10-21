import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../Utilities/appColors';
import LottieView from 'lottie-react-native';
import {scrnWidth, widthResponse} from '../../Utilities/helperFunction';

const SpinLoader = () => {
  const appColor = appColors();
  return (
    <View
      style={{
        alignSelf: 'center',
        // backgroundColor:appColor.black,
      }}>
      <LottieView
        source={require('../../../assets/lottiefiles/spinner.json')}
        autoPlay
        speed={1.3}
        style={{
          width: widthResponse ? 120 : 170,
          height: widthResponse ? 120 : 170,
        }}
      />
    </View>
  );
};

export default SpinLoader;

const styles = StyleSheet.create({});
