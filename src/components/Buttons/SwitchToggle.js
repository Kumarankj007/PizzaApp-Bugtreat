import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import * as Animatable from 'react-native-animatable';
import appColors from '../../Utilities/appColors';
import { widthResponse } from '../../Utilities/helperFunction';

const Toggle = ({
    onPress,
    isActive,
    type = 'default',
    style
}) => {
    const appColor = appColors()
    let background = ''
    let thumb = ''
    

    switch (type) {
        case 'green':
            background = isActive ? appColor.paid : appColor.smokeBack
            thumb = !isActive ? appColor.paid : appColor.white
            break;
        case 'default':
            background = isActive ? appColor.primary : appColor.smokeBack
            thumb = !isActive ? appColor.primary : appColor.white
            break;
        case 'lightGreen':
            background = isActive ? appColor.paid : appColor.bgWhite
            thumb = !isActive ? appColor.paid : appColor.white
    }

    

  return (
    <View style={[style]}>
      <Pressable
      onPress={onPress}
      style={[{
        padding: 4,
        backgroundColor: background,
        // backgroundColor:appColor.primary ,
        borderRadius: 30,
        width: widthResponse ? 50 : 90,
        justifyContent:'center',
      }]}>
      <Animatable.View
      animation={{
        from: { translateX: widthResponse ? (isActive ? 0 : 23) : (isActive ? 0 : 45) },
        to: { translateX: widthResponse ? (isActive ? 23 : 0) : (isActive ? 45 : 0) },
      }}
        style={{
          width: widthResponse ? 17 : 35,
          height: widthResponse ? 17 : 35,
          borderRadius: 50,
          backgroundColor: thumb,
        }}
        duration={400} easing={'ease'}></Animatable.View>
    </Pressable>
    </View>
  );
};

export default Toggle;

const styles = StyleSheet.create({});