import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import appColors from '../../Utilities/appColors';
import {CountryPicker} from 'react-native-country-codes-picker';

const CountryPick = ({Show, backPress = () => {}, onPick, country}) => {
  const appColor = appColors();
  return (
    <View>
      <CountryPicker
        show={Show}
        style={{
          modal: {
            height: widthResponse ? 300 : 400,
          },
          dialCode: {
            display: 'none',
          },
          textInput: {
            display: 'none',
          },
          countryName: {
            fontFamily: appFont.lR,
            color: appColor.black,
            fontSize: fontScalling(2),
            lineHeight: fontScalling(2.2),
          },
        }}
        onBackdropPress={backPress}
        onRequestClose={backPress}
        showOnly={country}
        pickerButtonOnPress={onPick}
      />
    </View>
  );
};

export default CountryPick;

const styles = StyleSheet.create({});
