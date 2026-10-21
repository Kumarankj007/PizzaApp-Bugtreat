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
import {
  Capitalize,
  fontScalling,
  permissionAlert,
  print,
  requestCameraPermission,
  scrnWidth,
  splitTime,
  widthResponse,
} from '../../Utilities/helperFunction';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {appFont} from '../../Utilities/appFont';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {Icon} from '../../Utilities/icon';
import RecipeList from '../../components/Cards/RecipeList';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {InputText} from '../../components/InputFields/InputText';
import ImageCropPicker from 'react-native-image-crop-picker';
import * as Animatable from 'react-native-animatable';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ShowSwitch from '../../components/Buttons/ShowSwitch';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Url} from '../../Utilities/appApi';
import {useDispatch, useSelector} from 'react-redux';
import PageLoader from '../../components/Loader/PageLoader';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import {Toast} from 'react-native-toast-notifications';
import ModalPopup from '../../components/Modal/ModalPopup';
import AuthLoading from '../../components/Loader/AuthLoading';
import Radio from '../../components/InputFields/Radio';
import {Rating} from 'react-native-ratings';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import DateTimePick from '../../components/InputFields/DateTimePick';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import uuid from 'react-native-uuid';
import ValidationContent from '../../Hooks/ValidationContent';
import RecipeFlour from '../../components/Cards/RecipeFlour';
import CalcInfo from '../../components/Cards/CalcInfo';
import Stopshare from '../../components/Buttons/Stopshare';

