import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  fontScalling,
  print,
  requestCameraPermission,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {FlourList, WizardStep} from '../../Utilities/contents';
import StepIndicator from 'react-native-step-indicator';
import {appFont} from '../../Utilities/appFont';
import {InputText} from '../../components/InputFields/InputText';
import Scanner from '../../components/Modal/Scanner';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import ModalPopup from '../../components/Modal/ModalPopup';
import SearchCard from '../../components/Cards/SearchCard';
import DatePick from '../../components/InputFields/DatePick';
import {Icon} from '../../Utilities/icon';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import Swiper from 'react-native-swiper';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Url} from '../../Utilities/appApi';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import PageLoader from '../../components/Loader/PageLoader';
import LottieView from 'lottie-react-native';
import WizardContent from '../../Hooks/WizardContent';
import {useAppVideos} from '../../Hooks/useAppVideos';
import {setPlannerVideoShow} from '../../Redux/AppSettingSlice';
import VideoPlayer from '../../components/Video/VideoPlayer';

const Wizard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const isFocus = useIsFocused();
  const {wizardVideo} = useAppVideos();
  const {plannerVideoShow} = useSelector(state => state.appSettings);

  const {wizContent, load} = WizardContent();
  return (
    <>
      {!load ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[
            // commenStyle.container,
            {
              backgroundColor: appColor.bgWhite,
            },
          ]}>
          {wizardVideo && (
            <VideoPlayer
              source={wizardVideo}
              onClose={() => dispatch(setPlannerVideoShow(false))}
              onOpen={() => dispatch(setPlannerVideoShow(true))}
              show={plannerVideoShow}
              showText={wizContent?.show_demo_video}
            />
          )}

          <View
            style={[
              commenStyle.container,
              {
                paddingBottom: widthResponse ? 40 : 60,
              },
            ]}>
            <LottieView
              source={require('../../../assets/lottiefiles/wizard.json')}
              autoPlay={true}
              loop={true}
              style={{
                width: scrnWidth / 1.2,
                height: scrnWidth / 1.2,
                marginBottom: widthResponse ? 40 : 45,
                alignSelf: 'center',
              }}
            />
            {wizContent?.pageTitle && (
              <Text
                style={[
                  commenStyle.sideHead,
                  {
                    fontSize: fontScalling(5),
                    lineHeight: fontScalling(5),
                    letterSpacing: 10,
                    marginBottom: widthResponse ? 20 : 25,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  },
                ]}>
                {wizContent.pageTitle}
              </Text>
            )}
            <View style={{alignItems: 'center'}}>
              <View>
                {wizContent?.button_one && (
                  <PrimaryButton
                    text={wizContent?.button_one}
                    invert
                    style={{
                      marginBottom: widthResponse ? 10 : 15,
                    }}
                    onPress={() => {
                      navigation.navigate('wizardStep1');
                    }}
                  />
                )}

                {wizContent?.button_two && (
                  <PrimaryButton
                    text={wizContent?.button_two}
                    invert
                    style={{
                      marginBottom: widthResponse ? 10 : 15,
                    }}
                    onPress={() => navigation.navigate('wizardQue')}
                  />
                )}

                {wizContent?.button_three && (
                  <PrimaryButton
                    text={wizContent?.button_three}
                    invert
                    style={{
                      marginBottom: widthResponse ? 10 : 15,
                    }}
                    onPress={() => navigation.navigate('wizardHistory')}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default Wizard;

const styles = StyleSheet.create({});

// {/* step one starts */}
// {step == 1 &&
//     <>
//         <WizardStep1
//             content={content}
//             onSubmit={handleStep1}
//         />
//     </>
// }
// {/* step one ends */}

// {/* step two starts */}
// {
//     step == 2 &&
//     <WizardStep2
//         content={content}
//         onSubmit={handleStep2}
//     />
// }
// {/* step two ends */}

// {/* step three starts */}
// {
//     step == 3 &&
//     <WizardStep3
//         content={content}
//     />
// }
// {/* step three ends */}
