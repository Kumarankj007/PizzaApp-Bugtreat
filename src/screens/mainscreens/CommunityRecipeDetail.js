import {
  Animated,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Capitalize,
  fontScalling,
  formatedNewDate,
  getCurrentTime,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {recipeDetail} from '../../Utilities/contents';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import ScrollCard from '../../components/Cards/ScrollCard';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import Carousel from 'react-native-reanimated-carousel';
import {appFont} from '../../Utilities/appFont';
import Country from '../../components/Cards/Country';
import NavButton from '../../components/Buttons/NavButton';
import CommunityRecipePrep from './CommunityRecipePrep';
import CommunityRecipePlan from './CommunityRecipePlan';
import CommunityRecipeInfo from './CommunityRecipeInfo';
import CommunityRecipeReview from './CommunityRecipeReview';
import CarDots from '../../components/Cards/CarDots';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Url} from '../../Utilities/appApi';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import PageLoader from '../../components/Loader/PageLoader';
import moment from 'moment';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import DateTimePick from '../../components/InputFields/DateTimePick';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import {InputText} from '../../components/InputFields/InputText';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {Toast} from 'react-native-toast-notifications';
import ValidationContent from '../../Hooks/ValidationContent';
import {Icon} from '../../Utilities/icon';
import ModalPopup from '../../components/Modal/ModalPopup';
import AuthLoading from '../../components/Loader/AuthLoading';
import Stopshare from '../../components/Buttons/Stopshare';
import Empty from '../../components/Loader/Empty';

const CarouselBlock = ({content}) => {
  const {logo} = useSelector(state => state.appSettings);
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseOptions = {
    width: scrnWidth,
    height: scrnWidth / 2,
  };
  return (
    <>
      {content?.multiple_image && content?.multiple_image.length > 0 ? (
        <>
          <Carousel
            {...baseOptions}
            data={content.multiple_image}
            autoPlay
            loop
            scrollAnimationDuration={1000}
            onSnapToItem={e => setCurrentIndex(e)}
            renderItem={({item}) => {
              return (
                <View>
                  <Image
                    source={{uri: item}}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />
                </View>
              );
            }}
          />

          {/* carousel dots */}
          {/* <CarDots
            datas={content?.multiple_image}
            currentIndex={currentIndex}
          /> */}
        </>
      ) : (
        <Image
          source={{uri: content?.cardImg ? content.cardImg : logo}}
          style={{
            width: '100%',
            height: scrnWidth / (widthResponse ? 1.5 : 2),
          }}
          resizeMode="cover"
        />
      )}
    </>
  );
};

