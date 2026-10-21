import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {
  convertTimeFormat,
  fontScalling,
  formatedDate,
  formatedNewDate,
  parseDate,
  parseTime,
  print,
  scrnHeight,
  toLocalTime,
  widthResponse,
} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import {InputText} from '../../components/InputFields/InputText';
import ModalPopup from '../../components/Modal/ModalPopup';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import {TimerPicker} from 'react-native-timer-picker';
import {appFont} from '../../Utilities/appFont';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Url} from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import {Toast} from 'react-native-toast-notifications';
import {CommunityRecipeCardShimmer} from '../../Utilities/appShimmer';
import DatePicker from 'react-native-date-picker';
import VideoPlayer from '../../components/Video/VideoPlayer';
import PlanCard from '../../components/Cards/PlanCard';
import uuid from 'react-native-uuid';
import {setPlanVideoShow} from '../../Redux/AppSettingSlice';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import DateTimePick from '../../components/InputFields/DateTimePick';
import ValidationContent from '../../Hooks/ValidationContent';
import {Icon} from '../../Utilities/icon';
import CalcInfo from '../../components/Cards/CalcInfo';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import {useAppVideos} from '../../Hooks/useAppVideos';

const SetPlan = ({route}) => {
  const {detail} = route?.params && route.params;
  const {setters, planVideoShow} = useSelector(state => state.appSettings);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const {styles} = pageStyle();
  const dispatch = useDispatch();
  const Navigation = useNavigation();

  const keyboardShow = KeyboardVisible();

  const [load, setLoad] = useState();
  const [stepsLoad, setStepsLoad] = useState(false);
  const [planContent, setPlanContent] = useState({});
  const [plan, setPlan] = useState([]);
  const [stepLoad, setStepLoad] = useState(false);
  const flatRef = useRef(null);
  const [error, setError] = useState(false);
  const [pickerModal, setPickerModal] = useState({
    visible: false,
    type: '',
  });
  const [visible, setVisible] = useState(false);

  const [userChoose, setUserChoose] = useState({
    date: '',
    time: '',
  });
  const [restDatas, setRestDatas] = useState(false);
  const [settingShow, setSettingShow] = useState(true);
  const [timeShow, setTimeShow] = useState(false);
  const [dateShow, setDateShow] = useState(false);
  const [start_timeShow, setstart_timeShow] = useState(false);
  const [start_dateShow, setstart_dateShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [videoShow, setVideShow] = useState(true);

  const [allSteps, setAllSteps] = useState([]);
  const [step, setStep] = useState({
    id: '',
    title: '',
    // time: '',
    time: '',
    temp: '',
    tempValue: '',
    temperature: '',
    // count: allSteps.length,
    start_date: '',
    start_time: '',
  });

  const {setPlanVideo} = useAppVideos();

  const [fixedStep, setFixedStep] = useState({
    title: planContent?.fixed_point,
    // time: '',
    time: '70',
    temp: '550',
    temperature: '550',
    start_time: userChoose?.time,
    start_date: userChoose?.date,
  });

  const [totalTime, setTotalTime] = useState({
    hours: 0,
    minutes: 0,
  });
  const tempArr = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
  const {valContent} = ValidationContent();

  useEffect(() => {
    // if (detail && detail.id) {
    pizzaPlanContentApiCall();
    // }
  }, [setters?.weight, setters?.language, setters?.temperature]);

  // all recipe detail contents and calculations
  const pizzaPlanContentApiCall = async () => {
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

      if (Object.keys(planContent).length == 0) setLoad(true);
      dispatch(setTitleLoad(true));
      const response = await fetch(Url().pizzaPlanContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setPlanContent(resparse.data);
          Navigation.setOptions({
            title: resparse?.data?.title,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the Recipe detail api ');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  // schema
  const schema = yup
    .object()
    .shape({
      title: yup.object().required(valContent?.choose_step),
      start_date: yup.string().required(valContent?.select_date),
      start_time: yup.string().required(valContent?.select_time),
      temperature: yup.object().optional(valContent?.enter_temperature),
    })
    .required();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      temperature: {
        tempValue: `20 ${setters?.temperature?.tshort}`,
        temp: '20',
      },
    },
  });

  const addPizzaPlanStep = data => {
    const updatedStep = {
      ...data,
      id: uuid.v4(),
      temp: data?.temperature?.temp,
    };
    allSteps.push(updatedStep);

    reset();
    calculateDurations(allSteps, userChoose);
    setVisible(false);
    addTotalTime();
    Toast.show(planContent?.toast_msg?.add_msg, {
      type: 'success',
      duration: 2000,
      style: {
        zIndex: 2000,
      },
    });

    if (allSteps.length == 1) {
      setFixedStep(pre => ({
        ...pre,
        title: planContent?.fixed_point,
        temp: '20',
        start_time: userChoose?.time,
        start_date: userChoose?.date,
      }));
    }
  };

  // getting the pizza plan
  const pizzaPlanStepsApiCall = async () => {
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
      formdata.append('calcid', detail.id);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      if (allSteps.length == 0) setStepLoad(true);
      if (allSteps.length > 0) setStepsLoad(true);
      const response = await fetch(Url().pizzaSteps, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse?.data, 'Res');
        if (resparse.status == 'success') {
          setUserChoose(pre => ({
            ...pre,
            date: formatedDate(resparse?.data?.plan_date),
            time: convertTimeFormat(resparse?.data?.plan_time),
          }));

          const updatedSteps = calculateDurations(resparse?.data?.points, {
            date: formatedDate(resparse?.data?.plan_date),
            time: convertTimeFormat(resparse?.data?.plan_time),
          });

          setAllSteps(updatedSteps);
          setFixedStep(pre => ({
            ...pre,
            title: resparse?.data?.fixed?.title
              ? resparse?.data?.fixed?.title
              : planContent?.fixed_point,
            temp: resparse?.data?.fixed?.temp,
            sorting_key: planContent?.fixed_point?.sorting_key
              ? planContent?.fixed_point?.sorting_key
              : '1',
            time: resparse?.data?.fixed?.time
              ? String(timeToSeconds(resparse?.data?.fixed?.time))
              : 30,
            oven: resparse?.data?.fixed?.oven
              ? resparse?.data?.fixed?.oven
              : '',
          }));
        }
      }
      setStepLoad(false);
      setStepsLoad(false);
    } catch (error) {
      console.log(error, 'error in the get pizza plan step');
      setStepLoad(false);
      setStepsLoad(false);
    }
  };

  // deleting the setted pizza plan steps
  const removePizzaPlan = id => {
    const newlyUpdate = allSteps.filter(pre => pre.id != id);
    setAllSteps(newlyUpdate);
    calculateDurations(newlyUpdate, userChoose);
    Toast.show(planContent?.toast_msg?.delete_msg, {
      type: 'danger',
      duration: 2000,
      style: {
        zIndex: 2000,
      },
    });
    // setFixedStep(pre => ({
    //   ...pre,
    //   title: planContent?.fixed_point?.sorting,
    //   // temperature: '500',
    //   start_time: userChoose?.time,
    //   start_date: userChoose?.date,
    // }));
  };

  // pizza plans step api call
  useEffect(() => {
    pizzaPlanStepsApiCall();
  }, [setters?.temperature, setters?.language]);

  // Function to format date-time in LOCAL TIME (YYYY-MM-DD HH:MM)
  const formatLocalTime = date => {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit format
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  const formatLocalDate = date => {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit format
    let day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  };

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0',
    )}`;
  }

  function timeToSeconds(time) {
    const [hrs, mins, secs] = time.split(':').map(Number);
    return hrs * 3600 + mins * 60 + secs;
  }
  // calculating the duration
  const calculateDurations = (steps, userChosen) => {
    // print(steps, 'steps');
    if (steps.length > 0) {
      // Sort steps by date and time
      steps.sort((a, b) => {
        const [dayA, monthA, yearA] = a.start_date.split('/');
        const [dayB, monthB, yearB] = b.start_date.split('/');
        const dateA = new Date(`${yearA}-${monthA}-${dayA}T${a.start_time}:00`);
        const dateB = new Date(`${yearB}-${monthB}-${dayB}T${b.start_time}:00`);
        return dateA - dateB;
      });

      for (let i = 0; i < steps.length - 1; i++) {
        const [day1, month1, year1] = steps[i].start_date.split('/');
        const [day2, month2, year2] = steps[i + 1].start_date.split('/');

        const startDateTime = new Date(
          `${year1}-${month1}-${day1}T${steps[i].start_time}:00`,
        );
        const endDateTime = new Date(
          `${year2}-${month2}-${day2}T${steps[i + 1].start_time}:00`,
        );

        // Calculate duration
        const durationMs = endDateTime - startDateTime;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60),
        );

        steps[i].time = `${durationHours}:${durationMinutes}`;
      }

      // Handle last step duration
      const [userDay, userMonth, userYear] = userChosen.date.split('/');
      const userEndDateTime = new Date(
        `${userYear}-${userMonth}-${userDay}T${userChosen.time}:00`,
      );

      const lastStepStartDateTime = new Date(
        `${steps[steps.length - 1].start_date.split('/').reverse().join('-')}T${
          steps[steps.length - 1].start_time
        }:00`,
      );

      const durationMsLast = userEndDateTime - lastStepStartDateTime;
      const durationHoursLast = Math.floor(durationMsLast / (1000 * 60 * 60));
      const durationMinutesLast = Math.floor(
        (durationMsLast % (1000 * 60 * 60)) / (1000 * 60),
      );

      steps[
        steps.length - 1
      ].time = `${durationHoursLast}:${durationMinutesLast}`;
    }

    return steps;
  };

  const addTotalTime = () => {
    const totalMinutes = allSteps.reduce((sum, item) => {
      const [hours, minutes, seconds = 0] = item.time.split(':').map(Number);
      return sum + hours * 60 + minutes + Math.floor(seconds / 60);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    setTotalTime(pre => ({
      ...pre,
      hours: hours,
      minutes: minutes,
    }));
    return;
  };

  useEffect(() => {
    if (allSteps.length > 0) {
      calculateDurations(allSteps, userChoose);
    }
    addTotalTime();
  }, [allSteps.length, allSteps, userChoose]);

  // updating the pizza plan
  const updatingThePizzaPlan = async () => {
    const totalSteps = [...allSteps, fixedStep];
    // print(fixedStep);
    let finalSteps = [];
    let emptObj = {};
    // formdata.append('plan' , )

    totalSteps.forEach((all, id) => {
      emptObj = {
        step_count: id + 1,
        key: all.title.sorting_key,
        time: all.title.sorting_key != 1 ? all.time : formatTime(all.time),
        start_date:
          all.title.sorting_key != 1
            ? formatedNewDate(all.start_date)
            : formatedNewDate(userChoose?.date),
        start_time:
          all.title.sorting_key != 1 ? all.start_time : userChoose?.time,
        temp: all.temp,
        oven_lid: all?.title?.sorting_key == 1 ? all?.oven?.sorting_key : '',
      };
      finalSteps.push(emptObj);
    });
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
      formdata.append('calcid', detail.id);

      formdata.append('steps', JSON.stringify(finalSteps));
      formdata.append('plan_date', formatedNewDate(userChoose?.date));
      formdata.append('plan_time', userChoose?.time);
      formdata.append(
        'total_calculated_time',
        `${totalTime.hours}:${totalTime.minutes}`,
      );

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      // print(finalSteps, 'fina');

      const response = await fetch(Url().pizzaPlanUpdate, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          Toast.show(resparse?.data ? resparse.data : 'updated successfully', {
            type: 'success',
            duration: 2000,
          });
          Navigation.setParams({
            refresh: 'refresh',
          });
          Navigation.goBack();
        }
      } else {
      }
    } catch (error) {
      console.log(error, 'error in the update pizza plan step');
    }
  };
  const subtractTimeFromStart = (startTime, duration) => {
    console.log(startTime, duration, 'start,duration');

    if (!duration || duration.length < 1) return startTime;

    // Parse start time (HH:mm)
    const [startHours, startMinutes] = startTime.split(':').map(Number);

    // Parse duration (expects "HH:mm")
    const durationParts = duration.split(':');
    const durHours = parseInt(durationParts[0], 10);
    const durMinutes =
      durationParts.length > 1 ? parseInt(durationParts[1], 10) : 0;

    if (isNaN(durHours) || isNaN(durMinutes)) return startTime;

    // Create base date at midnight
    const base = new Date();
    base.setHours(0, 0, 0, 0);

    // Build start time from base
    const startDate = new Date(base.getTime());
    startDate.setHours(startHours, startMinutes, 0, 0);

    // Subtract duration
    const durationMs = (durHours * 60 * 60 + durMinutes * 60) * 1000;
    const adjustedDate = new Date(startDate.getTime() - durationMs);

    // Format to HH:mm (24h format)
    const adjustedHours = adjustedDate.getHours().toString().padStart(2, '0');
    const adjustedMinutes = adjustedDate
      .getMinutes()
      .toString()
      .padStart(2, '0');

    return `${adjustedHours}:${adjustedMinutes}`;
  };

  return (
    <>
      {!load ? (
        <View style={[commenStyle.rootPage]}>
          {settingShow && setPlanVideo && (
            <VideoPlayer
              source={setPlanVideo}
              show={planVideoShow}
              onClose={() => dispatch(setPlanVideoShow(false))}
              showText={planContent?.show_demo_video}
              onOpen={() => dispatch(setPlanVideoShow(true))}
            />
          )}
          <View
            style={[
              commenStyle.container,
              {marginTop: widthResponse ? 20 : 25},
            ]}>
            {settingShow && (
              <>
                <View
                  style={[
                    commenStyle.hFlex,
                    {
                      marginBottom: widthResponse ? 15 : 20,
                    },
                  ]}>
                  {planContent?.resttimes?.title && (
                    <Text
                      style={[
                        commenStyle.sideHead,
                        {
                          marginBottom: 0,
                          flex: 1,
                          paddingRight: 15,
                          fontSize: fontScalling(2),
                        },
                      ]}>
                      {planContent?.resttimes?.title}
                    </Text>
                  )}
                  <TouchableOpacity onPress={() => setRestDatas(true)}>
                    <Icon
                      ComponentName={'AntDesign'}
                      name={'questioncircle'}
                      color={appColor.black}
                      size={widthResponse ? 20 : 25}
                    />
                  </TouchableOpacity>
                  <ModalPopup
                    onBackButtonPress={() => setRestDatas(false)}
                    onBackdropPress={() => setRestDatas(false)}
                    onClosePress={() => setRestDatas(false)}
                    visible={restDatas}
                    style={{
                      paddingTop: widthResponse ? 40 : 50,
                    }}>
                    {planContent?.resttimes?.title && (
                      <Text
                        style={[
                          commenStyle.sideHead,
                          {
                            textAlign: 'center',
                            marginBottom: widthResponse ? 20 : 25,
                          },
                        ]}>
                        {planContent?.resttimes?.title}
                      </Text>
                    )}
                    {planContent?.resttimes?.withcool && (
                      <CalcInfo
                        title={planContent?.resttimes?.withcool?.title}
                        datas={planContent?.resttimes?.withcool?.value}
                        style={{
                          marginBottom: widthResponse ? 15 : 20,
                        }}
                      />
                    )}
                    {planContent?.resttimes?.withoutcool && (
                      <CalcInfo
                        title={planContent?.resttimes?.withoutcool?.title}
                        datas={planContent?.resttimes?.withoutcool?.value}
                      />
                    )}
                  </ModalPopup>
                </View>
                <View
                  style={{
                    paddingBottom: widthResponse ? 15 : 25,
                    marginBottom: widthResponse ? 15 : 25,
                    borderBottomColor: appColor.borderColor,
                    borderBottomWidth: 1,
                  }}>
                  {planContent?.When_do_you_want_to_eat_pizza && (
                    <Text style={[commenStyle.sideHead, {}]}>
                      {planContent?.When_do_you_want_to_eat_pizza}
                    </Text>
                  )}
                  <View
                    style={[
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      },
                    ]}>
                    <InputText
                      placeholder={'date'}
                      customStyle={{paddingBottom: 0, width: '67%'}}
                      rightIcon={'MaterialIcons'}
                      iconRightName={'date-range'}
                      iconrightSize={widthResponse ? 20 : 24}
                      editable={false}
                      value={userChoose?.date}
                      onPress={() => setDateShow(true)}
                      onPressRight={() => setDateShow(true)}
                    />

                    {/* date picker */}
                    <DatePicker
                      mode="date"
                      theme="light"
                      modal
                      open={dateShow}
                      date={userChoose.date ? parseDate(userChoose.date) : date}
                      minimumDate={
                        userChoose.date ? parseDate(userChoose.date) : date
                      }
                      onConfirm={date => {
                        setDateShow(false);
                        setUserChoose({
                          ...userChoose,
                          date: formatedDate(date),
                        });
                      }}
                      onCancel={() => {
                        setDateShow(false);
                      }}
                      // buttonColor={appColor.primary}
                    />

                    <SelectDropDown
                      placeholder={'20:00'}
                      saveRecipe
                      nodrop={true}
                      onPress={() => {
                        setTimeShow(true);
                      }}
                      value={userChoose?.time}
                      datas={[1, 2, 3, 4, 5]}
                      contStyle={{
                        width: '30%',
                        marginBottom: 0,
                      }}
                    />

                    {/* date picker */}
                    <DatePicker
                      mode="time"
                      theme="light"
                      modal
                      minuteInterval={15}
                      open={timeShow}
                      is24hourSource="device"
                      date={userChoose.time ? parseTime(userChoose.time) : date}
                      onConfirm={time => {
                        setTimeShow(false);
                        setUserChoose(pre => ({
                          ...pre,
                          time: toLocalTime(time),
                        }));
                      }}
                      onCancel={() => {
                        setTimeShow(false);
                      }}
                      // buttonColor={appColor.primary}
                    />
                  </View>
                </View>
              </>
            )}

            {userChoose?.date && userChoose?.time && (
              <View
                style={[
                  commenStyle.hFlex,
                  {marginBottom: widthResponse ? 15 : 20},
                ]}>
                <PrimaryButton
                  invert
                  text={planContent?.new_step}
                  onPress={() => setVisible(true)}
                  iconComponent={'AntDesign'}
                  iconName={'pluscircle'}
                  iconSize={fontScalling(2.5)}
                  style={{flex: 1}}
                />

                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                  }}>
                  <TouchableOpacity
                    onPress={() => setSettingShow(!settingShow)}
                    style={{
                      width: widthResponse ? 40 : 50,
                      height: widthResponse ? 40 : 50,
                      borderRadius: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: appColor.primary,
                    }}>
                    <Icon
                      ComponentName={'Fontisto'}
                      name={'date'}
                      color={appColor.white}
                      size={widthResponse ? 20 : 24}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: keyboardShow ? 200 : 0,
            }}>
            {/* pizza plan list */}

            {!stepLoad ? (
              <>
                {/* {print(allSteps, 'all steps')} */}
                {allSteps && allSteps.length > 0 && (
                  <FlatList
                    ref={flatRef}
                    data={allSteps}
                    scrollEnabled={false}
                    style={[commenStyle.container]}
                    ItemSeparatorComponent={() => {
                      return (
                        <View style={{marginBottom: widthResponse ? 10 : 15}} />
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingVertical: widthResponse ? 10 : 15,
                    }}
                    renderItem={({item, index}) => {
                      return (
                        <PlanCard
                          key={index}
                          title={item?.title?.sorting}
                          temperatureShow={item?.title?.temperature}
                          maximumDate={
                            userChoose?.date ? userChoose.date : date
                          }
                          secondsShow
                          temperatureValue={item?.temp}
                          onDatePick={newDate => {
                            setAllSteps(prev =>
                              prev.map(step =>
                                step.id === item.id
                                  ? {...step, start_date: newDate}
                                  : step,
                              ),
                            );
                          }}
                          onTimePick={newTime => {
                            setAllSteps(prev =>
                              prev.map(step =>
                                step.id === item.id
                                  ? {...step, start_time: newTime}
                                  : step,
                              ),
                            );
                          }}
                          // leftEdit
                          tempEdit
                          onchangeLeft={temp => {
                            setAllSteps(prev =>
                              prev.map(step =>
                                step.id === item.id
                                  ? {...step, temp: temp}
                                  : step,
                              ),
                            );
                          }}
                          id={item?.id}
                          startDate={item?.start_date}
                          startTime={
                            item?.start_time &&
                            convertTimeFormat(item?.start_time)
                          }
                          onSecondChange={e =>
                            setAllSteps(pre =>
                              pre.map((step, i) =>
                                i === index ? {...step, time: e} : step,
                              ),
                            )
                          }
                          onDurationBlur={() => {
                            console.log(item?.time, 'getting');
                            const subTime = subtractTimeFromStart(
                              convertTimeFormat(item?.start_time),
                              item?.time,
                            );
                            console.log(subTime, 'sub');
                            setAllSteps(pre =>
                              pre.map((step, i) =>
                                i === index
                                  ? {...step, start_time: subTime}
                                  : step,
                              ),
                            );
                            calculateDurations(allSteps, userChoose);
                          }}
                          duration={item?.time}
                          content={planContent}
                          removePizzaPlan={removePizzaPlan}
                        />
                      );
                    }}
                  />
                )}
                {userChoose?.date &&
                  userChoose?.time &&
                  allSteps.length > 0 && (
                    <View
                      style={[
                        commenStyle.container,
                        {
                          paddingBottom: widthResponse ? 15 : 20,
                        },
                      ]}>
                      {fixedStep && (
                        <PlanCard
                          title={fixedStep?.title?.sorting}
                          // item={fixedStep}
                          disabled={true}
                          showText
                          tempEdit
                          temperatureValue={fixedStep?.temp}
                          content={planContent}
                          duration={fixedStep.time}
                          seconds
                          secondsShow
                          startDate={userChoose?.date}
                          startTime={userChoose?.time}
                          temperatureShow={fixedStep?.title?.temperature}
                          onchangeLeft={e =>
                            setFixedStep(pre => ({
                              ...pre,
                              temp: e,
                            }))
                          }
                          onSecondChange={e =>
                            setFixedStep(pre => ({
                              ...pre,
                              time: e,
                            }))
                          }
                          leftEdit={true}
                          ovens={planContent?.ovens}
                          ovenLabel={planContent?.oven_placeholder}
                          ovenPlaceholder={planContent?.oven_placeholder}
                          onOvenChange={e =>
                            setFixedStep(pre => ({
                              ...pre,
                              oven: e,
                            }))
                          }
                          ovenValue={fixedStep?.oven}
                        />
                      )}
                    </View>
                  )}
              </>
            ) : (
              <CommunityRecipeCardShimmer />
            )}
          </ScrollView>
          {/* {stepsLoad ? <SpinLoader /> : null} */}

          <View
            style={[
              commenStyle.container,
              {
                paddingVertical: widthResponse ? 10 : 15,
                backgroundColor: appColor.cardbg,
              },
            ]}>
            <PrimaryButton
              text={planContent?.save_button}
              onPress={updatingThePizzaPlan}
              style={{
                marginBottom: widthResponse ? 8 : 15,
              }}
            />
            <Text
              style={[
                commenStyle.para,
                {
                  textAlign: 'center',
                  marginBottom: 0,
                },
              ]}>
              {planContent?.total_cooking_time}
              {' : '}
              <Text style={[{color: appColor.active}]}>{`${
                totalTime?.hours + ' ' + planContent?.hours
              } ${totalTime?.minutes + ' ' + planContent?.minutes}`}</Text>
            </Text>
          </View>

          {/* bottom sheet for the add new step*/}
          <ModalBottomSheet
            snapPoints={['40%', '40%']}
            isVisible={visible}
            sheetTitle={planContent?.popup_content?.add_a_new_step}
            close={() => {
              setVisible(false);
            }}>
            {/* <ScrollView showsVerticalScrollIndicator={false}> */}
            {/* step type dropdown */}
            <Controller
              control={control}
              name="title"
              render={({field: {onChange, value}}) => {
                return (
                  <SelectDropDown
                    sorting
                    withOutDrop
                    // steps
                    label={planContent?.popup_content?.add_a_new_step}
                    placeholder={planContent?.popup_content?.add_a_new_step}
                    datas={planContent?.dropdown_values}
                    value={value}
                    modal
                    contStyle={{marginBottom: widthResponse ? 10 : 15}}
                    onChange={e => {
                      onChange(e);
                      setStep(e);
                    }}
                    error={errors.title}
                  />
                );
              }}
            />
            <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: widthResponse ? 10 : 15,
                },
              ]}>
              <Controller
                control={control}
                name="start_date"
                render={({field: {onChange, value}}) => {
                  return (
                    <>
                      <InputText
                        label={planContent?.date}
                        placeholder="date"
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
                        formError={errors.start_date}
                        onPress={() => setstart_dateShow(true)}
                        onPressRight={() => setstart_dateShow(true)}
                      />
                      {/* {console.log(userChoose, 'parseDate(userChoose.date)')} */}
                      <DateTimePick
                        mode={'date'}
                        date={date}
                        show={start_dateShow}
                        close={() => setstart_dateShow(false)}
                        onchange={onChange}
                        maximumDate={
                          userChoose?.date ? parseDate(userChoose.date) : date
                        }
                      />
                    </>
                  );
                }}
              />

              <Controller
                control={control}
                name="start_time"
                render={({field: {onChange, value}}) => {
                  return (
                    <>
                      <SelectDropDown
                        label={planContent?.time}
                        placeholder={planContent?.time}
                        nodrop={true}
                        onPress={() => setstart_timeShow(true)}
                        value={value}
                        datas={[1, 2, 3, 4, 5]}
                        error={errors.start_time}
                        contStyle={{
                          width: '49%',
                          marginBottom: 0,
                        }}
                      />
                      <DateTimePick
                        mode={'time'}
                        minuteInterval={15}
                        date={date}
                        show={start_timeShow}
                        close={() => setstart_timeShow(false)}
                        onchange={onChange}
                      />
                    </>
                  );
                }}
              />
            </View>
            <View
              style={[
                // commenStyle.hFlex,
                {marginBottom: widthResponse ? 10 : 15},
              ]}>
              {/* temperature dropdown */}
              {step?.temperature != '0' ? (
                <Controller
                  control={control}
                  name="temperature"
                  render={({field: {onChange, value}}) => (
                    <SelectDropDown
                      label={planContent?.popup_content?.temp}
                      placeholder={planContent?.popup_content?.temp}
                      value={value?.tempValue}
                      nodrop
                      error={errors.temperature}
                      onPress={() =>
                        setPickerModal({visible: true, type: 'temp'})
                      }
                    />
                  )}
                />
              ) : null}

              {/* picker modal */}
              <ModalPopup
                visible={pickerModal.visible}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClosePress={() => {
                  setPickerModal(pre => ({...pre, visible: false}));
                }}
                white={pickerModal.type == 'temp' ? false : true}
                onBackdropPress={() => {
                  setPickerModal(pre => ({...pre, visible: false}));
                }}>
                <View>
                  {pickerModal.type == 'time' ? (
                    <TimerPicker
                      padWithNItems={3}
                      hideSeconds
                      hourLabel={planContent?.hours}
                      minuteLabel={planContent?.minutes}
                      onDurationChange={e => {
                        // setStep(pre => ({
                        //   ...pre,
                        //   timeValue: `${
                        //     e.hours != '0'
                        //       ? e.hours + ' ' + planContent?.hours
                        //       : ''
                        //   } ${e.minutes} ${planContent?.minutes}`,
                        //   time: `${e.hours}:${e.minutes}:${e.seconds}`,
                        //   // time : `${e.hours < 0 ? e.hours : {'0'}e}:${e.minutes}:${e.seconds}`
                        // }));
                      }}
                      styles={{
                        backgroundColor: appColor.bgWhite,
                        theme: 'light',
                        pickerItem: {
                          fontSize: fontScalling(1.8),
                          lineHeight: fontScalling(2),
                          fontFamily: appFont.lR,
                          color: appColor.black,
                        },
                        pickerLabel: {
                          fontSize: fontScalling(2),
                          lineHeight: fontScalling(2),
                          right: -fontScalling(3.8),
                        },
                        pickerLabelContainer: {
                          width: widthResponse ? 60 : 100,
                        },
                        pickerItemContainer: {
                          width: widthResponse ? 100 : 180,
                        },
                      }}
                    />
                  ) : pickerModal.type == 'temp' ? (
                    <View
                      style={{
                        height: scrnHeight / 3,
                        alignSelf: 'center',
                        borderRadius: 20,
                        backgroundColor: appColor.bgWhite,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <FlatList
                          data={tempArr}
                          //   pagingEnabled
                          showsVerticalScrollIndicator={false}
                          initialNumToRender={10}
                          onEndReached={() => {
                            const last = tempArr[tempArr.length - 1];
                            for (let i = 1; i <= 10; i++) {
                              tempArr.push(last + i);
                            }
                          }}
                          // onStartReached={() => {
                          //   const start = tempArr[0];
                          //   for (let i = 1; i <= 10; i++) {
                          //     tempArr.unshift(start - i);
                          //   }
                          // }}
                          renderItem={({item, index}) => {
                            return (
                              <Controller
                                key={index}
                                control={control}
                                name="temperature"
                                render={({field: {onChange, value}}) => (
                                  <Pressable
                                    style={[styles.textmodal]}
                                    onPress={() => {
                                      // setStep(pre => ({
                                      //   ...pre,
                                      //   tempValue: `${item} ${setters?.temperature?.tshort}`,
                                      //   temp: String(item),
                                      // }));
                                      const val = {
                                        tempValue: `${item} ${setters?.temperature?.tshort}`,
                                        temp: String(item),
                                      };
                                      onChange(val);
                                      setPickerModal(pre => ({
                                        ...pre,
                                        visible: false,
                                      }));
                                    }}>
                                    <Text
                                      style={[
                                        commenStyle.authNavContainer,
                                        {color: appColor.black},
                                      ]}>
                                      {item}
                                    </Text>
                                  </Pressable>
                                )}
                              />
                            );
                          }}
                        />
                        <View style={[styles.textmodal]}>
                          <Text
                            style={[
                              commenStyle.authNavContainer,
                              {color: appColor.black},
                            ]}>
                            {setters?.temperature?.tshort}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              </ModalPopup>
              {/* time dropdown */}
              {/* <InputText
                label={planContent?.duration}
                placeholder={planContent?.duration}
                editable={false}
                value={step.timeValue}
                // onPress={() => setPickerModal({visible: true, type: 'time'})}
              /> */}
            </View>

            <PrimaryButton
              text={planContent?.popup_content?.add_step}
              onPress={handleSubmit(addPizzaPlanStep)}
            />

            {/* </ScrollView> */}
          </ModalBottomSheet>
        </View>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default SetPlan;

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    hFlexStart: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    textmodal: {
      height: scrnHeight / 10,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return {styles};
};
