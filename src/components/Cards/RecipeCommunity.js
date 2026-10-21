import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  fontScalling,
  print,
  scrnWidth,
  strEmptyCheck,
  widthResponse,
} from '../../Utilities/helperFunction';
import * as Animatable from 'react-native-animatable';
import {appFont} from '../../Utilities/appFont';
import Review from './Review';

const RecipeCommunity = ({
  data,
  index,
  addedTime,
  readyTime,
  topPick,
  onPress = () => {},
  numColumns,
  seperator,
}) => {
  const [hover, setHover] = useState(false);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const container = widthResponse ? 30 : 40;

  const rating = data?.recipe_rating == null ? '0' : data.recipe_rating;

  return (
    <Pressable
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      onPress={onPress}
      style={[
        hover ? null : commenStyle.shadow,
        {
          borderWidth: 1,
          borderRadius: 15,
          borderColor: hover ? appColor.primary : 'transparent',
          position: 'relative',
          elevation: hover ? 0 : 7,
          backgroundColor: appColor.bgWhite,
          width:
            (scrnWidth - container - seperator * (numColumns - 1)) / numColumns,
          marginRight: (index + 1) % numColumns == 0 ? 0 : seperator,
        },
      ]}>
      {/* top block */}
      <View
        style={[
          // commenStyle.hFlex,
          {
            padding: widthResponse ? 10 : 15,
            borderBottomWidth: 1,
            borderBottomColor: appColor.borderColor,
          },
        ]}>
        {/* image */}
        <View
          style={{
            aspectRatio: 1.3,
            width: '100%',
            marginBottom: widthResponse ? 7 : 12,
          }}>
          {(data?.cardImg && data.cardImg != '') || data.cardImg != null ? (
            <Animatable.Image
              animation={'zoomIn'}
              delay={index * 200}
              source={{uri: data.cardImg}}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 10,
                overflow: 'hidden',
              }}
              resizeMode="cover"
            />
          ) : (
            <Animatable.Image
              animation={'zoomIn'}
              delay={index * 200}
              source={require('../../../assets/images/logo.png')}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 10,
                overflow: 'hidden',
              }}
              resizeMode="cover"
            />
          )}
        </View>

        {/* detail */}
        <View
          style={{
            flex: 1,
          }}>
          {/* title */}
          {data?.fileName && (
            <Text
              numberOfLines={1}
              style={[
                commenStyle.sideHead,
                {
                  marginBottom: 5,
                  fontFamily: appFont.lBl,
                  fontSize: fontScalling(2),
                },
              ]}>
              {data.fileName}
            </Text>
          )}
          {/* rating */}
          {rating && rating != 0 && <Review review={rating} />}
          {/* time */}
          {data?.total_time && (
            <Text
              style={[
                commenStyle.para,
                {
                  marginBottom: 0,
                  marginTop: 3,
                },
              ]}>
              <Text style={{fontFamily: appFont.lB}}>
                {readyTime && readyTime} : {''}
              </Text>
              {data?.total_time}
            </Text>
          )}
        </View>
      </View>

      {/* author block */}

      <View
        style={[
          // commenStyle.hFlex,
          {
            paddingHorizontal: widthResponse ? 10 : 15,
            paddingVertical: widthResponse ? 10 : 10,
            justifyContent: 'space-between',
          },
        ]}>
        {data?.view_profile != 0 && (
          <View
            style={[
              commenStyle.hFlex,
              {
                // marginRight: 10,
                marginBottom: widthResponse ? 7 : 9,
              },
            ]}>
            {strEmptyCheck(data?.user_image) && (
              <Image
                source={{uri: data?.user_image}}
                style={{
                  width: widthResponse ? 20 : 25,
                  height: widthResponse ? 20 : 25,
                  borderRadius: 50,
                  overflow: 'hidden',
                  marginRight: 7,
                }}
                resizeMode="cover"
              />
            )}
            {data?.user_name && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                  },
                ]}>
                {data?.user_name}
              </Text>
            )}
          </View>
        )}
        {data?.saveDate && (
          <Text
            style={[
              commenStyle.para,
              {
                flex: 1,
                marginBottom: 0,
                color: appColor.textGrey,
                fontSize: fontScalling(1.4),
              },
            ]}>
            {addedTime && addedTime} : {data?.saveDate}
          </Text>
        )}
      </View>

      {/* top choice */}
      {data?.top_pick == '1' && (
        <ImageBackground
          resizeMode="stretch"
          source={require('../../../assets/images/topchoice.png')}
          style={{
            position: 'absolute',
            right: -8,
            top: 5,
            zIndex: 2,
          }}>
          <Text
            style={[
              commenStyle.sideHead,
              {
                marginBottom: 0,
                textTransform: 'uppercase',
                color: appColor.white,
                paddingHorizontal: widthResponse ? 12 : 17,
                paddingVertical: widthResponse ? 8 : 13,
                fontFamily: appFont.lBl,
                fontSize: fontScalling(1.3),
              },
            ]}>
            {topPick && topPick}
          </Text>
        </ImageBackground>
      )}
    </Pressable>
  );
};

export default RecipeCommunity;

const styles = StyleSheet.create({});
