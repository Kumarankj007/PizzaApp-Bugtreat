import React from 'react';
import {View, Text, TouchableNativeFeedback, StyleSheet} from 'react-native';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import Touchable from '../RippleEffect/Touchable';
import {appFont} from '../../Utilities/appFont';

export default NavButton = ({
  title,
  activeButtons,
  onPress = () => {},
  altStyle,
  dual = false,
  four = false,
  keyType = false,
}) => {
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const appColor = appColors();
  return (
    <View style={[commenStyle.authNavContainer, {flexWrap: 'wrap'}, altStyle]}>
      {title &&
        title.length > 0 &&
        title.map((item, index) => {
          return keyType ? (
            item?.value != 0 && (
              <Touchable
                key={index}
                onPress={() => onPress(item.key)}
                parentStyle={{
                  borderRadius: 20,
                  marginRight:
                    title.length != index + 1 ? (widthResponse ? 5 : 8) : 0,
                }}
                childStyle={{
                  padding: 10,
                  minWidth: dual
                    ? scrnWidth / 3
                    : four
                    ? scrnWidth / 6
                    : scrnWidth / 4,
                  paddingHorizontal: four ? 10 : 10,
                  backgroundColor:
                    activeButtons == item?.key
                      ? appColor.primary
                      : appColor.bgBlack,
                }}>
                {item?.tab_title && (
                  <Text
                    style={[
                      {
                        textAlign: 'center',
                        fontFamily: appFont.lB,
                        color: appColor.textWhite,
                        fontSize: fontScalling(1.8),
                      },
                    ]}>
                    {item.tab_title}
                  </Text>
                )}
              </Touchable>
            )
          ) : (
            <Touchable
              key={index}
              onPress={() => (keyType ? onPress(item.key) : onPress(index))}
              parentStyle={{
                borderRadius: 20,
                marginRight:
                  title.length != index + 1 ? (widthResponse ? 5 : 8) : 0,
              }}
              childStyle={{
                padding: 10,
                minWidth: dual
                  ? scrnWidth / 3
                  : four
                  ? scrnWidth / 6
                  : scrnWidth / 4,
                paddingHorizontal: four ? 7 : 15,
                backgroundColor:
                  activeButtons == index ? appColor.primary : appColor.bgBlack,
              }}>
              {item?.tab_title && (
                <Text
                  style={[
                    {
                      textAlign: 'center',
                      fontFamily: appFont.lB,
                      color: appColor.textWhite,
                      fontSize: fontScalling(1.8),
                    },
                  ]}>
                  {item.tab_title}
                </Text>
              )}
            </Touchable>
          );
        })}
    </View>
  );
};

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({});
  return {styles};
};
