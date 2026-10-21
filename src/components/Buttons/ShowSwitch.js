import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';

const ShowSwitch = ({
  title,
  yesText,
  noText,
  value,
  activeButton = () => {},
  style,
}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const [active, setActive] = useState(value);

  return (
    <View
      style={[
        commenStyle.hFlex,
        {
          justifyContent: 'space-between',
          marginBottom: widthResponse ? 15 : 20,
        },
        style,
      ]}>
      {title && (
        <Text
          style={[
            commenStyle.para,
            {
              fontSize: fontScalling(2),
              marginBottom: 0,
              flex: 1,
            },
          ]}>
          {title}
        </Text>
      )}

      <View
        style={[
          commenStyle.hFlex,
          {
            padding: widthResponse ? 8 : 12,
            backgroundColor: appColor.cardbg,
            borderRadius: 20,
          },
        ]}>
        {/* Yes Button */}
        <Pressable
          onPress={() => {
            setActive(1);
            activeButton(1);
          }}
          style={{
            paddingHorizontal: widthResponse ? 20 : 25,
            backgroundColor: active === 1 ? appColor.primary : appColor.bgWhite,
            paddingVertical: widthResponse ? 7 : 10,
            borderRadius: 20,
            marginRight: 7,
          }}>
          <Text
            style={{
              fontFamily: appFont.lBl,
              fontSize: fontScalling(1.7),
              color: active === 1 ? appColor.white : appColor.black,
              textTransform: 'uppercase',
            }}>
            {yesText}
          </Text>
        </Pressable>

        {/* No Button */}
        <Pressable
          onPress={() => {
            setActive(2);
            activeButton(2);
          }}
          style={{
            paddingHorizontal: widthResponse ? 20 : 25,
            backgroundColor: active === 2 ? appColor.primary : appColor.bgWhite,
            paddingVertical: widthResponse ? 7 : 10,
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontFamily: appFont.lBl,
              fontSize: fontScalling(1.7),
              color: active === 2 ? appColor.white : appColor.black,
              textTransform: 'uppercase',
            }}>
            {noText}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ShowSwitch;

const styles = StyleSheet.create({});