const RecipeDetail = ({route}) => {
  const {setters, deviceId, userId, logo} = useSelector(
    state => state.appSettings,
  );
  const keyboardVisible = KeyboardVisible(true);
  const {isLogged, isSubscribed} = useSelector(State => State.authSettings);
  const Navigation = useNavigation();
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const isFocus = useIsFocused();
  const {detail} = route?.params;

  const {styles} = pagestyles();
  const [images, setImages] = useState([]);
  const [imgError, setImgError] = useState(false);
  const [imgUploadBtn, setImgUploadBtn] = useState(false);
  const [shareSheet, setShareSheet] = useState(false);
  const textFocus = useRef(null);
  const [resDetail, setResDetail] = useState({});
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [resDelModal, setResDelModal] = useState(false);
  const [resRevoke, setResRevoke] = useState(false);
  const [revokeLoad, setRevokeLoad] = useState(false);
  const [delLoad, setDelLoad] = useState(false);

  const [bakingSheet, setBakingSheet] = useState(false);
  const [mediaSheet, setMediaSheet] = useState(false);
  const [oven, setOven] = useState('');
  const [bakTemp, setBakTemp] = useState('');
  const [bakTime, setBakTime] = useState('');
  const [rating, setRating] = useState(0);

  const [wb1, setWb1] = useState({
    wb1min: '',
    wb1max: '',
    color: '',
    strength: '',
  });
  const [wb2, setWb2] = useState({
    wb2min: '',
    wb2max: '',
    color: '',
    strength: '',
  });
  const [wb3, setWb3] = useState({
    wb3min: '',
    wb3max: '',
    color: '',
    strength: '',
  });
  const [wb4, setWb4] = useState({
    wb4min: '',
    wb4max: '',
    color: '',
    strength: '',
  });
  const [wBar, setWBar] = useState('');

  const [scheduleSheet, setScheduleSheet] = useState(false);
  const [schdulePick, setSchdulePick] = useState({
    datePick: false,
    timePick: false,
  });
  const [restInfo, setRestInfo] = useState(false);
  const date = new Date();
  const minInterval = 15;
  const [restDatas, setRestDatas] = useState(false);
  const {valContent} = ValidationContent();
  const [recipeImages, setRecipeImages] = useState([]);
  const [animButton, setAnimButton] = useState(false);
  const [recipeImage, setRecipeImage] = useState({
    name: 'profile.jpeg',
    uri: '',
    type: 'image/jpeg',
  });
  const [sheetLoad, setSheetLoad] = useState(false);

  // schema
  const schema = yup.object().shape({
    notes: yup
      .string()
      .required(valContent?.enter_your_notes)
      .min(5, valContent?.fill_in_with_5_characters),

    photos: yup
      .array()
      .test('max-images', 'upload only limited images', function (value) {
        const {recipeImages} = this.parent; // Access recipeImages from the parent form values
        const maxAllowed = recipeImages?.length ? 6 - recipeImages.length : 6;

        // Allow empty array but restrict maximum number of images
        return !value || value.length <= maxAllowed;
      }),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const shareSchema = yup
    .object()
    .shape({
      name: yup.string().required(valContent?.what_is_your_recipe_called),
      message: yup.string().required(valContent?.type_your_comment),
      profile: yup.string().required(valContent?.choose_profileshow),
    })
    .required();

  const {
    setValue: setShareValue,
    control: shareControl,
    handleSubmit: shareSubmit,
    reset: shareReset,
    formState: {errors: shareErrors},
  } = useForm({
    resolver: yupResolver(shareSchema),
  });

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

  const OpenCamera = async (onChange, images = []) => {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        let fileName = 'FlourImg.' + image.mime.split('/')[1];
        const newImages = [
          ...images,
          {
            id: uuid.v4(),
            name: fileName,
            uri: image.path,
            type: image.mime,
          },
        ];
        onChange(newImages);
      })
      .catch(error => {
        console.log(error);
        if (error.message == 'User did not grant camera permission.') {
          permissionAlert('Camera');
        }
      });
  };

  const OpenGallery = async (onChange, images = []) => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      width: 300,
      height: 300,
      cropping: true,
      multiple: true,
    })
      .then(image => {
        let imgArr = image.map((image, i) => ({
          id: uuid.v4(),
          name: 'profile' + i + '.' + image.mime.split('/')[1],
          uri: image.path,
          type: image.mime,
        }));
        onChange([...images, ...imgArr]);
      })
      .catch(error => {
        console.log(error);
        if (error.message == 'User did not grant library permission.') {
          permissionAlert('Gallery');
        }
      });
  };

  // handle delete image
  const handleDeleteImage = id => {
    const updatedImages = images.filter(item => item.id != id);
    // print(updatedImages, 'updates');
    setValue('photos', updatedImages);
  };

  const recipeImageOpenCamera = async () => {
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
      });
    setAnimButton(!animButton);
  };

  const pickRecipeImage = async () => {
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
      });
    setAnimButton(!animButton);
  };

  // Handle delete logic
  const handleRecipeImageDeleteImage = () => {
    setRecipeImage({
      ...recipeImage,
      uri: logo ? logo : '',
    });
    setAnimButton(false);
    setTimeout(() => {}, 1000);
  };

  useEffect(() => {
    if (detail && detail.id) {
      recipeDetailApiCall();
    }
  }, [
    setters?.weight,
    setters?.language,
    detail.id,
    isFocus,
    setters?.temperature?.tshort,
  ]);

  // all recipe detail contents and calculations
  const recipeDetailApiCall = async () => {
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
      formdata.append('calcId', detail.id);
      if (deviceId) formdata.append('uuId', deviceId);
      formdata.append('user_id', userId ? userId : 0);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      // print(formdata,"fomr")
      if (Object.keys(resDetail).length == 0) {
        setLoad(true);
        dispatch(setTitleLoad(true));
      }
      const response = await fetch(Url().recipeDetail, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse?.data, 'resparse reci');
          setResDetail(resparse.data);
          setOven(resparse?.data?.cards?.oven);
          setBakTemp(resparse?.data?.cards?.temp);
          setRating(resparse?.data?.cards?.grade);
          setBakTime(resparse?.data?.cards?.time);
          setWb1({
            wb1min: Number(resparse?.data?.wvBar?.bar1?.min),
            wb1max: Number(resparse?.data?.wvBar?.bar1?.max),
            color: resparse?.data?.wvBar?.bar1?.color,
            strength: resparse?.data?.wvBar?.bar1?.strength,
          });
          setWb2({
            wb2min: Number(resparse?.data?.wvBar?.bar2?.min),
            wb2max: Number(resparse?.data?.wvBar?.bar2?.max),
            color: resparse?.data?.wvBar?.bar2?.color,
            strength: resparse?.data?.wvBar?.bar2?.strength,
          });
          setWb3({
            wb3min: Number(resparse?.data?.wvBar?.bar3?.min),
            wb3max: Number(resparse?.data?.wvBar?.bar3?.max),
            color: resparse?.data?.wvBar?.bar3?.color,
            strength: resparse?.data?.wvBar?.bar3?.strength,
          });
          setWb4({
            wb4min: Number(resparse?.data?.wvBar?.bar4?.min),
            wb4max: Number(resparse?.data?.wvBar?.bar4?.max),
            color: resparse?.data?.wvBar?.bar4?.color,
            strength: resparse?.data?.wvBar?.bar4?.strength,
          });
          if (resparse?.data?.cards?.wValue)
            calculateArrowValue(
              resparse?.data?.wvBar,
              Number(resparse?.data?.cards?.wValue),
            );
          Navigation.setOptions({
            title: resparse?.data?.cards?.fileName
              ? resparse?.data?.cards?.fileName
              : detail?.fileName,
          });
          setValue('notes', resparse?.data?.cards?.comment);
          setRecipeImages(resparse?.data?.multiple_image);
          setRecipeImage({
            ...recipeImage,
            uri: resparse?.data?.cards?.cardImg,
          });
          setShareValue('name', resparse?.data?.cards?.fileName);
          setShareValue('message', resparse?.data?.cards?.comment);
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

  const calculateArrowValue = (barValue, val) => {
    const wBar =
      val >= barValue?.bar1?.min && val <= barValue?.bar1?.max
        ? ((val - barValue?.bar1?.min) /
            (barValue?.bar1?.max - barValue?.bar1?.min)) *
          100
        : val >= barValue?.bar2?.min && val <= barValue?.bar2?.max
        ? ((val - barValue?.bar2?.min) /
            (barValue?.bar2?.max - barValue?.bar2?.min)) *
          100
        : val >= barValue?.bar3?.min && val <= barValue?.bar3?.max
        ? ((val - barValue?.bar3?.min) /
            (barValue?.bar3?.max - barValue?.bar3?.min)) *
          100
        : val >= barValue?.bar4?.min && val <= barValue?.bar4?.max
        ? ((val - barValue?.bar4?.min) /
            (barValue?.bar4?.max - barValue?.bar4?.min)) *
          100
        : val < barValue?.bar1?.min
        ? 0
        : val > barValue?.bar4?.max
        ? 1
        : null;

    setWBar(wBar);
  };

  // Recipe detail image upload datas apicall
  const recipeDetailImageUpload = async data => {
    if (images.length == 0) setImgError(true);
    else {
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

        formdata.append('comment', data.notes);

        if (images.length > 0) {
          images.forEach((item, id) => formdata.append('images[]', item));
        }
        formdata.append('calcId', detail.id);

        // print(formdata, 'form');
        setSheetLoad(true);
        setImgError(false);
        const response = await fetch(
          Url().recipeDetailUploadPhotos,
          requestOptions,
        );
        // print(response,"respo")
        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.status == 'success') {
            setMediaSheet(false);
            Toast.show(resparse.data, {
              type: 'success',
              duration: 2000,
            });
            recipeDetailApiCall();
          }
          reset();
          setImages([]);
        }
        setSheetLoad(false);
      } catch (error) {
        console.log(error, 'error in the recipe detail image upload screen');
        setSheetLoad(false);
      }
    }
  };

  const multipeImageDelte = async id => {
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
      formdata.append('calcId', detail.id);
      formdata.append('imgId', id);
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const response = await fetch(Url().deleteMultipleImage, requestOptions);
      if (response.status == 200) {
        await response.json();
        recipeDetailApiCall();
      }
    } catch (error) {
      console.log(error, 'error in the multiple image delete');
    }
  };

  // recipe delete api call
  const HandleRecipeDelete = async () => {
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
      formdata.append('id', detail.id);
      formdata.append('delete', 'deleted');

      // print(formdata, 'form');
      setDelLoad(true);
      const response = await fetch(Url().recipeModify, requestOptions);
      // print(response,"resp")
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resp');
        if (resparse.status == 'success') {
          Toast.show(resparse.data, {
            type: 'success',
            duration: 2000,
          });
          setTimeout(() => {
            Navigation.navigate('recipeoverview', {
              delete: 'delete',
            });
          }, 2000);
          setResDelModal(false);
        }
      }
      setDelLoad(false);
    } catch (error) {
      console.log(error, 'error in the recipe detail image upload screen');
      setDelLoad(false);
    }
  };

  // api for the community share
  const handleCommunityShare = async data => {
    // console.log(data.profile == '2' ? 0 : 1);
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

      formdata.append('calcId', detail.id);
      formdata.append('file_name', data.name);
      formdata.append('comment', data.message);
      formdata.append('view_profile', data.profile == '2' ? 0 : 1);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      // print(formdata, 'shaare');
      setSheetLoad(true);
      const response = await fetch(Url().shareToCommunity, requestOptions);
      // print(response, 'reps');
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse,"resp")
        if (resparse.status == 'success') {
          Toast.show(resparse.data, {
            type: 'success',
            duration: 2000,
          });
          shareReset();
          setShareSheet(false);
          recipeDetailApiCall();
        }
        setSheetLoad(false);
      }
    } catch (error) {
      console.log(error, 'error in the community share api call');
      setSheetLoad(false);
    }
    // print(data,"data")
  };

  // for sending the baking information
  const sendBakingInformation = async () => {
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
      if (setters && setters?.temperature?.tshort) {
        formData.append(
          'tshort',
          setters?.temperature?.tshort ? setters?.temperature?.tshort : '°C',
        );
      }
      if (setters && setters?.weight?.ushort) {
        formData.append(
          'uShort',
          setters?.weight?.ushort ? setters?.weight?.ushort : 'g',
        );
      }
      if (deviceId) formData.append('uuId', deviceId);
      formData.append('calcId', detail.id);
      formData.append('additional', 'savedata');
      if (bakTemp && bakTemp != '') formData.append('temp', bakTemp);
      if (bakTime && bakTime != '') formData.append('time', bakTime);
      if (rating) formData.append('grade', rating);
      formData.append('oven', oven);
      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      // print(formData,"form")
      const response = await fetch(Url().savedCalculation, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setBakingSheet(false);
          Toast.show(resparse.data, {
            type: 'success',
            duration: 2000,
          });
        }
        setBakTemp('');
        setBakTime('');
        setOven('');
        setRating(0);
        recipeDetailApiCall();
      }
    } catch (error) {
      console.log(error, 'error in the baking information send api');
    }
  };

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
      formData.append('calcid', detail.id);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      // print(formData, 'form');
      const response = await fetch(Url().wizardRecipeSave, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse, 'resp');
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
          scheduleReset();
        }
      }
    } catch (error) {
      console.log(error, 'error in the schedule pizza api call');
    }
  };

  // for uploading the recipe thumbnail
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
      formdata.append('calcId', resDetail?.cards?.id);
      if (recipeImage?.uri && recipeImage?.uri != '') {
        formdata.append('file', recipeImage);
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      // print(formdata, 'form');
      const response = await fetch(Url().uploadRecipeImage, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
        }
      }
    } catch (error) {
      console.log(error, 'error in recipe image upload');
    }
  };

  // recipe share revoke api call
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
      formdata.append('calcid', detail.id);

      setRevokeLoad(true);
      const response = await fetch(Url().communityRecipeRemove, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          Toast.show(resparse.data, {
            type: 'success',
            duration: 2000,
          });
          recipeDetailApiCall();
        }
      }
      setResRevoke(false);
      setRevokeLoad(false);
    } catch (error) {
      console.log(error, 'error in the recipe remove screen');
      setRevokeLoad(false);
    }
  };

  useEffect(() => {
    recipeImage?.uri && recipeImage?.uri != '' && uploadRecipeImageApiCall();
  }, [recipeImage]);
  return (
    <>
      {!load ? (
        <>
          <View
            style={{
              flex: 1,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* top block */}
              <View
                style={[
                  commenStyle.container,
                  {
                    paddingTop: widthResponse ? 25 : 35,
                    paddingBottom:
                      !isLogged || resDetail?.cards?.flourDetails?.flourId == ''
                        ? widthResponse
                          ? 20
                          : 30
                        : widthResponse
                        ? 60
                        : 70,
                    backgroundColor: appColor.bgWhite,
                    alignItems: 'center',
                    position: 'relative',
                  },
                ]}>
                <TouchableOpacity
                  style={{
                    width: widthResponse ? 40 : 60,
                    height: widthResponse ? 40 : 60,
                    borderRadius: widthResponse ? 40 : 60,
                    backgroundColor: appColor.bgBlack,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    right: 20,
                    top: 20,
                  }}
                  onPress={() => setResDelModal(true)}>
                  <Icon
                    ComponentName={'MaterialCommunityIcons'}
                    name={'delete'}
                    color={appColor.bgWhite}
                    size={fontScalling(2.7)}
                  />
                </TouchableOpacity>
                {/* image */}
                {/* {resDetail?.cards?.cardImg &&
                resDetail?.cards?.cardImg != '' &&
                resDetail?.cards?.cardImg != null ? (
                  <Image
                    source={{uri: resDetail.cards.cardImg}}
                    style={{
                      width: scrnWidth / 4,
                      height: scrnWidth / 4,
                      borderRadius: scrnWidth / 4,
                      marginBottom: widthResponse ? 15 : 20,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require('../../../assets/images/logo.png')}
                    style={{
                      width: scrnWidth / 4,
                      height: scrnWidth / 4,
                      // borderRadius: scrnWidth / 4,
                      marginBottom: widthResponse ? 15 : 20,
                    }}
                    resizeMode="contain"
                  />
                )} */}

                <Pressable
                  onPress={() => setAnimButton(!animButton)}
                  style={{
                    width: scrnWidth / 4,
                    height: scrnWidth / 4,
                    borderRadius: scrnWidth / 8,
                    position: 'relative',
                    alignSelf: 'center',
                    marginBottom: widthResponse ? 15 : 20,
                  }}>
                  {/* {recipeImage?.uri && recipeImage?.uri != '' && ( */}

                  <Image
                    source={{
                      uri:
                        recipeImage?.uri && recipeImage?.uri != ''
                          ? recipeImage.uri
                          : logo,
                    }}
                    // source={{
                    //   uri:
                    //     recipeImage?.uri && recipeImage?.uri != ''
                    //       ? recipeImage.uri
                    //       : logo,
                    // }}
                    style={[
                      {
                        width: '100%',
                        height: '100%',
                        // position: 'absolute',
                        // zIndex: 10,
                        borderRadius: 200,
                      },
                    ]}
                    resizeMode="cover"
                  />
                  {/* )} */}
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
                      right: '0%',
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
                          recipeImageOpenCamera();
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
                          pickRecipeImage();
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
                            handleRecipeImageDeleteImage();
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
                {/* name */}
                {resDetail?.cards?.fileName && (
                  <Text style={[commenStyle.sideHead]}>
                    {Capitalize(resDetail.cards.fileName)}
                  </Text>
                )}

                {/* date details */}
                <View
                  style={[
                    commenStyle.hFlex,
                    {
                      marginBottom: isLogged ? (widthResponse ? 20 : 25) : 0,
                    },
                  ]}>
                  {detail?.saveDate && resDetail?.created_on && (
                    <View style={{}}>
                      <Text
                        style={[
                          commenStyle.para,
                          {
                            color: appColor.textGrey,
                            marginBottom: widthResponse ? 3 : 7,
                          },
                        ]}>
                        {resDetail.created_on}
                      </Text>
                      <Text
                        style={[
                          commenStyle.para,
                          {
                            fontFamily: appFont.lB,
                            marginBottom: 0,
                          },
                        ]}>
                        {detail.saveDate}
                      </Text>
                    </View>
                  )}

                  {detail?.last_used && resDetail?.last_used && (
                    <View
                      style={{
                        paddingLeft: widthResponse ? 15 : 20,
                        marginLeft: widthResponse ? 15 : 20,
                        borderLeftColor: appColor.borderColor,
                        borderLefttWidth: 1,
                      }}>
                      <Text
                        style={[
                          commenStyle.para,
                          {
                            color: appColor.textGrey,
                            marginBottom: widthResponse ? 3 : 7,
                          },
                        ]}>
                        {resDetail.last_used}
                      </Text>
                      <Text
                        style={[
                          commenStyle.para,
                          {
                            fontFamily: appFont.lB,
                            marginBottom: 0,
                          },
                        ]}>
                        {detail?.last_used}
                      </Text>
                    </View>
                  )}
                </View>

                {/* total cooking time */}
                {resDetail?.cards?.plan_steps != 0 &&
                  resDetail?.cards?.total_time &&
                  resDetail?.cards?.total_time != '00:00:00' && (
                    <Text
                      style={[
                        commenStyle.para,
                        {
                          textAlign: 'center',
                          marginBottom: widthResponse ? 15 : 20,
                          fontSize: fontScalling(2.3),
                          // fontFamily: appFont.lB,
                          lineHeight: fontScalling(3),
                        },
                      ]}>
                      {resDetail?.baking?.totalTime}
                      {' : '}

                      <Text style={[{color: appColor.active}]}>{`${
                        splitTime(resDetail?.cards?.total_time)[0] +
                        ' ' +
                        resDetail?.baking?.hours
                      } ${
                        splitTime(resDetail?.cards?.total_time)[1] +
                        ' ' +
                        resDetail?.baking?.minute
                      }`}</Text>
                    </Text>
                  )}

                {/* plan button */}
                {isLogged && isSubscribed ? (
                  <View
                    style={[
                      commenStyle.hFlex,
                      {
                        justifyContent: 'space-between',
                        width: '100%',
                      },
                    ]}>
                    <PrimaryButton
                      invert
                      text={
                        resDetail?.cards?.plan_steps == '0'
                          ? resDetail?.tab_title1
                          : resDetail?.tab_title3
                      }
                      // fontSize={fontScalling(1.5)}
                      style={{
                        width: '51%',
                        paddingHorizontal: widthResponse ? 5 : 10,
                      }}
                      onPress={() => {
                        Navigation.navigate('setplan', {
                          detail,
                        });
                      }}
                    />
                    <PrimaryButton
                      text={resDetail?.tab_title2}
                      onPress={() => {
                        resDetail?.cards?.plan_steps == '0'
                          ? Navigation.navigate('setplan', {detail})
                          : resDetail?.cards?.shared_recipe == '1'
                          ? setScheduleSheet(true)
                          : setShareSheet(true);
                      }}
                      style={{
                        width: '47%',
                        paddingHorizontal: widthResponse ? 10 : 15,
                      }}
                    />
                  </View>
                ) : null}

                {resDetail?.cards?.shared_recipe &&
                resDetail?.cards?.shared_recipe == '1' ? (
                  <Stopshare
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      width: scrnWidth - 100,
                      marginTop: widthResponse ? 20 : 30,
                      borderRadius: 15,
                    }}
                    text={resDetail?.stop_sharing}
                    onPress={() => setResRevoke(true)}
                  />
                ) : null}

                {/* share button */}
                {isLogged &&
                  resDetail?.cards?.flourDetails?.flourId != '' &&
                  isSubscribed && (
                    <View
                      style={[
                        {
                          // paddingHorizontal: widthResponse ? 10 : 15,
                          backgroundColor: appColor.bgWhite,
                          borderRadius: 15,
                          position: 'absolute',
                          bottom:
                            resDetail?.cards?.shared_recipe != '1' ? -25 : -30,
                          alignItems: 'center',
                          width: scrnWidth - 80,
                          elevation: 15,
                        },
                        commenStyle.shadow,
                      ]}>
                      {resDetail?.cards?.shared_recipe &&
                      resDetail?.cards?.shared_recipe == '1' ? (
                        <View
                          style={[
                            commenStyle.hFlex,
                            {
                              paddingVertical: widthResponse ? 5 : 10,
                            },
                          ]}>
                          <View
                            style={[
                              commenStyle.hFlex,
                              {
                                paddingVertical: widthResponse ? 5 : 15,
                                paddingRight: 40,
                                marginRight: 20,
                                borderRightColor: appColor.borderColor,
                                borderRightWidth: 1,
                              },
                            ]}>
                            <Icon
                              ComponentName={'Entypo'}
                              name={'eye'}
                              color={appColor.bgBlack}
                              size={widthResponse ? 24 : 27}
                            />
                            <Text
                            style={[
                              styles.label,
                              {
                                color: appColor.black,
                              },
                            ]}>
                            {resDetail?.cards?.view_count == null
                              ? '0'
                              : resDetail?.cards?.view_count}
                          </Text>
                          </View>
                          <View
                            style={[
                              commenStyle.hFlex,
                              {
                                paddingVertical: widthResponse ? 10 : 15,
                              },
                            ]}>
                            <Icon
                              ComponentName={'Entypo'}
                              name={'bowl'}
                              color={appColor.bgBlack}
                              size={widthResponse ? 24 : 27}
                            />
                            <Text
                              style={[
                                styles.label,
                                {
                                  color: appColor.black,
                                },
                              ]}>
                              {resDetail?.cards?.used_count}{' '}
                              {resDetail?.no_of_used}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[
                            commenStyle.hFlex,
                            {
                              // width: '100%',
                              // justifyContent: 'center',
                              paddingHorizontal: widthResponse ? 10 : 15,
                              paddingVertical: widthResponse ? 15 : 15,
                            },
                          ]}
                          onPress={() => {
                            if (resDetail?.cards?.plan_steps == '0') {
                              Navigation.navigate('setplan', {
                                detail,
                              });
                            }
                            if (resDetail?.cards?.plan_steps == '1') {
                              setShareSheet(true);
                            }
                          }}>
                          <Icon
                            ComponentName={'MaterialCommunityIcons'}
                            name={'share-variant'}
                            color={appColor.primary}
                            size={widthResponse ? 20 : 24}
                          />
                          {resDetail?.share_with_the_community && (
                            <Text style={[styles.label]}>
                              {resDetail.share_with_the_community}
                            </Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
              </View>

              {/* flour list */}
              <View
                style={[
                  commenStyle.container,
                  {
                    paddingTop:
                      !isLogged || resDetail?.cards?.flourDetails?.flourId == ''
                        ? widthResponse
                          ? 20
                          : 30
                        : widthResponse
                        ? 60
                        : 80,
                    paddingBottom: widthResponse ? 20 : 20,
                  },
                ]}>
                {/* list one */}
                {/* {resDetail?.cards?.flourDetails?.value != 0 && (
                  <RecipeList
                    flour
                    top
                    bottom
                    label={`${resDetail?.cards?.flourDetails.main_title}  -  ${resDetail?.cards?.flourDetails.flourDetails}`}
                    title={resDetail?.cards?.flourDetails.title}
                    value={resDetail?.cards?.flourDetails.value}
                    unit={resDetail?.cards?.flourDetails.postfix}
                  />
                )} */}

                {/* list two cooling */}
                {resDetail?.cards?.restTimes && (
                  <>
                    {/* {resDetail?.cards?.restTimes.withcool?.value != 0 && (
                      <RecipeList
                        top
                        border
                        margin
                        label={resDetail?.cards?.restTimes.title}
                        title={resDetail?.cards?.restTimes.withcool?.title}
                        value={resDetail?.cards?.restTimes.withcool?.value}
                      />
                    )} */}
                    {/* {resDetail?.cards?.restTimes.withoutcool?.value != 0 && (
                      <RecipeList
                        bottom
                        title={resDetail?.cards?.restTimes.withoutcool?.title}
                        value={resDetail?.cards?.restTimes.withoutcool?.value}
                      />
                    )} */}
                  </>
                )}

                {/* recipe list three */}
                {resDetail?.cards?.doughBalls && (
                  <>
                    {resDetail?.cards?.doughBalls?.pieces?.value != 0 && (
                      <RecipeList
                        top
                        border
                        margin
                        label={resDetail?.cards?.doughBalls?.title}
                        title={resDetail?.cards?.doughBalls?.pieces?.title}
                        value={resDetail?.cards?.doughBalls?.pieces?.value}
                        unit={resDetail?.cards?.doughBalls?.pieces?.postfix}
                      />
                    )}
                    {resDetail?.cards?.doughBalls?.weight?.value != 0 && (
                      <RecipeList
                        bottom
                        title={resDetail?.cards?.doughBalls?.weight?.title}
                        value={resDetail?.cards?.doughBalls?.weight?.value}
                        unit={resDetail?.cards?.doughBalls?.weight?.postfix}
                      />
                    )}
                  </>
                )}

                {/* used flour  */}
                {resDetail?.cards?.flourDetails?.flourDetails && (
                  <RecipeFlour
                    title={resDetail?.cards?.flourDetails?.main_title}
                    flourName={resDetail?.cards?.flourDetails?.flourDetails}
                    flourimage={resDetail?.cards?.flourImg}
                  />
                )}
                {/* arrow styling of the flour weight */}
                {resDetail?.cards?.wValue != 0 && (
                  <View
                    style={{
                      marginBottom: widthResponse ? 15 : 20,
                    }}>
                    <Text
                      style={[
                        commenStyle.sideHead,
                        {
                          fontSize: fontScalling(2),
                          marginBottom: widthResponse ? 7 : 12,
                        },
                      ]}>
                      {resDetail?.cards?.yourValues?.w_value?.title}
                    </Text>
                    <View
                      style={{
                        marginTop: 15,
                        flex: 1,
                        flexDirection: 'row',
                        position: 'relative',
                      }}>
                      <View style={{width: '25%', position: 'relative'}}>
                        <View
                          style={{
                            backgroundColor: resDetail?.wvBar?.bar1?.color,
                            height: widthResponse ? 10 : 15,
                            width: '100%',
                          }}>
                          {resDetail?.cards?.wValue >= wb1.wb1min &&
                          resDetail?.cards?.wValue <= wb1.wb1max ? (
                            <View
                              style={[
                                styles.triangle,
                                {
                                  position: 'absolute',
                                  left: wBar + '%',
                                  top: -10,
                                },
                              ]}></View>
                          ) : null}
                        </View>
                        <Text style={[styles.desc]}>
                          {resDetail?.wvBar?.bar1?.strength}
                        </Text>
                      </View>
                      <View style={{width: '25%', position: 'relative'}}>
                        <View
                          style={{
                            backgroundColor: resDetail?.wvBar?.bar2?.color,
                            height: widthResponse ? 10 : 15,
                            width: '100%',
                          }}>
                          {resDetail?.cards?.wValue >= wb2.wb2min &&
                          resDetail?.cards?.wValue <= wb2.wb2max ? (
                            <View
                              style={[
                                styles.triangle,
                                {
                                  position: 'absolute',
                                  left: wBar + '%',
                                  top: -10,
                                },
                              ]}></View>
                          ) : null}
                        </View>
                        <Text style={[styles.desc]}>
                          {resDetail?.wvBar?.bar2?.strength}
                        </Text>
                      </View>
                      <View style={{width: '25%', position: 'relative'}}>
                        <View
                          style={{
                            backgroundColor: resDetail?.wvBar?.bar3?.color,
                            height: widthResponse ? 10 : 15,
                            width: '100%',
                            position: 'relative',
                          }}>
                          {resDetail?.cards?.wValue >= wb3.wb3min &&
                          resDetail?.cards?.wValue <= wb3.wb3max ? (
                            <View
                              style={[
                                styles.triangle,
                                {
                                  position: 'absolute',
                                  left: wBar + '%',
                                  top: -10,
                                },
                              ]}></View>
                          ) : null}
                        </View>
                        <Text style={[styles.desc]}>
                          {resDetail?.wvBar?.bar3?.strength}
                        </Text>
                      </View>
                      <View style={{width: '25%', position: 'relative'}}>
                        <View
                          style={{
                            backgroundColor: resDetail?.wvBar?.bar4?.color,
                            height: widthResponse ? 10 : 15,
                            width: '100%',
                          }}>
                          {resDetail?.cards?.wValue >= wb4.wb4min &&
                          resDetail?.cards?.wValue <= wb4.wb4max ? (
                            <View
                              style={[
                                styles.triangle,
                                {
                                  position: 'absolute',
                                  left: wBar + '%',
                                  top: -10,
                                },
                              ]}></View>
                          ) : null}
                        </View>
                        <Text style={[styles.desc]}>
                          {resDetail?.wvBar?.bar4?.strength}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* recommended rest time  */}
                <View
                  style={[
                    commenStyle.hFlex,
                    {
                      marginBottom: widthResponse ? 15 : 20,
                    },
                  ]}>
                  {resDetail?.resttimes?.title && (
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
                      {resDetail?.resttimes?.title}
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
                    {resDetail?.resttimes?.title && (
                      <Text
                        style={[
                          commenStyle.sideHead,
                          {
                            textAlign: 'center',
                            marginBottom: widthResponse ? 20 : 25,
                          },
                        ]}>
                        {resDetail?.resttimes?.title}
                      </Text>
                    )}
                    {resDetail?.resttimes?.withcool && (
                      <CalcInfo
                        title={resDetail?.resttimes?.withcool?.title}
                        datas={resDetail?.resttimes?.withcool?.value}
                        style={{
                          marginBottom: widthResponse ? 15 : 20,
                        }}
                      />
                    )}
                    {resDetail?.resttimes?.withoutcool && (
                      <CalcInfo
                        title={resDetail?.resttimes?.withoutcool?.title}
                        datas={resDetail?.resttimes?.withoutcool?.value}
                      />
                    )}
                  </ModalPopup>
                </View>

                {/* recipe list four */}
                {resDetail?.cards?.yourValues && (
                  <>
                    {/* {resDetail?.cards?.yourValues?.w_value?.value != 0 && (
                      <RecipeList
                        top
                        border
                        margin
                        label={resDetail?.cards?.yourValues?.title}
                        title={resDetail?.cards?.yourValues?.w_value?.title}
                        value={resDetail?.cards?.yourValues?.w_value?.value}
                      />
                    )} */}
                    {resDetail?.cards?.yourValues.title &&
                      resDetail?.cards?.flourDetails?.value != 0 && (
                        <RecipeList
                          flour
                          top
                          border
                          margin
                          info
                          infoPress={() => setRestInfo(true)}
                          // bottom
                          label={resDetail?.cards?.yourValues.title}
                          title={resDetail?.cards?.flourDetails.title}
                          value={resDetail?.cards?.flourDetails.value}
                          unit={resDetail?.cards?.flourDetails.postfix}
                        />
                      )}
                    {resDetail?.cards?.yourValues?.hydration?.value != 0 && (
                      <RecipeList
                        border
                        margin
                        title={resDetail?.cards?.yourValues?.hydration?.title}
                        value={resDetail?.cards?.yourValues?.hydration?.value}
                        // unit={resDetail?.cards?.yourValues?.hydration?.postfix}
                        unit={`${resDetail?.cards?.yourValues?.hydration?.postfix} (${resDetail?.cards?.yourValues?.hydration?.value_percent}%)`}
                      />
                    )}
                    {resDetail?.cards?.yourValues?.yeastType?.value != 0 && (
                      <RecipeList
                        margin
                        border
                        title={resDetail?.cards?.yourValues?.yeastType?.title}
                        value={resDetail?.cards?.yourValues?.yeastType?.value}
                      />
                    )}
                    {resDetail?.cards?.yourValues?.yeast?.value != 0 && (
                      <RecipeList
                        margin
                        border
                        title={resDetail?.cards?.yourValues?.yeast?.title}
                        value={resDetail?.cards?.yourValues?.yeast?.value}
                        unit={resDetail?.cards?.yourValues?.yeast?.postfix}
                      />
                    )}
                    {resDetail?.cards?.yourValues?.salt?.value != 0 && (
                      <RecipeList
                        margin
                        border
                        title={resDetail?.cards?.yourValues?.salt?.title}
                        value={resDetail?.cards?.yourValues?.salt?.value}
                        unit={resDetail?.cards?.yourValues?.salt?.postfix}
                      />
                    )}
                    {resDetail?.cards?.yourValues?.oil?.value != 0 && (
                      <RecipeList
                        bottom
                        title={resDetail?.cards?.yourValues?.oil?.title}
                        value={resDetail?.cards?.yourValues?.oil?.value}
                        unit={resDetail?.cards?.yourValues?.oil?.postfix}
                      />
                    )}
                  </>
                )}

                {/* pre dough and main-dough */}

                {resDetail?.cards?.preDoughValues && (
                  <>
                    {resDetail?.cards?.preDoughValues?.pre_dough_types?.value !=
                      0 && (
                      <RecipeList
                        margin
                        top
                        border
                        label={resDetail?.cards?.preDoughValues?.title}
                        title={
                          resDetail?.cards?.preDoughValues?.pre_dough_types
                            ?.title
                        }
                        value={
                          resDetail?.cards?.preDoughValues?.pre_dough_types
                            ?.value
                        }
                      />
                    )}
                    {resDetail?.cards?.preDoughValues?.flour?.value != 0 && (
                      <RecipeList
                        border
                        margin
                        flour
                        title={resDetail?.cards?.preDoughValues?.flour?.title}
                        value={resDetail?.cards?.preDoughValues?.flour?.value}
                        unit={resDetail?.cards?.preDoughValues?.flour?.postfix}
                      />
                    )}

                    {resDetail?.cards?.preDoughValues?.hydration?.value !=
                      0 && (
                      <RecipeList
                        margin
                        border
                        unit={
                          resDetail?.cards?.preDoughValues?.hydration?.postfix
                        }
                        title={
                          resDetail?.cards?.preDoughValues?.hydration?.title
                        }
                        value={
                          resDetail?.cards?.preDoughValues?.hydration?.value
                        }
                      />
                    )}
                    {resDetail?.cards?.preDoughValues?.yeast?.value != 0 && (
                      <RecipeList
                        margin
                        border
                        title={resDetail?.cards?.preDoughValues?.yeast?.title}
                        value={resDetail?.cards?.preDoughValues?.yeast?.value}
                        unit={resDetail?.cards?.preDoughValues?.yeast?.postfix}
                      />
                    )}
                    {resDetail?.cards?.preDoughValues?.total_voordeeg?.value !=
                      0 && (
                      <RecipeList
                        bottom
                        title={
                          resDetail?.cards?.preDoughValues?.total_voordeeg
                            ?.title
                        }
                        value={
                          resDetail?.cards?.preDoughValues?.total_voordeeg
                            ?.value
                        }
                        unit={
                          resDetail?.cards?.preDoughValues?.total_voordeeg
                            ?.postfix
                        }
                      />
                    )}
                  </>
                )}

                {resDetail?.cards?.mainDoughValues && (
                  <>
                    {resDetail?.cards?.mainDoughValues?.flour?.value != 0 && (
                      <RecipeList
                        flour
                        top
                        border
                        margin
                        label={resDetail?.cards?.mainDoughValues?.title}
                        title={resDetail?.cards?.mainDoughValues?.flour?.title}
                        value={resDetail?.cards?.mainDoughValues?.flour?.value}
                        unit={resDetail?.cards?.mainDoughValues?.flour?.postfix}
                      />
                    )}

                    {resDetail?.cards?.mainDoughValues?.hydration?.value !=
                      0 && (
                      <RecipeList
                        margin
                        border
                        unit={
                          resDetail?.cards?.mainDoughValues?.hydration?.postfix
                        }
                        title={
                          resDetail?.cards?.mainDoughValues?.hydration?.title
                        }
                        value={
                          resDetail?.cards?.mainDoughValues?.hydration?.value
                        }
                      />
                    )}
                    {/* <RecipeList
                      margin
                      border
                      title={resDetail?.cards?.mainDoughValues?.yeast?.title}
                      value={resDetail?.cards?.mainDoughValues?.yeast?.value}
                      unit={resDetail?.cards?.mainDoughValues?.yeast?.postfix}
                    /> */}
                    {resDetail?.cards?.mainDoughValues?.salt?.value != 0 && (
                      <RecipeList
                        margin
                        border
                        title={resDetail?.cards?.mainDoughValues?.salt?.title}
                        value={resDetail?.cards?.mainDoughValues?.salt?.value}
                        unit={resDetail?.cards?.mainDoughValues?.salt?.postfix}
                      />
                    )}

                    {resDetail?.cards?.mainDoughValues?.oil?.value != 0 && (
                      <RecipeList
                        bottom
                        title={resDetail?.cards?.mainDoughValues?.oil?.title}
                        value={resDetail?.cards?.mainDoughValues?.oil?.value}
                        unit={resDetail?.cards?.mainDoughValues?.oil?.postfix}
                      />
                    )}
                  </>
                )}

                {/* total dough  */}
                {resDetail?.cards?.yourValues?.total_deeg?.value != 0 && (
                  <RecipeList
                    top
                    bottom
                    flour
                    label={resDetail?.cards?.yourValues?.total_deeg?.title}
                    title={resDetail?.cards?.flourDetails?.title}
                    value={resDetail?.cards?.yourValues?.total_deeg?.value}
                    unit={resDetail?.cards?.yourValues?.total_deeg?.postfix}
                  />
                )}

                {/* dough ball details */}
                {/* {resDetail?.cards?.dough_balls && (
                  <View>
                    {resDetail?.cards?.dough_balls?.Number_of_adults?.value && (
                      <RecipeList
                        top
                        border
                        margin
                        label={
                          resDetail?.cards?.dough_balls?.Calculate_dough_balls
                        }
                        title={
                          resDetail?.cards?.dough_balls?.Number_of_adults?.title
                        }
                        value={
                          resDetail?.cards?.dough_balls?.Number_of_adults?.value
                        }
                      />
                    )}

                    {resDetail?.cards?.dough_balls?.Number_of_kids?.value && (
                      <RecipeList
                        margin
                        border
                        title={
                          resDetail?.cards?.dough_balls?.Number_of_kids?.title
                        }
                        value={
                          resDetail?.cards?.dough_balls?.Number_of_kids?.value
                        }
                      />
                    )}

                    {resDetail?.cards?.dough_balls?.How_much_appetite
                      ?.value && (
                      <RecipeList
                        margin
                        border
                        title={
                          resDetail?.cards?.dough_balls?.How_much_appetite
                            ?.title
                        }
                        value={
                          resDetail?.cards?.dough_balls?.How_much_appetite
                            ?.value
                        }
                      />
                    )}

                    {resDetail?.cards?.dough_balls?.Aantal_deegbollen
                      ?.value && (
                      <RecipeList
                        // margin
                        bottom
                        title={
                          resDetail?.cards?.dough_balls?.Aantal_deegbollen
                            ?.title
                        }
                        value={
                          resDetail?.cards?.dough_balls?.Aantal_deegbollen
                            ?.value
                        }
                      />
                    )}
                  </View>
                )} */}

                {/* baking oven */}
                <View>
                  {resDetail?.cards?.oven && (
                    <RecipeList
                      top
                      border
                      margin
                      label={resDetail?.baking?.bake}
                      title={resDetail?.baking?.oven}
                      value={resDetail?.cards?.oven}
                    />
                  )}

                  {resDetail?.cards?.temp && (
                    <RecipeList
                      margin
                      border
                      title={resDetail?.baking?.temp}
                      value={`${resDetail?.cards?.temp} ${
                        setters?.temperature?.tshort
                          ? setters?.temperature?.tshort
                          : '°C'
                      }`}
                    />
                  )}

                  {resDetail?.cards?.time && (
                    <RecipeList
                      margin
                      border
                      title={resDetail?.baking?.time}
                      value={`${resDetail?.cards?.time} ${resDetail?.baking?.sec}`}
                    />
                  )}

                  {resDetail?.cards?.grade && (
                    <RecipeList
                      bottom
                      like
                      title={resDetail?.baking?.grade}
                      value={resDetail?.cards?.grade}
                    />
                  )}
                </View>

                {/* rice and details */}
                {resDetail?.cards?.rice &&
                  resDetail?.cards?.rice.length > 0 && (
                    <View
                      style={{
                        marginBottom: widthResponse ? 15 : 20,
                      }}>
                      {resDetail?.baking?.yourRice && (
                        <Text
                          style={[
                            commenStyle.sideHead,
                            {
                              fontSize: fontScalling(2),
                              marginBottom: widthResponse ? 10 : 12,
                            },
                          ]}>
                          {resDetail.baking.yourRice}
                        </Text>
                      )}
                      {/* table head */}
                      <View
                        style={{
                          backgroundColor: appColor.bgWhite,
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}>
                        <View
                          style={[
                            commenStyle.hFlex,
                            {
                              justifyContent: 'space-between',
                              backgroundColor: appColor.bgBlack,
                            },
                          ]}>
                          {resDetail?.baking?.time && (
                            <View style={[styles.theadView]}>
                              <Text
                                style={[
                                  styles.thead,
                                  {
                                    // paddingLeft:widthResponse? 10 : 13
                                  },
                                ]}>
                                {`${resDetail?.baking?.time}(${resDetail?.baking?.hours})`}
                              </Text>
                            </View>
                          )}

                          {resDetail?.baking?.temp && (
                            <View style={[styles.theadView]}>
                              <Text style={[styles.thead]}>
                                {`${resDetail?.baking?.temp}(${
                                  setters?.temperature?.tshort
                                    ? setters?.temperature?.tshort
                                    : '°C'
                                })`}
                              </Text>
                            </View>
                          )}
                          {resDetail?.baking?.dough && (
                            <Text
                              style={[
                                styles.thead,
                              ]}>{`${resDetail?.baking?.dough}`}</Text>
                          )}
                        </View>

                        {/* tbody */}

                        {resDetail.cards.rice &&
                          resDetail.cards.rice.length > 0 &&
                          resDetail.cards.rice.map((item, index) => (
                            <View
                              key={index}
                              style={[
                                // commenStyle.hFlex,
                                {
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  flex: 1,
                                  borderBlockColor: appColor.bgBlack,
                                  borderBottomWidth:
                                    resDetail.cards.rice.length == index + 1
                                      ? 0
                                      : 0.4,
                                },
                              ]}>
                              <View style={[styles.tdView]}>
                                <Text
                                  style={[
                                    styles.td,
                                    {
                                      // paddingLeft:widthResponse? 10 : 13
                                    },
                                  ]}>
                                  {item?.hours && item.hours}
                                </Text>
                              </View>

                              <View style={[styles.tdView]}>
                                <Text style={[styles.td, {}]}>
                                  {item?.temperature && item.temperature}
                                </Text>
                              </View>
                              <View
                                style={[styles.tdView, {borderRightWidth: 0}]}>
                                <Text style={[styles.td]}>
                                  {item?.type != '' ? item.type : '-'}
                                </Text>
                              </View>
                            </View>
                          ))}
                      </View>
                    </View>
                  )}
              </View>

              {/* flour notes */}
            </ScrollView>

            {/* buttons */}
            <View
              style={[
                commenStyle.container,
                {
                  display: keyboardVisible ? 'none' : 'flex',
                  paddingVertical: widthResponse ? 10 : 15,
                  backgroundColor: appColor.bgWhite,
                  flexDirection: 'row',
                },
              ]}>
              {/* <PrimaryButton
                text={resDetail?.buttons?.bakingTime}
                onPress={() => setBakingSheet(true)}
                invert
                style={{
                  width: '49%',
                  marginRight: '2%',
                }}
              /> */}

              <PrimaryButton
                text={resDetail?.media_button}
                onPress={() => setMediaSheet(true)}
                invert
                style={{
                  width: '49%',
                  marginRight: '2%',
                }}
              />
              <PrimaryButton
                text={resDetail?.submit_button}
                style={{
                  width: '49%',
                }}
                onPress={() => {
                  Navigation.navigate('Calculeer', {
                    screen: 'calculator',
                    params: {
                      value: 'modify',
                      id: detail?.id,
                      recipeImage:
                        recipeImage?.uri && recipeImage?.uri != ''
                          ? recipeImage.uri
                          : logo,
                    },
                  });
                }}
              />
            </View>
          </View>
          {/* share bottomsheet */}
          <ModalBottomSheet
            sheetLoad={sheetLoad}
            isVisible={shareSheet}
            close={() => {
              setShareSheet(false);
            }}
            sheetTitle={resDetail?.share_with_the_community}
            snapPoints={['45%', '45%']}>
            {/* <View
              style={{
                flex: 1,
              }}>
              <BottomSheetScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}> */}
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps={'always'}
              contentContainerStyle={{
                marginBottom: keyboardVisible == 0 ? 40 : keyboardVisible,
              }}
              scrollEnabled={true}
              enableAutomaticScroll={true}
              extraHeight={400}
              ref={textFocus}
              showsVerticalScrollIndicator={false}>
              {/* name */}
              <Controller
                name="name"
                control={shareControl}
                render={({field: {onChange, value}}) => (
                  <InputText
                    label={resDetail?.share_popup?.title1}
                    placeholder={resDetail?.share_popup?.title1_placeholder}
                    onChangeText={onChange}
                    value={value}
                    formError={shareErrors.name}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                )}
              />

              {/* message */}
              <Controller
                name="message"
                control={shareControl}
                render={({field: {onChange, value}}) => (
                  <InputText
                    onChangeText={onChange}
                    value={value}
                    label={resDetail?.share_popup?.title2}
                    placeholder={resDetail?.share_popup?.title2_placeholder}
                    multiline={true}
                    formError={shareErrors.message}
                    numberOfLines={3}
                    textVertical
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                )}
              />

              {/* profile show */}

              <Controller
                name="profile"
                control={shareControl}
                render={({field: {onChange, value}}) => (
                  <ShowSwitch
                    title={resDetail?.share_popup?.title3}
                    yesText={resDetail?.share_popup?.yes}
                    noText={resDetail?.share_popup?.no}
                    activeButton={onChange}
                    value={value}
                  />
                )}
              />

              {shareErrors.profile ? (
                <Text style={[{color: appColor.formError}]}>
                  {shareErrors.profile.message}
                </Text>
              ) : null}

              <PrimaryButton
                text={resDetail?.share_popup?.button}
                onPress={shareSubmit(handleCommunityShare)}
                style={{
                  marginTop: fontScalling(2),
                }}
              />
            </KeyboardAwareScrollView>
            {/* </BottomSheetScrollView>
            </View> */}
          </ModalBottomSheet>

          {/* baking sheet modal */}
          <ModalBottomSheet
            isVisible={bakingSheet}
            close={() => {
              setBakingSheet(false);
            }}
            sheetTitle={resDetail?.baking?.bake}
            snapPoints={['50%', '50%']}>
            {/* <View
              style={{
                flex: 1,
              }}>
              <BottomSheetScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}> */}
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps={'always'}
              contentContainerStyle={{
                marginBottom: keyboardVisible == 0 ? 40 : keyboardVisible,
              }}
              scrollEnabled={true}
              enableAutomaticScroll={true}
              extraHeight={400}
              ref={textFocus}
              showsVerticalScrollIndicator={false}>
              {/* ovens choose */}
              {resDetail?.baking?.ovens.length > 0 && (
                <View style={[commenStyle.container]}>
                  <Radio
                    options={resDetail?.baking?.ovens}
                    value={oven}
                    onchange={setOven}
                  />
                </View>
              )}

              {/* temperature */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: widthResponse ? 10 : 15,
                }}>
                {resDetail?.baking?.temp && (
                  <Text
                    style={[
                      commenStyle.para,
                      {
                        // marginLeft:10,
                        marginBottom: 0,
                        fontFamily: appFont.lB,
                        width: '30%',
                      },
                    ]}>
                    {resDetail?.baking?.temp}
                  </Text>
                )}
                <InputText
                  placeholder={resDetail?.baking?.temp}
                  customStyle={{
                    paddingBottom: 0,
                    flex: 1,
                  }}
                  keyboardType={'numeric'}
                  onChangeText={setBakTemp}
                  value={bakTemp}
                />
                <Text
                  style={[
                    commenStyle.para,
                    {
                      marginLeft: 10,
                      marginBottom: 0,
                      fontFamily: appFont.lB,
                      width: '10%',
                      textAlign: 'left',
                    },
                  ]}>
                  {setters?.temperature?.tshort
                    ? setters?.temperature?.tshort
                    : '°C'}
                </Text>
              </View>

              {/* time */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: widthResponse ? 10 : 15,
                }}>
                {resDetail?.baking?.time && (
                  <Text
                    style={[
                      commenStyle.para,
                      {
                        // marginLeft:10,
                        marginBottom: 0,
                        fontFamily: appFont.lB,
                        width: '30%',
                      },
                    ]}>
                    {resDetail?.baking?.time}
                  </Text>
                )}
                <InputText
                  placeholder={resDetail?.baking?.time}
                  customStyle={{
                    paddingBottom: 0,
                    flex: 1,
                  }}
                  keyboardType={'numeric'}
                  onChangeText={setBakTime}
                  value={bakTime}
                />
                {resDetail?.baking?.sec && (
                  <Text
                    style={[
                      commenStyle.para,
                      {
                        marginLeft: 10,
                        marginBottom: 0,
                        fontFamily: appFont.lB,
                        width: '10%',
                        textAlign: 'left',
                      },
                    ]}>
                    {resDetail?.baking?.sec}
                  </Text>
                )}
              </View>

              <Rating
                type="heart"
                ratingColor={'gold'}
                ratingBackgroundColor="#fff"
                minValue={0}
                jumpValue={1}
                ratingCount={10}
                imageSize={25}
                onFinishRating={setRating}
                startingValue={rating}
                style={{
                  alignItems: 'flex-start',
                  marginVertical: widthResponse ? 10 : 20,
                }}
              />

              <PrimaryButton
                text={resDetail?.buttons?.save}
                onPress={sendBakingInformation}
                style={{
                  marginTop: fontScalling(2),
                }}
              />
            </KeyboardAwareScrollView>
            {/* </BottomSheetScrollView>
            </View> */}
          </ModalBottomSheet>

          {/* media sheet modal*/}
          <ModalBottomSheet
            sheetLoad={sheetLoad}
            isVisible={mediaSheet}
            close={() => {
              setMediaSheet(false);
            }}
            sheetTitle={resDetail?.media_button}>
            {/* notes text */}
            <Controller
              name="notes"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  label={resDetail?.notes_placeholder}
                  placeholder={resDetail?.notes_placeholder}
                  multiline={true}
                  numberOfLines={4}
                  textVertical
                  onChangeText={onChange}
                  value={value}
                  formError={errors.notes}
                  tagerror
                />
              )}
            />

            {/* image upload */}
            <View
              style={{
                position: 'relative',
              }}>
              <InputText
                label={resDetail?.upload_image}
                placeholder={resDetail?.upload_image_placeholder}
                editable={false}
              />

              {/* upload buttons  */}
              <Controller
                name="photos"
                control={control}
                rules={{required: valContent?.upload_an_one_photo}}
                render={({field: {value, onChange}}) => (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 17.5,
                      right: 4,
                      zIndex: 5,
                    }}>
                    {imgUploadBtn && (
                      <Animatable.View
                        animation={'slideInRight'}
                        duration={700}
                        style={[
                          commenStyle.hFlex,
                          {
                            position: 'absolute',
                            bottom: widthResponse ? 2 : 7,
                            right: '110%',
                          },
                        ]}>
                        <TouchableOpacity
                          onPress={() => {
                            OpenGallery(onChange, value);
                          }}
                          style={[
                            styles.parentIcon,
                            {
                              marginHorizontal: 15,
                              elevation: imgUploadBtn ? 3 : 0,
                            },
                          ]}>
                          <Icon
                            ComponentName={'MaterialCommunityIcons'}
                            name={'folder-multiple-image'}
                            color={appColor.bgWhite}
                            size={widthResponse ? 15 : 18}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            requestCameraPermission().then(e => {
                              if (e) {
                                OpenCamera(onChange, value);
                              }
                            });
                          }}
                          style={[
                            styles.parentIcon,
                            {
                              elevation: imgUploadBtn ? 3 : 0,
                            },
                          ]}>
                          <Icon
                            ComponentName={'FontAwesome'}
                            name={'camera'}
                            color={appColor.bgWhite}
                            size={widthResponse ? 15 : 18}
                          />
                        </TouchableOpacity>
                      </Animatable.View>
                    )}
                    <TouchableOpacity
                      onPress={() => setImgUploadBtn(!imgUploadBtn)}
                      style={[
                        commenStyle.hFlex,
                        {
                          padding: widthResponse ? 8 : 12,
                          backgroundColor: appColor.bgWhite,
                          borderRadius: 50,
                        },
                      ]}>
                      <Icon
                        ComponentName={'MaterialCommunityIcons'}
                        name={'upload'}
                        color={appColor.bgBlack}
                        size={widthResponse ? 18 : 20}
                      />
                      {resDetail?.upload_button && (
                        <Text
                          style={{
                            fontFamily: appFont.lBl,
                            color: appColor.black,
                            fontSize: fontScalling(1.6),
                            marginLeft: 5,
                            textTransform: 'capitalize',
                          }}>
                          {resDetail.upload_button}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
            {errors.photos ? (
              <Text
                style={{
                  marginVertical: 10,
                  color: appColor.formError,
                }}>
                {errors.photos.message}
              </Text>
            ) : null}
            {/*  */}
            <Controller
              name="photos"
              control={control}
              rules={{required: valContent?.upload_an_one_photo}}
              render={({field: {value, onChange}}) => {
                setImages(value);
                return (
                  <>
                    {value && value.length > 0 && (
                      <View
                        style={{
                          marginBottom: widthResponse ? 15 : 20,
                          paddingBottom: widthResponse ? 10 : 15,
                          borderBottomColor: appColor.borderColor,
                          borderBottomWidth: 1, // io
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}>
                        {value.map((image, index) => {
                          return (
                            <View
                              key={index}
                              style={[
                                {
                                  width:
                                    scrnWidth / (widthResponse ? 3.45 : 4.5),
                                  aspectRatio: 1,
                                  // height: scrnWidth / 3.45,
                                  marginRight:
                                    (index + 1) % (widthResponse ? 3 : 4) == 0
                                      ? 0
                                      : widthResponse
                                      ? 8
                                      : 15,
                                  marginBottom: widthResponse ? 10 : 15,
                                  position: 'relative',
                                },
                              ]}>
                              {/*  */}
                              <Image
                                source={{uri: image?.uri}}
                                resizeMode="cover"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: 10,
                                }}
                              />
                              <TouchableOpacity
                                onPress={() => handleDeleteImage(image.id)}
                                style={{
                                  width: widthResponse ? 25 : 35,
                                  height: widthResponse ? 25 : 35,
                                  borderRadius: 50,
                                  backgroundColor: appColor.primary,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  position: 'absolute',
                                  right: 6,
                                  top: 6,
                                }}>
                                <Icon
                                  ComponentName={'Entypo'}
                                  name={'cross'}
                                  color={appColor.white}
                                  size={widthResponse ? 20 : 24}
                                />
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </>
                );
              }}
            />

            {recipeImages && recipeImages.length > 0 && (
              <View
                style={{
                  // marginBottom: widthResponse ? 10 : 15,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {recipeImages.map((image, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        {
                          width: scrnWidth / (widthResponse ? 3.45 : 4.5),
                          aspectRatio: 1,
                          // height: scrnWidth / 3.45,
                          marginRight:
                            (index + 1) % (widthResponse ? 3 : 4) == 0
                              ? 0
                              : widthResponse
                              ? 8
                              : 15,
                          marginBottom: widthResponse ? 10 : 15,
                          position: 'relative',
                        },
                      ]}>
                      {/*  */}
                      <Image
                        source={{uri: image?.image}}
                        resizeMode="cover"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 10,
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => multipeImageDelte(image.id)}
                        style={{
                          width: widthResponse ? 25 : 35,
                          height: widthResponse ? 25 : 35,
                          borderRadius: 50,
                          backgroundColor: appColor.bgWhite,
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'absolute',
                          right: '5%',
                          top: '5%',
                        }}>
                        <Icon
                          ComponentName={'Entypo'}
                          name={'cross'}
                          color={appColor.black}
                          size={widthResponse ? 20 : 26}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
            <PrimaryButton
              text={resDetail?.buttons?.save}
              onPress={handleSubmit(recipeDetailImageUpload)}
            />
          </ModalBottomSheet>
          {/* recipe delete modal */}
          <ModalPopup
            visible={resDelModal}
            onBackButtonPress={() => setResDelModal(false)}
            onBackdropPress={() => setResDelModal(false)}
            onClosePress={() => setResDelModal(false)}
            style={{
              justifyContent: 'center',
            }}>
            {resDetail?.delpopup?.question && (
              <Text style={[commenStyle.modalTitle]}>
                {resDetail.delpopup.question}
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
                  onPress={HandleRecipeDelete}
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

          {/* recipe share revoke modal */}
          <ModalPopup
            visible={resRevoke}
            onBackButtonPress={() => setResRevoke(false)}
            onBackdropPress={() => setResRevoke(false)}
            onClosePress={() => setResRevoke(false)}
            style={{
              justifyContent: 'center',
            }}>
            {resDetail?.are_you_going_to_revoke_sharing && (
              <Text style={[commenStyle.modalTitle]}>
                {resDetail.are_you_going_to_revoke_sharing}
              </Text>
            )}

            {/* loading with buttons */}
            {!revokeLoad ? (
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
                  onPress={HandleRecipeRemove}
                  style={{
                    marginRight: 10,
                  }}
                />
                <PrimaryButton
                  invert
                  modal
                  text={resDetail?.delpopup?.no}
                  onPress={() => setResRevoke(false)}
                />
              </View>
            ) : (
              <AuthLoading />
            )}
          </ModalPopup>

          {/* schedulet sheet */}
          <ModalBottomSheet
            isVisible={scheduleSheet}
            close={() => {
              setScheduleSheet(false);
            }}
            sheetTitle={resDetail?.schedule_pizza?.title}
            snapPoints={['45%', '45%']}>
            <View
              style={[
                {
                  flexDirection: 'row',
                },
              ]}>
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
                          console.log(e, 'eaf');
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
              text={resDetail?.tab_title2}
              onPress={scheduleSubmit(schedulePizza)}
              style={{
                marginTop: fontScalling(2),
              }}
            />
          </ModalBottomSheet>

          {/* rest info pop up */}
          <ModalPopup
            visible={restInfo}
            onBackButtonPress={() => setRestInfo(false)}
            onBackdropPress={() => setRestInfo(false)}
            onClosePress={() => setRestInfo(false)}
            style={{
              paddingTop: widthResponse ? 30 : 50,
            }}>
            {resDetail?.cards?.restTimes && (
              <>
                {resDetail?.cards?.restTimes.withcool?.value != 0 && (
                  <RecipeList
                    top
                    border
                    margin
                    dark
                    label={resDetail?.cards?.restTimes.title}
                    title={resDetail?.cards?.restTimes.withcool?.title}
                    value={resDetail?.cards?.restTimes.withcool?.value}
                  />
                )}
                {resDetail?.cards?.restTimes.withoutcool?.value != 0 && (
                  <RecipeList
                    bottom
                    dark
                    title={resDetail?.cards?.restTimes.withoutcool?.title}
                    value={resDetail?.cards?.restTimes.withoutcool?.value}
                  />
                )}
              </>
            )}
          </ModalPopup>
        </>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default RecipeDetail;

const pagestyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    label: {
      marginLeft: 10,
      marginBottom: 0,
      textTransform: 'uppercase',
      fontSize: fontScalling(1.9),
      color: appColor.primary,
      fontFamily: appFont.lBl,
    },
    parentIcon: {
      backgroundColor: appColor.primary,
      borderRadius: 100,
      padding: 8,
    },
    theadView: {
      borderRightWidth: 0.4,
      borderRightColor: appColor.bgWhite,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: widthResponse ? 10 : 14,
      paddingVertical: widthResponse ? 12 : 15,
    },
    thead: {
      fontFamily: appFont.lR,
      fontSize: fontScalling(1.9),
      lineHeight: fontScalling(1.9),
      color: appColor.white,
      flex: 1,
      textAlign: 'center',
    },
    td: {
      fontFamily: appFont.lR,
      fontSize: fontScalling(1.9),
      lineHeight: fontScalling(1.9),
      color: appColor.black,
      paddingVertical: widthResponse ? 10 : 15,
      textAlign: 'center',
    },
    tdView: {
      flex: 1,
      borderRightColor: appColor.bgBlack,
      borderRightWidth: 0.5,
    },
    triangle: {
      width: 10,
      height: 10,
      backgroundColor: 'transparent',
      borderWidth: 7,
      borderTopColor: 'transparent',
      borderLeftColor: 'transparent',
      zIndex: 100,
      transform: [{rotate: '45deg'}, {translateX: -10}],
    },
    desc: {
      textAlign: 'center',
      fontFamily: appFont.lR,
      color: appColor.boldBlacktext,
      marginTop: widthResponse ? 5 : 10,
      fontSize: fontScalling(1.5),
    },
  });
  return {styles};
};
