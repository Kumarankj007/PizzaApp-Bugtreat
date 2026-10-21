import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useStyle} from '../../Utilities/styleSheet';
import {
  fontScalling,
  getImageUrl,
  isOdd,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import {appFont} from '../../Utilities/appFont';
import Review from './Review';
import Country from './Country';

export default FlourCard = ({
  item,
  index,
  separator = widthResponse ? 15 : 20,
  onPress = () => {},
  milltitle,
  numColumns = 2,
  favorite = false,
}) => {
  const [hover, setHover] = useState(false);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const container = widthResponse ? 30 : 40;

   const [imgLoad, setImgLoad] = useState(false);
    const [img, setImg] = useState('');



  useEffect(() => {
      if (item?.flourImg != '') {
        (async () => {
          let updateImg = item?.flourImg
            ? await getImageUrl(item?.flourImg)
            : null;
          setImg(updateImg);
        })();
      }
    }, []);
  return (
    <View
      style={[
        commenStyle.whiteCard,
        {
          width:
            (scrnWidth - container - separator * (numColumns - 1)) / numColumns,
          marginRight: (index + 1) % numColumns == 0 ? 0 : separator, //@@
          borderWidth: 1,
          shadowOpacity: hover ? 0 : 0.2,
          borderColor: hover ? appColor.primary : 'transparent',
        },
      ]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => setHover(true)}
        onPressOut={() => setHover(false)}
        // background={TouchableNativeFeedback.Ripple('#0000000f', false)}
      >
        <View
          style={{
            padding: 15,
            overflow: 'hidden',
          }}>
          {/* flour image */}
          <Animatable.View
            animation={'zoomIn'}
            duration={900}
            delay={1 * 200}
            style={{
              width: '70%',
              aspectRatio: 1,
              alignSelf: 'center',
              marginBottom: 10,
            }}>
              <Image
                source={img ? {uri: img} : {uri : `${process.env.BASE_URL}assets/images/wheat-white.png`}}
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
          </Animatable.View>
          {/* flour name */}
          {item?.flourName && (
            <Text
              style={[
                commenStyle.sideHead,
                {
                  color: appColor.textBlack,
                  fontSize: fontScalling(2.2),
                  marginBottom: 7,
                },
              ]}
              numberOfLines={favorite ? 2 : 1}>
              {item.flourName}
            </Text>
          )}
          {/* review and country */}
          <View
            style={[commenStyle.hFlex, {marginBottom: widthResponse ? 5 : 10}]}>
            {/* review */}
            {item?.flourRating && item?.flourRating != 0 && (
              <Review review={Number(item?.flourRating).toFixed(0)} />
            )}
            {/* country */}
            {item?.country && (
              <Country
                country={item.country}
                style={{
                  flex: 1,
                }}
                textStyle={{
                  flex: 1,
                }}
              />
            )}
          </View>
          {/* Mill */}
          {item.millName && (
            <Text
              numberOfLines={1}
              style={[
                commenStyle.authSubButton,
                {color: appColor.Textlightblack},
              ]}>
              {milltitle && milltitle} :{' '}
              <Text style={{fontFamily: appFont.lR}}>{item.millName}</Text>
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
};
