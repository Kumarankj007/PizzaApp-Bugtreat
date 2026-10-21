import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import RangeSlider from '../../components/InputFields/RangeSlider';
import CountInput from '../../components/InputFields/CountInput';
import CalcDrop from '../../components/DropDowns.js/CalcDrop';
import Toggle from '../../components/Buttons/SwitchToggle';
import {InputText} from '../../components/InputFields/InputText';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useDispatch, useSelector} from 'react-redux';
import {Url} from '../../Utilities/appApi';
import {useNavigation} from '@react-navigation/native';
import {Icon} from '../../Utilities/icon';
import {Toast} from 'react-native-toast-notifications';
import {setCalcValues} from '../../Redux/CalculationSlice';
import YoutubePlayer from 'react-native-youtube-iframe';
import ModalPopup from '../../components/Modal/ModalPopup';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import {setPaywallSheet} from '../../Redux/HeaderSlice';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import ValidationContent from '../../Hooks/ValidationContent';
import CalcInfo from '../../components/Cards/CalcInfo';

const StandardCalculator = ({data, calculations, calcId, recipeImage}) => {
  const {setters, deviceId, userId, logo} = useSelector(
    state => state.appSettings,
  );
  const {calcValues} = useSelector(state => state.calcuationValues);
  const {isLogged, isSubscribed} = useSelector(State => State.authSettings);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const textFocus = useRef(null);
  const [premiumToggle, setPremiumToggle] = useState(
    data?.formCnt?.pre_dough?.value && data?.formCnt?.pre_dough?.value == '1'
      ? true
      : false,
  );
  const [doughSheet, setDoughSheet] = useState(false);
  const [predoughTool, setPreDoughTool] = useState(false);
  const keyboard = KeyboardVisible();
  const keyboardHeight = KeyboardVisible(true);

  const [dough, setDough] = useState(
    data?.formCnt?.doughBalls?.pieces ?? data?.formCnt?.doughBalls?.min,
  );
  const [weight, setWeight] = useState(
    data?.formCnt?.weight?.value ?? data?.formCnt?.weight?.def,
  );
  const [water, setWater] = useState(
    data?.formCnt?.hydration?.value ?? data?.formCnt?.hydration?.def,
  );
  const [yeasttype, setYeastType] = useState(
    data?.formCnt?.yeastType?.value ?? data?.formCnt?.yeastType?.placeholder,
  );
  const [yeast, setYeast] = useState(
    data?.formCnt?.yeast?.value ?? data?.formCnt?.yeast?.def,
  );
  const [salt, setSalt] = useState(
    data?.formCnt?.salt?.value ?? data?.formCnt?.salt?.def,
  );
  const [oil, setOil] = useState(
    data?.formCnt?.oil?.value ?? data?.formCnt?.oil?.def,
  );
  const [floorstrength, setFloorStrength] = useState(
    calculations?.flourStrength
      ? calculations.flourStrength
      : data?.formCnt?.flour_strength?.value
      ? data?.formCnt?.flour_strength?.value
      : '',
  );
  const [minPercentage, setMinPercentage] = useState(
    data?.formCnt?.percentage?.percent_one
      ? data.formCnt.percentage.percent_one
      : 0,
  );
  const [maxPercentage, setMaxPercentage] = useState(
    data?.formCnt?.percentage?.percent_two
      ? data.formCnt.percentage.percent_two
      : 0,
  );

  const [predoughType, setPreDoughType] = useState(
    data?.formCnt?.pre_dough_types?.value
      ? data?.formCnt?.pre_dough_types?.value
      : '',
  );
  const [doughHelp, setDoughHelp] = useState({
    adults: data?.formCnt?.Number_of_adults?.value
      ? data.formCnt.Number_of_adults.value
      : '',
    kids: data?.formCnt?.Number_of_kids?.value
      ? data.formCnt.Number_of_kids.value
      : '',
    hungry: data?.formCnt?.How_much_appetite?.value
      ? data.formCnt.How_much_appetite.value
      : '',
    numbers: data?.formCnt?.Aantal_deegbollen?.value
      ? data.formCnt.Aantal_deegbollen.value
      : '',
  });

  const [totalDough, setTotalDough] = useState(
    data?.formCnt?.Aantal_deegbollen?.value
      ? data.formCnt.Aantal_deegbollen.value
      : '',
  );
  const [restPopup, setRestPopup] = useState(false);
  const {valContent} = ValidationContent();
  const [toolModal, setToolModal] = useState(false);

  // setting the unchanged values
  useEffect(() => {
    if (calcValues && Object.keys(calcValues).length != 0) {
      setDough(calcValues?.dough);
      setPremiumToggle(calcValues?.premiumToggle);
      setWeight(calcValues.weight);
      setWater(calcValues?.water);
      setYeastType(calcValues?.yeasttype);
      setYeast(calcValues?.yeast);
      setSalt(calcValues?.salt);
      setOil(calcValues?.oil);
      setFloorStrength(calcValues?.floorstrength);
      setMinPercentage(calcValues?.minPercentage);
      setPreDoughType(calcValues?.predoughType);
      setDoughHelp({
        ...doughHelp,
        adults: calcValues?.doughHelp?.adults,
        kids: calcValues?.doughHelp?.kids,
        hungry: calcValues?.doughHelp?.hungry,
        numbers: calcValues?.doughHelp?.numbers,
      });
      setTotalDough(calcValues?.doughHelp?.numbers);
      setValue('adults', calcValues?.doughHelp?.adults);
      setValue('kids', calcValues?.doughHelp?.kids);
      setValue('hungry', calcValues?.doughHelp?.hungry);
      setValue('numbers', calcValues?.doughHelp?.numbers);
    }
  }, [calcValues, currentValues]);

  // dough calculator schemaa
  const schema = yup
    .object()
    .shape({
      adults: yup.string().required(valContent?.enter_adults),
      kids: yup.string().required(valContent?.enter_kids),
      hungry: yup
        .object()
        .typeError(valContent?.choose_apetite)
        .required(valContent?.choose_apetite),
      numbers: yup.string().notRequired(valContent?.enter_adults),
    })
    .required();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: doughHelp,
  });

  const currentValues = watch();

  // print(currentValues,"current")

  const handlePremium = data => {
    setDoughSheet(false);
    // setDoughHelp(data);
    // setPremiumToggle(false);
    // reset();
  };

  // pre dough calculation
  const handlePreDough = () => {
    if (isLogged) {
      if (isSubscribed) {
        setPremiumToggle(!premiumToggle);
      } else dispatch(setPaywallSheet(true));
    } else {
      Toast.show('Kindly Login', {
        type: 'success',
        duration: 2000,
      });
      navigation.navigate('NoTabStack', {
        screen: 'login',
      });
      // console.log('premium');
    }
  };

  // pre dough help
  const handleDoughHelp = () => {
    if (isLogged) {
      if (isSubscribed) {
        setDoughSheet(true);
      } else dispatch(setPaywallSheet(true));
    } else {
      Toast.show('Kindly Login', {
        type: 'success',
        duration: 2000,
      });
      navigation.navigate('NoTabStack', {
        screen: 'login',
      }); //cc
    }
  };

  const StartCalculation = () => {
    const calculationDatas = {
      calcId,
      flourId: calcId ? data?.formCnt?.flourId : calculations?.flourId,
      wValue: calcId ? data?.formCnt?.wValue : calculations?.wValue,
      thumbNail: calculations?.thumb ? calculations.thumb : '',
      dough,
      weight,
      water,
      yeasttype,
      yeast,
      salt,
      oil,
      predoughType,
      minPercentage,
      maxPercentage,
      doughHelp,
      premiumToggle,
      floorstrength,
      totalDough,
      flourCalculator: 0,
    };
    dispatch(setCalcValues(calculationDatas));
    navigation.navigate('calculatorDetail', {
      calcdata: calculationDatas,
    });
  };

  // total dough ball calculation
  const calculateDoughBall = currentDoughHelp => {
    if (
      currentDoughHelp.adults &&
      currentDoughHelp.kids &&
      currentDoughHelp.hungry
    ) {
      let toCalcValue = '';

      switch (currentDoughHelp.hungry.sorting_key) {
        case 'low':
          toCalcValue = 0.8;
          break;
        case 'medium':
          toCalcValue = 1;
          break;
        case 'high':
          toCalcValue = 1.2;
          break;
        default:
          break;
      }

      const totalDoughBalls = Math.round(
        toCalcValue *
          (Number(currentDoughHelp.adults) * 1.5 +
            Number(currentDoughHelp.kids)),
      );

      const updatedDoughHelp = {
        ...doughHelp,
        numbers: totalDoughBalls,
      };
      // print(updatedDoughHelp,"updates")

      setDoughHelp(updatedDoughHelp);
      setTotalDough(String(totalDoughBalls));
      setDough(totalDoughBalls);

      // console.log(toCalcValue, totalDoughBalls, 'totla');
      return totalDoughBalls;
    } else {
      // console.log('no');
      setTotalDough('');
      return null;
    }
  };

  return (
    <>
      {/* tabs calculator */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: keyboardHeight + (widthResponse ? 20 : 30),
        }}>
        {/* image and name */}

        {/* {data?.logo && data?.logo != '' && ( */}
        <View
          style={{
            width: scrnWidth / 4,
            height: scrnWidth / 4,
            borderRadius: scrnWidth / 4,
            marginBottom: widthResponse ? 10 : 15,
            alignSelf: 'center',
            overflow: 'hidden',
          }}>
          <Image
            source={{
              uri: recipeImage
                ? recipeImage
                : calculations?.thumb
                ? calculations.thumb
                : logo,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
          />
        </View>
        {/* )} */}
        {/* {calculations?.name && ( */}
        <Text
          style={[
            commenStyle.sideHead,
            {
              textAlign: 'center',
              marginBottom: widthResponse ? 15 : 20,
            },
          ]}>
          {calculations?.name || data?.formCnt?.cardName}
        </Text>
        {/* )} */}

        <View style={[commenStyle.container]}>
          {/* basic */}
          <View
            style={[
              styles.box,
              commenStyle.shadow,
              {
                marginBottom: widthResponse ? 20 : 25,
              },
            ]}>
            {/* title */}
            {data?.formTitle && (
              <View
                style={{
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  overflow: 'hidden',
                }}>
                <Text
                  style={[
                    commenStyle.sideHead,
                    {
                      padding: widthResponse ? 15 : 20,
                      backgroundColor: appColor.bgBlack,
                      color: appColor.white,
                      fontFamily: appFont.pDSb,
                      marginBottom: widthResponse ? 15 : 20,
                    },
                  ]}>
                  {data.formTitle}
                </Text>
              </View>
            )}
            <View
              style={[
                commenStyle.container,
                {
                  paddingBottom: widthResponse ? 15 : 20,
                },
              ]}>
              {/* dough ball help button */}
              <View
                style={[
                  styles.box,
                  commenStyle.hFlex,
                  commenStyle.shadow,
                  {
                    padding: widthResponse ? 15 : 20,
                    overflow: 'visible',
                    marginBottom: widthResponse ? 25 : 35,
                  },
                ]}>
                {data?.formCnt?.Calculate_dough_balls && (
                  <Text
                    style={[
                      commenStyle.sideHead,
                      {
                        flex: 1,
                        marginRight: widthResponse ? 15 : 20,
                        fontSize: fontScalling(2),
                        marginBottom: 0,
                      },
                    ]}>
                    {data?.formCnt?.Calculate_dough_balls}
                  </Text>
                )}
                <PrimaryButton
                  invert
                  iconComponent={'AntDesign'}
                  iconName={'questioncircle'}
                  iconSize={fontScalling(2.5)}
                  text={data?.formCnt?.dough_ball}
                  onPress={handleDoughHelp}
                  style={{
                    width: '60%',
                  }}
                />
              </View>
              {/* advanced  */}
              <View
                style={[
                  styles.box,
                  commenStyle.shadow,
                  {
                    padding: widthResponse ? 15 : 20,
                    overflow: 'visible',
                    marginBottom: widthResponse ? 20 : 25,
                  },
                ]}>
                {/* toggle button */}
                <View
                  style={[
                    commenStyle.hFlex,
                    {
                      marginBottom: premiumToggle
                        ? widthResponse
                          ? 15
                          : 20
                        : 0,
                    },
                  ]}>
                  {data?.formCnt?.pre_dough?.title && (
                    <Text
                      style={[
                        commenStyle.sideHead,
                        {
                          marginBottom: 0,
                          flex: 1,
                        },
                      ]}>
                      {data.formCnt.pre_dough.title}
                    </Text>
                  )}

                  <View style={[commenStyle.hFlex]}>
                    <Toggle
                      isActive={premiumToggle}
                      onPress={handlePreDough}
                      style={{
                        marginRight: widthResponse ? 5 : 10,
                      }}
                    />

                    <TouchableOpacity onPress={() => setPreDoughTool(true)}>
                      <Icon
                        ComponentName={'AntDesign'}
                        name={'questioncircle'}
                        color={appColor.black}
                        size={fontScalling(3)}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {premiumToggle ? (
                  <>
                    {/* type dropdown */}
                    <CalcDrop
                      // top
                      slideTitle={
                        data?.formCnt?.pre_dough_types?.title &&
                        data.formCnt.pre_dough_types.title
                      }
                      value={predoughType}
                      datas={data?.formCnt?.pre_dough_types?.options}
                      onChange={setPreDoughType}
                      placeholder={
                        data?.formCnt?.pre_dough_types?.placeholder &&
                        data.formCnt.pre_dough_types.placeholder
                      }
                    />

                    {/* percentage */}
                    <View>
                      {data?.formCnt?.percentage?.title && (
                        <Text
                          style={[
                            commenStyle.sideHead,
                            {fontSize: fontScalling(1.8)},
                          ]}>
                          {data.formCnt.percentage.title}
                        </Text>
                      )}
                      <View style={[commenStyle.hFlex]}>
                        <View
                          style={{
                            // width: '45%',
                            flex: 1,
                          }}>
                          <InputText
                            placeholder={
                              data?.formCnt?.percentage
                                ?.percentage_placeholder &&
                              data.formCnt.percentage.percentage_placeholder
                            }
                            value={minPercentage}
                            onChangeText={setMinPercentage}
                            keyboardType={'numeric'}
                            customStyle={{
                              paddingBottom: 0,
                            }}
                          />
                        </View>
                        {/* {data?.formCnt?.percentage?.percentage_to && (
                    <Text
                      style={[
                        commenStyle.para,
                        {
                          paddingHorizontal: widthResponse ? 5 : 10,
                          // width: '10%',
                          textAlign: 'center',
                          marginBottom: 0,
                          fontSize: fontScalling(1.5),
                        },
                      ]}>
                      {data.formCnt.percentage.percentage_to}
                    </Text>
                  )}
                  <View
                    style={{
                      // width: '45%',
                      flex: 1,
                    }}>
                    <InputText
                      placeholder={
                        data?.formCnt?.percentage?.percentage_placeholder &&
                        data.formCnt.percentage.percentage_placeholder
                      }
                      value={maxPercentage}
                      onChangeText={setMaxPercentage}
                      keyboardType={'numeric'}
                      customStyle={{
                        paddingBottom: 0,
                      }}
                    />
                  </View> */}
                      </View>
                    </View>
                  </>
                ) : null}
              </View>

              {/* new tooltip  */}
              {/* <View
                style={[
                  commenStyle.hFlex,
                  {
                    marginBottom: widthResponse ? 20 : 25,
                  },
                ]}>
                <Text
                  style={[
                    commenStyle.sideHead,
                    {
                      marginBottom: 0,
                      flex: 1,
                    },
                  ]}>
                  {data?.calc_tooltip}
                </Text>
                <TouchableOpacity onPress={() => setToolModal(true)}>
                  <Icon
                    ComponentName={'AntDesign'}
                    name={'questioncircle'}
                    color={appColor.black}
                    size={fontScalling(3)}
                  />
                </TouchableOpacity>
              </View> */}

              {/*  */}
              {/* <ModalPopup
                visible={toolModal}
                onBackButtonPress={() => setToolModal(false)}
                onBackdropPress={() => setToolModal(false)}
                onClosePress={() => setToolModal(false)}
                style={{
                  paddingTop: widthResponse ? 40 : 50,
                }}>
                {data?.calc_tooltip && (
                  <Text style={[commenStyle.sideHead]}>
                    {data?.calc_tooltip}
                  </Text>
                )}

                {data?.calc_tooltip_content && (
                  <Text style={[commenStyle.para]}>
                    {data?.calc_tooltip_content}
                  </Text>
                )}
              </ModalPopup> */}

              {/* count input */}
              <CountInput
                slideTitle={
                  data?.formCnt?.doughBalls?.title &&
                  data.formCnt.doughBalls.title
                }
                value={String(dough)}
                onChangeText={setDough}
              />

              {/* weight slider  */}
              {data?.formCnt?.weight?.min && data?.formCnt?.weight?.max && (
                <RangeSlider
                  slideTitle={
                    data?.formCnt?.weight?.title && data.formCnt.weight.title
                  }
                  unitShow
                  unit={setters?.weight?.ushort ? setters.weight.ushort : 'g'}
                  minimum={data.formCnt.weight.min}
                  maximum={data.formCnt.weight.max}
                  value={weight}
                  onChangeText={setWeight}
                  step={1}
                  toolContent={data?.formCnt?.weight?.tip}
                  noteText={data?.note}
                  note1={data?.formCnt?.weight?.flags?.flag1}
                  note1MinRange={
                    data?.formCnt?.weight?.recMin && data.formCnt.weight.recMin
                  }
                  note1MaxRange={
                    data?.formCnt?.weight?.recMax && data.formCnt.weight.recMax
                  }
                />
              )}

              {/* hydration slider  */}
              {data?.formCnt?.hydration?.min &&
                data?.formCnt?.hydration?.max && (
                  <RangeSlider
                    slideTitle={
                      data?.formCnt?.hydration?.title &&
                      data.formCnt.hydration.title
                    }
                    unitShow
                    unit={'%'}
                    minimum={data.formCnt.hydration.min}
                    maximum={data.formCnt.hydration.max}
                    value={water}
                    onChangeText={setWater}
                    step={0.01} //@@
                    toolContent={data?.formCnt?.hydration?.tip}
                    noteText={data?.note}
                    note1={data?.formCnt?.hydration?.flags?.flag1}
                    note1MinRange={
                      data?.formCnt?.hydration?.recMin &&
                      data.formCnt.hydration.recMin
                    }
                    note1MaxRange={
                      data?.formCnt?.hydration?.recMax &&
                      data.formCnt.hydration.recMax
                    }
                    maxCalc
                  />
                )}

              {/* yeast dropdown */}
              <CalcDrop
                slideTitle={
                  data?.formCnt?.yeastType?.title &&
                  data.formCnt.yeastType.title
                }
                value={yeasttype}
                datas={data?.formCnt?.yeastType?.options}
                tooltip
                onChange={setYeastType}
                placeholder={
                  data?.formCnt?.yeastType?.placeholder &&
                  data.formCnt.yeastType.placeholder
                }
                toolContent={data?.formCnt?.yeastType?.tip}
              />

              {/* yeast slider */}
              {data?.formCnt?.yeast?.min && data?.formCnt?.yeast?.max && (
                <RangeSlider
                  slideTitle={
                    data?.formCnt?.yeast?.title && data.formCnt.yeast.title
                  }
                  unitShow
                  unit={'%'}
                  minimum={data.formCnt.yeast.min}
                  maximum={data.formCnt.yeast.max}
                  value={yeast}
                  onChangeText={setYeast}
                  step={0.01} //@@
                  toolContent={data?.formCnt?.yeast?.tip}
                  noteText={data?.note}
                  note1={data?.formCnt?.yeast?.flags?.flag1}
                  note1MinRange={
                    data?.formCnt?.yeast?.recMin && data.formCnt.yeast.recMin
                  }
                  note1MaxRange={
                    data?.formCnt?.yeast?.recMax && data.formCnt.yeast.recMax
                  }
                />
              )}

              {/* salt slider */}
              {data?.formCnt?.salt?.min && data?.formCnt?.salt?.max && (
                <RangeSlider
                  slideTitle={
                    data?.formCnt?.salt?.title && data.formCnt.salt.title
                  }
                  unitShow
                  unit={'%'}
                  minimum={data.formCnt.salt.min}
                  maximum={data.formCnt.salt.max}
                  value={salt}
                  onChangeText={setSalt}
                  step={0.1}
                  toolContent={data?.formCnt?.salt?.tip}
                  noteText={data?.note}
                  note1={data?.formCnt?.salt?.flags?.flag1}
                  note1MinRange={
                    data?.formCnt?.salt?.recMin && data.formCnt.salt.recMin
                  }
                  note1MaxRange={
                    data?.formCnt?.salt?.recMax && data.formCnt.salt.recMax
                  }
                />
              )}

              {/* oil slider */}
              {data?.formCnt?.oil?.min && data?.formCnt?.oil?.max && (
                <RangeSlider
                  slideTitle={
                    data?.formCnt?.oil?.title && data.formCnt.oil.title
                  }
                  unitShow
                  unit={'%'}
                  minimum={data.formCnt.oil.min}
                  maximum={data.formCnt.oil.max}
                  value={oil}
                  onChangeText={setOil}
                  step={0.1}
                  toolContent={data?.formCnt?.oil?.tip}
                  noteText={data?.note}
                  note1={data?.formCnt?.oil?.flags?.flag1}
                  note1MinRange={
                    data?.formCnt?.oil?.recMin && data.formCnt.oil.recMin
                  }
                  note1MaxRange={
                    data?.formCnt?.oil?.recMax && data.formCnt.oil.recMax
                  }
                  maxCalc
                />
              )}

              {/* rest time info */}
              {/* {data?.formCnt?.resttimes && (
                <View
                  style={{
                    marginBottom: widthResponse ? 15 : 20,
                  }}>
                  <>
                    <View style={[commenStyle.hFlex]}>
                      {data?.formCnt?.resttimes?.title && (
                        <Text
                          style={[
                            commenStyle.sideHead,
                            {
                              marginBottom: 0,
                              flex: 1,
                              paddingRight: 10,
                              fontSize: fontScalling(2),
                            },
                          ]}>
                          {data?.formCnt?.resttimes?.title}
                        </Text>
                      )}
                      <Pressable
                        onPress={() => setRestPopup(true)}
                        style={{
                          width: widthResponse ? 25 : 30,
                          height: widthResponse ? 25 : 30,
                          borderRadius: widthResponse ? 25 : 30,
                          backgroundColor: appColor.black,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Icon
                          ComponentName={'FontAwesome5'}
                          name={'exclamation'}
                          color={appColor.white}
                          size={widthResponse ? 12 : 17}
                        />
                      </Pressable>
                    </View>
                    <ModalPopup
                      onBackButtonPress={() => setRestPopup(false)}
                      onBackdropPress={() => setRestPopup(false)}
                      onClosePress={() => setRestPopup(false)}
                      visible={restPopup}
                      style={{
                        paddingTop: widthResponse ? 40 : 50,
                      }}>
                      {data?.formCnt?.resttimes?.title && (
                        <Text
                          style={[
                            commenStyle.sideHead,
                            {
                              textAlign: 'center',
                              marginBottom: widthResponse ? 20 : 25,
                            },
                          ]}>
                          {data?.formCnt?.resttimes?.title}
                        </Text>
                      )}
                      {data?.formCnt?.resttimes?.withcool && (
                        <CalcInfo
                          title={data?.formCnt?.resttimes?.withcool?.title}
                          datas={data?.formCnt?.resttimes?.withcool?.value}
                          style={{
                            marginBottom: widthResponse ? 15 : 20,
                          }}
                        />
                      )}
                      {data?.formCnt?.resttimes?.withoutcool && (
                        <CalcInfo
                          title={data?.formCnt?.resttimes?.withoutcool?.title}
                          datas={data?.formCnt?.resttimes?.withoutcool?.value}
                        />
                      )}
                    </ModalPopup>
                  </>
                </View>
              )} */}
              {/* flower strength dropdown */}
              <CalcDrop
                slideTitle={
                  data?.formCnt?.flour_strength?.title &&
                  data.formCnt.flour_strength.title
                }
                value={floorstrength}
                datas={data?.formCnt?.flour_strength?.options}
                top
                tooltip={false}
                onChange={setFloorStrength}
                placeholder={
                  data?.formCnt?.flour_strength?.placeholder &&
                  data.formCnt.flour_strength.placeholder
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {/* sticky button */}

      {!keyboard && (
        <View
          style={[commenStyle.container, {marginTop: widthResponse ? 10 : 15}]}>
          {/* bottom button */}
          <PrimaryButton
            text={data?.formBtn && data.formBtn}
            onPress={StartCalculation}
          />
        </View>
      )}

      {/* premium bottom sheet */}
      <ModalBottomSheet
        isVisible={doughSheet}
        snapPoints={['50%', '50%']}
        sheetTitle={
          data?.formCnt?.Calculate_dough_balls &&
          data.formCnt.Calculate_dough_balls
        }
        close={() => setDoughSheet(false)}>
        {/* <View style={{flex: 1}}>
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}> */}
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{
            marginBottom: keyboardHeight == 0 ? 40 : keyboardHeight,
          }}
          scrollEnabled={true}
          enableAutomaticScroll={true}
          extraHeight={400}
          ref={textFocus}>
          {/* adults counts */}
          <Controller
            name="adults"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <InputText
                  label={
                    data?.formCnt?.Number_of_adults?.title &&
                    data.formCnt.Number_of_adults.title
                  }
                  placeholder={
                    data?.formCnt?.Number_of_adults?.title &&
                    data.formCnt.Number_of_adults.title
                  }
                  keyboardType={'Numeric'}
                  value={currentValues.adults}
                  onChangeText={e => {
                    const updatedDoughHelp = {
                      ...doughHelp,
                      adults: e,
                    };

                    const totalDoughBalls =
                      calculateDoughBall(updatedDoughHelp);

                    setDoughHelp({
                      ...updatedDoughHelp,
                      numbers: totalDoughBalls, // Update state with the calculated value
                    });
                    onChange(e);
                  }}
                  formError={errors.adults}
                />
              );
            }}
          />

          {/* kids counts */}
          <Controller
            name="kids"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <InputText
                  label={
                    data?.formCnt?.Number_of_kids?.title &&
                    data.formCnt.Number_of_kids.title
                  }
                  placeholder={
                    data?.formCnt?.Number_of_kids?.title &&
                    data.formCnt.Number_of_kids.title
                  }
                  keyboardType={'Numeric'}
                  value={currentValues.kids}
                  onChangeText={e => {
                    const updatedDoughHelp = {
                      ...doughHelp,
                      kids: e,
                    };

                    const totalDoughBalls =
                      calculateDoughBall(updatedDoughHelp);

                    setDoughHelp({
                      ...updatedDoughHelp,
                      numbers: totalDoughBalls, // Update state with the calculated value
                    });
                    onChange(e);
                  }}
                  formError={errors.kids}
                />
              );
            }}
          />

          {/* how much hungry */}

          <Controller
            name="hungry"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <SelectDropDown
                  label={
                    data?.formCnt?.How_much_appetite?.title &&
                    data.formCnt.How_much_appetite.title
                  }
                  placeholder={
                    data?.formCnt?.How_much_appetite?.placeholder &&
                    data.formCnt.How_much_appetite.placeholder
                  }
                  modal
                  sorting
                  value={currentValues.hungry}
                  withOutDrop
                  onChange={e => {
                    const updatedDoughHelp = {
                      ...doughHelp,
                      hungry: e,
                    };

                    const totalDoughBalls =
                      calculateDoughBall(updatedDoughHelp);

                    // console.log(totalDoughBalls, 'fa');

                    setDoughHelp({
                      ...updatedDoughHelp,
                      numbers: totalDoughBalls, // Update state with the calculated value
                    });
                    onChange(e);
                  }}
                  error={errors.hungry}
                  datas={data?.formCnt?.How_much_appetite?.options}
                />
              );
            }}
          />

          {/* flour bals */}
          {/* <Controller
            name="numbers"
            control={control}
            render={({field: {onChange, value}}) => {
              return ( */}
          <InputText
            label={
              data?.formCnt?.Aantal_deegbollen?.title &&
              data.formCnt.Aantal_deegbollen.title
            }
            placeholder={
              data?.formCnt?.Aantal_deegbollen?.title &&
              data.formCnt.Aantal_deegbollen.title
            }
            editable={false}
            keyboardType={'Numeric'}
            value={String(totalDough)}
            // onChangeText={e =>
            //   setDoughHelp(pre => ({
            //     ...pre,
            //     numbers: e,
            //   }))
            // }
            formError={errors.numbers}
          />
          {/* );
            }}
          /> */}

          {/* submit button */}
          <PrimaryButton
            text={data?.formCnt?.Indienen && data.formCnt.Indienen}
            onPress={handleSubmit(handlePremium)}
          />
        </KeyboardAwareScrollView>
        {/* </BottomSheetScrollView>
        </View> */}
      </ModalBottomSheet>

      {/* pre dough description popup */}
      <ModalPopup
        visible={predoughTool}
        onBackButtonPress={() => setPreDoughTool(false)}
        onBackdropPress={() => setPreDoughTool(false)}
        onClosePress={() => setPreDoughTool(false)}
        style={{
          paddingTop: widthResponse ? 30 : 50,
          justifyContent: 'center',
        }}>
        {/* description */}

        <View>
          {data?.formCnt?.pre_dough?.title && (
            <Text
              style={[
                commenStyle.title,
                {
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: widthResponse ? 20 : 30,
                },
              ]}>
              {data.formCnt.pre_dough.title}
            </Text>
          )}
          <View
            style={{
              borderRadius: 15,
              overflow: 'hidden',
              aspectRatio: 1.8,
            }}>
            {data.link && (
              <YoutubePlayer
                videoId={data.link.split('/').pop()}
                height={'100%'}
                width={'100%'}
              />
            )}
          </View>
          {data?.content && <HtmlView url={data.content} />}
        </View>
      </ModalPopup>
    </>
  );
};

export default StandardCalculator;

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    box: {
      borderRadius: 15,
      // overflow: 'hidden',
      backgroundColor: appColor.bgWhite,
      elevation: 7,
      shadowColor: appColor.black,
      shadowRadius: 10,
    },
  });
  return {styles};
};
