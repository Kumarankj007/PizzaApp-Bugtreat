import {
  FlatList,
  Image,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  fontScalling,
  getCurrentTime,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {appFont} from '../../Utilities/appFont';
import Country from '../../components/Cards/Country';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {userdetail} from '../../Utilities/contents';
import DetailReview from '../../components/Cards/DetailReview';
import {DropAnimation} from '../../components/AnimatedComp/DropAnimation';
import {useDispatch, useSelector} from 'react-redux';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import PageLoader from '../../components/Loader/PageLoader';
import {Url} from '../../Utilities/appApi';
import RightButtonCard from '../../components/Cards/RightButtonCard';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import {Toast, useToast} from 'react-native-toast-notifications';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {InputText} from '../../components/InputFields/InputText';
import Ratings from '../../components/Cards/Ratings';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import ValidationContent from '../../Hooks/ValidationContent';

const ComunityUserDetail = ({route}) => {
  const {id} = route?.params && route.params;
  const keyboardVisible = KeyboardVisible(true);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [reviewDrop, setReviewDrop] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [revsheet, setRevsheet] = useState(false);
  const toast = useToast();
  const textFocus = useRef(null);
  const [review, setReview] = useState({
    rating: '',
    title: '',
    description: '',
  });
  const navigation = useNavigation();
  const {isLogged} = useSelector(State => State.authSettings);
  const {setters, deviceId, userId} = useSelector(state => state.appSettings);
  const {valContent} = ValidationContent();
  const [sheetLoad, setSheetLoad] = useState(false);

  const sameUserId =
    userDetail && userDetail?.user_details && userDetail?.user_details?.id
      ? userId == userDetail?.user_details?.id
      : false;

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

  const currentValues = watch();

  // community userdetail apicall
  const CommunityUserDetail = async () => {
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

      if (id) formData.append('id', id);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      //   print(formData,"form")
      if (Object.keys(userDetail).length == 0) {
        setLoad(true);
        dispatch(setTitleLoad(true));
      }
      const response = await fetch(Url().communityUserDetail, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse, 'resp');
          setUserDetail(resparse.data);
          navigation.setOptions({
            title: resparse?.data?.user_details?.name,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the user detail api call');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  //   community user review apicall

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

      if (deviceId && deviceId != '') {
        formdata.append('deviceId', deviceId);
      }
      if (id) {
        formdata.append('user_id', id);
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
      const response = await fetch(Url().communityUserReview, requestOptions);
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
        setSheetLoad(false);
      }
    } catch (error) {
      console.log(error, 'error in flour review');
      setSheetLoad(false);
    }
  };

  useEffect(() => {
    CommunityUserDetail();
  }, [setters?.language, id]);

  // api for the history api call
  const historyCallApi = async () => {
    try {
      const saveDate = dateString => {
        const [date, month, year] = dateString.split('/');
        return `${year}-${date}-${month}`;
      };
      const formData = new FormData();

      if (userId) formData.append('user_id', userId);

      formData.append('community_user_id', id);
      formData.append('save_time', getCurrentTime());
      formData.append('save_date', saveDate(moment().format('L')));

      // print(formData, 'from');
      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      const response = await fetch(Url().historyCall, requestOptions);
      const resparse = await response.json();
      // print(resparse, 'resparse-- -');
    } catch (error) {
      console.log(error, 'error in the history call recipe detail api call');
    }
  };

  useEffect(() => {
    if (isLogged && id && userId != id) {
      historyCallApi();
    }
  }, [id]);

  // api for the user follow api call
  const userFollowCallApi = async id => {
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
      id && formData.append('to_follow_id', id);
      // print(id);
      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      const response = await fetch(Url().userFollow, requestOptions);
      // print(response, 'rep');
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          Toast.show(resparse?.data, {type: 'success', duration: 2000});
        }
      }
      CommunityUserDetail();
    } catch (error) {
      console.log(error, 'error in the user follow api call');
    }
  };

  return (
    <>
      {!load ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: appColor.cardbg,
          }}
          contentContainerStyle={{
            paddingBottom: widthResponse ? 20 : 25,
          }}>
          {/* top block */}
          <View
            style={[
              commenStyle.scrollContainer,
              {
                alignItems: 'center',
                paddingVertical: widthResponse ? 25 : 30,
              },
            ]}>
            {userDetail?.user_details?.image &&
              userDetail.user_details.image != '' && (
                <Image
                  source={{uri: userDetail.user_details.image}}
                  style={{
                    width: scrnWidth / 3.3,
                    height: scrnWidth / 3.3,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginBottom: widthResponse ? 10 : 15,
                  }}
                  resizeMode="cover"
                />
              )}
            {/* name */}
            {userDetail?.user_details?.name && (
              <Text
                style={[
                  commenStyle.sideHead,
                  {
                    fontFamily: appFont.lBl,
                  },
                ]}>
                {userDetail.user_details.name}
              </Text>
            )}

            {/* country */}
            {userDetail?.user_details?.land && (
              <Country
                country={userDetail.user_details.land}
                style={{
                  marginBottom: widthResponse ? 13 : 18,
                }}
              />
            )}
            {!sameUserId && (
              <PrimaryButton
                text={
                  userDetail?.following && userDetail?.following == 0
                    ? userDetail?.follow_button && userDetail.follow_button
                    : userDetail?.un_follow_button &&
                      userDetail.un_follow_button
                }
                onPress={() => userFollowCallApi(userDetail?.user_details?.id)}
                style={{
                  width: scrnWidth / 2,
                }}
              />
            )}
          </View>

          {/* middle block */}
          <View
            style={[
              {
                padding: widthResponse ? 15 : 20,
                backgroundColor: appColor.cardbg,
                paddingBottom: 0,
              },
            ]}>
            {/* {!sameUserId && ( 
              <RightButtonCard
                // textVal={userDetail?.reviews_content && userDetail.reviews_content}
                btnVal={
                  userDetail?.reviews_content?.post_a_review &&
                  userDetail.reviews_content.post_a_review
                }
                onPress={() => setRevsheet(!revsheet)}
                btnHover={revsheet}
                iconComponent={'AntDesign'}
                iconName={'edit'}
                iconSize={20}
                altStyle={{
                  marginBottom: widthResponse ? 15 : 20,
                }}
              />
            )} */}
            {/* side heading */}
            {/* {content?.sidehead && (
              <Text style={[commenStyle.sideHead]}>{content.sidehead}</Text>
            )} */}

            {/* paragraph */}
            {userDetail?.user_details?.description && (
              <Text style={[commenStyle.para]}>
                {userDetail.user_details.description}
              </Text>
            )}
          </View>

          {/* reviews block*/}
          {userDetail?.recipe_data && userDetail?.recipe_data.length > 0 ? (
            <FlatList
              data={userDetail?.recipe_data}
              scrollEnabled={false}
              // style={[commenStyle.container]}
              contentContainerStyle={{
                padding: widthResponse ? 15 : 20,
              }}
              ItemSeparatorComponent={() => (
                <View style={{height: widthResponse ? 8 : 12}} />
              )}
              renderItem={({item, index}) => (
                <DetailReview
                  key={index}
                  item={item}
                  index={index}
                  drop={reviewDrop.includes(index)}
                  onPress={() => {
                    setReviewDrop([index]);
                    LayoutAnimation.configureNext(DropAnimation);
                  }}
                  onDoublePress={() =>
                    navigation.navigate('recipeDetail', {
                      item,
                    })
                  }
                />
              )}
            />
          ) : (
            <>
              {userDetail?.no_recipes && (
                <Text
                  style={[
                    commenStyle.sideHead,
                    {
                      textAlign: 'center',
                      marginTop: fontScalling(6),
                      color: appColor.primary,
                      fontSize: fontScalling(3),
                    },
                  ]}>
                  {userDetail?.no_recipes}
                </Text>
              )}
            </>
          )}
        </ScrollView>
      ) : (
        <PageLoader />
      )}

      {/* user review sheet */}
      <ModalBottomSheet
        isVisible={revsheet}
        snapPoints={['45%', '45%']}
        sheetTitle={userDetail?.reviews_content?.post_a_review}
        sheetLoad={sheetLoad}
        close={() => {
          setRevsheet(false);
        }}>
        {/* <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}> */}
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{
            marginBottom: keyboardVisible == 0 ? 40 : keyboardVisible,
          }}
          showsVerticalScrollIndicator={false}>
          {/* title */}
          <Controller
            control={control}
            name="title"
            render={({field: {value, onChange}}) => (
              <InputText
                label={userDetail?.reviews_content?.title}
                placeholder={userDetail?.reviews_content?.title_placeholder}
                value={value}
                onChangeText={onChange}
                formError={errors.title}
              />
            )}
          />

          {/* description */}
          <Controller
            control={control}
            name="description"
            render={({field: {value, onChange}}) => (
              <InputText
                label={userDetail?.reviews_content?.story}
                placeholder={userDetail?.reviews_content?.story_placeholder}
                value={value}
                onChangeText={onChange}
                formError={errors.description}
                multiline
                numberOfLines={3}
                textVertical
              />
            )}
          />

          {/* rating */}
          {userDetail?.reviews_content?.rating && (
            <Text
              style={{
                color: appColor.black,
                fontFamily: appFont.lB,
                paddingBottom: widthResponse ? 7 : 12,
                fontSize: fontScalling(2),
                marginBottom: 5,
              }}>
              {userDetail?.reviews_content?.rating}
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
            text={userDetail?.reviews_content?.submit_button}
            onPress={handleSubmit(sendReviewApiCall)}
            style={{
              marginBottom: 0,
            }}
          />
        </ScrollView>
        {/* </BottomSheetScrollView> */}
      </ModalBottomSheet>
    </>
  );
};

export default ComunityUserDetail;

const styles = StyleSheet.create({});
