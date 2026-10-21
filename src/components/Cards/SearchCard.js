import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  Capitalize,
  fontScalling,
  getImageUrl,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';

const SearchCard = ({
  image = '',
  title,
  country,
  onPress = () => {},
  type = 'flour',
}) => {
  const [hover, setHover] = useState(false);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const [imgLoad, setImgLoad] = useState(false);
  const [img, setImg] = useState('');

  useEffect(() => {
    if (image != '') {
      (async () => {
        setImgLoad(true);
        let updateImg = image ? await getImageUrl(image, type) : null;
        setImg(updateImg);
        setImgLoad(false);
      })();
    }
  }, []);
  return (
    <Pressable
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      onPress={onPress}
      style={[
        commenStyle.hFlex,
        commenStyle.shadow,
        {
          padding: widthResponse ? 10 : 15,
          backgroundColor: appColor.bgWhite,
          elevation: hover ? 0 : 5,
          shadowOpacity: hover ? 0 : .2,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: hover ? appColor.primary : 'transparent',
        },
      ]}>
      {/* image */}
      <View
        style={[commenStyle.shadow,{
          width: scrnWidth / 7,
          height: scrnWidth / 7,
          borderRadius: 10,
          backgroundColor: appColor.bgWhite,
          marginRight: 15,
          elevation: 5,
          padding: 7,
        }]}>
        {/* {print(image, 'uri')} */}
        <Image
          source={
            img && img != '' && !imgLoad
              ? {uri: img}
              : require('../../../assets/images/logo.png')
          }
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
        }}>
        {title && (
          <Text
            style={[
              commenStyle.title,
              {
                fontFamily: appFont.lB,
                fontSize: fontScalling(2),
              },
            ]}
            numberOfLines={1}>
            {Capitalize(title)}
          </Text>
        )}
        {country && (
          <View style={commenStyle.hFlex}>
            <Image
              source={country.flag}
              style={{
                width: 15,
                height: 15,
                borderRadius: 50,
                marginRight: 8,
                overflow: 'hidden',
              }}
            />
            <Text
              style={[
                commenStyle.para,
                {
                  marginBottom: 0,
                },
              ]}>
              {country.name}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default SearchCard;

const styles = StyleSheet.create({});
