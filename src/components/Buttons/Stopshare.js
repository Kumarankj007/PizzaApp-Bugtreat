import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {widthResponse} from '../../Utilities/helperFunction';
import {Icon} from '../../Utilities/icon';

const Stopshare = ({style, text, onPress = () => {}}) => {
  const [hover, setHover] = useState(false);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  return (
    <Pressable
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      style={[
        {
          // width: widthResponse ? 40 : 50,
          // height: widthResponse ? 40 : 50,
          padding: widthResponse ? 8 : 14,
          borderRadius: widthResponse ? 40 : 50,
          backgroundColor: hover ? appColor.primary : appColor.bgWhite,
          flexDirection: 'row',
          // justifyContent: 'center',
          alignItems: 'center',

          elevation: 5,
        },
        style,
        commenStyle.shadow,
      ]}
      onPress={onPress}>
      <Icon
        ComponentName={'MaterialCommunityIcons'}
        name={'share-off'}
        color={!hover ? appColor.primary : appColor.bgWhite}
        size={widthResponse ? 23 : 27}
      />
      <Text
        style={[
          commenStyle.authPara,
          {
            marginBottom: 0,
            color: !hover ? appColor.primary : appColor.bgWhite,
            marginLeft: 8,
          },
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};

export default Stopshare;

const styles = StyleSheet.create({});
