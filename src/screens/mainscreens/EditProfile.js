import {
  Button,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AuthBack from '../../components/Cards/AuthBack';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import ScrollCard from '../../components/Cards/ScrollCard';
import {
  fontScalling,
  permissionAlert,
  print,
  requestCameraPermission,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from '../../Utilities/icon';
import * as Animatable from 'react-native-animatable';
import ImageCropPicker from 'react-native-image-crop-picker';
import ModalPopup from '../../components/Modal/ModalPopup';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {InputText} from '../../components/InputFields/InputText';
import {ProfileEdit} from '../../Utilities/contents';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import Toggle from '../../components/Buttons/SwitchToggle';
import CheckBox from '../../components/InputFields/CheckBox';
import {
  setIsLogged,
  setUserDetails,
  userSettingApi,
} from '../../Redux/AuthSlice';
import PageLoader from '../../components/Loader/PageLoader';
import {useAuthenticationContent} from '../../Hooks/AuthContent';
import {useNavigation} from '@react-navigation/native';
import CountryPick from '../../components/Modal/CountryPick';
import {Url} from '../../Utilities/appApi';
import {useToast} from 'react-native-toast-notifications';
import AuthLoading from '../../components/Loader/AuthLoading';
import ValidationContent from '../../Hooks/ValidationContent';

const EditProfile = () => {
  const {userDatas} = useSelector(State => State.authSettings);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [delLoad, setDelLoad] = useState(false);
  const [animButton, setAnimButton] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [profileDelete, setProfileDelete] = useState(false);
  const [delSubscrip, setDelSubscrip] = useState(false);
  const deleteAnimRef = useRef(null);
  const [profile, setProfile] = useState({
    username: '',
    usermail: '',
    country: '',
    password: '',
    confirm_password: '',
    profileStatus: '',
    description: '',
    profilepicture: {
      name: 'profile.jpeg',
      uri: '',
      type: 'image/jpeg',
    },
  });
  const {commenStyle} = useStyle();
  const styles = useStyles();
  const appColor = appColors();
  const textFocus = useRef(null);
  const navigation = useNavigation();
  const {userDetails} = useSelector(state => state.authSettings);
  const dispatch = useDispatch();
  const [countryShow, setCountryShow] = useState(false);
  const toast = useToast();
  const {valContent} = ValidationContent();

  // apicall for the authentication content
  const {authContent, load, error} = useAuthenticationContent();
  const {setters, userId} = useSelector(State => State.appSettings);

  if (authContent?.edit_profile?.title) {
    navigation.setOptions({
      title: authContent.edit_profile.title,
    });
  }

  // camer open function
  const OpenCamera = async () => {
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
        setProfile({
          ...currentValues,
          profilepicture: {
            ...currentValues.profilepicture,
            name: fileName,
            uri: image.path,
            type: 'image/jpeg',
          },
        });
      })
      .catch(error => {
        console.log(error);
        if (error.message == 'User did not grant camera permission.') {
          permissionAlert('Camera');
        }
      });
    setAnimButton(!animButton);
  };

  // gallery open function
  const OpenGallery = async () => {
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
        setProfile({
          ...currentValues,
          profilepicture: {
            ...currentValues.profilepicture,
            name: fileName,
            uri: image.path,
            type: 'image/jpeg',
          },
        });
      })
      .catch(error => {
        console.log(error);
        if (error.message == 'User did not grant library permission.') {
          permissionAlert('Gallery');
        }
      });
    setAnimButton(!animButton);
  };

  // Handle delete logic
  const handleDeleteImage = () => {
    setProfile({
      ...profile,
      profilepicture: {
        ...profile.profilepicture,
        uri: '',
      },
    });
    setAnimButton(false);
    setTimeout(() => {
      setdeleteModal(false);
    }, 1000);
  };

  // validation:
  const schema = yup
    .object()
    .shape({
      username: yup
        .string('must be string')
        .required(valContent?.enter_yourname),
      usermail: yup
        .string()
        .email(valContent?.enter_validmail)
        .required(valContent?.enter_mail),
      country: yup.object().required(valContent?.select_country),
      password: yup.string(valContent?.enter_password),
      description: yup.string(valContent?.enter_description).optional(),
      confirm_password: yup
        .string()
        .oneOf([yup.ref('password'), null], valContent?.password_match),
    })
    .required();

  // form State:
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: profile,
    resolver: yupResolver(schema),
  });

  // reset data for state updation in useForms
  useEffect(() => {
    reset(profile);
  }, [reset, profile]);

  // Watch for changes in form fields
  const currentValues = watch();

  useEffect(() => {
    if (userDatas) {
      setProfile({
        ...currentValues,
        username: userDatas.name,
        usermail: userDatas.email,
        country: {
          code: '',
          name: {
            en: userDatas.country,
          },
        },
        profileStatus: userDatas.profile_status,
        description: userDatas?.description,
        profilepicture: {
          ...currentValues.profilepicture,
          uri: userDatas?.image,
        },
      });
    }
    setContent(ProfileEdit);

    // dispatch(userSettingApi());
  }, [userDatas]);

  const DelCheckBox = () => {
    return (
      <>
        {authContent?.edit_profile?.stop_subscription && (
          <Text style={[commenStyle.para]}>
            {authContent.edit_profile.stop_subscription}
          </Text>
        )}
      </>
    );
  };
  // profile delete

  // delete profile apicall
  const HandleProfileDelete = async () => {
    // setProfileDelete(!profileDelete);
    try {
      const formdata = new FormData();
      if (setters && setters?.language?.language_code && userId) {
        formdata.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
        formdata.append('id', userId);
      }
      // print(formdata, 'form data');

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      setDelLoad(true);
      const response = await fetch(Url().deleteProfile, requestOptions);
      // print(response, 'response');
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resp');
        if (resparse.status == 'success') {
          toast.show(resparse?.data ? resparse.data : 'success', {
            type: 'success',
            duration: 2000,
          });
          setProfileDelete(!profileDelete);
          dispatch(setIsLogged(false));
          navigation.navigate('search');
        }
      }
      setTimeout(() => {
        setDelLoad(false);
      }, 3000);
    } catch (error) {
      console.log(error, 'error in delete profile api call');
      setDelLoad(false);
    }
  };

  // edited profile send api call
  const editProfileSendApiCall = async data => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Cookie', 'ci_session=fvob7jbmem1ueqpt1vv3ema818mrvlhu');
      const formdata = new FormData();
      if (setters && setters?.language?.language_code) {
        formdata.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }
      if (userId) {
        formdata.append('id', userId);
      }
      formdata.append('name', data.username);
      formdata.append('email', data.usermail);
      formdata.append('land', data.country.name.en);
      formdata.append('cc', data.country.code);
      if (data.confirm_password && data.confirm_password != '') {
        formdata.append('password', data.confirm_password);
      }
      formdata.append('hide_profile', data.profileStatus);

      formdata.append(
        'file',
        profile?.profilepicture?.uri != '' ? profile.profilepicture : 'file',
      );

      formdata.append('description', data.description);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        headers: myHeaders,
        redirect: 'follow',
        // headers : {
        //   "content-type" : "multipart/form-data",
        //   "Accept" : 'application/x-www-form-urlencoded',
        // }
      };
      setLoading(true);
      const response = await fetch(Url().editProfile, requestOptions);
      // print(response, 'response');
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resp');
        if (resparse.status == 'success') {
          toast.show(resparse?.data ? resparse.data : 'success', {
            type: 'success',
            duration: 2000,
          });
          navigation.goBack();
          dispatch(userSettingApi());
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error, 'error in edit profile api call');
      setLoading(false);
    }
  };

  return (
    <>
      {!load ? (
        <>
          <ScrollCard scrollRef={textFocus} editProfile spaceTop>
            {/* profile picture */}
            <Pressable
              onPress={() => setAnimButton(!animButton)}
              style={{
                width: scrnWidth / 4,
                height: scrnWidth / 4,
                borderRadius: scrnWidth / 8,
                position: 'relative',
                backgroundColor: appColor.cardbg,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {profile?.profilepicture?.uri &&
              profile?.profilepicture?.uri != '' ? (
                <Image
                  source={{uri: profile?.profilepicture?.uri}}
                  style={[
                    {
                      width: '100%',
                      height: '100%',
                      // position: 'absolute',
                      // zIndex: 10,
                      borderRadius: 100,
                    },
                  ]}
                  resizeMode="cover"
                />
              ) : (
                <Text
                  style={{
                    fontFamily: appFont.lB,
                    fontSize: fontScalling(8),
                    lineHeight: fontScalling(10),
                    color: appColor.primary,
                    textTransform: 'uppercase',
                  }}>
                  {profile?.username && profile?.username != ''
                    ? profile.username.charAt(0)
                    : 's'}
                </Text>
              )}
              {/* edit button */}
              <Pressable
                onPress={() => {
                  setAnimButton(!animButton), 1000;
                }}
                style={styles.editImg}>
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
                      OpenCamera();
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
                      OpenGallery();
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
                  {profile?.profilepicture?.uri &&
                    profile?.profilepicture?.uri != '' && (
                      <Animatable.View
                        duration={!animButton ? 1300 : 1200}
                        animation={!animButton ? 'fadeInRight' : 'fadeInLeft'}
                        onTouchStart={() => {
                          setdeleteModal(!deleteModal);
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

            {/* for username */}
            <Controller
              name="username"
              control={control}
              render={({field: {onChange, value}}) => {
                return (
                  <InputText
                    label={
                      authContent?.edit_profile?.name &&
                      authContent.edit_profile.name
                    }
                    placeholder={
                      authContent?.edit_profile?.name &&
                      authContent.edit_profile.name
                    }
                    value={value}
                    onChangeText={onChange}
                    formError={errors.username}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                );
              }}
            />

            {/* for usermail */}
            <Controller
              name="usermail"
              control={control}
              render={({field: {onChange, value}}) => {
                return (
                  <InputText
                    label={
                      authContent?.edit_profile?.Email &&
                      authContent.edit_profile.Email
                    }
                    placeholder={
                      authContent?.edit_profile?.Email &&
                      authContent.edit_profile.Email
                    }
                    value={value}
                    onChangeText={onChange}
                    formError={errors.usermail}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                );
              }}
            />

            {/* for country */}
            <Controller
              name="country"
              control={control}
              render={({field: {onChange, value}}) => {
                return (
                  <SelectDropDown
                    label={
                      authContent?.edit_profile?.country?.title &&
                      authContent.edit_profile.country.title
                    }
                    placeholder={
                      authContent?.edit_profile?.country?.placeholder &&
                      authContent.edit_profile.country.placeholder
                    }
                    value={value?.name?.en}
                    // value={Object.keys(value).length == 0 ? '' : value}
                    onChange={onChange}
                    error={errors.country}
                    nodrop
                    // country
                    onPress={() => setCountryShow(true)}
                  />
                );
              }}
            />

            {/* country picker */}
            <Controller
              name="country"
              control={control}
              render={({field: {onChange, value}}) => {
                return (
                  <CountryPick
                    Show={countryShow}
                    backPress={() => setCountryShow(false)}
                    country={authContent?.edit_profile?.country?.value}
                    onPick={item => {
                      onChange(item);
                      setCountryShow(false);
                    }}
                  />
                );
              }}
            />

            {/* password */}
            <Controller
              name="password"
              control={control}
              render={({field: {onChange, value}}) => {
                return (
                  <InputText
                    label={
                      authContent?.edit_profile?.password &&
                      authContent.edit_profile.password
                    }
                    placeholder={
                      authContent?.edit_profile?.password &&
                      authContent.edit_profile.password
                    }
                    secureTextEntry
                    autoCapitalize={true}
                    onChangeText={onChange}
                    value={value}
                    formError={errors.password}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                );
              }}
            />

            {/* confirm password */}
            <Controller
              name="confirm_password"
              control={control}
              render={({field: {onChange, value}}) => {
                return (
                  <InputText
                    label={
                      authContent?.edit_profile?.confirm_password &&
                      authContent.edit_profile.confirm_password
                    }
                    placeholder={
                      authContent?.edit_profile?.confirm_password &&
                      authContent.edit_profile.confirm_password
                    }
                    secureTextEntry
                    autoCapitalize={true}
                    onChangeText={onChange}
                    value={value}
                    formError={errors.confirm_password}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                );
              }}
            />

            {/* for description */}
            <Controller
              name="description"
              control={control}
              render={({field: {onChange, value}}) => {
                return (
                  <InputText
                    label={
                      authContent?.edit_profile?.profile_description &&
                      authContent.edit_profile.profile_description
                    }
                    placeholder={
                      authContent?.edit_profile?.profile_description &&
                      authContent.edit_profile.profile_description
                    }
                    value={value}
                    multiline={true}
                    numberOfLines={3}
                    textVertical={true}
                    onChangeText={onChange}
                    formError={errors.usermail}
                    onFocus={event => {
                      textFocus.current.scrollToFocusedInput(event.target);
                    }}
                  />
                );
              }}
            />

            {/* profile status */}
            <View
              style={[
                commenStyle.hFlex,
                {
                  justifyContent: 'space-between',
                  marginVertical: fontScalling(2),
                },
              ]}>
              {authContent?.edit_profile?.hide_profile && (
                <Text
                  style={[
                    commenStyle.authPara,
                    {marginBottom: 0, fontFamily: appFont.lB},
                  ]}>
                  {authContent.edit_profile.hide_profile}
                </Text>
              )}
              <Toggle
                isActive={profile.profileStatus == '1' ? false : true}
                onPress={() =>
                  setProfile({
                    ...currentValues,
                    profileStatus: profile.profileStatus == '2' ? '1' : '2',
                  })
                }
              />
            </View>

            {/* save button */}
            <PrimaryButton
              text={
                authContent?.edit_profile?.title &&
                authContent.edit_profile.title
              }
              style={{
                marginBottom: fontScalling(1.6),
              }}
              onPress={handleSubmit(editProfileSendApiCall)}
            />

            {/* delete button */}
            <PrimaryButton
              invert
              text={
                authContent?.edit_profile?.delete_profile &&
                authContent.edit_profile.delete_profile
              }
              onPress={() => setProfileDelete(!profileDelete)}
            />

            {/* submit loading */}
            {!loading ? null : <AuthLoading />}
          </ScrollCard>
          {/* delete modal */}
          <ModalPopup
            visible={deleteModal}
            onBackButtonPress={() => setdeleteModal(!deleteModal)}
            onBackdropPress={() => setdeleteModal(!deleteModal)}
            onClosePress={() => {
              setdeleteModal(!deleteModal);
            }}
            style={{
              justifyContent: 'center',
            }}>
            {authContent?.edit_profile?.modal?.description && (
              <Text
                style={[
                  commenStyle.modalTitle,
                  {
                    textAlign: 'center',
                  },
                ]}>
                {authContent.edit_profile.modal.description}
              </Text>
            )}
            <View
              style={[
                commenStyle.hFlex,
                {
                  justifyContent: 'center',
                },
              ]}>
              <PrimaryButton
                modal
                text={
                  authContent?.edit_profile?.modal?.yes &&
                  authContent.edit_profile.modal.yes
                }
                style={{
                  marginRight: 10,
                }}
                onPress={handleDeleteImage}
              />
              <PrimaryButton
                invert
                modal
                text={
                  authContent?.edit_profile?.modal?.no &&
                  authContent.edit_profile.modal.no
                }
                onPress={() => setdeleteModal(!deleteModal)}
              />
            </View>
          </ModalPopup>

          {/* profile delete modal */}
          <ModalPopup
            visible={profileDelete}
            onBackButtonPress={() => setProfileDelete(!profileDelete)}
            onBackdropPress={() => setProfileDelete(!profileDelete)}
            onClosePress={() => {
              setProfileDelete(!profileDelete);
            }}
            style={{
              justifyContent: 'center',
            }}>
            {authContent?.edit_profile?.delete_profile && (
              <Text style={[commenStyle.modalTitle]}>
                {authContent.edit_profile.delete_profile}
              </Text>
            )}
            <View>
              <CheckBox
                onPress={() => setDelSubscrip(!delSubscrip)}
                checked={delSubscrip}
                label={<DelCheckBox />}
              />
            </View>
            {/* loading with buttons */}
            {!delLoad ? (
              <View
                style={[
                  commenStyle.hFlex,
                  {
                    justifyContent: 'center',
                    marginTop: fontScalling(2.3),
                  },
                ]}>
                <PrimaryButton
                  modal
                  text={
                    authContent?.edit_profile?.modal?.yes &&
                    authContent.edit_profile.modal.yes
                  }
                  style={{
                    marginRight: 10,
                  }}
                  onPress={HandleProfileDelete}
                />
                <PrimaryButton
                  invert
                  modal
                  text={
                    authContent?.edit_profile?.modal?.no &&
                    authContent.edit_profile.modal.no
                  }
                  onPress={() => setProfileDelete(!profileDelete)}
                />
              </View>
            ) : (
              <AuthLoading />
            )}
          </ModalPopup>
        </>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default EditProfile;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    editImg: {
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
    },
  });
  return styles;
};
