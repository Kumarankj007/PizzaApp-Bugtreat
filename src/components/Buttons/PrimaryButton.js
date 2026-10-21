import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../Utilities/appColors';
import {appFont} from '../../Utilities/appFont';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {Icon} from '../../Utilities/icon';

const PrimaryButton = ({
  text,
  onPress = () => {},
  shadow,
  style,
  modal,
  invert = false,
  recipe,
  iconName,
  iconSize,
  iconComponent,
  fontSize,
}) => {
  const [hover, setHover] = useState(false);
  const appColor = appColors();
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      style={[
        {
          backgroundColor: invert
            ? hover
              ? appColor.primary
              : appColor.black
            : hover
            ? appColor.bgBlack
            : appColor.primary,
          paddingVertical: modal ? 9 : recipe ? 11 : widthResponse ? 13 : 16,
          paddingHorizontal: recipe ? 10 : 20,
          borderRadius: recipe ? 10 : 15,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          elevation: shadow && 50,
          shadowColor: shadow && appColor.black,
        },
        style,
      ]}>
      {iconName && iconName != '' && (
        <View style={{marginRight: widthResponse ? 5 : 10}}>
          <Icon
            ComponentName={iconComponent}
            name={iconName}
            size={iconSize}
            color={appColor.white}
          />
        </View>
      )}
      <Text
        style={{
          textAlign: 'center',
          color: appColor.white,
          fontFamily: appFont.lBl,
          fontSize: recipe
            ? fontScalling(1.8)
            : fontSize
            ? fontSize
            : fontScalling(2),
          textTransform: 'uppercase',
        }}>
        {text}
      </Text>
    </Pressable>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({});
