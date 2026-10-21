import React, {useRef, useState} from 'react';
import {FlatList, ScrollView, Text, View} from 'react-native';
import RightButtonCard from '../../components/Cards/RightButtonCard';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../Utilities/helperFunction';
import ReviewCard from '../../components/Cards/ReviewCard';
import SpinLoader from '../../components/Loader/SpinLoader';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from '../../components/InputFields/InputText';
import {appFont} from '../../Utilities/appFont';
import Ratings from '../../components/Cards/Ratings';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {recipeDetail} from '../../Utilities/contents';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {Url} from '../../Utilities/appApi';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import ValidationContent from '../../Hooks/ValidationContent';
import {useNavigation} from '@react-navigation/native';

export default FlourDetailReview = ({data, flourId, apiCall = () => {}}) => {
  const {commenStyle} = useStyle();
  const navigation = useNavigation();
  const appColor = appColors();
  const keyboardVisible = KeyboardVisible(true);
  const textFocus = useRef(null);
  const {setters, deviceId, userId} = useSelector(State => State.appSettings);
  const {isLogged, userDatas} = useSelector(State => State.authSettings);
  const [load, setLoad] = useState(false);
  const [revsheet, setRevsheet] = useState(false);
  const toast = useToast();
  const [review, setReview] = useState({
    rating: '',
    title: userDatas?.name ? userDatas.name : '',
    description: '',
  });

  const {valContent} = ValidationContent();
  const [sheetLoad, setSheetLoad] = useState(false);

  const schema = yup
    .object()
    .shape({
      rating: yup.string().required(valContent?.provide_rating),
      title: yup.string().required(valContent?.enter_title),
      description: yup.string().required(valContent?.enter_description),
    })
    .required();

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: review,
  });

  const currentValues = watch();

  const sendReviewApiCall = async data => {
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

      if (deviceId && deviceId != '') {
        formdata.append('deviceId', deviceId);
        // formdata.append('uuId', deviceId);
      }
      if (flourId) {
        formdata.append('flourId', flourId);
      }

      if (data.rating && data.title && data.description) {
        formdata.append('rating', data.rating);
        formdata.append('title', data.title);
        formdata.append('description', data.description);
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      setSheetLoad(true);
      const response = await fetch(Url().flourReview, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse,"resp")
        if (resparse.status == 'success') {
          toast.show(resparse?.data ? resparse.data : 'sent successfully', {
            type: 'success',
            duration: 2000,
          });
        }
        if (resparse.status == 'error') {
          toast.show(resparse?.data ? resparse.data : 'sent successfully', {
            type: 'danger',
            duration: 2000,
          });
        }
        reset();
        setRevsheet(false);
        apiCall();
        setSheetLoad(false);
      }
    } catch (error) {
      console.log(error, 'error in flour review');
      setSheetLoad(false);
    }
  };

  const onHitLikeApi = async id => {
    try {
      const formdata = new FormData();
      // if (setters && setters?.language?.language_code) {
      //   formdata.append(
      //     'lcode',
      //     setters?.language?.language_code
      //       ? setters?.language?.language_code
      //       : 'nl',
      //   );
      // }

      if (deviceId && deviceId != '') {
        formdata.append('uuId', deviceId);
      }
      if (isLogged && userId) formdata.append('user_id', userId);
      if (id) {
        formdata.append('reviewId', id);
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      setLoad(true);

      const response = await fetch(Url().flourReviewLike, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        apiCall();
      }
      setLoad(false);
    } catch (error) {
      console.log(error, 'error in flour review');
      setLoad(false);
    }
  };

  return (
    <View>
      <RightButtonCard
        textVal={data?.reviewTitle && data.reviewTitle}
        btnVal={data?.reviewformBtn && data.reviewformBtn}
        onPress={() => {
          if (isLogged) {
            setRevsheet(true);
          } else {
            navigation.navigate('NoTabStack', {
              screen: 'login',
            });
          }
        }}
        btnHover={revsheet}
        iconComponent={'AntDesign'}
        iconName={'edit'}
        iconSize={widthResponse ? 20 : 30}
        altStyle={{
          marginBottom: widthResponse ? 15 : 20,
        }}
      />

      {data?.reviews && data?.reviews.length > 0 ? (
        <FlatList
          data={data.reviews}
          scrollEnabled={false}
          contentContainerStyle={[
            commenStyle.container,
            {
              paddingBottom: widthResponse ? 20 : 25,
            },
          ]}
          ItemSeparatorComponent={() => (
            <View style={{height: widthResponse ? 10 : 15}} />
          )}
          renderItem={({item, index}) => (
            <ReviewCard
              key={index}
              review={item}
              onLike={onHitLikeApi}
              load={load}
            />
          )}
        />
      ) : (
        <>
          {data?.reviewNotify?.notfound && (
            <Text
              style={[
                commenStyle.sideHead,
                commenStyle.container,
                {
                  color: appColor.primary,
                  textAlign: 'center',
                  paddingVertical: widthResponse ? 30 : 40,
                },
              ]}>
              {data.reviewNotify.notfound}
            </Text>
          )}
        </>
      )}

      {/* user review sheet */}
      <ModalBottomSheet
        isVisible={revsheet}
        snapPoints={['45%', '45%']}
        sheetTitle={data?.reviewformHd}
        sheetLoad={sheetLoad}
        close={() => {
          setRevsheet(false);
        }}>
        {/* <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
        > */}
        <KeyboardAwareScrollView
          contentContainerStyle={{
            marginBottom: keyboardVisible == 0 ? 40 : keyboardVisible,
          }}
          scrollEnabled={true}
          keyboardShouldPersistTaps={'always'}
          enableAutomaticScroll={true}
          extraHeight={400}
          ref={textFocus}
          showsVerticalScrollIndicator={false}>
          {/* title */}
          {/* <Controller
            control={control}
            name="title"
            render={({field: {value, onChange}}) => (
              <InputText
                label={data?.title?.name_of_the_user}
                placeholder={data?.title?.placeholder}
                value={value}
                onChangeText={onChange}
                formError={errors.title}
                onFocus={event =>
                  textFocus.current.scrollToFocusedInput(event.target)
                }
              />
            )}
          /> */}

          {/* description */}
          <Controller
            control={control}
            name="description"
            render={({field: {value, onChange}}) => (
              <InputText
                label={data?.story?.title}
                placeholder={data?.story?.placeholder}
                value={value}
                onChangeText={onChange}
                formError={errors.description}
                multiline
                numberOfLines={3}
                textVertical
                onFocus={event =>
                  textFocus.current.scrollToFocusedInput(event.target)
                }
              />
            )}
          />

          {/* rating */}
          {data?.stars && (
            <Text
              style={{
                color: appColor.black,
                fontFamily: appFont.lB,
                paddingBottom: widthResponse ? 7 : 12,
                fontSize: fontScalling(2),
                marginBottom: 5,
              }}>
              {data.stars}
            </Text>
          )}
          <Controller
            name="rating"
            control={control}
            render={({field: {value, onChange}}) => (
              <Ratings
                rating
                counts={value}
                onPress={e => onChange(e + 1)}
                errors={errors.rating}
                style={{
                  marginBottom: widthResponse ? 15 : 20,
                }}
              />
            )}
          />

          <PrimaryButton
            text={data?.sendBtn && data.sendBtn}
            onPress={handleSubmit(sendReviewApiCall)}
            style={{
              marginBottom: 0,
            }}
          />
        </KeyboardAwareScrollView>
        {/* </BottomSheetScrollView> */}
      </ModalBottomSheet>
    </View>
  );
};
