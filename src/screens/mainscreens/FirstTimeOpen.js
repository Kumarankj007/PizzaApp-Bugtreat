import {
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import appColors from '../../Utilities/appColors';
import {
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import CheckBox from '../../components/InputFields/CheckBox';
import { appFont } from '../../Utilities/appFont';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { useStyle } from '../../Utilities/styleSheet';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { setAllUnits, setLogo, setSetters } from '../../Redux/AppSettingSlice';
import { setUserDetails, setUserStatus } from '../../Redux/AuthSlice';
import { Url } from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import ValidationContent from '../../Hooks/ValidationContent';

const FirstTimeOpen = () => {
  const [hide, setHide] = useState(false);
  const appColor = appColors();
  const [firstContent, setFirstContent] = useState({});
  const [load, setLoad] = useState(false);
  const navigation = useNavigation();
  const { commenStyle } = useStyle();

  const dispatch = useDispatch();
  const { allUnits, deviceId } = useSelector(State => State.appSettings);
  const { valContent } = ValidationContent();

  // schema
  const schema = yup
    .object()
    .shape({
      language: yup.object().required(valContent?.choose_language),
      weight: yup.object().required(valContent?.choose_weight),
      temperature: yup.object().required(valContent?.choose_temperature),
      remember: yup
        .boolean()
        .oneOf([true], valContent?.remember_me)
        .required(valContent?.remember_me),
    })
    .required();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const currentValues = watch();

  // handling the value of the setting
  const submit = data => {
    dispatch(setSetters(data));
    dispatch(setUserStatus(1));
    navigation.navigate('intro');
    reset();
  };

  // apicall for the firseSetting
  const apiCall = async () => {
    try {
      const formdata = new FormData();
      formdata.append('context', 'pizza');
      // formdata.append("devId", );
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };
      setLoad(true);
      const response = await fetch(Url().firseSetting, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse.data, "resparse")
          setFirstContent(resparse.data);
          dispatch(
            setAllUnits({
              language: resparse.data.languages,
              weight: resparse.data.units,
              temperature: resparse.data.temperatures,
            }),
          );
          setValue('language', resparse?.data?.defl);
          setValue('weight', resparse?.data?.defu);
          setValue('temperature', resparse?.data?.deft);
          dispatch(setLogo(resparse?.data?.logo));
        }
      }
      setLoad(false);
    } catch (error) {
      console.log(error, 'error in first screen settings');
      setLoad(false);
    }
  };
  // print(allUnits,"allUNits")
  // terms and condition
  const Terms_Cond = () => {
    return (
      <View style={[commenStyle.hFlex]}>
        {firstContent?.formCnt?.gdpr?.gdprcontent1 && (
          <Text style={[commenStyle.checkLabel, { color: appColor.white }]}>
            {firstContent?.formCnt?.gdpr?.gdprcontent1}
          </Text>
        )}
        {firstContent?.formCnt?.gdpr?.terms_and_conditions_content && (
          <Pressable
            onPress={() =>
              navigation.navigate('privacy', {
                language: currentValues?.language,
                value: 'first',
                terms: true
              })
            }>
            <Text
              style={[
                commenStyle.checkLabel,
                { textDecorationLine: 'underline', color: appColor.white },
              ]}>
              {' '}
              {firstContent?.formCnt?.gdpr?.terms_and_conditions_content}{' '}
            </Text>
          </Pressable>
        )}
        {firstContent?.formCnt?.gdpr?.gdprcontent2 && (
          <Text style={[commenStyle.checkLabel, { color: appColor.white }]}>
            {firstContent?.formCnt?.gdpr?.gdprcontent2}{' '}
          </Text>
        )}
        {firstContent?.formCnt?.gdpr?.privacy_policy_content && (
          <Pressable
            onPress={() =>
              navigation.navigate('privacy', {
                language: currentValues?.language,
                value: 'first',
                // params : {
                // }
              })
            }>
            <Text
              style={[
                commenStyle.checkLabel,
                { textDecorationLine: 'underline', color: appColor.white },
              ]}>
              {firstContent?.formCnt?.gdpr?.privacy_policy_content}
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  // apiCall on page enter
  useEffect(() => {
    apiCall();
  }, []);

  return (
    <Pressable
      onPressIn={() => setHide(true)}
      onPressOut={() => setHide(false)}
      style={{
        flex: 1,
      }}>
      {!load ? (
        <ImageBackground
          resizeMode="stretch"
          style={{
            flex: 1,
          }}
          // source={firstContent.background && firstContent.background != "" ? {uri:firstContent.background} : require('../../../assets/images/firstscreenbackground.png')}
          source={require('../../../assets/images/firstscreenbackground.png')}>
          {/* statusbar */}
          <StatusBar
            barStyle={'light-content'}
            translucent
            backgroundColor={'transparent'}
          />
          <KeyboardAwareScrollView
            scrollEnabled={true}
            enableAutomaticScroll={true}
            contentContainerStyle={[
              commenStyle.container,
              {
                paddingTop: widthResponse ? 50 : 80,
              },
            ]}>
            <View
              style={{
                // backgroundColor:appColor.Textlightblack,
                paddingTop: 40,
              }}>
              {/* logo */}
              <View
                style={{
                  width: scrnWidth / 2.5,
                  height: scrnWidth / 2.5,
                  marginHorizontal: 'auto',
                  marginBottom: 30,
                }}>
                {/* logo image */}
                {firstContent && firstContent.logo && firstContent.log != '' ? (
                  <Image
                    source={{ uri: firstContent.logo }}
                    resizeMode="contain"
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/logo.png')}
                    resizeMode="contain"
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                )}
              </View>
              {/* language dropdown */}
              <Controller
                name="language"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <SelectDropDown
                      dark
                      label={firstContent?.formCnt?.language?.title}
                      placeholder={firstContent?.formCnt?.language?.placeHolder}
                      datas={allUnits.language}
                      value={value}
                      onChange={onChange}
                      error={errors.language}
                      language
                      parentZindex={6}
                      dropStyle={{
                        overflow: 'hidden',
                      }}
                      dropHide={hide}
                      borderRadius={18}
                    />
                  );
                }}
              />

              {/* weight dropdown */}
              <Controller
                name="weight"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <SelectDropDown
                      dark
                      label={firstContent?.formCnt?.measurement?.placeHolder}
                      placeholder={
                        firstContent?.formCnt?.measurement?.placeHolder
                      }
                      datas={allUnits.weight}
                      value={value}
                      onChange={onChange}
                      error={errors.weight}
                      parentZindex={5}
                      weight={true}
                      dropStyle={{
                        overflow: 'hidden',
                      }}
                      dropHide={hide}
                      borderRadius={18}
                    />
                  );
                }}
              />
              {/* temperature dropdown */}
              <Controller
                name="temperature"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <SelectDropDown
                      dark
                      label={firstContent?.formCnt?.temperature?.placeHolder}
                      placeholder={
                        firstContent?.formCnt?.temperature?.placeHolder
                      }
                      datas={allUnits.temperature}
                      value={value}
                      onChange={onChange}
                      error={errors.temperature}
                      parentZindex={4}
                      temperature={true}
                      contStyle={{
                        marginBottom: widthResponse ? 13 : 30,
                      }}
                      dropStyle={{
                        overflow: 'hidden',
                      }}
                      dropHide={hide}
                      borderRadius={18}
                    />
                  );
                }}
              />
              {/* terms & conditions */}
              <View
                style={{
                  marginBottom: 25,
                }}>
                <Controller
                  name="remember"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <CheckBox
                        darkBack
                        onPress={() => onChange(!value)}
                        checked={value}
                        label={<Terms_Cond />}
                      />
                    );
                  }}
                />
                {errors.remember && (
                  <Text
                    style={{
                      marginTop: 3,
                      color: appColor.formError,
                      fontSize: fontScalling(1.45),
                      fontFamily: appFont.lR,
                    }}>
                    {errors.remember.message}
                  </Text>
                )}
              </View>
              <PrimaryButton
                text={firstContent?.formCnt?.submit}
                onPress={handleSubmit(submit)}
                shadow
              />
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      ) : (
        <PageLoader />
      )}
    </Pressable>
  );
};

export default FirstTimeOpen;

const styles = StyleSheet.create({});
