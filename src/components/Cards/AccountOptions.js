import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {
  Capitalize,
  fontScalling,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import {Icon} from '../../Utilities/icon';

const AccountOptions = ({
  onPress = () => {},
  text,
  component,
  name,
  size = widthResponse ? 19 : 24,
  border = false,
  spaceBottom = true,
}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const [hover, setHover] = useState(false);
  const bottomSpace = widthResponse ? 10 : 18;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      style={[
        commenStyle.hFlex,
        {
          paddingBottom: spaceBottom ? bottomSpace : 0,
          borderBottomColor: appColor.borderColor,
          borderBottomWidth: !border ? 1 : 0,
          marginBottom: spaceBottom ? bottomSpace : 0,
        },
      ]}>
      {/* left icon */}
      <View
        style={
          {
            // marginTop: 4
          }
        }>
        <Icon
          ComponentName={component}
          name={name}
          size={size}
          color={hover ? appColor.primary : appColor.black}
        />
      </View>
      {text && (
        <Text
          style={{
            fontFamily: appFont.lB,
            color: hover ? appColor.primary : appColor.black,
            fontSize: fontScalling(2.3),
            paddingRight: 15,
            flex: 1,
            marginLeft: 10,
          }}>
          {Capitalize(text)}
        </Text>
      )}
      {/* right icon */}
      <View
        style={{
          marginTop: 4,
        }}>
        <Icon
          ComponentName={'Feather'}
          name={'chevron-right'}
          size={widthResponse ? 24 : 28}
          color={hover ? appColor.primary : appColor.black}
        />
      </View>
    </Pressable>
  );
};

export default AccountOptions;

const styles = StyleSheet.create({});
