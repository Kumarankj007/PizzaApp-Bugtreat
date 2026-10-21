import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PrimaryButton from '../Buttons/PrimaryButton';
import {
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import Review from './Review';
import {useStyle} from '../../Utilities/styleSheet';
import Used from './Used';
import {appFont} from '../../Utilities/appFont';
import Country from './Country';

const WizardRecipe = ({
  buttonText,
  data,
  onpress = () => {},
  drop,
  onSelect = () => {},
  usedContent,
}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const imageSize = scrnWidth / 8;

  return (
    <Pressable
      onPress={() => onpress(data)}
      style={[
        drop ? null : commenStyle.shadow,
        {
          padding: widthResponse ? 15 : 20,
          backgroundColor: drop ? appColor.tooLight : appColor.bgWhite,
          borderWidth: 1,
          borderColor: drop ? appColor.primary : 'transparent',
          flexDirection: 'row',
          borderRadius: 10,
        },
      ]}>
      {data?.cardImg && data?.cardImg != '' && (
        <View
          style={{
            width: imageSize,
            height: imageSize,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor:appColor.ToastError,
            marginRight: 15,
          }}>
          <Image
            source={{uri: data.cardImg}}
            style={{
              overflow: 'hidden',
              borderRadius: imageSize,
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
          />
        </View>
      )}
      <View
        style={{
          flex: 1,
        }}>
        {data.fileName && (
          <Text
            style={[
              commenStyle.sideHead,
              {
                marginBottom: 5,
                fontFamily: appFont.lBl,
                fontSize: fontScalling(2.1),
              },
            ]}>
            {data.fileName}
          </Text>
        )}
        {data.comment && (
          <Text
            numberOfLines={drop ? undefined : 2}
            style={[
              commenStyle.para,
              {
                marginBottom: 0,
              },
            ]}>
            {data.comment}
          </Text>
        )}
        {/* author */}
        {drop && (
          <View
            style={{
              paddingTop: widthResponse ? 15 : 18,
              marginTop: 10,
              borderTopColor: appColor.primary,
              borderTopWidth: 1,
            }}>
            <View
              style={[
                commenStyle.hFlex,
                {
                  marginBottom: 15,
                },
              ]}>
              {data?.user_image && data?.user_image != '' && (
                <View
                  style={{
                    width: scrnWidth / 8,
                    height: scrnWidth / 8,
                    marginRight: 10,
                  }}>
                  <Image
                    source={{uri: data.user_image}}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                    resizeMode="cover"
                  />
                </View>
              )}
              <View
                style={{
                  flex: 1,
                }}>
                {data?.user_name && (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: appFont.lB,
                      fontSize: fontScalling(1.8),
                      color: appColor.black,
                      marginBottom: 8,
                    }}>
                    {data.user_name}
                  </Text>
                )}

                {/* country */}
                {data?.country && <Country country={data.country} />}
              </View>
            </View>
            <View
              style={[
                {
                  justifyContent: 'space-between',
                  flexDirection: widthResponse ? 'column-reverse' : 'row',
                },
              ]}>
              {buttonText && (
                <PrimaryButton
                  text={buttonText}
                  recipe
                  onPress={() => onSelect(data)}
                />
              )}
              <View
                style={[
                  commenStyle.hFlex,
                  {
                    flex: 1,
                    marginBottom: widthResponse ? 5 : 0,
                  },
                ]}>
                {data.recipe_rating && <Review review={data.recipe_rating} />}
                <Used
                  value={data?.used_count}
                  text={usedContent}
                  style={{
                    flex: 1,
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default WizardRecipe;

const styles = StyleSheet.create({});
