import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Keyboard,
} from 'react-native';
import {
  euro,
  fontScalling,
  getCurrentTime,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {appFont} from '../../Utilities/appFont';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {Icon} from '../../Utilities/icon';
import {InputText} from '../../components/InputFields/InputText';
import AppHeader from '../../components/Header/AppHeader';
import {useDispatch, useSelector} from 'react-redux';
import NavButton from '../../components/Buttons/NavButton';
import FlourDetailInfo from './FlourDetailInfo';
import FlourDetailMill from './FlourDetailMill';
import FlourDetailReview from './FlourDetailReview';
import Country from '../../components/Cards/Country';
import Review from '../../components/Cards/Review';
import {useNavigation} from '@react-navigation/native';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import {Toast} from 'react-native-toast-notifications';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import moment from 'moment';
import {Controller, useForm} from 'react-hook-form';
import ValidationContent from '../../Hooks/ValidationContent';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import Radio from '../../components/InputFields/Radio';

const FlourDetail = ({route}) => {
  const {Detail} = route.params;
  const verify =
    route?.params?.verify && route.params.verify == 'mill' ? true : false;
  // print(flourDetail, 'flour');

  const {setters, deviceId, userId} = useSelector(State => State.appSettings);
  const {isLogged} = useSelector(State => State.authSettings);
  const [load, setLoad] = useState(false);
  const [flourDetail, setFlourDetail] = useState({});
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollA = useRef(new Animated.Value(0)).current;
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const appColor = appColors();
  const {headerHeight} = useSelector(state => state.headSettings);
  const bannerHeight = scrnWidth / 1.8;
  const {valContent} = ValidationContent();
  const [priceDrop, setPriceDrop] = useState(true);
  const [flourPrice, setFlourPrice] = useState({
    input: '',
    result: '',
  });
  const [flourPriceSubmit, setFlourPriceSubmit] = useState(false);
  const [isTransparent, setTransparent] = useState(true);
  const [activeButtons, setActiveButtons] = useState(0);
  const [flourEditSheet, setFlourEditSheet] = useState(false);
  const [flourEditLoad, setFlourEditLoad] = useState(false);

  const [priceFocus, setPriceFocus] = useState(false);

  // print(flourPrice, 'flour');

  // header transparent:
  // useEffect(() => {
  //   const listenerId = scrollA.addListener(a => {
  //     const topNaviOffset = bannerHeight - scrnWidth / 3 / 3 + 20;
  //     if (isTransparent && a.value > topNaviOffset) {
  //       setTransparent(false);
  //     } else if (!isTransparent && a.value < topNaviOffset) {
  //       setTransparent(true);
  //     }
  //     return () => scrollA.removeListener(listenerId);
  //   });
  // });

  const flagSchema = yup
    .object()
    .shape({
      reason: yup.string().required(valContent?.choose_reason),
      comment: yup.string().required(valContent?.comment_required),
    })
    .required();

  const {
    control: flagControl,
    reset: flagReset,
    handleSubmit: flagSubmit,
    formState: {errors: flagErrors},
  } = useForm({
    resolver: yupResolver(flagSchema),
  });

  const schema = yup
    .object()
    .shape({
      price: yup
        .string()
        .required(valContent?.price_is_required)
        .test(
          'not-zero',
          valContent?.price_should_not_be_zero,
          value => value !== '0',
        ),
    })
    .required();

  const {
    setValue,
    control,
    reset,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  // header transparent:
  useEffect(() => {
    const listenerId = scrollA.addListener(a => {
      const topNaviOffset = bannerHeight - scrnWidth / 3 / 3 + 20;
      if (isTransparent && a.value > topNaviOffset) {
        setTransparent(false);
      } else if (!isTransparent && a.value < topNaviOffset) {
        setTransparent(true);
      }
      return () => scrollA.removeListener(listenerId);
    });
  }, []);

  // flour detail content apicall
  const flourDetailApicall = async () => {
    try {
      const formdata = new FormData();
      if (setters && setters?.language?.language_code) {
        formdata.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }
      if (isLogged && userId) formdata.append('user_id', userId);
      if (setters && setters?.weight?.ushort) {
        formdata.append(
          'uShort',
          setters?.weight?.ushort ? setters?.weight?.ushort : 'g',
        );
      }
      if (setters && setters?.temperature?.tshort) {
        formdata.append(
          'tshort',
          setters?.temperature?.tshort ? setters?.temperature?.tshort : '°C',
        );
      }
      if (Detail && Detail?.flourId) {
        formdata.append('flourId', Detail.flourId);
      }

      if (deviceId) formdata.append('uuId', deviceId);
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      // if (verify) {
      //   setLoad(true);
      //   dispatch(setTitleLoad(true));
      // }
      if (Object.keys(flourDetail).length == 0) {
        setLoad(true);
        dispatch(setTitleLoad(true));
      }

      const response = await fetch(Url().flourDetail, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse.data, 'resp');
          setFlourDetail(resparse.data);
          // navigation.setOptions({
          //   title: resparse.data.pageTitle,
          // });
          setValue('price', resparse?.data?.userPrice);
          // if (resparse?.data?.avg_price_value != '0') {
          //   setFlourPriceSubmit(true);
          //   setPriceDrop(true);
          // }
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the search screen');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  // api for the history api call
  const historyCallApi = async () => {
    //cc
    try {
      const saveDate = dateString => {
        const [date, month, year] = dateString.split('/');
        return `${year}-${date}-${month}`;
      };
      const formData = new FormData();

      if (userId) formData.append('user_id', userId);

      formData.append('flour_id', Detail?.flourId);
      formData.append('save_time', getCurrentTime());
      formData.append('save_date', saveDate(moment().format('L')));

      // print(formData, 'from');
      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      const response = await fetch(Url().historyCall, requestOptions);
      const resparse = await response.json();
      // print(resparse, 'resparse');
    } catch (error) {
      console.log(error, 'error in the history call recipe detail api call');
    }
  };

  useEffect(() => {
    if (isLogged && Detail && Detail?.flourId) {
      historyCallApi();
    }
  }, [Detail?.flourId]);

  // flour detail content
  useEffect(() => {
    flourDetailApicall();
  }, [setters.language, setters.weight, setters?.temperature]);

  useEffect(() => {
    if (verify) {
      flourDetailApicall();
      setActiveButtons(0);
    }
    flourViewCount();
  }, [Detail.flourId]);

  // four view count api call
  const flourViewCount = async () => {
    try {
      const formData = new FormData();

      formData.append('id', Detail.flourId);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      await fetch(Url().flourViewCount, requestOptions);
    } catch (error) {
      console.log(error, 'error in the flower view count');
    }
  };

  // flour price submit api call
  const FlourPriceSubmitApi = async data => {
    setPriceFocus(false);
    Keyboard.dismiss();
    try {
      const formdata = new FormData();
      if (setters && setters?.language?.language_code && userId) {
        formdata.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
        formdata.append('user_id', userId);
      }

      if (Detail && Detail?.flourId) {
        formdata.append('flour_id', Detail.flourId);
      }

      if (deviceId) formdata.append('device_id', deviceId);
      formdata.append('price', data?.price);
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      // print(formdata, 'price form');

      const response = await fetch(Url().averagePrice, requestOptions);

      if (response.status == 200) {
        const resparse = await response.json();
        // if(resparse.status == 'success'){
        Toast.show(resparse.data, {
          type: 'success',
          duration: 2000,
        });
        flourDetailApicall();
        // }
        setFlourPriceSubmit(true);
      }
    } catch (error) {
      console.log(error, 'error in the flour price submit api');
    }
  };

  // flour follow api call
  const flourFollowApiCall = async () => {
    try {
      const formdata = new FormData();
      if (setters && setters?.language?.language_code) {
        formdata.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }
      if (Detail?.flourId) {
        formdata.append('flour_id', Detail.flourId);
        formdata.append('user_id', userId);
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const response = await fetch(Url().flourFollow, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          flourDetailApicall();
          Toast.show(resparse?.data, {type: 'success', duration: 2000});
        }
      }
    } catch (error) {
      console.log(error, 'error in the flour follow api call');
    }
  };

  // flour edit apicall
  const flourEditApi = async data => {
    // print(data, 'dat');
    try {
      const formdata = new FormData();
      if (setters && setters?.language?.language_code) {
        formdata.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }
      if (Detail?.flourId) {
        formdata.append('flourId', Detail.flourId);
      }
      formdata.append('uuId', deviceId);
      formdata.append('reason', data?.reason);
      formdata.append('comment', data?.comment);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      setFlourEditLoad(true);

      // print(formdata, 'form');

      const response = await fetch(Url().flour_report, requestOptions);
      // print(response, 'respo');
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse, 'resp');
          setFlourEditSheet(false);
          Toast.show(resparse?.data, {type: 'success', duration: 2000});
        }
      }
      setFlourEditLoad(false);
    } catch (error) {
      console.log(error, 'error in the flour follow api call');
      setFlourEditLoad(false);
    }
  };

  const Navtabs = ({activeButtons}) => {
    switch (activeButtons) {
      case 0:
        return <FlourDetailInfo data={flourDetail} />;
      case 1:
        return <FlourDetailMill data={flourDetail} />;
      case 2:
        return (
          <FlourDetailReview
            data={flourDetail}
            flourId={Detail.flourId}
            apiCall={flourDetailApicall}
          />
        );
    }
  };

  return (
    <View
      style={[
        commenStyle.rootPage,
        {
          backgroundColor: appColor.cardbg,
        },
      ]}>
      {/* <View
        style={{
          position: load ? 'relative' : 'absolute',
          top: 0,
          zIndex: 2,
          width: '100%',
          backgroundColor: isTransparent ? 'transparent' : '#fff',
        }}>
        <AppHeader title={flourDetail.flourName} animation={isTransparent} />
      </View> */}
      {!load ? (
        <>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollA}}}],
              {useNativeDriver: true},
            )}>
            {/* banner Img */}
            <View
              style={{
                backgroundColor: appColor.bgWhite,
                position: 'relative',
              }}>
              <Animated.View
                style={{
                  width: '100%',
                  height: bannerHeight,
                  marginBottom: scrnWidth / 3 / 3 + 20,
                  opacity: scrollA.interpolate({
                    inputRange: [-bannerHeight / 2, bannerHeight / 2],
                    outputRange: [2, 0.5],
                  }),
                }}>
                {/* flour banner */}
                {flourDetail?.pageBanner && flourDetail?.pageBanner != '' && (
                  <Animated.Image
                    source={{uri: flourDetail.pageBanner}}
                    style={[
                      {
                        width: '100%',
                        height: '100%',
                        transform: [{translateY: scrollA}],
                      },
                    ]}
                    resizeMode="cover"
                  />
                )}
                {/* product Img */}
                {flourDetail?.FlourImg && flourDetail?.FlourImg != '' && (
                  <Animated.View
                    style={[
                      styles.productImgParent,
                      commenStyle.shadow,
                      {
                        borderRadius: 10,
                        // overflow: 'hidden',
                        padding: widthResponse ? 10 : 15,
                        transform: [
                          {
                            scale: scrollA.interpolate({
                              inputRange: [-bannerHeight / 3, 0],
                              outputRange: [1.5, 1],
                            }),
                          },
                        ],
                      },
                    ]}>
                    <Image
                      source={{uri: flourDetail.FlourImg}}
                      style={{height: '100%', width: '100%'}}
                      resizeMode="contain"
                    />
                  </Animated.View>
                )}
              </Animated.View>
              {/* Flag edit button  */}
              <TouchableOpacity
                onPress={() => setFlourEditSheet(true)}
                style={[
                  commenStyle.hFlex,
                  {
                    // marginBottom: 20,
                    width: widthResponse ? 40 : 50,
                    aspectRatio: 1,
                    backgroundColor: appColor.bgWhite,
                    padding: 3,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    right: '5%',
                    top: '10%',
                  },
                ]}>
                <Icon
                  name={'flag'}
                  ComponentName={'Ionicons'}
                  color={appColor.primary}
                  size={widthResponse ? 20 : 24}
                />
                {/* {flourDetail?.report?.button && (
                    <Text
                      style={[
                        commenStyle.sideHead,
                        {
                          color: appColor.textBlack,
                          fontSize: fontScalling(1.8),
                          marginBottom: 0,
                          marginLeft: widthResponse ? 5 : 10,
                        },
                      ]}>
                      {flourDetail?.report?.button}
                    </Text>
                  )} */}
              </TouchableOpacity>
            </View>
            {/* Product detail */}
            <View
              style={[
                commenStyle.container,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  paddingTop: 10,
                },
              ]}>
              {/* flour name */}
              {Detail?.flourName && (
                <Text
                  style={[commenStyle.sideHead, {color: appColor.textBlack}]}>
                  {Detail.flourName}
                </Text>
              )}
              {/* review and country */}
              <View
                style={[
                  commenStyle.hFlex,
                  {
                    marginBottom: widthResponse ? 15 : 20,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  },
                ]}>
                {/* review */}
                {flourDetail?.flourRating &&
                  flourDetail?.flourRating != 0.0 && (
                    <>
                      <Review
                        review={flourDetail.flourRating}
                        style={{
                          marginRight: widthResponse ? 6 : 10,
                        }}
                      />
                      {/* slace */}
                      <View style={[styles.slace]} />
                    </>
                  )}

                {/* country */}
                {flourDetail?.country && (
                  <Country
                    // flag={Detail.country.flag}
                    country={flourDetail.country}
                  />
                )}
                {/* slace */}
                <View style={[styles.slace]} />
                {flourDetail?.millName && (
                  <Text
                    style={[
                      commenStyle.authSubButton,
                      {color: appColor.Textlightblack},
                    ]}>
                    {flourDetail?.millTitle && flourDetail.millTitle} :
                    <Text style={{fontFamily: appFont.lR}}>
                      {' '}
                      {flourDetail.millName}
                    </Text>
                  </Text>
                )}
              </View>
              {/* follow btn */}
              <PrimaryButton
                onPress={flourFollowApiCall}
                text={
                  flourDetail?.flour_follow && flourDetail?.flour_follow == 0
                    ? flourDetail?.follow_button && flourDetail.follow_button
                    : flourDetail?.un_follow_button &&
                      flourDetail.un_follow_button
                }
                style={{
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  marginBottom: 20,
                }}
              />
              {/* flower cost dropdown */}
              {isLogged ? (
                <View
                  style={[
                    commenStyle.whiteCard,
                    commenStyle.shadow,
                    {width: '100%', marginBottom: 20},
                  ]}>
                  <Pressable
                    onPress={() => setPriceDrop(!priceDrop)}
                    style={[
                      commenStyle.hFlex,
                      {padding: 15, borderRadius: 15},
                    ]}>
                    {flourDetail?.avg_price_title && (
                      <Text
                        style={[
                          commenStyle.authSubButton,
                          {
                            color: appColor.textBlack,
                            fontSize: fontScalling(2),
                            lineHeight: fontScalling(2.2),
                            flex: 1,
                          },
                        ]}>
                        {flourDetail.avg_price_title}
                      </Text>
                    )}
                    <Icon
                      ComponentName={'FontAwesome6'}
                      name={priceDrop ? 'chevron-up' : 'chevron-down'}
                      color={appColor.black}
                      size={16}
                    />
                  </Pressable>
                  {priceDrop && (
                    <View style={[{padding: 20, paddingTop: 5}]}>
                      <Controller
                        name="price"
                        control={control}
                        render={({field: {value, onChange}}) => (
                          <InputText
                            placeholder={'0.00'}
                            value={
                              // flourPriceSubmit
                              //   ? flourDetail?.userPrice && //io
                              //     euro(flourDetail?.userPrice)
                              // : value
                              priceFocus ? value : euro(value)
                            }
                            formError={errors.price}
                            onFocus={() => setPriceFocus(true)}
                            onBlur={() => setPriceFocus(false)}
                            onChangeText={onChange}
                            keyboardType={'numeric'}
                            // editable={!flourPriceSubmit ? true : false}
                            // amount={flourPriceSubmit ? false : true}
                          />
                        )}
                      />
                      {/* {!flourPriceSubmit ? ( */}
                      <PrimaryButton
                        textStyle={{
                          fontSize: fontScalling(2),
                          lineHeight: fontScalling(2.2),
                        }}
                        onPress={handleSubmit(FlourPriceSubmitApi)}
                        text={flourDetail?.submit_button}
                        black
                        style={{marginBottom: 10}}
                      />
                      {/* ) : null} */}
                      {flourDetail?.avg_price_value &&
                        flourDetail?.avg_price_value != 0 && (
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            {flourDetail?.avg_price && (
                              <Text
                                style={[
                                  commenStyle.authSubButton,
                                  {
                                    color: appColor.textBlack,
                                    fontSize: fontScalling(2),
                                    lineHeight: fontScalling(2.2),
                                    marginBottom: 6,
                                  },
                                ]}>
                                {flourDetail.avg_price}
                              </Text>
                            )}
                            {flourDetail?.avg_price_value && (
                              <Text style={[commenStyle.settingLinks]}>
                                {euro(flourDetail?.avg_price_value)}
                              </Text>
                            )}
                          </View>
                        )}
                    </View>
                  )}
                </View>
              ) : null}
            </View>
            {/* Navtabs */}
            <View
              style={[
                // commenStyle.container,
                {
                  paddingVertical: 20,
                },
              ]}>
              {/* tab bars */}
              {flourDetail?.tab_titles && flourDetail.tab_titles.length > 0 && (
                <NavButton
                  title={flourDetail.tab_titles}
                  activeButtons={activeButtons}
                  onPress={setActiveButtons}
                  altStyle={{marginBottom: widthResponse ? 20 : 25}}
                />
              )}
              <Navtabs activeButtons={activeButtons} />
            </View>
          </Animated.ScrollView>
          <Button flourDetail={flourDetail} />
          {/* suggest edit modal  */}
          <ModalBottomSheet
            isVisible={flourEditSheet}
            sheetLoad={flourEditLoad}
            close={() => {
              setFlourEditSheet(false);
            }}
            sheetTitle={flourDetail?.report?.button}>
            {/* for reason */}
            <Controller
              name="reason"
              control={flagControl}
              render={({field: {onChange, value}}) => (
                <Radio
                  options={flourDetail?.report?.reasons}
                  onchange={onChange}
                  value={value}
                  label={flourDetail?.report?.reason}
                  formError={flagErrors.reason}
                />
              )}
            />
            {/* for the comment */}
            <Controller
              name="comment"
              control={flagControl}
              render={({field: {onChange, value}}) => (
                <InputText
                  label={flourDetail?.report?.comment}
                  placeholder={flourDetail?.report?.comment_placeholder}
                  formError={flagErrors.comment}
                  value={value}
                  onChangeText={onChange}
                  numberOfLines={3}
                  textVertical
                  multiline
                />
              )}
            />
            <PrimaryButton
              text={flourDetail?.report?.submit}
              onPress={flagSubmit(flourEditApi)}
            />
          </ModalBottomSheet>
        </>
      ) : (
        <PageLoader />
      )}
    </View>
  );
};

