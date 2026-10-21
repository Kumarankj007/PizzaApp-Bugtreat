import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import WizardProcess from '../../components/Cards/WizardProcess';
import {
  convertTimeFormat,
  fontScalling,
  formatedDate,
  print,
  scrnWidth,
  splitTime,
  strEmptyCheck,
  widthResponse,
} from '../../Utilities/helperFunction';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import * as Animatable from 'react-native-animatable';
import {appFont} from '../../Utilities/appFont';
import {useSelector} from 'react-redux';
import {Url} from '../../Utilities/appApi';
import Empty from '../../components/Loader/Empty';
import SpinLoader from '../../components/Loader/SpinLoader';
import {HistoryCardShimmer} from '../../Utilities/appShimmer';
import ModalPopup from '../../components/Modal/ModalPopup';
import {useToast} from 'react-native-toast-notifications';
import {useNavigation} from '@react-navigation/native';
import WizardContent from '../../Hooks/WizardContent';
import PageLoader from '../../components/Loader/PageLoader';

const WizardQue = () => {
  const {trigger} = useSelector(state => state.trigger);
  const {setters, allUnits, userId} = useSelector(State => State.appSettings);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const toast = useToast();
  const scrollRef = useRef(null);
  const imgWidth = scrnWidth / (widthResponse ? 4 : 6);
  const leftGap = widthResponse ? 10 : 12.5;

  // state:
  const [cancelModal, setCancelModal] = useState(false);
  const [accIndex, setAccIndex] = useState(0);
  const [accId, setAccId] = useState(-1);
  const [queLoad, setQueLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [start, setStart] = useState(0);
  const [queue, setQueue] = useState({
    data: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });
  const navigation = useNavigation();
  const {wizContent, load} = WizardContent();

  // stateReset:
  const stateReset = () => {
    setQueLoad(true);
    setQueue({
      data: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
    });
    setStart(0);
    setAccIndex(0);
    setAccId(-1);
  };

  //pull to refresh
  const onRefresh = useCallback(() => {
    setRefresh(true);
    stateReset();
  }, []);

  // useEffects:
  useEffect(() => {
    !refresh && wizQueApiCall();
  }, [start]);

  useEffect(() => {
    refresh && wizQueApiCall();
  }, [refresh]);

  useEffect(() => {
    onRefresh();
  }, [setters?.temperature, setters?.language, trigger]);

  // api function
  const wizQueApiCall = async () => {
    try {
      const formdata = new FormData();

      if (setters?.language?.language_code) {
        formdata.append('lcode', setters.language.language_code || 'nl');
      }

      formdata.append('user_id', userId);
      // formdata.append('user_id', 42);
      formdata.append(
        'tshort',
        setters?.temperature?.tshort ? setters?.temperature?.tshort : '°C',
      );

      // Append start value
      formdata.append('start', refresh ? 0 : start);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      if (queue.data.length === 0) setQueLoad(true);
      const response = await fetch(Url().wizardQueue, requestOptions);

      if (response.status === 200) {
        const resparse = await response.json();
        if (resparse.status === 'success') {
          setQueue(prev => ({
            data: refresh
              ? resparse.data.queued_recipes
              : [...prev.data, ...resparse.data.queued_recipes],
            start: Number(resparse.data.start),
            limit: Number(resparse.data.limit),
            total: Number(resparse.data.total),
            count: Number(resparse.data.count),
            page: refresh ? 1 : prev.page + 1,
          }));
          start == 0 && setAccId(resparse.data.queued_recipes[0].wid);
        }
      }
      setRefresh(false);
      setQueLoad(false);
    } catch (error) {
      console.log('Error in the wizard queue result:', error);
      setRefresh(false);
      setQueLoad(false);
    }
  };

  const handleCancel = async () => {
    setCancelModal(false);
    try {
      const formdata = new FormData();

      if (setters?.language?.language_code) {
        formdata.append('lcode', setters.language.language_code || 'nl');
      }
      accId != -1 && formdata.append('wid', accId);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const response = await fetch(Url().wizardCancellation, requestOptions);

      if (response.status === 200) {
        const resparse = await response.json();
        if (resparse.status === 'success') {
          toast.show(resparse?.data ? resparse?.data : 'success', {
            type: 'success',
            duration: 2000,
          });
          onRefresh();
        }
      }
    } catch (error) {
      console.log('Error in the wizard cancel result:', error);
    }
  };

  const handleNext = async () => {
    try {
      const formdata = new FormData();

      if (setters?.language?.language_code) {
        formdata.append('lcode', setters.language.language_code || 'nl');
      }
      const skipId = queue.data.find(item => item.current_queue == 1);

      const getNextStepId = data => {
        // print(data, 'da');
        const currentIndex = data.steps.findIndex(
          step => step.id === data.current_step_id,
        );
        return currentIndex !== -1 && currentIndex + 1 < data.steps.length
          ? data.steps[currentIndex + 1].id
          : null;
      };

      if (skipId)
        accId != -1 && formdata.append('ws_id', getNextStepId(skipId));
      formdata.append('user_id', userId);

      // print(getNextStepId(skipId), 'sk');
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      // print(formdata, 'form');
      const response = await fetch(Url().wizardNext, requestOptions);
      // print(response, 'rep');
      if (response.status === 200) {
        const resparse = await response.json();
        if (resparse.status === 'success') {
          toast.show(resparse?.data ? resparse?.data : 'success', {
            type: 'success',
            duration: 2000,
          });
          onRefresh();
        }
      }
    } catch (error) {
      console.log('Error in the wizard cancel result:', error);
    }
  };
  return (
    <>
      {!load ? (
        <View
          style={[
            commenStyle.container,
            {
              flex: 1,
              justifyContent: 'space-between',
              paddingTop: widthResponse ? 15 : 20,
            },
          ]}>
          <View
            style={[
              commenStyle.hFlex,
              {
                justifyContent: 'space-between',
                marginBottom: widthResponse ? 15 : 20,
              },
            ]}>
            {wizContent?.step3?.title && (
              <Text style={[commenStyle.sideHead, {marginBottom: 0}]}>
                {wizContent?.step3?.title}
              </Text>
            )}

            {wizContent?.step3?.sorting?.buttonTwo && (
              <PrimaryButton
                text={wizContent?.step3?.sorting?.buttonTwo}
                invert
                onPress={() => navigation.navigate('wizardHistory')}
              />
            )}
          </View>
          {!queLoad ? (
            <>
              {queue?.data && queue?.data?.length > 0 ? (
                <>
                  <FlatList
                    data={queue.data}
                    style={{
                      // backgroundColor:appColor.white,
                      marginBottom: widthResponse ? 15 : 20,
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={refresh}
                        onRefresh={onRefresh}
                        colors={[appColor.primary]}
                        tintColor={appColor.primary}
                      />
                    }
                    onEndReached={() => {
                      start == queue.start &&
                        queue.page < queue.count &&
                        setStart(Number(queue.limit) + Number(start));
                    }}
                    ListFooterComponent={() =>
                      queue.page != queue.count && <SpinLoader />
                    }
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index}) => {
                      return (
                        <View key={index}>
                          {/* que details */}
                          <Pressable
                            onPress={() => {
                              setAccIndex(index == accIndex ? -1 : index);
                              setTimeout(() => {
                                scrollRef.current?.scrollToIndex({
                                  animated: true,
                                  index: index,
                                });
                              }, 100);
                            }}
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
                              {item.recipe_image && item.recipe_image != '' ? (
                                <Image
                                  source={{uri: item.recipe_image}}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 10,
                                  }}
                                  resizeMode="contain"
                                />
                              ) : (
                                <Text>NO IMAGE</Text>
                              )}
                            </View>
                            <View
                              style={{
                                flex: 1,
                              }}>
                              {/* title */}
                              {item.recipe_name && item.recipe_name != '' && (
                                <Text
                                  style={[
                                    commenStyle.sideHead,
                                    {
                                      fontFamily: appFont.lBl,
                                      marginBottom: 5,
                                    },
                                  ]}>
                                  {item.recipe_name}
                                </Text>
                              )}

                              {/* total steps */}
                              {item?.total_step_count &&
                                item?.total_step_count != '' && (
                                  <Text
                                    style={[
                                      commenStyle.para,
                                      {
                                        marginBottom: 5,
                                      },
                                    ]}>
                                    {wizContent?.step3?.steps &&
                                      wizContent?.step3?.steps != '' && (
                                        <Text
                                          style={[
                                            {
                                              fontFamily: appFont.lB,
                                            },
                                          ]}>
                                          {wizContent?.step3?.steps} :
                                        </Text>
                                      )}
                                    {` ${item?.total_step_count} ${
                                      wizContent?.step3?.steps &&
                                      wizContent?.step3?.steps != '' &&
                                      wizContent?.step3?.steps
                                    } - ${
                                      wizContent?.step3?.average &&
                                      wizContent?.step3?.average != '' &&
                                      wizContent?.step3?.average
                                    } ${
                                      item?.average_hours &&
                                      item?.average_hours.length > 2 &&
                                      item?.average_hours.slice(0, 2)
                                    } ${
                                      wizContent?.step3?.uur &&
                                      wizContent?.step3?.uur != '' &&
                                      wizContent?.step3?.uur
                                    }`}
                                  </Text>
                                )}

                              {/* current steps */}
                              {wizContent?.step3?.current_step &&
                                wizContent?.step3?.current_step != '' && (
                                  <Text
                                    style={[
                                      commenStyle.para,
                                      {
                                        marginBottom: 2,
                                        fontFamily: appFont.lB,
                                      },
                                    ]}>
                                    {`${wizContent?.step3?.current_step} : `}
                                    {item.step && item.step != '' && (
                                      <Text
                                        style={[
                                          commenStyle.para,
                                          {
                                            marginBottom: 0,
                                          },
                                        ]}>
                                        {item.step}
                                      </Text>
                                    )}
                                  </Text>
                                )}
                            </View>
                          </Pressable>
                          {/* steps */}
                          <View style={{overflow: 'hidden'}}>
                            {index == accIndex &&
                              item?.steps &&
                              item?.steps.length > 0 &&
                              item?.steps.map((items, indexs) => {
                                const animationDuration = 1000;
                                const status = item?.current_step_count - 1;
                                const height = status > indexs ? '100%' : 0;
                                return (
                                  <Animatable.View
                                    animation={'slideInDown'}
                                    duration={700}
                                    key={indexs}
                                    style={{
                                      flexDirection: 'row',
                                      marginLeft: imgWidth / 2 - leftGap,
                                      // width: '90%',
                                      // marginBottom: 10
                                    }}>
                                    {/* dots */}
                                    <View
                                      style={{
                                        alignItems: 'center',
                                        // backgroundColor: appColor.ToastError,
                                        paddingTop: widthResponse ? 9 : 12,
                                        position: 'relative',
                                      }}>
                                      {/* dot */}
                                      <View
                                        style={{
                                          width: widthResponse ? 20 : 25,
                                          height: widthResponse ? 20 : 25,
                                          borderRadius: 60,
                                          zIndexs: 10,
                                          backgroundColor: appColor.bgWhite,
                                          borderWidth: 5,
                                          borderColor:
                                            status > indexs
                                              ? appColor.primary
                                              : status == indexs &&
                                                item?.current_queue != 0
                                              ? appColor.bgBlack
                                              : appColor.TextInputborderbg,
                                        }}
                                      />
                                      {/* line */}
                                      {indexs != item?.total_step_count - 1 && (
                                        <View
                                          style={{
                                            flex: 1,
                                            // backgroundColor: appColor.ToastInfo
                                          }}>
                                          <View
                                            style={[
                                              {
                                                // borderColor: appColor.primary,
                                                width: 5,
                                                height: widthResponse
                                                  ? '120%'
                                                  : '120%',
                                                left: widthResponse
                                                  ? -2.5
                                                  : -2.5,
                                                position: 'absolute',
                                                top: -1,
                                                overflow: 'hidden',
                                                backgroundColor: 'transparent',
                                              },
                                            ]}>
                                            <Animatable.View
                                              duration={animationDuration}
                                              delay={indexs * animationDuration}
                                              animation={'slideInDown'}
                                              style={[
                                                {
                                                  width: '100%',
                                                  height: '100%',
                                                  // backgroundColor: appColor.primary
                                                  backgroundColor:
                                                    status > indexs
                                                      ? appColor.primary
                                                      : 'transparent',
                                                  backfaceVisibility:
                                                    status > indexs
                                                      ? 'visible'
                                                      : 'hidden',
                                                },
                                              ]}
                                            />
                                          </View>
                                        </View>
                                      )}
                                    </View>

                                    {/* details */}
                                    <View
                                      style={{
                                        flex: 1,
                                        paddingLeft: 15,
                                      }}>
                                      <WizardProcess
                                        title={items?.title}
                                        duration={
                                          items?.time &&
                                          `${
                                            // splitTime(items.time)[0] > 0 &&
                                            splitTime(items.time)[0] +
                                            wizContent?.hours
                                          }` +
                                            `${
                                              // splitTime(items.time)[1] > 0 &&
                                              splitTime(items.time)[1]
                                            }` +
                                            wizContent?.minute
                                        }
                                        hours={splitTime(items.time)[0]}
                                        hoursPlaceholder={wizContent?.hours}
                                        minute={splitTime(items.time)[1]}
                                        minutePlaceholder={wizContent?.minute}
                                        seconds={splitTime(items.time)[2]}
                                        secondsPlaceholder={wizContent?.seconds}
                                        dateTime={`${formatedDate(
                                          items?.start_date,
                                        )}   ${convertTimeFormat(
                                          items?.start_time,
                                        )}`}
                                        current_que={item?.current_queue}
                                        temp={items?.temp}
                                        description={items?.description}
                                        ovenName={items?.oven_name}
                                        status={
                                          status > indexs
                                            ? 1
                                            : item?.current_queue != '0' &&
                                              status == indexs
                                            ? 0
                                            : undefined
                                        }
                                      />
                                      <View
                                        style={{
                                          paddingBottom: 10,
                                        }}
                                      />
                                    </View>
                                  </Animatable.View>
                                );
                              })}
                          </View>
                        </View>
                      );
                    }}
                  />

                  {/* bottom buttons */}
                  {accId != -1 && (
                    <View
                      style={[
                        commenStyle.hFlex,
                        {
                          justifyContent: 'space-between',
                          marginBottom: 10,
                        },
                      ]}>
                      <PrimaryButton
                        text={wizContent?.step3?.button_value?.cancel}
                        invert
                        style={{
                          width: '49%',
                        }}
                        onPress={() => setCancelModal(true)}
                      />
                      <PrimaryButton
                        text={wizContent?.step3?.button_value?.next_step}
                        onPress={handleNext}
                        style={{
                          width: '49%',
                        }}
                      />
                    </View>
                  )}
                </>
              ) : (
                <ScrollView
                  contentContainerStyle={{
                    flex: 1,
                  }}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={onRefresh}
                      colors={[appColor.primary]}
                      tintColor={appColor.primary}
                    />
                  }>
                  <Empty />
                </ScrollView>
              )}
            </>
          ) : (
            <HistoryCardShimmer />
          )}

          {/* Cancel popup */}
          <ModalPopup
            visible={cancelModal}
            onBackButtonPress={() => setCancelModal(false)}
            onBackdropPress={() => setCancelModal(false)}
            onClosePress={() => setCancelModal(false)}
            style={{
              justifyContent: 'center',
            }}>
            {strEmptyCheck(wizContent?.step3?.cancel_popup?.question) && (
              <Text
                style={[
                  commenStyle.modalTitle,
                  {
                    textAlign: 'center',
                  },
                ]}>
                {wizContent?.step3?.cancel_popup?.question}
              </Text>
            )}
            <View
              style={[
                commenStyle.hFlex,
                {
                  justifyContent: 'center',
                },
              ]}>
              {strEmptyCheck(wizContent?.step3?.cancel_popup?.yes) && (
                <PrimaryButton
                  modal
                  text={wizContent?.step3?.cancel_popup?.yes}
                  style={{
                    marginRight: 10,
                  }}
                  onPress={handleCancel}
                />
              )}
              {strEmptyCheck(wizContent?.step3?.cancel_popup?.no) && (
                <PrimaryButton
                  invert
                  modal
                  text={wizContent?.step3?.cancel_popup?.no}
                  onPress={() => setCancelModal(!cancelModal)}
                />
              )}
            </View>
          </ModalPopup>
        </View>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default WizardQue;

const styles = StyleSheet.create({});
