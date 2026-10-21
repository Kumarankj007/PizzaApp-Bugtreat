import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  Capitalize,
  fontScalling,
  getFlag,
  widthResponse,
} from '../../Utilities/helperFunction';

const Country = ({style, country, flag, textStyle}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  return (
    <View style={[commenStyle.hFlex, {}, style]}>
      {flag && (
        <Image
          source={flag}
          style={{
            width: widthResponse ? 15 : 25,
            height: widthResponse ? 15 : 25,
            borderRadius: 50,
            overflow: 'hidden',
            marginRight: 5,
          }}
        />
      )}

      {country && (
        <>
          <Text style={{fontSize: fontScalling(2.1)}}>
            {country != '' && getFlag(country)}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              commenStyle.para,
              {
                color: appColor.primary,
                marginBottom: 0,
                marginLeft: 5,
                // flex: 1,
              },
              textStyle,
            ]}>
            {Capitalize(country)}
          </Text>
        </>
      )}
    </View>
  );
};

export default Country;

const styles = StyleSheet.create({});
