import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import * as Animatable from 'react-native-animatable';
import {
  fontScalling,
  isOdd,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {Icon} from '../../Utilities/icon';
import Review from './Review';
import Used from './Used';
import {appFont} from '../../Utilities/appFont';
import Share from 'react-native-share';
import {BASE_URL} from '@env';
import RNFS from 'react-native-fs';
import {useSelector} from 'react-redux';

const Recipe = ({
  data,
  id,
  seperator,
  onPress = () => {},
  share,
  shared,
  notshared,
  shareText,
  lastused,
  created,
  used,
  numColumns,
  availabelText,
}) => {
  const {isLogged} = useSelector(State => State.authSettings);
  const [hover, setHover] = useState(false);
  const [shareHover, setShareHover] = useState(false);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  // const width = widthResponse ? 40 : 50;
  const width = '100%';
  const container = widthResponse ? 30 : 40;

  const onShare = async () => {
    const link = `${BASE_URL}recipes/${data.public_key}`;

    if (data?.cardImg) {
      try {
        const imageName = data?.cardImg.split('/').pop();
        const filePath = `${RNFS.DocumentDirectoryPath}/${imageName}`;

        const downloadResult = await RNFS.downloadFile({
          fromUrl: data?.cardImg,
          toFile: filePath,
        }).promise;

        if (downloadResult.statusCode === 200) {
          const options = {
            title: `${data?.fileName}`,
            url: `file://${filePath}`,
            type: 'image/jpeg',
            message: `${shareText} : ${data?.fileName} ${link}`,
          };

          await Share.open(options);
        } else {
          console.log('Failed to download image:', downloadResult.statusCode);
        }
      } catch (error) {
        console.log('Error sharing product:', error.message);
      }
    }
  };

  const rating = data?.recipe_rating == null ? '0' : data.recipe_rating;

  return (
    <Pressable
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      onPress={onPress}
      style={[
        commenStyle.whiteCard,
        hover ? null : commenStyle.shadow,
        {
          width:
            (scrnWidth - container - seperator * (numColumns - 1)) / numColumns, //@@
          marginRight: (id + 1) % numColumns == 0 ? 0 : seperator, //@@
          padding: widthResponse ? 10 : 15,
          borderWidth: 1,
          elevation: hover ? 0 : 10,
          borderColor: hover ? appColor.primary : 'transparent',
        },
      ]}>
      {/* top choice  */}
      {data?.top_pick == '1' && (
        <View
          style={[
            commenStyle.hFlex,
            ,
            {
              borderRadius: 30,
              backgroundColor: appColor.primary,
              position: 'absolute',
              left: '10%',
              top: '6%',
              justifyContent: 'center',
              zIndex: 1,
              width: 30,
              aspectRatio: 1,
              elevation: 10,
            },
          ]}>
          <Icon
            ComponentName={'Entypo'}
            name={'trophy'}
            color={'#fff'}
            size={widthResponse ? 20 : 24}
          />
        </View>
      )}
      {/* top images */}
      <View
        style={[
          commenStyle.hFlex,
          {
            justifyContent: 'space-between',
            marginBottom: widthResponse ? 8 : 12,
            position: 'relative',
            borderRadius: 10,
            overflow: 'hidden',
          },
        ]}>
        {data?.cardImg && data?.cardImg != null ? (
          <Animatable.Image
            animation={'zoomIn'}
            delay={id * 200}
            source={{uri: data?.cardImg}}
            style={{
              width: width,
              // aspectRatio: 1.3,
              height: scrnWidth / 3,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
        ) : (
          <Animatable.Image
            animation={'zoomIn'}
            delay={id * 200}
            source={require('../../../assets/images/logo.png')}
            style={{
              width: width,
              // aspectRatio: 1.3,
              height: scrnWidth / 3,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
        )}

        {data?.recipe_shared != 0 && (
          <Pressable
            onPressIn={() => setShareHover(true)}
            onPressOut={() => setShareHover(false)}
            style={[
              commenStyle.hFlex,
              {
                flex: 1,
                justifyContent: 'flex-end',
                padding: widthResponse ? 5 : 8,
                borderRadius: 10,
                backgroundColor: appColor.bgWhite,
                position: 'absolute',
                right: '6%',
                top: '6%',
                elevation: shareHover ? 0 : 7,
                borderWidth: 0.5,
                borderColor: !shareHover ? 'transparent' : appColor.primary,
              },
            ]}
            onPress={onShare}>
            <Icon
              ComponentName={'Entypo'}
              name={'share'}
              size={widthResponse ? 17 : 20}
              color={appColor.primary}
            />
            {share && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    color: appColor.primary,
                    marginLeft: 5,
                  },
                ]}>
                {share}
              </Text>
            )}
          </Pressable>
        )}

        {data?.plan_steps != 0 && (
          <Animatable.View
            animation={'slideInUp'}
            delay={500}
            style={[
              commenStyle.hFlex,
              {
                position: 'absolute',
                left: 0,
                bottom: 0,
                right: 0,
                flex: 1,
                backgroundColor: appColor.primary,
                justifyContent: 'center',
                zIndex: 1,
                padding: 5,
              },
            ]}>
            <Icon
              ComponentName={'FontAwesome5'}
              name={'pizza-slice'}
              color={appColor.bgWhite}
              size={widthResponse ? 14 : 17}
            />
            {/* <Image
              source={require('../../../assets/images/pizzaIcon.png')}
              resizeMode="contain"
              style={{
                width: widthResponse ? 20 : 30,
                // height: widthResponse ? 20 : 30,
                aspectRatio: 1,
              }}
            /> */}
            {availabelText && (
              <Text
                numberOfLines={1}
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    color: appColor.white,
                    fontSize: fontScalling(1.5),
                    marginLeft: 5,
                  },
                ]}>
                {availabelText}
              </Text>
            )}
          </Animatable.View>
        )}
      </View>

      {/* name */}
      {data?.fileName && (
        <Text
          numberOfLines={1}
          style={[
            commenStyle.sideHead,
            {
              fontSize: fontScalling(1.9),
              marginBottom: widthResponse ? 8 : 10,
            },
          ]}>
          {data.fileName}
        </Text>
      )}

      {/* rating & used */}
      <View
        style={[
          commenStyle.hFlex,
          {
            // justifyContent: 'space-between',
            marginBottom: widthResponse ? 8 : 12,
          },
        ]}>
        {rating && rating != 0 && <Review review={rating} />}

        {data.used && (
          <Used
            value={data.used}
            text={used}
            style={{
              marginRight: 0,
              flex: 1,
              // justifyContent: 'flex-end',
            }}
          />
        )}
      </View>

      {/* share status */}
      {data?.recipe_shared_content && (
        <View
          style={[
            commenStyle.hFlex,
            {
              marginBottom: widthResponse ? 12 : 16,
            },
          ]}>
          <Icon
            ComponentName={
              data?.recipe_shared == '1' ? 'FontAwesome' : 'AntDesign'
            }
            name={data?.recipe_shared == '1' ? 'check-circle' : 'closecircle'}
            size={widthResponse ? 15 : 17}
            color={
              data?.recipe_shared == '1' ? appColor.paid : appColor.deactive
            }
          />
          <Text
            style={[
              commenStyle.para,
              {
                marginBottom: 0,
                fontSize: fontScalling(1.5),
                marginLeft: 4,
              },
            ]}>
            {data?.recipe_shared_content}
            {/* {data?.recipe_shared?.status ? shared && shared : notshared && notshared} */}
          </Text>
        </View>
      )}

      {/* dates */}
      <View
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: appColor.cardBack,
        }}>
        {data?.saveDate && (
          <View style={{}}>
            <Text
              style={[
                commenStyle.para,
                {
                  marginBottom: 0,
                  fontSize: fontScalling(1.3),
                  paddingLeft: widthResponse ? 5 : 10,
                  paddingVertical: widthResponse ? 4 : 6,
                },
              ]}>
              {created && created} {' :  '}
              <Text
                style={{
                  fontFamily: appFont.lB,
                }}>
                {data?.saveDate}
              </Text>
            </Text>
          </View>
        )}
        {data?.last_used && (
          <View
            style={{
              borderTopColor: appColor.borderColor,
              borderTopWidth: 1,
            }}>
            <Text
              style={[
                commenStyle.para,
                {
                  marginBottom: 0,
                  fontSize: fontScalling(1.3),
                  paddingLeft: widthResponse ? 5 : 10,
                  paddingVertical: widthResponse ? 4 : 6,
                },
              ]}>
              {lastused && lastused} {' :  '}
              <Text
                style={{
                  fontFamily: appFont.lB,
                }}>
                {data?.last_used}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default Recipe;

const styles = StyleSheet.create({});
