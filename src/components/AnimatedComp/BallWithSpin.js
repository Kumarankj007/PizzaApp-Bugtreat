import {StyleSheet, View, Dimensions, Animated, Text} from 'react-native';
import React from 'react';
import spinner from './Spinner';
import appColors from '../../Utilities/appColors';
import { Icon } from '../../Utilities/icon';

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

  const appColor = appColors()

  return (
    <Animated.View style={[styles.container, containerStyle ,{transform: [{rotate: spin}]}]}>
      {/* <Animated.View style={[style, {transform: [{rotate: spin}]}]} /> */}
      {/* {imgSrc != null && (
        <Animated.Image
          resizeMode={'contain'}
          source={!localImg ? imgSrc : {uri: imgSrc}}
          style={[imgStyle, {transform: [{rotate: spin}]}]}
        />
      )} */}
      <Icon
        ComponentName={'FontAwesome'}
        name={'spinner'}
        color={appColor.primary}
        size={50}
      />

    </Animated.View>
  );
};

export default BallWithSpin;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignSelf: 'center',
  },
});
