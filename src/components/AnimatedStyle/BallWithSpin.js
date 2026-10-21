import {StyleSheet, View, Dimensions, Animated, Text} from 'react-native';
import React from 'react';
import spinner from './Spinner';
import {scrnWidth} from '../../utilities/helperFunction';
import {Icon} from '../../Utilities/icon';
import appColors from '../../Utilities/appColors';
import { widthResponse } from '../../Utilities/helperFunction';

const {width, height} = Dimensions.get('screen');

const BallWithSpin = ({
  style = {},
  imgSrc = null,
  imgStyle = {},
  duration,
  containerStyle = {},
  localImg = false,
}) => {
  const spin = spinner('clock', duration);
  const antiSpin = spinner('anti', duration);
  const appColor = appColors();

  return (
    <Animated.View
      style={[
        {
          transform: [{rotate: spin}],
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: appColor.TextInputborderbg,
          borderRadius: 50,
          width:widthResponse ? 35 : 60,
          height:widthResponse ? 35 : 60
        },
      ]}>
      <Icon
        ComponentName={'EvilIcons'}
        name={'spinner'}
        color={appColor.white}
        size={24}
      />
    </Animated.View>
  );
};

export default BallWithSpin;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