const Button = ({flourDetail}) => {
  const keyboardVisible = KeyboardVisible().valueOf();
  const {commenStyle} = useStyle();
  const navigation = useNavigation();
  const {styles} = pageStyle();
  const appColor = appColors();
  return (
    !keyboardVisible && (
      <View
        style={[
          commenStyle.container,
          {
            backgroundColor: appColor.cardbg,
            paddingVertical: widthResponse ? 10 : 15,
          },
        ]}>
        <PrimaryButton
          text={flourDetail?.calcBtn && flourDetail.calcBtn}
          onPress={() => {
            navigation.navigate('Calculeer', {
              screen: 'calculator',
              params: {
                data: {
                  name: flourDetail?.flourName,
                  flourId: flourDetail?.flourId,
                  wValue: flourDetail?.wValue,
                  thumb: flourDetail?.FlourImg,
                  flourStrength: flourDetail?.flourstrength,
                },
                value: 'Value',
              },
            });
          }}
        />
      </View>
    )
  );
};

export default FlourDetail;

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    productImgParent: {
      alignSelf: 'center',
      position: 'absolute',
      width: scrnWidth / 3,
      height: scrnWidth / 3,
      bottom: -scrnWidth / 3 / 3,
      backgroundColor: appColor.bgWhite,
      elevation: 15,
      borderRadius: 15,
    },
    slace: {
      height: widthResponse ? 15 : 19,
      width: 1,
      backgroundColor: appColor.bgBlack,
      opacity: 0.3,
      marginHorizontal: widthResponse ? 10 : 15,
    },
    container: {
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
    },
    touchable: {borderColor: 'black'},
    text: {alignSelf: 'center'},
  });
  return {styles};
};
