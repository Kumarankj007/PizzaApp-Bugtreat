import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Grain from '../../../assets/images/tree.svg';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {fontScalling} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import {LocalSvg} from 'react-native-svg';

const Ratings = ({counts = 3, rating, onPress = () => {}, style, errors}) => {
  const total = [...Array(5).keys()].map((_, index) => index + 1);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  return (
    <View
      style={[
        commenStyle.hFlex,
        {
          // backgroundColor:appColor.TextInputborderbg
        },
        style,
      ]}>
      {total.map((_, index) => (
        <Pressable
          key={index}
          onPress={rating ? () => onPress(index) : onPress}>
          <LocalSvg
            asset={require('../../../assets/images/tree.svg')}
            width={rating ? 20 : 15}
            height={rating ? 40 : 30}
            fill={counts >= index + 1 ? 'yellow' : 'transparent'}
            stroke={
              counts >= index + 1 ? appColor.primary : appColor.boldBlacktext
            }
          />
        </Pressable>
      ))}
      {/* form errors */}
      {errors && (
        <Text
          style={{
            marginTop: 3,
            marginLeft: 10,
            color: appColor.formError,
            fontSize: fontScalling(1.45),
            fontFamily: appFont.lR,
          }}>
          {errors.message}
        </Text>
      )}
    </View>
  );
};

export default Ratings;

const styles = StyleSheet.create({});
