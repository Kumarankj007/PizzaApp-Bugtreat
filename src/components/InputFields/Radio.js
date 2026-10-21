import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { fontScalling, print, widthResponse } from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import { appFont } from '../../Utilities/appFont';

const Radio = ({options, value, onchange = () => {}, style}) => {
  const appColor = appColors()
  const final_options = options.map(item => {
    return {
      label: item,
      value: item,
    };
  });

  return (
    <>
      <View style={[style]}>
        {final_options.map((opt,index) => {
          const checked = value == opt.value;
          return (
            <TouchableOpacity
              onPress={() => onchange(opt.value)}
              key={opt.value}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: widthResponse ? 15 : 20,
                paddingVertical:widthResponse ? 2 :5,
              }}>
              <Text
              numberOfLines={1}
                style={{
                  fontFamily: appFont.lR,
                  color: appColor.black,
                  fontSize: fontScalling(2),
                  paddingRight:10,
                  flex:1
                }}>
                {opt.label}
              </Text>
              <View
                style={{
                  width: widthResponse ? 17 : 28,
                  height: widthResponse ? 17 : 28,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: checked ? appColor.primary : appColor.boldBlacktext,
                  overflow: 'hidden',
                }}>
                {checked && (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: appColor.primary,
                      margin: widthResponse ? 2 : 5,
                      borderRadius: 50,
                    }}></View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

export default Radio;

const styles = StyleSheet.create({});
