import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import NavButton from '../../components/Buttons/NavButton';
import {
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import StandardCalculator from './StandardCalculator';
import {useDispatch, useSelector} from 'react-redux';
import {Url} from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {setPaywallSheet, setTitleLoad} from '../../Redux/HeaderSlice';
import FlourCalculator from './FlourCalculator';
import {Toast} from 'react-native-toast-notifications';
import {setCalculatorVideoShow} from '../../Redux/AppSettingSlice';
import {useAppVideos} from '../../Hooks/useAppVideos';
import VideoPlayer from '../../components/Video/VideoPlayer';
import {Icon} from '../../Utilities/icon';
import ModalPopup from '../../components/Modal/ModalPopup';

const Calculator = ({route}) => {
  const calcValue =
    route?.params && route?.params?.value ? route?.params?.data : false;
  const calcModify =
    route?.params && route?.params?.value == 'modify'
      ? route?.params?.id
      : null;

  const recipeImage = route?.params?.recipeImage
    ? route.params.recipeImage
    : '';

  // console.log(calcModify)
  const [calcContent, setCalcContent] = useState({});
  const {setters, deviceId, calculatorVideoShow} = useSelector(
    State => State.appSettings,
  );
  const {isLogged, isSubscribed} = useSelector(State => State.authSettings);
  const [load, setLoad] = useState(false);
  const appColor = appColors();
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {commenStyle} = useStyle();
  const [activeButtons, setActiveButtons] = useState(0);
  const {calculatorVideo} = useAppVideos();

  const [toolModal, setToolModal] = useState(false);

  // calculator content apicall
  const calculatorContentApiCall = async () => {
    try {
      const formData = new FormData();
      if (setters && setters?.language?.language_code) {
        formData.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }
      if (setters && setters?.weight?.ushort) {
        formData.append(
          'uShort',
          setters?.weight?.ushort ? setters?.weight?.ushort : 'g',
        );
      }

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      dispatch(setTitleLoad(true));
      setLoad(true);
      const response = await fetch(Url().calculatorContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          //   print(resparse, 'resp');
          navigation.setOptions({
            title: resparse?.data?.pageTitle,
          });
          setCalcContent(resparse.data);
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the calculator content api call');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  const modifyCalculationApiCall = async () => {
    try {
      const formData = new FormData();
      if (setters && setters?.language?.language_code) {
        formData.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }
      if (setters && setters?.weight?.ushort) {
        formData.append(
          'uShort',
          setters?.weight?.ushort ? setters?.weight?.ushort : 'g',
        );
      }

      formData.append('id', calcModify);
      formData.append('uuId', deviceId);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      // print(formData, 'form');
      dispatch(setTitleLoad(true));
      setLoad(true);
      const response = await fetch(Url().recipeModify, requestOptions);
      // print(response, 'reposn');
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse.data, 'rresparce modify');
          setActiveButtons(
            resparse?.data?.formCnt?.flourcalculator
              ? Number(resparse?.data?.formCnt?.flourcalculator)
              : 0,
          );
          setCalcContent(resparse.data);
          navigation.setOptions({
            title: resparse?.data?.pageTitle,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the modify calculator content api call');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  useEffect(() => {
    if (calcModify) {
      modifyCalculationApiCall();
    } else {
      calculatorContentApiCall();
    }
  }, [setters?.language, setters?.weight, calcModify, calcValue]);

  const NavTabs = ({activeButtons}) => {
    switch (activeButtons) {
      case 0:
        return (
          <StandardCalculator
            data={calcContent}
            calculations={calcValue}
            calcId={calcModify}
            recipeImage={recipeImage}
          />
        );
      case 1:
        if (isLogged) {
          if (isSubscribed) {
            return (
              <FlourCalculator
                data={calcContent}
                calculations={calcValue}
                calcId={calcModify}
                recipeImage={recipeImage}
              />
            );
          } else {
            dispatch(setPaywallSheet(true));
            setActiveButtons(0);
            return null;
          }
        } else {
          setActiveButtons(0);
          Toast.show('Kindly Login', {
            type: 'success',
            duration: 2000,
          });
          navigation.navigate('NoTabStack', {
            screen: 'login',
          });
        }
    }
  };
  return (
    <View
      style={[
        commenStyle.rootPage,
        {
          paddingBottom: widthResponse ? 15 : 20,
        },
      ]}>
      {!load ? (
        <>
          {calculatorVideo && (
            <VideoPlayer
              source={calculatorVideo}
              onClose={() => dispatch(setCalculatorVideoShow(false))}
              onOpen={() => dispatch(setCalculatorVideoShow(true))}
              show={calculatorVideoShow}
              showText={calcContent?.show_demo_video}
            />
          )}

          {/* top nav  */}
          <View
            style={[
              commenStyle.container,
              {
                marginVertical: 15,
                position: 'relative',
              },
            ]}>
            {calcContent?.tab_titles && (
              <NavButton
                title={calcContent?.tab_titles}
                activeButtons={activeButtons}
                onPress={setActiveButtons}
                dual
              />
            )}

            {/* new tool tip */}
            {calcContent?.calc_tooltip && (
              <TouchableOpacity
                onPress={() => setToolModal(true)}
                style={{
                  position: 'absolute',
                  right: widthResponse ? 10 : 15,
                  top: widthResponse ? 5 : 10,
                }}>
                <Icon
                  ComponentName={'AntDesign'} //io
                  name={'questioncircle'}
                  color={appColor.black}
                  size={fontScalling(3)}
                />
              </TouchableOpacity>
            )}

            <ModalPopup
              visible={toolModal}
              onBackButtonPress={() => setToolModal(false)}
              onBackdropPress={() => setToolModal(false)}
              onClosePress={() => setToolModal(false)}
              style={{
                paddingTop: widthResponse ? 40 : 50,
              }}>
              {calcContent?.calc_tooltip && (
                <Text style={[commenStyle.sideHead]}>
                  {calcContent?.calc_tooltip}
                </Text>
              )}

              {calcContent?.calc_tooltip_content && (
                <Text style={[commenStyle.para]}>
                  {calcContent?.calc_tooltip_content}
                </Text>
              )}
            </ModalPopup>
          </View>

          {/* navtabs */}
          <NavTabs activeButtons={activeButtons} />
        </>
      ) : (
        <PageLoader />
      )}
    </View>
  );
};

export default Calculator;

const styles = StyleSheet.create({});
