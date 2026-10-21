import {Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import AuthBack from '../../components/Cards/AuthBack';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CheckBox from '../../components/InputFields/CheckBox';
import AuthRouteText from '../../components/Cards/AuthRouteText';
import {InputText} from '../../components/InputFields/InputText';
import TickList from '../../components/Cards/TickList';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../Utilities/helperFunction';
import {useDispatch, useSelector} from 'react-redux';
import {setUserDetails} from '../../Redux/AuthSlice';
import {countries} from '../../Utilities/contents';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import {useToast} from 'react-native-toast-notifications';
import {useAuthenticationContent} from '../../Hooks/AuthContent';
import {Url} from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import CountryPick from '../../components/Modal/CountryPick';
import AuthLoading from '../../components/Loader/AuthLoading';
import ValidationContent from '../../Hooks/ValidationContent';

const Register = ({navigation}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const textFocus = useRef();
  const dispatch = useDispatch();
  const {setters, deviceId} = useSelector(State => State.appSettings);
  const [loading, setLoading] = useState(false);
  const [countryShow, setCountryShow] = useState(false);
  const toast = useToast();
  const {valContent} = ValidationContent();

  // schema
  const schema = yup
    .object()
    .shape({
      username: yup
        .string()
        .required(valContent?.email_username_mail)
        .required(),
      mail: yup
        .string()
        .email(valContent?.enter_validmail)
        .required(valContent?.enter_mail)
        .required(),
      country: yup.object().required(valContent?.select_country).required(),
      password: yup
        .string()
        .required(valContent?.enter_password)
        .min(8, valContent?.password_message)
        .matches(/[A-Z]/, valContent?.password_message)
        .matches(
          /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/,
          valContent?.password_message,
        )
        .required(),
      confirmpassword: yup
        .string()
        .oneOf([yup.ref('password'), null], valContent?.password_match)
        .required(),
      remember: yup
        .boolean()
        .oneOf([true], valContent?.remember_me)
        .required(valContent?.remember_me),
    })
    .required()
    .required();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  // apicall for the authentication content
  const {authContent, load, error} = useAuthenticationContent();

  if (authContent?.terug) {
    navigation.setOptions({
      title: authContent.terug,
    });
  }

  // label For CheckBox
  const Label = () => {
    return (
      <View style={[{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}]}>
        {authContent?.registration?.gdpr?.gdprcontent1 && (
          <Text style={[commenStyle.checkLabel]}>
            {authContent.registration.gdpr.gdprcontent1}{' '}
          </Text>
        )}
        {authContent?.registration?.gdpr?.terms_and_conditions_content && (
          <Pressable onPress={() => navigation.navigate('privacy')}>
            <Text style={[commenStyle.checkLabel, {color: appColor.primary}]}>
              {authContent?.registration?.gdpr?.terms_and_conditions_content}
            </Text>
          </Pressable>
        )}
        {authContent?.registration?.gdpr?.gdprcontent2 && (
          <Text style={[commenStyle.checkLabel]}>
            {' '}
            {authContent?.registration?.gdpr?.gdprcontent2}{' '}
          </Text>
        )}
        {authContent?.registration?.gdpr?.privacy_policy_content && (
          <Pressable onPress={() => navigation.navigate('privacy')}>
            <Text style={[commenStyle.checkLabel, {color: appColor.primary}]}>
              {authContent?.registration?.gdpr?.privacy_policy_content}
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  // handleregister
  const registerSubmit = data => {
    Keyboard.dismiss();
    registerApiCall(data);
  };

  // user register apicall
  const registerApiCall = async form => {
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
      if (
        form.username &&
        form.mail &&
        form.country &&
        form.password &&
        form.remember &&
        deviceId &&
        deviceId != ''
      ) {
        formdata.append('email', form.mail);
        formdata.append('name', form.username);
        formdata.append('land', form.country.name.en);
        formdata.append('cc', form.country.code);
        formdata.append('password', form.password);
        formdata.append('device_id', deviceId);
        formdata.append('privacy_check', form.remember ? 1 : 0);
      }

      // print(formdata,"fomrdata")
      const requestOptions = {
        method: 'POST',
        body: formdata,
        // redirect: "follow"
      };
      setLoading(true);

      const response = await fetch(Url().register, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse, 'resp');
          toast.show(resparse?.data ? resparse.data : 'success', {
            type: 'success',
            duration: 2000,
          });
          setTimeout(() => {
            reset();
            navigation.navigate('login');
          }, 1000);
        }
        if (resparse.status == 'warning') {
          // print(resparse, 'resp');
          toast.show(resparse?.data ? resparse.data : 'error', {
            type: 'warning',
            duration: 2000,
          });
        }
        if (resparse.status == 'error') {
          // print(resparse, 'resp');
          toast.show(resparse?.data ? resparse.data : 'error', {
            type: 'danger',
            duration: 2000,
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error, 'error in the register submit');
      setLoading(false);
    }
  };
  return (
    <>
      {!load ? (
        <AuthBack scrollRef={textFocus} auth>
          <View
            style={{
              marginBottom: widthResponse ? 10 : 20,
            }}>
            {/* title */}
            {authContent?.registration?.title && (
              <Text style={[commenStyle.authTitle]}>
                {authContent.registration.title}
              </Text>
            )}

            {/* para content */}
            {authContent?.registration?.content && (
              <HtmlView url={authContent.registration.content} />
            )}
          </View>
          {/* tick list */}
          {authContent?.registration?.list && (
            <View
              style={{
                borderRadius: 15,
                overflow: 'hidden',
                padding: widthResponse ? 20 : 30,
                backgroundColor: appColor.primaryLight,
                marginBottom: 15,
                alignSelf: 'center',
              }}>
              <HtmlView url={authContent.registration.list} />
            </View>
          )}
          <Controller
            name="username"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <InputText
                  label={
                    authContent?.registration?.name &&
                    authContent.registration.name
                  }
                  placeholder={
                    authContent?.registration?.name_placeholder &&
                    authContent.registration.name_placeholder
                  }
                  onChangeText={onChange}
                  value={value}
                  formError={errors.username}
                  onFocus={event => {
                    textFocus.current.scrollToFocusedInput(event.target);
                  }}
                />
              );
            }}
          />
          <Controller
            name="mail"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <InputText
                  label={
                    authContent?.registration?.Email &&
                    authContent.registration.Email
                  }
                  placeholder={
                    authContent?.registration?.Email &&
                    authContent.registration.Email
                  }
                  autoCapitalize={true}
                  onChangeText={onChange}
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
          {/* weight dropdown */}
          <Controller
            name="country"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <SelectDropDown
                  label={
                    authContent?.registration?.country?.title &&
                    authContent.registration.country.title
                  }
                  placeholder={
                    authContent?.registration?.country?.placeholder &&
                    authContent.registration.country.placeholder
                  }
                  datas={countries}
                  value={value?.name?.en}
                  onChange={onChange}
                  error={errors.country}
                  nodrop
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
                  country={authContent?.registration?.country?.value}
                  onPick={item => {
                    onChange(item);
                    setCountryShow(false);
                  }}
                />
              );
            }}
          />

          {/* initial password */}
          <Controller
            name="password"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <InputText
                  label={
                    authContent?.registration?.password &&
                    authContent.registration.password
                  }
                  placeholder={
                    authContent?.registration?.password_placeholder &&
                    authContent.registration.password_placeholder
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
            name="confirmpassword"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <InputText
                  label={
                    authContent?.registration?.Wachtwoordbevestigen &&
                    authContent.registration.Wachtwoordbevestigen
                  }
                  placeholder={
                    authContent?.registration?.Wachtwoordbevestigen &&
                    authContent.registration.Wachtwoordbevestigen
                  }
                  secureTextEntry
                  autoCapitalize={true}
                  onChangeText={onChange}
                  value={value}
                  formError={errors.confirmpassword}
                  onFocus={event => {
                    textFocus.current.scrollToFocusedInput(event.target);
                  }}
                />
              );
            }}
          />

          {/* check box */}
          <View style={[{marginTop: 5}]}>
            <Controller
              name="remember"
              control={control}
              render={({field: {onChange, value}}) => {
                return (
                  <CheckBox
                    onPress={() => onChange(!value)}
                    checked={value}
                    label={<Label />}
                  />
                );
              }}
            />
            {errors.remember && (
              <Text style={[commenStyle.error]}>{errors.remember.message}</Text>
            )}
          </View>
          {/* submit button */}
          <PrimaryButton
            text={
              authContent?.registration?.button &&
              authContent.registration.button
            }
            onPress={handleSubmit(registerSubmit)}
            style={{
              marginTop: fontScalling(3),
            }}
          />
          <AuthRouteText
            label={
              authContent?.registration?.subtitle1 &&
              authContent.registration.subtitle1
            }
            text={
              authContent?.registration?.subtitle2 &&
              authContent.registration.subtitle2
            }
            onPress={() => {
              reset();
              navigation.navigate('login');
            }}
          />

          {/* authentication loader */}
          {loading && <AuthLoading />}
        </AuthBack>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default Register;

const styles = StyleSheet.create({});
