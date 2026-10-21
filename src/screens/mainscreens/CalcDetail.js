import {
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import {
  fontScalling,
  permissionAlert,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {appFont} from '../../Utilities/appFont';
import {useToast} from 'react-native-toast-notifications';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import RecipeList from '../../components/Cards/RecipeList';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {InputText} from '../../components/InputFields/InputText';
import CalcInput from '../../components/InputFields/CalcInput';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import {Icon} from '../../Utilities/icon';
import ImageCropPicker from 'react-native-image-crop-picker';
import * as Animatable from 'react-native-animatable';
import {setCalcValues} from '../../Redux/CalculationSlice';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import ValidationContent from '../../Hooks/ValidationContent';
import RecipeFlour from '../../components/Cards/RecipeFlour';

const CalcDetail = ({route}) => {
  const reciImage = require('../../../assets/images/logo.png');
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const {styles} = pagestyles();
  const {setters, deviceId, userId} = useSelector(state => state.appSettings);
  const {isLogged} = useSelector(State => State.authSettings);
  const detail = route?.params && route?.params?.calcdata;
  const keyboardVisible = KeyboardVisible(true); //@@
  const {calcValues} = useSelector(state => state.calcuationValues);
  // print(detail, 'detail');
  const Navigation = useNavigation();
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [calcResult, setCalcResult] = useState({});
  const [saveSheet, setSaveSheet] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const toast = useToast();
  const [count, setCount] = useState(
    calcResult?.rice ? calcResult.rice.length : 0,
  );
  const [animButton, setAnimButton] = useState(false);
  const [recipeImage, setRecipeImage] = useState({
    name: 'profile.jpeg',
    uri: '',
    type: 'image/jpeg',
  });
  const [saveData, setSaveData] = useState({
    recipeName: '',
    comment: '',
    date: moment().format('L'),
    time: moment().format('LT'),
    proofing: calcResult?.rice
      ? calcResult.rice
      : [
          {
            hours: '',
            temperature: '',
            type: '',
          },
        ],
  });
  const {valContent} = ValidationContent();
  const [sheetLoad, setSheetLoad] = useState(false);

  // schemaa for the proofing
  const schema = yup.object({
    recipeName: yup.string().required(valContent?.what_is_your_recipe_called),
    comment: yup.string().required(valContent?.type_your_comment),
    // proofing: yup.array().of(
    //   yup.object().shape({
    //     hours: yup.string().required(valContent?.enter_hours),
    //     temperature: yup.string().required(valContent?.enter_temperature),
    //     type: yup.string().required(valContent?.select_proof),
    //   }),
    // ),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: saveData,
  });

  const currentValue = watch();

  // camer open function
  const OpenCamera = async () => {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      width: 200,
      height: 200,
      cropping: true,
      compressImageMaxHeight: 200,
      compressImageMaxWidth: 200,
    })
      .then(image => {
        let fileName = 'profile.' + image.mime.split('/')[1];
        setRecipeImage({
          ...recipeImage,
          name: fileName,
          uri: image.path,
          type: 'image/jpeg',
        });
      })
      .catch(error => {
        console.log(error);
        if (error.message == 'User did not grant camera permission.') {
          permissionAlert('Camera');
        }
      });
    setAnimButton(!animButton);
  };

  // gallery open function
  const OpenGallery = async () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      width: 200,
      height: 200,
      cropping: true,
      compressImageMaxHeight: 200,
      compressImageMaxWidth: 200,
    })
      .then(image => {
        let fileName = 'profile.' + image.mime.split('/')[1];
        setRecipeImage({
          ...recipeImage,
          name: fileName,
          uri: image.path,
          type: 'image/jpeg',
        });
      })
      .catch(error => {
        console.log(error);
        if (error.message == 'User did not grant library permission.') {
          permissionAlert('Gallery');
        }
      });
    setAnimButton(!animButton);
  };

  // Handle delete logic
  const handleDeleteImage = () => {
    setRecipeImage({
      ...recipeImage,
      uri: calcResult?.logo,
    });
    setAnimButton(false);
  };

  //   for adding the new prrofing
  const addField = () => {
    setCount(count + 1);
    setValue('proofing', [
      ...currentValue.proofing,
      {
        hours: '',
        temperature: '',
        type: '',
      },
    ]);
  };

  //   for removing prrofing
  const removeField = ind => {
    setCount(count - 1);
    currentValue.proofing.splice(ind, 1);
  };

  // uploading the recipe image
  const uploadRecipeImageApiCall = async () => {
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
      formdata.append('calcId', calcResult?.id);
      if (recipeImage?.uri && recipeImage?.uri != '') {
        formdata.append('file', recipeImage);
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      // print(formdata, 'formdata');
      const response = await fetch(Url().uploadRecipeImage, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resp');
        if (resparse.status == 'success') {
        }
      }
    } catch (error) {
      console.log(error, 'error in recipe image upload');
    }
  };

  //   this is only for the calculationDetail
  const calculateRecipeApiCall = async () => {
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
      if (setters && setters?.temperature?.tshort) {
        formdata.append(
          'tshort',
          setters?.temperature?.tshort ? setters?.temperature?.tshort : '°c',
        );
      }

      if (detail?.calcId) formdata.append('calcId', detail.calcId);
      if (setters && setters?.weight?.ushort) {
        formdata.append(
          'uShort',
          setters?.weight?.ushort ? setters?.weight?.ushort : 'g',
        );
      }
      if (deviceId) formdata.append('uuId', deviceId);

      // print(detail, 'details');

      if (detail) {
        // if (detail.flourId)
        formdata.append('flourId', detail.flourId ? detail.flourId : 0);
        // formdata.append('wValue', detail.wValue ? detail.wValue : detail.floorstrength);
        formdata.append('wValue', detail.wValue ? detail.wValue : 0);
        formdata.append(
          'wName',
          detail.floorstrength ? detail.floorstrength : '',
        );
        formdata.append('weight', detail.weight);
        formdata.append('hydration', detail.water);
        formdata.append('yeastType', detail.yeasttype);
        formdata.append('yeast', detail.yeast);
        formdata.append('salt', detail.salt);
        formdata.append('oil', detail.oil);
        if (detail?.flourCalculator == '0') {
          formdata.append('flourCalculator', 0);
          formdata.append('pieces', detail.dough);
          if (detail.doughHelp.adults)
            formdata.append('no_of_adults', detail.doughHelp.adults);
          if (detail.doughHelp.kids)
            formdata.append('no_of_kids', detail.doughHelp.kids);
          if (detail.doughHelp.hungry) {
            formdata.append('hungry_level', detail.doughHelp.hungry.sorting);
            formdata.append('hungry_key', detail.doughHelp.hungry.sorting_key);
          }

          if (detail.totalDough)
            formdata.append('no_of_balls', detail.totalDough);
          if (detail && detail.premiumToggle) {
            if (detail?.predoughType && detail?.minPercentage) {
              formdata.append('pre_dough', 1);
              formdata.append('pre_dough_types', detail.predoughType);
              formdata.append('pre_dough_percent_one', detail.minPercentage);
              // formdata.append('pre_dough_percent_two', detail.maxPercentage);
            }
          } else {
            formdata.append('pre_dough', 0);
          }
        } else {
          formdata.append('flourCalculator', 1);
          formdata.append('fweight', detail?.flour);
        }
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      setLoad(true);
      dispatch(setTitleLoad(true));
      const response = await fetch(Url().calculateRecipe, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse.data, 'respar clc');
          setCalcResult(resparse.data);
          setCount(resparse.data?.riceCount ? resparse.data.riceCount : 0);
          setSaveData(pre => ({
            ...pre,
            recipeName: resparse?.data?.recipeName,
            comment: resparse?.data?.comment_val,
            proofing: resparse.data.rice,
          }));
          setValue('recipeName', resparse?.data?.recipeName);
          setValue('comment', resparse?.data?.comment_val);
          setValue('proofing', resparse?.data?.rice);
          setRecipeImage({
            ...recipeImage,
            uri: resparse?.data?.recipeImage
              ? resparse.data.recipeImage
              : detail?.thumbNail
              ? detail.thumbNail
              : resparse.data.logo,
          });
          Navigation.setOptions({
            title: resparse?.data?.recipeName
              ? resparse.data.recipeName
              : resparse.data.formTitle,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in recipe calculator');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  // saving the calculations
  const saving_the_calculationApiCall = async data => {
    // print(data, 'dave');
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
      if (setters && setters?.temperature?.tshort) {
        formdata.append(
          'tshort',
          setters?.temperature?.tshort ? setters?.temperature?.tshort : '°c',
        );
      }
      formdata.append('calcId', calcResult?.id);
      formdata.append('card', data.recipeName);
      formdata.append('comment', data.comment);
      formdata.append('saveDate', data.date);
      formdata.append('saveTime', data.time);
      // formdata.append('rice', JSON.stringify(saveData.proofing));
      // sendTheProofingDatas(data.proofing);
      if (deviceId) formdata.append('uuId', deviceId);
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      // print(formdata, 'form');
      setSheetLoad(true);
      const response = await fetch(Url().saveCalculation, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          toast.show(calcResult?.notify?.saved, {
            type: 'success',
            duration: 2000,
          });
          uploadRecipeImageApiCall();
          setSaveSheet(false);
          setSaveData({
            recipeName: '',
            time: '',
            comment: '',
            date: '',
            proofing: [
              {
                hours: '',
                temperature: '',
                type: '',
              },
            ],
          });
          reset();
          setCount(0);
          dispatch(setCalcValues({}));
          setTimeout(() => {
            Navigation.navigate('recepten', {
              screen: 'recipeoverview',
            });
          }, 2000);
        }
        if (resparse.status == 'error') {
          toast.show(calcResult?.notify?.failed, {
            type: 'danger',
            duration: 2000,
          });
        }
        setSheetLoad(false);
      }
    } catch (error) {
      console.log(error, 'error in the saving the calculation api ');
      setSheetLoad(false);
    }
  };

  const sendTheProofingDatas = async proofDatas => {
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
      // proofDatas.forEach(element => formdata.append('values[]', element));
      formdata.append('values', JSON.stringify(proofDatas));
      formdata.append('calcid', calcResult?.id);
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      // print(formdata);
      const response = await fetch(Url().proofingValues, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'ealfsl');
        if (resparse.status == 'success') {
        }
        if (resparse.status == 'error') {
        }
      }
    } catch (error) {
      console.log(error, 'error in the sending theproofing api ');
    }
  };

  useEffect(() => {
    if (detail) {
      calculateRecipeApiCall();
    }
  }, [
    detail,
    detail.flourId,
    setters?.weight?.ushort,
    setters?.language,
    detail.calcId,
    setters?.temperature?.tshort,
  ]);

  return (
    <>
      {!load ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={[
              {
                backgroundColor: appColor.cardBack,
              },
            ]}>
            {/* flour image */}
            <ImageBackground
              source={{uri: calcResult?.pageBanner}}
              style={[
                {
                  paddingVertical: widthResponse ? 15 : 20,
                },
              ]}
              resizeMode="cover">
              <View style={[commenStyle.container]}>
                <Pressable
                  onPress={() => setAnimButton(!animButton)}
                  style={{
                    width: scrnWidth / 4,
                    height: scrnWidth / 4,
                    borderRadius: scrnWidth / 8,
                    position: 'relative',
                    backgroundColor: appColor.cardbg,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {recipeImage?.uri && calcResult?.logo != '' && (
                    <Image
                      source={{uri: recipeImage.uri}}
                      style={[
                        {
                          width: '100%',
                          height: '100%',
                          // position: 'absolute',
                          // zIndex: 10,
                          borderRadius: 100,
                        },
                      ]}
                      resizeMode="cover"
                    />
                  )}
                  {/* edit button */}
                  <Pressable
                    onPress={() => {
                      setAnimButton(!animButton), 1000;
                    }}
                    style={{
                      backgroundColor: appColor.bgBlack,
                      width: widthResponse ? 30 : 50,
                      height: widthResponse ? 30 : 50,
                      borderRadius: 30,
                      borderWidth: 2,
                      borderColor: appColor.white,
                      position: 'absolute',
                      top: scrnWidth / 6,
                      // left: scrnWidth / 6,
                      right: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      color={appColor.white}
                      size={widthResponse ? 10 : 20}
                      ComponentName={'FontAwesome5'}
                      name={'edit'}
                    />
                  </Pressable>
                  {animButton && (
                    <>
                      {/* camer button */}
                      <Animatable.View
                        isInteraction={true}
                        duration={!animButton ? 500 : 400}
                        animation={!animButton ? 'fadeInRight' : 'fadeInLeft'}
                        onTouchStart={() => {
                          OpenCamera();
                        }}
                        style={{
                          backgroundColor: appColor.primary,
                          width: scrnWidth > 500 ? 50 : 30,
                          height: scrnWidth > 500 ? 50 : 30,
                          borderRadius: scrnWidth > 500 ? 25 : 15,
                          shadowColor: appColor.bgBlack,
                          elevation: 5,
                          shadowOpacity: 0.3,
                          shadowOffset: {height: 10},
                          position: 'absolute',
                          top: '40%',
                          right: '-20%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                        }}>
                        <Icon
                          color={appColor.white}
                          size={scrnWidth > 500 ? 22 : 13}
                          ComponentName={'FontAwesome5'}
                          name={'camera'}
                        />
                      </Animatable.View>
                      {/* gallery button */}
                      <Animatable.View
                        duration={!animButton ? 900 : 800}
                        animation={!animButton ? 'fadeInRight' : 'fadeInLeft'}
                        onTouchStart={() => {
                          OpenGallery();
                        }}
                        style={{
                          backgroundColor: appColor.primary,
                          width: scrnWidth > 500 ? 50 : 30,
                          height: scrnWidth > 500 ? 50 : 30,
                          borderRadius: scrnWidth > 500 ? 25 : 15,
                          shadowColor: appColor,
                          elevation: 5,
                          shadowOpacity: 0.3,
                          shadowOffset: {height: 10},
                          position: 'absolute',
                          top: '3%',
                          right: '-5%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Icon
                          color={appColor.white}
                          size={scrnWidth > 500 ? 22 : 13}
                          ComponentName={'MaterialCommunityIcons'}
                          name={'folder-multiple-image'}
                        />
                      </Animatable.View>
                      {/* delete button */}
                      {recipeImage?.uri && recipeImage?.uri != '' && (
                        <Animatable.View
                          duration={!animButton ? 1300 : 1200}
                          animation={!animButton ? 'fadeInRight' : 'fadeInLeft'}
                          onTouchStart={() => {
                            handleDeleteImage();
                          }}
                          style={{
                            backgroundColor: appColor.primary,
                            width: scrnWidth > 500 ? 50 : 30,
                            height: scrnWidth > 500 ? 50 : 30,
                            borderRadius: scrnWidth > 500 ? 25 : 15,
                            shadowColor: appColor.boldBlacktext,
                            elevation: 5,
                            shadowOpacity: 0.3,
                            shadowOffset: {height: 10},
                            position: 'absolute',
                            top: '-10%',
                            left: '30%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Icon
                            color={appColor.white}
                            size={scrnWidth > 500 ? 22 : 13}
                            ComponentName={'FontAwesome5'}
                            name={'trash'}
                          />
                        </Animatable.View>
                      )}
                    </>
                  )}
                </Pressable>
              </View>
            </ImageBackground>

            <View
              style={[
                commenStyle.container,
                {
                  paddingVertical: widthResponse ? 15 : 20,
                },
              ]}>
              <View
                style={[
                  commenStyle.hFlex,
                  {
                    marginBottom: widthResponse ? 25 : 35,
                  },
                ]}>
                {/* title */}
                {calcResult?.formTitle && (
                  <Text
                    style={[
                      commenStyle.sideHead,
                      {
                        textAlign: 'center',
                        // fontSize: fontScalling(3),
                        textTransform: 'uppercase',
                        color: appColor.primary,
                        marginBottom: 0,
                      },
                    ]}>
                    {calcResult.formTitle}
                  </Text>
                )}
                {calcResult?.share?.url && (
                  <TouchableOpacity
                    style={{
                      width: widthResponse ? 35 : 45,
                      height: widthResponse ? 35 : 45,
                      borderRadius: 50,
                      backgroundColor: appColor.bgBlack,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 'auto',
                    }}
                    onPress={() => {
                      Linking.openURL(calcResult.share.url);
                    }}>
                    <Icon
                      ComponentName={'FontAwesome5'}
                      name={'file-pdf'}
                      color={appColor.bgWhite}
                      size={widthResponse ? 17 : 20}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* recipe list one */}
              {/* {calcResult?.flourDetails?.value != 0 && (
                <RecipeList
                  flour
                  top
                  bottom
                  label={calcResult?.flourDetails?.title}
                  title={calcResult?.flourDetails?.title}
                  value={calcResult?.flourDetails?.value}
                  unit={calcResult?.flourDetails?.postfix}
                />
              )} */}

              {/* recipe list two */}
              {calcResult?.restTimes && (
                <>
                  {/* {calcResult?.restTimes?.withcool?.value != 0 && (
                    <RecipeList
                      top
                      border
                      margin
                      label={calcResult?.restTimes?.title}
                      title={calcResult?.restTimes?.withcool?.title}
                      value={calcResult?.restTimes?.withcool?.value}
                    />
                  )}
                  {calcResult?.restTimes?.withoutcool?.value != 0 && (
                    <RecipeList
                      bottom
                      title={calcResult?.restTimes?.withoutcool?.title}
                      value={calcResult?.restTimes?.withoutcool?.value}
                    />
                  )} */}
                  {/* resting note */}
                  {/* {calcResult?.restTimes.note && (
                    <Text
                      style={[
                        commenStyle.para,
                        {
                          color: appColor.primary,
                        },
                      ]}>
                      {calcResult.restTimes.note}
                    </Text>
                  )} */}
                </>
              )}

              {/* recipe list three */}
              {calcResult?.doughBalls && (
                <>
                  {calcResult?.doughBalls?.pieces?.value != 0 && (
                    <RecipeList
                      top
                      border
                      margin
                      label={calcResult?.doughBalls?.title}
                      title={calcResult?.doughBalls?.pieces?.title}
                      value={calcResult?.doughBalls?.pieces?.value}
                      unit={calcResult?.doughBalls?.pieces?.postfix}
                    />
                  )}
                  {calcResult?.doughBalls?.weight?.value != 0 && (
                    <RecipeList
                      bottom
                      title={calcResult?.doughBalls?.weight?.title}
                      value={calcResult?.doughBalls?.weight?.value}
                      unit={calcResult?.doughBalls?.weight?.postfix}
                    />
                  )}
                </>
              )}

              {/* used flour  */}
              {calcResult?.flourDetails?.flourDetails && (
                <RecipeFlour
                  title={calcResult?.flourDetails?.title}
                  flourName={calcResult?.flourDetails?.flourDetails?.fname}
                  flourimage={calcResult?.flourDetails?.flourDetails?.fimage}
                />
              )}

              {/* recipe list four */}
              {calcResult?.yourValues && (
                <>
                  {calcResult?.flourDetails?.value != 0 && (
                    <RecipeList
                      flour
                      top
                      border
                      margin
                      // bottom
                      // label={calcResult?.flourDetails?.title}
                      label={calcResult?.yourValues?.title}
                      title={calcResult?.flourDetails?.title}
                      value={calcResult?.flourDetails?.value}
                      unit={calcResult?.flourDetails?.postfix}
                    />
                  )}
                  {calcResult?.yourValues?.hydration?.value != 0 && (
                    <RecipeList
                      border
                      margin
                      title={calcResult?.yourValues?.hydration?.title}
                      value={calcResult?.yourValues?.hydration?.value}
                      unit={calcResult?.yourValues?.hydration?.postfix}
                    />
                  )}
                  {calcResult?.yourValues?.yeastType?.value != 0 && (
                    <RecipeList
                      margin
                      border
                      title={calcResult?.yourValues?.yeastType?.title}
                      value={calcResult?.yourValues?.yeastType?.value}
                    />
                  )}
                  {calcResult?.yourValues?.yeast?.value != 0 && (
                    <RecipeList
                      margin
                      border
                      title={calcResult?.yourValues?.yeast?.title}
                      value={calcResult?.yourValues?.yeast?.value}
                      unit={calcResult?.yourValues?.yeast?.postfix}
                    />
                  )}
                  {calcResult?.yourValues?.salt?.value != 0 && (
                    <RecipeList
                      margin
                      border
                      title={calcResult?.yourValues?.salt?.title}
                      value={calcResult?.yourValues?.salt?.value}
                      unit={calcResult?.yourValues?.salt?.postfix}
                    />
                  )}
                  {calcResult?.yourValues?.oil?.value != 0 && (
                    <RecipeList
                      bottom
                      title={calcResult?.yourValues?.oil?.title}
                      value={calcResult?.yourValues?.oil?.value}
                      unit={calcResult?.yourValues?.oil?.postfix}
                    />
                  )}
                </>
              )}

              {/* pre dough and main-dough */}

              {detail.premiumToggle && calcResult?.pre_dough && (
                <>
                  {calcResult?.pre_dough?.flour?.value != 0 && (
                    <RecipeList
                      top
                      border
                      margin
                      flour
                      label={calcResult?.pre_dough?.title}
                      title={calcResult?.pre_dough?.flour?.title}
                      value={calcResult?.pre_dough?.flour?.value}
                      unit={calcResult?.pre_dough?.flour?.postfix}
                    />
                  )}
                  {calcResult?.pre_dough?.hydration?.value != 0 && (
                    <RecipeList
                      margin
                      border
                      unit={calcResult?.pre_dough?.hydration?.postfix}
                      title={calcResult?.pre_dough?.hydration?.title}
                      value={calcResult?.pre_dough?.hydration?.value}
                    />
                  )}
                  {calcResult?.pre_dough?.yeast?.value != 0 && (
                    <RecipeList
                      margin
                      border
                      title={calcResult?.pre_dough?.yeast?.title}
                      value={calcResult?.pre_dough?.yeast?.value}
                      unit={calcResult?.pre_dough?.yeast?.postfix}
                    />
                  )}
                  {calcResult?.pre_dough?.yeastType?.value != 0 && (
                    <RecipeList
                      margin
                      border
                      title={calcResult?.pre_dough?.yeastType?.title}
                      value={calcResult?.pre_dough?.yeastType?.value}
                    />
                  )}
                  {calcResult?.pre_dough?.total_voordeeg?.value != 0 && (
                    <RecipeList
                      bottom
                      title={calcResult?.pre_dough?.total_voordeeg?.title}
                      value={calcResult?.pre_dough?.total_voordeeg?.value}
                      unit={calcResult?.pre_dough?.total_voordeeg?.postfix}
                    />
                  )}
                </>
              )}

              {detail.premiumToggle && calcResult?.main_dough && (
                <>
                  {calcResult?.main_dough?.flour?.value != 0 && (
                    <RecipeList
                      flour
                      top
                      border
                      margin
                      label={calcResult?.main_dough?.title}
                      title={calcResult?.main_dough?.flour?.title}
                      value={calcResult?.main_dough?.flour?.value}
                      unit={calcResult?.main_dough?.flour?.postfix}
                    />
                  )}
                  {calcResult?.main_dough?.hydration?.value != 0 && (
                    <RecipeList
                      margin
                      border
                      unit={calcResult?.main_dough?.hydration?.postfix}
                      title={calcResult?.main_dough?.hydration?.title}
                      value={calcResult?.main_dough?.hydration?.value}
                    />
                  )}
                  {/* <RecipeList
                    margin
                    border
                    title={calcResult?.main_dough?.yeast?.title}
                    value={calcResult?.main_dough?.yeast?.value}
                    unit={calcResult?.main_dough?.yeast?.postfix}
                  /> */}
                  {/* <RecipeList
                    margin
                    border
                    title={calcResult?.main_dough?.yeastType?.title}
                    value={calcResult?.main_dough?.yeastType?.value}
                  /> */}
                  {calcResult?.main_dough?.salt?.value != 0 && (
                    <RecipeList
                      margin
                      border
                      title={calcResult?.main_dough?.salt?.title}
                      value={calcResult?.main_dough?.salt?.value}
                      unit={calcResult?.main_dough?.salt?.postfix}
                    />
                  )}
                  {calcResult?.main_dough?.oil?.value != 0 && (
                    <RecipeList
                      bottom
                      title={calcResult?.main_dough?.oil?.title}
                      value={calcResult?.main_dough?.oil?.value}
                      unit={calcResult?.main_dough?.oil?.postfix}
                    />
                  )}
                </>
              )}

              {/* total dough  */}
              {calcResult?.yourValues?.total_deeg?.value != 0 && (
                <RecipeList
                  top
                  bottom
                  flour
                  label={calcResult?.yourValues?.total_deeg?.title}
                  title={calcResult?.flourDetails?.title}
                  value={calcResult?.yourValues?.total_deeg?.value}
                  unit={calcResult?.yourValues?.total_deeg?.postfix}
                />
              )}
            </View>
          </ScrollView>
          {/* save and back button */}
          <View
            style={[
              commenStyle.hFlex,
              commenStyle.container,
              {
                justifyContent: 'space-between',
                width: '100%',
                paddingVertical: widthResponse ? 10 : 15,
              },
            ]}>
            <PrimaryButton
              invert
              text={calcResult?.buttons?.edit}
              style={{
                width: '49%',
                paddingHorizontal: widthResponse ? 10 : 15,
              }}
              onPress={() => {
                if (Navigation.canGoBack) {
                  Navigation.goBack();
                }
              }}
            />
            <PrimaryButton
              text={calcResult?.buttons?.save}
              style={{
                width: '49%',
                paddingHorizontal: widthResponse ? 10 : 15,
              }}
              onPress={() => setSaveSheet(true)}
            />
          </View>

          {/* saving the calculation sheet */}
          <ModalBottomSheet
            isVisible={saveSheet}
            snapPoints={['55%', '55%']}
            close={() => setSaveSheet(false)}
            sheetLoad={sheetLoad}
            sheetTitle={calcResult?.popup?.title}>
            {/* <View style={{flex: 1}}>
              <BottomSheetScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                keyboardShouldPersistTaps={'always'}> */}
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps={'always'}
              contentContainerStyle={{
                marginBottom: keyboardVisible == 0 ? 40 : keyboardVisible,
              }}
              scrollEnabled={true}
              nestedScrollEnabled
              enableAutomaticScroll={true}
              extraHeight={0}
              showsVerticalScrollIndicator={false}>
              {/* for recipe name */}
              <Controller
                control={control}
                name="recipeName"
                render={({field: {onChange, value}}) => (
                  <InputText
                    label={calcResult?.popup?.name}
                    placeholder={calcResult?.popup?.name}
                    value={currentValue.recipeName}
                    onChangeText={e => {
                      onChange(e);
                      setSaveData({...saveData, recipeName: e});
                    }}
                    formError={errors.recipeName}
                  />
                )}
              />

              {/* for comment */}
              <Controller
                control={control}
                name="comment"
                render={({field: {onChange, value}}) => (
                  <InputText
                    label={calcResult?.comment}
                    placeholder={calcResult?.comment_placeholder}
                    multiline
                    value={currentValue.comment}
                    numberOfLines={3}
                    textVertical
                    onChangeText={e => {
                      onChange(e);
                      setSaveData({...saveData, comment: e});
                    }}
                    formError={errors.comment}
                  />
                )}
              />

              <PrimaryButton
                text={calcResult?.popup?.save}
                onPress={handleSubmit(saving_the_calculationApiCall)}
              />
            </KeyboardAwareScrollView>
            {/* </BottomSheetScrollView>
            </View> */}
          </ModalBottomSheet>
        </>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default CalcDetail;

const pagestyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    label: {
      marginLeft: 10,
      marginBottom: 0,
      textTransform: 'uppercase',
      fontSize: fontScalling(2.4),
      color: appColor.primary,
      fontFamily: appFont.lBl,
    },
    parentIcon: {
      backgroundColor: appColor.primary,
      borderRadius: 100,
      padding: 8,
    },
  });
  return {styles};
};
