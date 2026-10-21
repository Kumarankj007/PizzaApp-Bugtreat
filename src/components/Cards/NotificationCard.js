import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import * as Animatable from 'react-native-animatable';
import {appFont} from '../../Utilities/appFont';
import {Icon} from '../../Utilities/icon';
import {useNavigation} from '@react-navigation/native';

const NotificationCard = ({
  title,
  time,
  date,
  image,
  id,
  onDelPress = () => {},
  onSwipe = () => {},
  index,
  item,
}) => {
  const [delHover, setDelHover] = useState(false);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const [hover, setHover] = useState(false);
  const Navigation = useNavigation();

  return (
    <Pressable
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      onPress={() => {
        if (item?.type) {
          if (item?.type == 'user_follow') {
            Navigation.navigate('Community', {
              screen: 'userDetail',
              initial: false,
              params: {id: item.redirect_id},
            });
          } else if (
            [
              'recipe_review',
              'recipe_review_request',
              'recipe_shared',
              'wizard',
              'recipe_load',
            ].includes(item.type)
          ) {
            Navigation.navigate('Community', {
              screen: 'recipeDetail',
              initial: false,
              params: {
                value: 'community',
                item: {
                  id: item?.redirect_id,
                },
              },
            });
          }
        }
      }}
      style={[
        // commenStyle.hFlex,
        !hover ? commenStyle.shadow : null,
        {
          backgroundColor: appColor.bgWhite,
          borderRadius: 10,
          padding: widthResponse ? 10 : 15,
          flexDirection: 'row',
          borderColor: hover ? appColor.primary : 'transparent',
          borderWidth: 1,
        },
      ]}>
      {/* image */}
      <View
        style={{
          width: scrnWidth / 7,
          aspectRatio: 1,
          // height: scrnWidth / 7,
          marginRight: 15,
        }}>
        <Animatable.Image
          animation={'zoomIn'}
          delay={index * 300}
          duration={900}
          source={
            image ? {uri: image} : require('../../../assets/images/logo.png')
          }
          resizeMode="cover"
          style={{
            borderRadius: 8,
            width: '100%',
            height: '100%',
          }}
        />
      </View>

      {/* text  */}
      <View
        style={{
          flex: 1,
          paddingRight: 15,
        }}>
        {title && (
          <Text
            style={[
              commenStyle.title,
              {
                fontFamily: appFont.lB,
                fontSize: fontScalling(2),
                marginBottom: 8,
              },
            ]}>
            {title}
          </Text>
        )}
        <View style={[commenStyle.hFlex]}>
          {date && (
            <Text
              style={[
                commenStyle.para,
                {
                  marginBottom: 0,
                  borderRightColor: appColor.black,
                  borderRightWidth: 1,
                  lineHeight: fontScalling(2.1),
                },
              ]}>
              {date}
            </Text>
          )}
          <View
            style={{
              width: 1,
              height: widthResponse ? 15 : 20,
              backgroundColor: appColor.black,
              marginHorizontal: widthResponse ? 5 : 8,
            }}
          />
          {time && (
            <Text
              style={[
                commenStyle.para,
                {
                  marginBottom: 0,
                  lineHeight: fontScalling(2.1),
                },
              ]}>
              {time}
            </Text>
          )}
        </View>
      </View>

      {/* delete */}
      <Pressable
        onPressIn={() => setDelHover(true)}
        onPressOut={() => setDelHover(false)}
        onPress={() => onDelPress(id)}
        style={{
          width: widthResponse ? 32 : 38,
          height: widthResponse ? 32 : 38,
          borderRadius: 50,
          backgroundColor: delHover ? appColor.primary : appColor.black,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
          ComponentName={'MaterialCommunityIcons'}
          name={'trash-can'}
          color={appColor.white}
          size={widthResponse ? 17 : 20}
        />
      </Pressable>
    </Pressable>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({});
