import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
// file import:

import {appFont} from '../../Utilities/appFont';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {Icon} from '../../Utilities/icon';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';

export function InputText({
  formError,
  label,
  placeholder,
  icon,
  iconName,
  iconSize,
  row,
  onChangeText,
  value,
  keyboardType,
  onFocus,
  onBlur,
  ref,
  dark = false,
  numberOfLines,
  multiline = false,
  autoFocus,
  maxLength,
  editable,
  secureTextEntry,
  leftIcon,
  custom,
  path,
  imgFill,
  textVertical,
  required,
  noelevation,
  onPressLeft = () => {},
  onPress = () => {},
  unLink = () => {},
  onPressTextInput = () => {},
  rightIcon,
  iconRightName,
  onPressRight = () => {},
  unLinkComponent = false,
  autoCapitalize = true,
  login = false,
  customStyle,
  dialProp = [
    {
      emoji: '🇮🇳',
      name: 'India',
      phone: '+91',
      phoneLength: 10,
    },
    () => {},
  ],
  labelCenter,
  bgWhite = false,
  iconrightSize,
  photo,
  borderRadius = 20,
  uploadText,
  onUploadPress,
  tagerror,
  inputStyle = {},
  containerStyle = {},
}) {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const [visible, setVisible] = useState(secureTextEntry);

  return (
    <View
      style={[
        {paddingBottom: widthResponse ? 13 : 14},
        customStyle,
        {
          position: 'relative',
        },
      ]}>
      {/* label */}
      {label && (
        <Text
          style={{
            color: dark ? appColor.textWhite : appColor.black,
            fontFamily: appFont.lB,
            paddingBottom: widthResponse ? 7 : 12,
            fontSize: fontScalling(2),
            textAlign: labelCenter ? 'center' : 'left',
            marginBottom: labelCenter ? 5 : 0,
          }}>
          {label}
          {required && <Text style={{color: appColor.textBlack}}> *</Text>}
        </Text>
      )}
      {/* input field */}
      <Pressable
        onPress={onPress}
        style={[
          {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingVertical: 3,
            paddingHorizontal: 15,
            paddingRight: photo ? 5 : 15,
            backgroundColor: dark
              ? appColor.inputBackDark
              : bgWhite
              ? appColor.bgWhite
              : appColor.cardbg,
            borderRadius: borderRadius, //@@
            // opacity: custom ? 1 : 0.7,
            width: '100%',
            borderWidth: tagerror ? 1 : 0,
            borderColor:
              tagerror && formError ? appColor.ToastError : 'transparent',
            shadowColor: appColor.bgBlack,
            shadowOpacity: bgWhite ? 0.2 : 0,
            shadowOffset: {width: 0, height: 2},
            shadowColor: 'black',
            shadowRadius: 5,
            // shadowOpacity:0.2
          },
          containerStyle,
        ]}>
        {leftIcon && (
          <Pressable onPress={onPressLeft} style={{paddingHorizontal: 5}}>
            <Icon
              ComponentName={icon}
              name={iconName}
              color={dark ? appColor.placeHolder : appColor.black}
              size={iconSize}
            />
          </Pressable>
        )}
        {custom && (
          <Pressable
            onPress={onPressLeft}
            style={{
              paddingHorizontal: imgFill ? 0 : 5,
              paddingVertical: imgFill ? 0 : 5,
            }}>
            {path != '' ? (
              <Image
                style={{
                  width: imgFill ? 40 : 25,
                  height: imgFill ? 40 : 25,
                  borderTopLeftRadius: imgFill ? 3 : 0,
                  borderBottomLeftRadius: imgFill ? 3 : 0,
                  borderRightWidth: 0.5,
                  borderColor: appColor.TextInputborderbg,
                }}
                resizeMode={imgFill ? 'cover' : 'contain'}
                source={imgFill ? {uri: path} : path}
              />
            ) : (
              <Pressable
                onPress={onPressLeft}
                style={{
                  width: imgFill ? 40 : 25,
                  height: imgFill ? 40 : 25,
                  paddingHorizontal: imgFill ? 0 : 5,
                  paddingVertical: imgFill ? 0 : 5,
                  backgroundColor: appColor.bgWhite,
                  borderRightWidth: 0.5,
                  borderLeftWidth: 0.2,
                  borderTopLeftRadius: imgFill ? 3 : 0,
                  borderBottomLeftRadius: imgFill ? 3 : 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  ComponentName={'FontAwesome5'}
                  name={'user-tie'}
                  size={25}
                  color={appColor.boldBlacktext}
                />
              </Pressable>
            )}
          </Pressable>
        )}

        {login && dialProp && (
          <Pressable style={{flexDirection: 'row'}} onPress={dialProp[1]}>
            <Text style={{paddingHorizontal: 5}}>{dialProp[0].emoji}</Text>
            <Text
              style={{
                paddingHorizontal: 5,
                color: appColor.boldBlacktext,
              }}>
              {dialProp[0].phone}
            </Text>
          </Pressable>
        )}
        <TextInput
          autoCapitalize={autoCapitalize ? 'none' : 'words'}
          onTouchStart={onPressTextInput}
          onKeyPress={onPressTextInput}
          secureTextEntry={visible}
          onPress={editable ? () => {} : onPress}
          ref={ref}
          autoFocus={autoFocus}
          lineBreakStrategy="word-wrap"
          onFocus={onFocus}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={
            dark ? appColor.placeHolderTextDark : appColor.placeHolderText
          }
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          value={value}
          editable={editable}
          style={[
            {
              flex: 1,
              color: dark ? appColor.textWhite : appColor.boldBlacktext,
              fontFamily: appFont.rR,
              paddingVertical: widthResponse ? 13.5 : 16,
              paddingHorizontal: 6,
              textAlignVertical: textVertical ? 'top' : 'center',
              fontSize: fontScalling(1.8),
            },
            inputStyle, //@@
          ]}
        />
        {secureTextEntry ? (
          <Pressable
            style={{paddingRight: 10}}
            onPress={() => {
              setVisible(!visible);
            }}>
            <Icon
              ComponentName={'Feather'}
              name={visible ? 'eye-off' : 'eye'}
              color={dark ? appColor.bgWhite : appColor.placeHolderText}
              size={20}
            />
          </Pressable>
        ) : null}
        {rightIcon && ( //
          <TouchableOpacity onPress={onPressRight}>
            <Icon
              ComponentName={rightIcon}
              name={iconRightName}
              color={dark ? appColor.bgWhite : appColor.bgBlack}
              size={iconrightSize ? iconrightSize : 20}
            />
          </TouchableOpacity> //
        )}
        {tagerror && formError && (
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: -25,
              paddingHorizontal: 10,
              backgroundColor: appColor.ToastError,
              borderRadius: 5,
              paddingVertical: 2,
            }}>
            <View
              style={{
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderLeftWidth: 6,
                borderRightWidth: 6,
                borderBottomWidth: 10,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: 'red',
                position: 'absolute',
                top: -10,
                left: 5,
              }}
            />
            <Text
              style={{
                color: appColor.white,
                fontSize: fontScalling(1.45),
                fontFamily: appFont.lR,
              }}>
              {formError.message}
            </Text>
          </View>
        )}
      </Pressable>
      {/* form errors */}
      {formError && !tagerror && (
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
}
