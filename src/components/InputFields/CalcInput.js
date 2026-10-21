import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';

const CalcInput = ({
  width,
  contstyle,
  unitShow,
  unit,
  value,
  inputStyle,
  white = false,
  onChangeText = () => {},
  formError,
}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  return (
    <View style={[{width: width}, contstyle]}>
      <View style={[commenStyle.hFlex]}>
        <TextInput
          style={[
            {
              backgroundColor: white ? appColor.white : appColor.primaryLight,
              padding: widthResponse ? 5 : 8,
              height: widthResponse ? 40 : 45,
              borderRadius: 15,
              width: 55,
              textAlign: 'center',
              color: appColor.black,
            },
            inputStyle,
          ]}
          value={value}
          keyboardType="numeric"
          // onChangeText={onChangeText}
          onChangeText={e => {
            const sanitized = e
              .replace(/[^0-9.]/g, '') // Remove anything that's not a digit or dot
              .replace(/(\..*?)\..*/g, '$1');
            onChangeText(sanitized);
          }}
        />
        {unitShow ? (
          <Text
            style={{
              paddingLeft: 5,
              fontFamily: appFont.lR,
              color: appColor.black,
              fontSize: fontScalling(1.8),
              lineHeight: fontScalling(2.3),
            }}>
            {unit}
          </Text>
        ) : null}
      </View>
      {/* form errors */}
      {formError && (
        <Text
          style={{
            marginTop: 3,
            marginLeft: 3,
            color: appColor.formError,
            fontSize: fontScalling(1.45),
            fontFamily: appFont.lR,
          }}>
          {formError.message}
        </Text>
      )}
    </View>
  );
};

export default CalcInput;

const styles = StyleSheet.create({});
