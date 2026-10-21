import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {
  convertTimeFormat,
  fontScalling,
  formatedDate,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import * as Animatable from 'react-native-animatable';
import {Icon} from '../../Utilities/icon';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setTitle} from '../../Redux/HeaderSlice';

const HistoryCard = ({
  title,
  subhead,
  time,
  wizard = false,
  image,
  item,
  process = 0,
  index = 1,
  date,
  processText,
}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const Navigation = useNavigation();
  const dispatch = useDispatch();
  const [hover, setHover] = useState(false);

  return (
    <Pressable
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      onPress={() => {
        if (item?.type == 'recipe') {
          Navigation.navigate('Community', {
            screen: 'recipeDetail',
            initial: false,
            params: {
              value: 'community',
              item,
            },
          });
        } else if (item?.type == 'flour') {
          Navigation.navigate('Zoeken', {
            screen: 'flourDetail',
            initial: false,
            params: {
              Detail: item.item,
            },
          });
          dispatch(setTitle(item?.item?.flourName));
        } else if (item?.type == 'community_user') {
          Navigation.navigate('Community', {
            screen: 'userDetail',
            initial: false,
            params: {id: item.id},
          });
          dispatch(setTitle(item?.name ? item.name : 'user detail'));
        } else if (item?.type == 'mill') {
          dispatch(setTitle(item?.name ? item.name : 'user detail'));
          Navigation.navigate('Zoeken', {
            screen: 'milldetail',
            initial: false,

            params: {
              detail: {millId: item.id},
            },
          });
        }
      }}
      style={[
        commenStyle.hFlex,
        !hover && commenStyle.shadow,
        {
          borderRadius: wizard ? 15 : 10,
          backgroundColor: appColor.bgWhite,
          padding: widthResponse ? 10 : 15,
          //   marginBottom: fontScalling(1.5)
          borderColor: hover
            ? appColor.primary
            : process != 0
            ? appColor.primary
            : 'transparent',
          borderWidth: 1,
          position: 'relative',
        },
      ]}>
      <>
        {/* image */}
        {image && image != '' ? (
          <View
            style={[
              commenStyle.shadow,
              {
                width: scrnWidth / (widthResponse ? 6 : 8),
                // height: scrnWidth / 6,
                aspectRatio: 1,
                shadowOpacity: wizard ? 0.1 : 0.2,
                backgroundColor: appColor.bgWhite,
                marginRight: 15,
                padding: 7,
                borderRadius: 10,
                shadowRadius: 2,
              },
            ]}>
            <Image
              // animation={'zoomIn'}
              // delay={300 * index}
              // duration={900}
              source={{uri: image}}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            />
          </View>
        ) : (
          <View
            style={[
              commenStyle.shadow,
              {
                width: scrnWidth / (widthResponse ? 6 : 8),
                // height: scrnWidth / 6,
                aspectRatio: 1,
                shadowOpacity: wizard ? 0 : 0.2,
                backgroundColor: appColor.cardBack,
                marginRight: 15,
                padding: 7,
                borderRadius: 10,
              },
            ]}>
            <Image
              // animation={'zoomIn'}
              // delay={300 * index}
              // duration={900}
              source={require('../../../assets/images/logo.png')}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            />
          </View>
        )}
        {/* text  */}
        <View
          style={{
            flex: 1,
          }}>
          {title && title != '' && (
            <Text
              style={[
                commenStyle.title,
                {
                  fontFamily: appFont.lBl,
                  fontSize: wizard ? fontScalling(2) : fontScalling(2.1),
                  marginBottom: wizard ? 4 : 7,
                },
              ]}
              numberOfLines={1}>
              {title}
            </Text>
          )}
          <View style={[!wizard && commenStyle.hFlex]}>
            {subhead && subhead != '' && (
              <Text
                style={[
                  commenStyle.sideHead,
                  {
                    marginBottom: 0,
                    fontSize: wizard ? fontScalling(1.6) : fontScalling(1.8),
                  },
                ]}>
                {subhead}
              </Text>
            )}
            {time && date && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    fontSize: fontScalling(1.6),
                  },
                ]}>
                {`${formatedDate(date)}  ${convertTimeFormat(time)}`}
              </Text>
            )}
          </View>
        </View>
        {process != 0 && (
          <View
            style={[
              commenStyle.hFlex,
              {
                position: 'absolute',
                backgroundColor: appColor.primary,
                borderBottomLeftRadius: 20,
                paddingHorizontal: 10,
                paddingLeft: 20,
                paddingVertical: 8,
                top: 0,
                right: 0,
              },
            ]}>
            <Icon
              ComponentName={'Entypo'}
              name={'warning'}
              color={appColor.white}
            />
            {processText && processText != '' && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    color: appColor.white,
                    marginBottom: 0,
                    marginLeft: 8,
                  },
                ]}>
                {processText}
              </Text>
            )}
          </View>
        )}
      </>
    </Pressable>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({});
