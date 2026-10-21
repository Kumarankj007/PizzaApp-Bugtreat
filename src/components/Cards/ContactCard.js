import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {Icon} from '../../Utilities/icon';
import * as Animatable from 'react-native-animatable';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {SvgUri} from 'react-native-svg';

const ContactCard = ({
  color,
  component,
  name,
  size,
  label,
  value,
  style,
  icon,
}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  return (
    <Pressable
      style={[
        commenStyle.hFlex,
        {
          marginBottom: fontScalling(2),
        },
        style,
      ]}>
      <View
        // animation={'zoomIn'}
        // duration={1000}
        style={[commenStyle.contactCircle]}>
        {icon && (
          <SvgUri
            uri={icon}
            fill={appColor.white}
            width={widthResponse ? 20 : 30}
          />
        )}
      </View>
      <View
        style={{
          marginLeft: 10,
        }}>
        {label && (
          <Text
            style={[
              commenStyle.sideHead,
              {
                fontSize: fontScalling(2.1),
                marginBottom: 5,
              },
            ]}>
            {label}
          </Text>
        )}
        {value && (
          <Text
            style={[
              commenStyle.para,
              {
                // fontSize:fontScalling(2.1),
                marginBottom: 0,
              },
            ]}>
            {value}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default ContactCard;

const styles = StyleSheet.create({});
