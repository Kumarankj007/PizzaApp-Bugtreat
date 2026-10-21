import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import Review from './Review';
import Country from './Country';
import * as Animatable from 'react-native-animatable';

const UserCommunity = ({data, index, style, count, onPress = () => {}}) => {
  const [hover, setHover] = useState(false);
  const appColor = appColors();
  const {commenStyle} = useStyle();

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
          backgroundColor: appColor.bgWhite,
          padding: widthResponse ? 8 : 13,
        },
        style,
      ]}>
      {data?.image && (
        <Animatable.Image
          animation={'zoomIn'}
          delay={index * 200}
          source={{uri: data.image}}
          style={{
            width: '100%',
            height: scrnWidth / 3.5,
            borderRadius: 10,
            overflow: 'hidden',
          }}
          resizeMode="cover"
        />
      )}

      <View
        style={{
          padding: widthResponse ? 10 : 15,
        }}>
        {/* name */}
        {data?.name && (
          <Text
            style={[
              commenStyle.sideHead,
              {
                fontFamily: appFont.lBl,
                fontSize: fontScalling(2.1),
                marginBottom: 5,
              },
            ]}>
            {data.name}
          </Text>
        )}

        {/* rating & flag */}
        <View
          style={[
            commenStyle.hFlex,
            {
              // flex: 1,
              marginBottom: widthResponse ? 3 : 7,
            },
          ]}>
          {data?.rate && data?.rate != '0.0' && <Review review={data.rate} />}

          {/* country */}
          {data?.land && (
            <Country
              country={data.land}
              style={{
                flex: 1,
              }}
            />
          )}
        </View>

        {/* counts */}

        {data?.recipes_count && (
          <Text
            style={[
              commenStyle.para,
              {
                marginBottom: 0,
                fontSize: fontScalling(1.7),
              },
            ]}>
            {count && (
              <Text
                style={{
                  fontFamily: appFont.lB,
                }}>
                {count}
              </Text>
            )}
            {' : '}
            {data?.recipes_count}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default UserCommunity;

const styles = StyleSheet.create({});
