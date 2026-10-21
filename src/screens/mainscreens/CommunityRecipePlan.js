import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  fontScalling,
  print,
  scrnWidth,
  splitTime,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import {useSelector} from 'react-redux';
// import * as Animatable from 'react-native-animatable';
// import StepIndicator from 'react-native-step-indicator';

const CommunityRecipePlan = ({data}) => {
  const {logo} = useSelector(state => state.appSettings);
  const {setters, deviceId, userId} = useSelector(state => state.appSettings);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const colorValue = useRef(new Animated.Value(0)).current;
  const imgWidth = scrnWidth / (widthResponse ? 4 : 6);
  const leftGap = widthResponse ? 10 : 12.5;
  return (
    <View style={[commenStyle.container]}>
      {/* que details */}
      <View
        style={[
          commenStyle.hFlex,
          {
            marginBottom: 20,
          },
        ]}>
        <View
          style={{
            width: imgWidth,
            // height: scrnWidth / 4,
            aspectRatio: 1,
            borderRadius: 10,
            backgroundColor: appColor.bgWhite,
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}>
          {/* {data?.content?.card_img && ( */}
          <Image
            source={{
              uri: data?.content?.card_img ? data?.content?.card_img : logo,
            }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
          {/* )} */}
        </View>
        <View
          style={{
            flex: 1,
          }}>
          {/* title */}
          {data?.content?.fileName && (
            <Text
              style={[
                commenStyle.sideHead,
                {
                  fontFamily: appFont.lBl,
                  marginBottom: 5,
                  fontSize: fontScalling(2.1),
                },
              ]}>
              {data.content.fileName}
            </Text>
          )}

          {/* total steps */}
          {data?.content?.step_values && (
            <Text
              style={[
                commenStyle.para,
                {
                  marginBottom: 5,
                },
              ]}>
              {data?.content?.steps && (
                <Text
                  style={[
                    {
                      fontFamily: appFont.lB,
                    },
                  ]}>
                  {data?.content?.steps} :
                </Text>
              )}
              {data.content.step_values}
            </Text>
          )}

          {/* current steps */}
          {data?.content?.made_on_values && (
            <>
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 2,
                    fontFamily: appFont.lB,
                  },
                ]}>
                {data?.content?.this_pizza_was_made_on} :
              </Text>
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                  },
                ]}>
                {data?.content?.made_on_values}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* plan steps */}
      <View
        style={{
          position: 'relative',
          // width: '90%',
          zIndex: -1,
          marginLeft: imgWidth / 2 - leftGap,
          // backgroundColor: appColor.TextInputborderbg
        }}>
        <View
          style={{
            borderLeftColor: appColor.bgBlack,
            borderLeftWidth: 2,
            borderStyle: 'solid',
            height: '100%',
            position: 'absolute',
            top: widthResponse ? -20 : -25,
            left: leftGap,
          }}
        />
        {data?.steps &&
          data?.steps.length > 0 &&
          data?.steps.map((item, index) => {
            // print(item,index)
            const animationDuration = 1000;
            const height = data?.content?.processStatus > index ? '100%' : 0;

            const outBack =
              data?.content?.processStatus > index
                ? appColor.bgWhite
                : data?.content?.processStatus == index
                ? appColor.primary
                : appColor.bgBlack;
            const outText =
              data?.content?.processStatus > index
                ? appColor.black
                : appColor.white;

            const nameAnimation = colorValue.interpolate({
              inputRange: [0, 1],
              outputRange: [appColor.white, outText], // From black to red
            });
            const backgroundAnimation = colorValue.interpolate({
              inputRange: [0, 1],
              outputRange: [appColor.bgBlack, outBack], // From black to red
            });
            useEffect(() => {
              const startColorAnimation = () => {
                Animated.timing(colorValue, {
                  toValue: 0,
                  duration: 100,
                  useNativeDriver: false,
                }).start(() => {
                  if (data?.content?.processStatus > index) {
                    Animated.timing(colorValue, {
                      toValue: 1,
                      delay: index * animationDuration,
                      duration: animationDuration,
                      useNativeDriver: false,
                    }).start();
                  }
                });
              };
              startColorAnimation();
            }, []);

            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  // data?.content?.steps.length - 1 != index
                  //   ? widthResponse
                  //     ? 20
                  //     : 25
                  //   : 0,
                  alignItems: 'center',
                }}>
                {/* dots */}
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: appColor.ToastError,
                    position: 'relative',
                    borderRadius: 60,
                    zIndex: 10,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor:
                      data?.content?.processStatus > index ||
                      data?.content?.processStatus == index
                        ? appColor.primary
                        : appColor.bgBlack,
                  }}>
                  {/* dot */}
                  <View
                    style={{
                      width: widthResponse ? 20 : 25,
                      height: widthResponse ? 20 : 25,
                      borderRadius: 60,
                      backgroundColor:
                        data?.content?.processStatus > index ||
                        data?.content?.processStatus == index
                          ? appColor.primary
                          : appColor.bgBlack,
                      borderWidth: 5,
                      borderColor: appColor.bgWhite,
                    }}
                  />
                </View>

                {/* details */}
                <View
                  style={[
                    {
                      flex: 1,
                      paddingLeft: 15,
                      // backgroundColor:appColor.Textlightblack,
                      position: 'relative',
                    },
                  ]}>
                  {/* triangle */}
                  <View
                    style={{
                      width: 0,
                      height: 0,
                      backgroundColor: 'transparent',
                      borderStyle: 'solid',
                      borderLeftWidth: 5,
                      borderBottomWidth: 9,
                      borderRightWidth: 5,
                      borderLeftColor: 'transparent',
                      // borderBottomColor:status == 0 ? appColor.bgBlack : status == 1 ? appColor.primary : appColor.TextInputborderbg,
                      // borderBottomColor: appColor.bgWhite,
                      borderBottomColor:
                        data?.content?.processStatus > index
                          ? appColor.bgWhite
                          : data?.content?.processStatus == index
                          ? appColor.primary
                          : appColor.bgBlack,
                      borderRightColor: 'transparent',
                      transform: [{rotate: '-90deg'}],
                      position: 'absolute',
                      left: 6,
                      // top: widthResponse ? 13 : 17,
                      top: '40%',
                    }}
                  />
                  <View
                    style={[
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      },
                    ]}>
                    {/* time and temperature */}
                    {(item?.time || item?.temp) && (
                      <Animated.Text
                        style={[
                          commenStyle.para,
                          {
                            marginBottom: 0,
                            width: '40%',
                            backgroundColor:
                              data?.content?.processStatus > index
                                ? appColor.bgWhite
                                : data?.content?.processStatus == index
                                ? appColor.primary
                                : appColor.bgBlack,
                            padding: widthResponse ? 10 : 14,
                            borderRadius: 10,
                            textAlign: 'center',
                            overflow: 'hidden',
                            color:
                              data?.content?.processStatus > index
                                ? appColor.black
                                : appColor.white,
                            //   backgroundColor:backgroundAnimation,
                            // color:nameAnimation
                          },
                        ]}>
                        {/* {(splitTime(item.time)[0] > "0"
                              ? `${splitTime(item.time)[0]} hrs`
                              : '') +
                            (splitTime(item.time)[1] > "0"
                              ? `${splitTime(item.time)[1]} min`
                              : '') - item.temp + setters?.temperature?.tshort} */}
                        {/* {splitTime(item.time)[0] > 0
                          ? `${splitTime(item.time)[0]} hrs `
                          : '' + splitTime(item.time)[1] > 0
                          ? `${splitTime(item.time)[1]} min${item.temp} ${
                              setters?.temperature?.tshort
                            }`
                          : ``} */}
                        {`${
                          splitTime(item.time)[0] > 0
                            ? splitTime(item.time)[0] + 'hrs'
                            : ''
                        } ${
                          splitTime(item.time)[1] > 0
                            ? splitTime(item.time)[1] + 'min'
                            : ''
                        } ${
                          item?.title?.temperature != 0
                            ? '- ' +
                              item.temp +
                              ' ' +
                              setters?.temperature?.tshort
                            : ''
                        }`}
                      </Animated.Text>
                    )}
                    {item?.title && (
                      <Animated.Text
                        style={[
                          commenStyle.para,
                          {
                            marginBottom: 0,
                            fontFamily: appFont.lB,
                            width: '58%',
                            backgroundColor:
                              data?.content?.processStatus > index
                                ? appColor.bgWhite
                                : data?.content?.processStatus == index
                                ? appColor.primary
                                : appColor.bgBlack,
                            padding: widthResponse ? 10 : 14,
                            fontSize: fontScalling(1.7),
                            borderRadius: 10,
                            textAlign: 'center',
                            overflow: 'hidden',
                            color:
                              data?.content?.processStatus > index
                                ? appColor.black
                                : appColor.white,
                            // backgroundColor:backgroundAnimation,
                            // color:nameAnimation
                          },
                        ]}>
                        {item?.title?.sorting}
                      </Animated.Text>
                    )}
                  </View>
                  {/* {data?.content?.steps.length - 1 != index &&
                <View
                  style={{paddingBottom:widthResponse ? 20 :25}}
                />} */}
                </View>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default CommunityRecipePlan;

const styles = StyleSheet.create({});

// {index != data?.content?.steps.length - 1 && (
//   <View style={{
//     flex: 1,
//     // backgroundColor: appColor.ToastInfo
//   }}>
//     <View
//       style={[
//         {
//           // borderColor: appColor.primary,
//           width: widthResponse ? 5 : 5,
//           height: '100%',
//           left: widthResponse ? -3 : 2.5,
//           position: 'absolute',
//           top: 0,
//           overflow: 'hidden',
//           backgroundColor: 'transparent',
//         },
//       ]}>
//       <Animatable.View
//         duration={animationDuration}
//         delay={index * animationDuration}
//         animation={'slideInDown'}
//         style={[
//           {
//             width: '100%',
//             height: '100%',
//             // backgroundColor: appColor.primary
//             borderTopColor:
//               data?.content?.processStatus > index
//                 ? appColor.primary
//                 : 'transparent',
//             backfaceVisibility: data?.content?.processStatus > index
//               ? 'visible'
//               : 'hidden',
//           },
//         ]}
//       />
//     </View>
//   </View>
// )}
