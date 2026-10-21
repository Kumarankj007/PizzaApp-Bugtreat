import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {appFont} from '../../Utilities/appFont';

const Review = ({review, style}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  return (
    <View style={[commenStyle.hFlex, {marginRight: 10}, style]}>
      <Image
        resizeMode="contain"
        source={require('../../../assets/images/review_logo.png')}
        style={{
          width: widthResponse ? 10 : 17,
          aspectRatio: 0.5,
          marginRight: 4,
        }}
      />
      <Text
        style={[
          commenStyle.authSubButton,
          {fontFamily: appFont.lR, fontSize: fontScalling(1.8)},
        ]}>
        {review}
      </Text>
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({});
