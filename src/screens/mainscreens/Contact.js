import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import {InputText} from '../../components/InputFields/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import DarkBack from '../../components/Cards/DarkBack';
import ContactCard from '../../components/Cards/ContactCard';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useToast} from 'react-native-toast-notifications';
import {Url} from '../../Utilities/appApi';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import PageLoader from '../../components/Loader/PageLoader';
import ValidationContent from '../../Hooks/ValidationContent';

const Contact = () => {
  const [contactContent, setContactContent] = useState({});
  const [load, setLoad] = useState(false);
  const textFocus = useRef();
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const {setters} = useSelector(State => State.appSettings);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toast = useToast();
  const {valContent} = ValidationContent();

  // schema
  const schema = yup
    .object()
    .shape({
      name: yup.string().required(valContent?.enter_yourname),
      mail: yup
        .string()
        .email(valContent?.enter_validmail)
        .required(valContent?.enter_mail),
      number: yup.string().required(valContent?.enter_your_number).optional(),
      message: yup.string().required(valContent?.enter_your_message),
    })
    .required();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  // apicall for the contact screen content
  const contentApiCall = async () => {
    try {
      const formdata = new FormData();
      formdata.append(
        'lcode',
        setters?.language?.language_code
          ? setters?.language?.language_code
          : 'nl',
      );
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };
      setLoad(true);
      dispatch(setTitleLoad(true));
      const response = await fetch(Url().contactusContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse.data, "Res")
          setContactContent(resparse?.data);
          navigation.setOptions({
            title: resparse?.data?.pageTitle,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in contact content');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  // content api
  useEffect(() => {
    contentApiCall();
  }, [setters.language]);

  const handleFormSubmit = data => {
    enquiryApiCall(data);
  };

  // contact sent apicall
  const enquiryApiCall = async frmdata => {
    Keyboard.dismiss();
    // print(frmdata,"red")
    try {
      const formdata = new FormData();
      formdata.append(
        'lcode',
        setters?.language?.language_code
          ? setters?.language?.language_code
          : 'nl',
      );
      if (frmdata) {
        formdata.append('name', frmdata.name);
        formdata.append('email', frmdata.mail);
        formdata.append('telephone', frmdata.number);
        formdata.append('comment', frmdata.message);
      }
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      const response = await fetch(Url().enquiry, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse,"resparse")
          toast.show(resparse?.data ? resparse?.data : 'sent successfully', {
            type: 'success',
            duration: 2000,
          });
          reset();
        }
      }
    } catch (error) {
      console.log(error, 'error in the contact submit api call');
    }
  };
  return (
    <>
      {!load ? (
        <>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            scrollEnabled={true}
            enableAutomaticScroll={true}
            extraHeight={300}
            showsVerticalScrollIndicator={false}
            ref={textFocus}>
            {/* form contents */}
            <View
              style={[
                commenStyle.container,
                {
                  backgroundColor: appColor.white,
                  paddingVertical: widthResponse ? 30 : 35,
                  zIndex: 1,
                },
              ]}>
              {/* title one */}
              {contactContent?.formTitle && (
                <Text style={[commenStyle.sideHead]}>
                  {contactContent?.formTitle}
                </Text>
              )}

              {/* for name */}
              <Controller
                name="name"
                control={control}
                render={({field: {onChange, value}}) => {
                  return (
                    <InputText
                      label={contactContent?.formFields?.name?.title}
                      placeholder={
                        contactContent?.formFields?.name?.placeHolder
                      }
                      onChangeText={onChange}
                      value={value}
                      formError={errors.name}
                      required
                      onFocus={event => {
                        textFocus.current.scrollToFocusedInput(event.target);
                      }}
                    />
                  );
                }}
              />

              {/* for number */}
              <Controller
                name="number"
                control={control}
                render={({field: {onChange, value}}) => {
                  return (
                    <InputText
                      label={contactContent?.formFields?.telephone?.title}
                      placeholder={
                        contactContent?.formFields?.telephone?.placeHolder
                      }
                      onChangeText={onChange}
                      value={value}
                      formError={errors.number}
                      keyboardType={'numeric'}
                      onFocus={event => {
                        textFocus.current.scrollToFocusedInput(event.target);
                      }}
                    />
                  );
                }}
              />
              {/* for mail */}
              <Controller
                name="mail"
                control={control}
                render={({field: {onChange, value}}) => {
                  return (
                    <InputText
                      label={contactContent?.formFields?.email?.title}
                      placeholder={
                        contactContent?.formFields?.email?.placeHolder
                      }
                      required
                      onChangeText={onChange}
                      autoCapitalize
                      value={value}
                      formError={errors.mail}
                      keyboardType={'email-address'}
                      onFocus={event => {
                        textFocus.current.scrollToFocusedInput(event.target);
                      }}
                    />
                  );
                }}
              />
              {/* for message */}
              <Controller
                name="message"
                control={control}
                render={({field: {onChange, value}}) => {
                  return (
                    <InputText
                      label={contactContent?.formFields?.message?.title}
                      placeholder={
                        contactContent?.formFields?.message?.placeHolder
                      }
                      required
                      onChangeText={onChange}
                      value={value}
                      formError={errors.message}
                      multiline={true}
                      numberOfLines={3}
                      textVertical
                      onFocus={event => {
                        textFocus.current.scrollToFocusedInput(event.target);
                      }}
                    />
                  );
                }}
              />
              <PrimaryButton
                text={
                  contactContent?.formBtn
                    ? contactContent?.formBtn
                    : 'contact us'
                }
                onPress={handleSubmit(handleFormSubmit)}
                style={{
                  marginTop: fontScalling(2),
                }}
              />
            </View>

            {/* bottom contents */}
            <View style={[commenStyle.darkContainer, {flex: 1}]}>
              {/* title two */}
              {contactContent?.contactTitle && (
                <Text style={[commenStyle.sideHead]}>
                  {contactContent?.contactTitle}
                </Text>
              )}
              {/* description */}
              {contactContent?.contactContent && (
                <Text
                  style={[commenStyle.para, {marginBottom: fontScalling(2)}]}>
                  {contactContent?.contactContent}
                </Text>
              )}

              {/* reach us  */}
              <View style={[commenStyle.hFlex]}>
                {/* links */}
                <View
                  style={{
                    width: scrnWidth / 1.5,
                  }}>
                  {contactContent?.contactFields &&
                    contactContent?.contactFields.length > 0 &&
                    contactContent?.contactFields.map((item, ind) => (
                      <ContactCard
                        key={ind}
                        label={item?.title}
                        value={item?.content}
                        icon={item?.icon}
                      />
                    ))}
                </View>
                {/* right image */}
                {contactContent?.contactLogo &&
                  contactContent?.contactLogo != '' && (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      <Image
                        source={{uri: contactContent?.contactLogo}}
                        resizeMode="contain"
                        style={{
                          width: scrnWidth / 5,
                          height: scrnWidth / 5,
                        }}
                      />
                    </View>
                  )}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default Contact;

const styles = StyleSheet.create({});
