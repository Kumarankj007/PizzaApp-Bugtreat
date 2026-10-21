import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import CalcInfo from '../../components/Cards/CalcInfo';
import ModalPopup from '../../components/Modal/ModalPopup';
import {setOnFlourCalcValue} from '../../Redux/CalculationSlice';

const FlourCalculator = ({data, calculations, calcId, recipeImage}) => {
  // print(data,"calc data")
  const {setters, deviceId, userId, logo} = useSelector(
    state => state.appSettings,
  );
  const {isLogged} = useSelector(State => State.authSettings);
  const navigation = useNavigation();
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const textFocus = useRef(null);
  const keyboard = KeyboardVisible();
  const keyboardHeight = KeyboardVisible(true);
  const {onFlourcalcValues} = useSelector(state => state.calcuationValues);

  // print(onFlourcalcValues, 'data');
  const [flour, setFlour] = useState(
    data?.formCnt?.bloem?.value ? data.formCnt.bloem.value : 1000,
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

  const [restPopup, setRestPopup] = useState(false);
  const dispatch = useDispatch();
  const startCalculation = () => {
    if (flour == 0) {
      Toast.show(`${data?.enter_flour} (${setters?.weight?.ushort})`, {
        type: 'danger',
        duration: 2000,
      });
    } else {
      const calculationDatas = {
        calcId,
        flourId: calcId ? data?.formCnt?.flourId : calculations?.flourId,
        wValue: calcId ? data?.formCnt?.wValue : calculations?.wValue,
        thumbNail: calculations?.thumb ? calculations.thumb : '',
        flour,
        weight,
        water,
        yeasttype,
        yeast,
        salt,
        oil,
        floorstrength,
        flourCalculator: 1,
      };
      navigation.navigate('calculatorDetail', {
        calcdata: calculationDatas,
      });
      dispatch(setOnFlourCalcValue(calculationDatas));
    }
  };

  // setting the unchanged values
  useEffect(() => {
    if (onFlourcalcValues && Object.keys(onFlourcalcValues).length != 0) {
      setFlour(onFlourcalcValues?.flour);
      setWeight(onFlourcalcValues?.weight);
      setWater(onFlourcalcValues?.water);
      setYeastType(onFlourcalcValues?.yeasttype);
      setYeast(onFlourcalcValues?.yeast);
      setSalt(onFlourcalcValues?.salt);
      setOil(onFlourcalcValues?.oil);
      setFloorStrength(onFlourcalcValues?.floorstrength);
    }
  }, [onFlourcalcValues]);
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
        {/* // )} */}
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
              {/* flower strength dropdown */}
              {/* {(data?.formCnt?.flourId == undefined ||
                data?.formCnt?.flourId == 0) &&
              calculations == false ? ( */}
              {/* <> */}
              <CalcDrop
                slideTitle={
                  data?.formCnt?.flour_strength?.title &&
                  data.formCnt.flour_strength.title
                }
                value={floorstrength}
                datas={data?.formCnt?.flour_strength?.options}
                // top
                tooltip={false}
                onChange={setFloorStrength}
                placeholder={
                  data?.formCnt?.flour_strength?.placeholder &&
                  data.formCnt.flour_strength.placeholder
                }
              />
              {/* </>
              ) : null} */}
              {/* count input */}
              <CountInput
                slideTitle={
                  data?.formCnt?.bloem?.title && data.formCnt.bloem.title
                }
                value={String(flour)}
                onChangeText={setFlour}
                unit={setters?.weight?.ushort ? setters.weight.ushort : 'g'}
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
                    step={0.01}
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
                  step={0.1}
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
                          name={'questioncircle'}
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
              {/* <CalcDrop
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
              /> */}
            </View>
          </View>
        </View>
      </ScrollView>
      {!keyboard && (
        <View
          style={[commenStyle.container, {marginTop: widthResponse ? 10 : 15}]}>
          {/* bottom button */}
          <PrimaryButton
            text={data?.formBtn && data.formBtn}
            onPress={startCalculation}
          />
        </View>
      )}
    </>
  );
};

export default FlourCalculator;

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    box: {
      borderRadius: 15,
      backgroundColor: appColor.bgWhite,
      elevation: 7,
      shadowColor: appColor.black,
      shadowRadius: 10,
    },
  });
  return {styles};
};