const CommunityRecipeDetail = ({route}) => {
  const {item} = route?.params && route?.params;
  const [content, setContent] = useState({});
  const [activeButtons, setActiveButtons] = useState('recipe');
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const {setters, deviceId, userId} = useSelector(state => state.appSettings);
  const {isLogged} = useSelector(State => State.authSettings);
  const Navigation = useNavigation();
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [resDetail, setResDetail] = useState({});
  const navs = ['Recept', 'Pizza plan', 'Informatie', 'Reviews'];
  const [userHover, setUserHover] = useState(false);
  const [scheduleSheet, setScheduleSheet] = useState(false);
  const [schdulePick, setSchdulePick] = useState({
    datePick: false,
    timePick: false,
  });
  const date = new Date();
  const {valContent} = ValidationContent();
  const [resDelModal, setResDelModal] = useState(false);
  const [delLoad, setDelLoad] = useState(false);

  const userVerify =
    userId &&
    resDetail &&
    resDetail?.pizza_was_made_by?.user_id &&
    userId == resDetail?.pizza_was_made_by?.user_id;
  const scheduleSchema = yup
    .object()
    .shape({
      sch_date: yup.string().required(valContent?.select_date),
      sch_time: yup.string().required(valContent?.select_time),
    })
    .required();

  const {
    control: scheduleControl,
    handleSubmit: scheduleSubmit,
    reset: scheduleReset,
    formState: {errors: scheduleErrors},
  } = useForm({
    resolver: yupResolver(scheduleSchema),
  });

  // community recipe details
  const communityRecipeDetail = async () => {
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
      if (item?.id) formdata.append('calcid', item.id);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      if (Object.keys(resDetail).length == 0) {
        setLoad(true);
        dispatch(setTitleLoad(true));
      }
      //   print(formdata,"form")

      const response = await fetch(Url().communityRecipeDetail, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setResDetail(resparse?.data);
          Navigation.setOptions({
            title: resparse?.data?.fileName,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the community recipe detail api');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  // api for the view count
  const recipeViewCountApi = async () => {
    try {
      const formData = new FormData();

      formData.append('id', item.id);
      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      const response = await fetch(Url().recipeViewCount, requestOptions);
      // print(await response.json());
    } catch (error) {
      console.log(error, 'error in the recipe detail view count api call');
    }
  };

  useEffect(() => {
    if (item && item.id) {
      communityRecipeDetail();
    }
  }, [setters?.weight, setters?.language, item.id, setters?.temperature]);

  // api for the history api call
  const historyCallApi = async () => {
    try {
      const saveDate = dateString => {
        const [date, month, year] = dateString.split('/');
        return `${year}-${date}-${month}`;
      };
      const formData = new FormData();

      if (userId) formData.append('user_id', userId);

      formData.append('calcid', item.id);
      formData.append('save_time', getCurrentTime());
      formData.append('save_date', saveDate(moment().format('L')));
      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      // print(formData,"form")
      const response = await fetch(Url().historyCall, requestOptions);
      const resparse = await response.json();
    } catch (error) {
      console.log(error, 'error in the history call recipe detail api call');
    }
  };

  // history and view count api call
  useEffect(() => {
    if (isLogged && item && item.id && item?.user_id != userId) {
      historyCallApi();
      recipeViewCountApi();
    }
  }, [item?.id]);

  const Navtabs = ({activeButtons}) => {
    switch (activeButtons) {
      case 'recipe':
        return <CommunityRecipePrep recipe={resDetail?.recipe_tab} />;
      case 'pizza_plan':
        return <CommunityRecipePlan data={resDetail?.plan_tab} />;
      case 'informatie':
        return <CommunityRecipeInfo data={resDetail?.information_tab} />;
      case 'reviews':
        return (
          <CommunityRecipeReview
            data={resDetail?.reviews_tab}
            recipeId={item?.id}
            apiCall={communityRecipeDetail}
            userVerify={userVerify}
          />
        );
    }
  };

  // scheduling the pizza for the wizard
  const schedulePizza = async data => {
    // print(data, 'data');
    try {
      const formData = new FormData();
      if (setters && setters?.language?.language_code && userId) {
        formData.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
        formData.append('user_id', userId);
      }
      if (data) {
        // formData.append('flour_id', 3213);
        formData.append('pizza_eat_date', formatedNewDate(data?.sch_date));
        formData.append('pizza_eat_time', data?.sch_time);
      }
      formData.append('calcid', item.id);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      // print(formData, 'form');
      const response = await fetch(Url().wizardRecipeSave, requestOptions);
      // print(response, 'respo');
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resp');
        if (resparse.status == 'success') {
          setScheduleSheet(false);
          Toast.show(resparse?.data, {
            type: 'success',
            duration: 2000,
          });
          setTimeout(() => {
            Navigation.navigate('Planner', {
              screen: 'wizardQue',
            });
          }, 2000);
        }
      }
    } catch (error) {
      console.log(error, 'error in the schedule pizza api call');
    }
  };

  // recipe delete api call
  const HandleRecipeRemove = async () => {
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
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      formdata.append('calcid', resDetail.calcid);

      setDelLoad(true);
      const response = await fetch(Url().communityRecipeRemove, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          Toast.show(resparse.data, {
            type: 'success',
            duration: 2000,
          });
          setTimeout(() => {
            if (Navigation.canGoBack) {
              Navigation.goBack();
            }
          }, 2000);
          setResDelModal(false);
        }
      }
      setDelLoad(false);
    } catch (error) {
      console.log(error, 'error in the recipe remove screen');
      setDelLoad(false);
    }
  };
  return (
    <>
      {!load ? (
        Object.keys(resDetail).length > 0 ? (
          <View style={[commenStyle.rootPage]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                backgroundColor: appColor.cardBack,
              }}
              keyboardShouldPersistTaps={'always'}>
              {/* top content */}
              <View
                style={{
                  backgroundColor: appColor.bgWhite,
                }}>
                {/* top block */}
                <View
                  style={{
                    position: 'relative',
                  }}>
                  {userVerify && (
                    <Stopshare
                      text={resDetail?.stop_sharing}
                      style={{
                        position: 'absolute',
                        right: 20,
                        top: 20,
                        zIndex: 2,
                      }}
                      onPress={() => setResDelModal(true)}
                    />
                  )}
                  {/* carousel */}
                  <CarouselBlock content={resDetail} />
                </View>
                {/* middle block */}
                <View
                  style={[
                    commenStyle.container,
                    {
                      paddingVertical: widthResponse ? 20 : 25,
                      paddingBottom: widthResponse ? 50 : 60,
                      position: 'relative',
                    },
                  ]}>
                  {/* title */}
                  {resDetail?.fileName && (
                    <Text
                      style={[
                        commenStyle.sideHead,
                        {
                          textAlign: 'center',
                        },
                      ]}>
                      {Capitalize(resDetail.fileName)}
                    </Text>
                  )}

                  {/* author */}
                  {resDetail?.pizza_was_made_by && (
                    <Pressable
                      onPressIn={() => setUserHover(true)}
                      onPressOut={() => setUserHover(false)}
                      onPress={() => {
                        if (resDetail?.pizza_was_made_by.hide_profile != 2) {
                          Navigation.navigate('userDetail', {
                            id: resDetail?.pizza_was_made_by?.user_id,
                          });
                        }
                      }}
                      style={[
                        commenStyle.hFlex,
                        userHover ? null : commenStyle.shadow,
                        {
                          borderWidth: 1,
                          borderColor: userHover
                            ? appColor.primary
                            : 'transparent',
                          borderRadius: 15,
                          // overflow: 'hidden',
                          backgroundColor: appColor.bgWhite,
                          paddingHorizontal: widthResponse ? 10 : 15,
                          paddingVertical: widthResponse ? 12 : 15,
                          position: 'absolute',
                          bottom: widthResponse ? -40 : -50,
                          alignSelf: 'center',
                          width: scrnWidth - 80,
                          zIndex: 2,
                        },
                      ]}>
                      <View
                        style={{
                          flex: 1,
                        }}>
                        {/* name  */}
                        {resDetail?.pizza_was_made_by?.user_name && (
                          <Text
                            style={[
                              commenStyle.sideHead,
                              {
                                fontFamily: appFont.lBl,
                                marginBottom: 7,
                                fontSize: fontScalling(2.2),
                              },
                            ]}
                            numberOfLines={1}>
                            {resDetail.pizza_was_made_by.user_name}
                          </Text>
                        )}
                        {/* country */}
                        {resDetail?.pizza_was_made_by?.user_land && (
                          <Country
                            country={resDetail.pizza_was_made_by.user_land}
                          />
                        )}
                      </View>
                      {resDetail?.pizza_was_made_by?.user_image && (
                        <Image
                          source={{uri: resDetail.pizza_was_made_by.user_image}}
                          style={{
                            width: scrnWidth / (widthResponse ? 7 : 12),
                            aspectRatio: 1,
                            // height: scrnWidth / 7,
                            borderRadius: scrnWidth,
                          }}
                        />
                      )}
                    </Pressable>
                  )}
                </View>
              </View>

              {/* navtabs */}
              <View
                style={{
                  paddingTop: widthResponse ? 60 : 80,
                }}>
                {resDetail?.tab_titles && resDetail?.tab_titles.length > 0 && (
                  <NavButton
                    four
                    keyType
                    title={resDetail.tab_titles}
                    activeButtons={activeButtons}
                    onPress={setActiveButtons}
                    altStyle={{
                      marginBottom: 15,
                    }}
                  />
                )}

                <Navtabs activeButtons={activeButtons} />
              </View>
            </ScrollView>

            {/* button */}
            <View
              style={[
                commenStyle.container,
                userVerify ? commenStyle.hFlex : null,
                {
                  backgroundColor: appColor.cardbg,
                  paddingVertical: widthResponse ? 10 : 15,
                },
              ]}>
              <PrimaryButton
                text={resDetail?.submit_button}
                onPress={() => setScheduleSheet(true)}
                style={{
                  width: userVerify ? '49%' : '100%',
                  marginRight: userVerify ? '2%' : 0,
                  paddingHorizontal: userVerify ? 2 : 10,
                }}
              />
              {/* recipe change button  */}
              {userVerify && (
                <PrimaryButton
                  text={resDetail?.change_button}
                  onPress={() => {
                    Navigation.navigate('Calculeer', {
                      screen: 'calculator',
                      params: {
                        value: 'modify',
                        id: resDetail?.calcid,
                      },
                    });
                  }}
                  invert
                  style={{
                    width: '49%',
                  }}
                />
              )}
            </View>

            {/* schedulet sheet */}
            <ModalBottomSheet
              isVisible={scheduleSheet}
              close={() => {
                setScheduleSheet(false);
              }}
              sheetTitle={resDetail?.schedule_pizza?.title}
              snapPoints={['45%', '45%']}>
              {/* <View
              style={{
                flex: 1,
              }}>
              <BottomSheetScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}> */}
              <View style={[{flexDirection: 'row'}]}>
                <Controller
                  control={scheduleControl}
                  name="sch_date"
                  render={({field: {onChange, value}}) => {
                    return (
                      <>
                        <InputText
                          label={resDetail?.schedule_pizza?.date?.label}
                          placeholder={
                            resDetail?.schedule_pizza?.date?.placeholder
                          }
                          customStyle={{
                            paddingBottom: 0,
                            width: '49%',
                            marginRight: '2%',
                          }}
                          rightIcon="MaterialIcons"
                          iconRightName="date-range"
                          iconrightSize={widthResponse ? 20 : 24}
                          editable={false}
                          value={value} // Ensure value is set here
                          formError={scheduleErrors.sch_date}
                          onPress={() =>
                            setSchdulePick(pre => ({
                              ...pre,
                              datePick: true,
                              timePick: false,
                            }))
                          }
                          onPressRight={() =>
                            setSchdulePick(pre => ({
                              ...pre,
                              datePick: true,
                              timePick: false,
                            }))
                          }
                        />
                        <DateTimePick
                          mode={'date'}
                          date={date}
                          show={schdulePick.datePick}
                          close={() =>
                            setSchdulePick(pre => ({
                              ...pre,
                              datePick: false,
                            }))
                          }
                          onchange={e => {
                            onChange(e);
                          }}
                          minimumDate={date}
                        />
                      </>
                    );
                  }}
                />

                <Controller
                  control={scheduleControl}
                  name="sch_time"
                  render={({field: {onChange, value}}) => {
                    return (
                      <>
                        <SelectDropDown
                          label={resDetail?.schedule_pizza?.time?.placeholder}
                          placeholder={
                            resDetail?.schedule_pizza?.time?.placeholder
                          }
                          nodrop={true}
                          onPress={() =>
                            setSchdulePick(pre => ({
                              ...pre,
                              timePick: true,
                              datePick: false,
                            }))
                          }
                          value={value}
                          datas={[1, 2, 3, 4, 5]}
                          error={scheduleErrors.sch_time}
                          contStyle={{
                            width: '49%',
                            marginBottom: 0,
                          }}
                        />
                        <DateTimePick
                          mode={'time'}
                          date={date}
                          minuteInterval={15}
                          show={schdulePick.timePick}
                          minimumDate={date}
                          close={() =>
                            setSchdulePick(pre => ({
                              ...pre,
                              timePick: false,
                            }))
                          }
                          onchange={onChange}
                        />
                      </>
                    );
                  }}
                />
              </View>

              <PrimaryButton
                text={resDetail?.submit_button}
                onPress={scheduleSubmit(schedulePizza)}
                style={{
                  marginTop: fontScalling(2),
                }}
              />
              {/* </BottomSheetScrollView>
            </View> */}
            </ModalBottomSheet>

            {/* recipe delete modal */}
            <ModalPopup
              visible={resDelModal}
              onBackButtonPress={() => setResDelModal(false)}
              onBackdropPress={() => setResDelModal(false)}
              onClosePress={() => setResDelModal(false)}
              style={{
                justifyContent: 'center',
                // paddingTop: widthResponse ? 60 : 8÷0,
              }}>
              {resDetail?.are_you_going_to_revoke_sharing && (
                <Text style={[commenStyle.modalTitle]}>
                  {resDetail.are_you_going_to_revoke_sharing}
                </Text>
              )}

              {/* loading with buttons */}
              {!delLoad ? (
                <View
                  style={[
                    commenStyle.hFlex,
                    {
                      justifyContent: 'center',
                      // marginTop: fontScalling(2.3),
                    },
                  ]}>
                  <PrimaryButton
                    modal
                    text={resDetail?.delpopup?.yes}
                    style={{
                      marginRight: 10,
                    }}
                    onPress={HandleRecipeRemove}
                  />
                  <PrimaryButton
                    invert
                    modal
                    text={resDetail?.delpopup?.no}
                    onPress={() => setResDelModal(false)}
                  />
                </View>
              ) : (
                <AuthLoading />
              )}
            </ModalPopup>
          </View>
        ) : (
          <Empty />
        )
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default CommunityRecipeDetail;

const styles = StyleSheet.create({});
