import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {Icon} from '../../Utilities/icon';

const RecipeList = ({
  label,
  datas,
  flour,
  style,
  title,
  value,
  unit,
  border,
  top,
  bottom,
  like,
  margin,
  info = false,
  infoPress = () => {},
  dark = false,
}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();

  const val = value == 0 ? String(value) : value;

  return (
    <View
      style={[
        {
          marginBottom: margin ? 0 : widthResponse ? 15 : 20,
        },
        style,
      ]}>
      <View style={[commenStyle.hFlex]}>
        {label && label != '' && (
          <Text
            style={[
              commenStyle.sideHead,
              {
                fontSize: fontScalling(2),
                marginBottom: widthResponse ? 7 : 12,
                flex: 1,
              },
            ]}>
            {label}
          </Text>
        )}
        {info && (
          <TouchableOpacity style={{marginRight: 10}} onPress={infoPress}>
            <Icon
              ComponentName={'AntDesign'}
              name={'exclamationcircle'}
              color={appColor.black}
              size={widthResponse ? 20 : 25}
            />
          </TouchableOpacity>
        )}
      </View>
      {value && value != '' && (
        <View
          style={[
            {
              flexDirection: 'row',
              borderTopLeftRadius: top ? 15 : 0,
              borderTopRightRadius: top ? 15 : 0,
              borderBottomLeftRadius: bottom ? 15 : 0,
              borderBottomRightRadius: bottom ? 15 : 0,
              overflow: 'hidden',
            },
          ]}>
          <View
            style={{
              paddingVertical: widthResponse ? 10 : 14,
              paddingHorizontal: widthResponse ? 15 : 20,
              backgroundColor: appColor.bgBlack,
              width: '50%',
              justifyContent: 'center',
              borderBottomColor: appColor.borderColor,
              borderBottomWidth: border ? 1 : 0,
            }}>
            {title && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    fontSize: fontScalling(1.9),

                    color: appColor.white,
                  },
                ]}>
                {title}
              </Text>
            )}
          </View>
          <View
            style={[
              commenStyle.hFlex,
              {
                paddingVertical: widthResponse ? 10 : 14,
                paddingHorizontal: widthResponse ? 15 : 20,
                backgroundColor: dark ? appColor.cardBack : appColor.bgWhite,
                width: '50%',
                justifyContent: 'center',
                borderBottomColor: appColor.Textlightblack,
                borderBottomWidth: border ? 1 : 0,
              },
            ]}>
            {flour && (
              <Image
                resizeMode="contain"
                source={require('../../../assets/images/review_logo.png')}
                style={{
                  width: widthResponse ? 12 : 18,
                  aspectRatio: 0.5,
                  marginRight: 6,
                }}
              />
            )}
            {like && (
              <Icon
                ComponentName={'AntDesign'}
                name={'heart'}
                color={appColor.primary}
                size={widthResponse ? 16 : 18}
              />
            )}
            {val && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    fontSize: fontScalling(1.9),
                    marginLeft: like ? 5 : 0,
                  },
                ]}>
                {val} {unit && unit}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default RecipeList;

const styles = StyleSheet.create({});
