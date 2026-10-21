import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import RightButtonCard from '../../components/Cards/RightButtonCard';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../Utilities/helperFunction';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import ReviewCard from '../../components/Cards/ReviewCard';
import SpinLoader from '../../components/Loader/SpinLoader';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from '../../components/InputFields/InputText';
import {appFont} from '../../Utilities/appFont';
import Ratings from '../../components/Cards/Ratings';
import {Url} from '../../Utilities/appApi';
import {useSelector} from 'react-redux';
import {Toast} from 'react-native-toast-notifications';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import ValidationContent from '../../Hooks/ValidationContent';

const CommunityRecipeReview = ({data, recipeId, apiCall = () => {}, userVerify}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const [revsheet, setRevsheet] = useState(false);
  const keyboardVisible = KeyboardVisible(true);
  const {setters, deviceId, userId} = useSelector(State => State.appSettings);
  const {userDatas} = useSelector(State => State.authSettings);
  const textFocus = useRef(null);
  const [review, setReview] = useState({
    rating: '',
    title: userDatas?.name ? userDatas.name : '',
    description: '',
  });
  const [sheetLoad, setSheetLoad] = useState(false);

  const {valContent} = ValidationContent();

  const schema = yup
    .object()
    .shape({
      rating: yup.string().required(valContent?.provide_rating),
      title: yup.string().required(valContent?.enter_title),
      description: yup.string().required(valContent?.enter_Story),
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

  const sendReviewApiCall = async data => {
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

      if (deviceId && deviceId != '') {
        formdata.append('deviceId', deviceId);
      }
      if (recipeId) {
        formdata.append('calcId', recipeId);
      }

      if (data.rating && data.title && data.description) {
        formdata.append('rating', data.rating);
        formdata.append('title', data.title);
        formdata.append('description', data.description);
      }

      // print(formdata, 'forms');
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      setSheetLoad(true);
      const response = await fetch(Url().communityRecipeReview, requestOptions);
      // print(response, 'respons');
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resp');
        if (resparse.status == 'success') {
          Toast.show(resparse?.data ? resparse.data : 'sent successfully', {
            type: 'success',
            duration: 2000,
          });
        }
        if (resparse.status == 'error') {
          Toast.show(resparse?.data ? resparse.data : 'sent successfully', {
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
      console.log(error, 'error in review send api review');
      setSheetLoad(false);
    }
  };

  const onHitLikeApi = async id => {
    try {
      const formdata = new FormData();

      if (deviceId && deviceId != '') {
        formdata.append('uuId', deviceId);
      }
      if (id) {
        formdata.append('reviewId', id);
      }
      if (userId) {
        formdata.append('user_id', userId);
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const response = await fetch(
        Url().communityRecipeReviewLike,
        requestOptions,
      );
      if (response.status == 200) {
        const resparse = await response.json();
        Toast.show(resparse.data, {
          type: 'success',
          duration: 2000,
        });
        apiCall();
      }
    } catch (error) {
      console.log(error, 'error in community recipe review like');
    }
  };

  return (
    <>
      <View>
        {!userVerify ? (
          <RightButtonCard
            textVal={data?.title}
            btnVal={data?.popup?.post_a_review}
            iconComponent={'AntDesign'}
            iconName={'edit'}
            iconSize={20}
            onPress={() => setRevsheet(!revsheet)}
            btnHover={revsheet}
            altStyle={{
              marginBottom: widthResponse ? 15 : 20,
            }}
          />
        ) : (
          data?.title &&
          data?.title != '' && (
            <Text
              style={[
                commenStyle.sideHead,
                commenStyle.container,
                {
                  marginBottom: 0,
                  fontSize: fontScalling(1.8),
                  paddingRight: 7,
                  flex: 1,
                },
              ]}>
              {data?.title}
            </Text>
          )
        )}

        {data?.values && data.values.length > 0 && (
          <FlatList
            data={data.values}
            scrollEnabled={false}
            contentContainerStyle={[
              commenStyle.container,
              {paddingBottom: widthResponse ? 25 : 35},
            ]}
            ItemSeparatorComponent={() => (
              <View style={{height: widthResponse ? 10 : 15}} />
            )}
            renderItem={({item, index}) => (
              <ReviewCard
                key={index}
                onLike={onHitLikeApi}
                review={item}
                communityRecipe
              />
            )}
          />
        )}
      </View>

      {/* user review sheet */}
      <ModalBottomSheet
        isVisible={revsheet}
        snapPoints={['45%', '45%']}
        sheetTitle={data?.popup?.post_a_review}
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
                label={data?.popup?.title}
                placeholder={data?.popup?.title_placeholder}
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
                label={data?.popup?.story}
                placeholder={data?.popup?.story_placeholder}
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
          {data?.popup?.rating && (
            <Text
              style={{
                color: appColor.black,
                fontFamily: appFont.lB,
                paddingBottom: widthResponse ? 7 : 12,
                fontSize: fontScalling(2),
                marginBottom: 5,
              }}>
              {data?.popup?.rating}
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
            text={data?.popup?.submit_button}
            onPress={handleSubmit(sendReviewApiCall)}
            style={{
              marginBottom: 0,
            }}
          />
        </KeyboardAwareScrollView>
        {/* </BottomSheetScrollView> */}
      </ModalBottomSheet>
    </>
  );
};

export default CommunityRecipeReview;

const styles = StyleSheet.create({});
