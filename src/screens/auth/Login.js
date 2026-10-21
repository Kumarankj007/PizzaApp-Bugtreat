import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {InputText} from '../../components/InputFields/InputText';
import appColors from '../../Utilities/appColors';
import CheckBox from '../../components/InputFields/CheckBox';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import AuthBack from '../../components/Cards/AuthBack';
import AuthRouteText from '../../components/Cards/AuthRouteText';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setIsLogged, userSettingApi} from '../../Redux/AuthSlice';
import {print, widthResponse} from '../../Utilities/helperFunction';
import {useAuthenticationContent} from '../../Hooks/AuthContent';
import {useToast} from 'react-native-toast-notifications';
import {Url} from '../../Utilities/appApi';
import {setUserId} from '../../Redux/AppSettingSlice';
import AuthLoading from '../../components/Loader/AuthLoading';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import PageLoader from '../../components/Loader/PageLoader';
import ValidationContent from '../../Hooks/ValidationContent';

const Login = () => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();

  // print(userDetails,"userregister");
  const [loading, setLoading] = useState(false);
  const {setters, deviceId, fcmToken} = useSelector(State => State.appSettings);

  // apicall for the authentication content
  const {authContent, load, error} = useAuthenticationContent();
  const {valContent} = ValidationContent();

  if (authContent?.terug) {
    navigation.setOptions({
      title: authContent.terug,
    });
  }

  // schema
  const schema = yup
    .object()
    .shape({
      mail: yup
        .string()
        .email(valContent?.enter_validmail)
        .required(valContent?.email_username_mail),
      password: yup.string().required(valContent?.enter_password),
      // remember: yup.boolean().oneOf([true], 'please select this').required(),
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
  });

  // label For CheckBox
  const Label = () => {
    return (
      <>
        {authContent?.login?.checkbox_content1 && (
          <Text style={[commenStyle.checkLabel]}>
            {authContent.login.checkbox_content1}
          </Text>
        )}
      </>
    );
  };

  // handling submission
  const formSubmit = data => {
    Keyboard.dismiss();
    loginApiCall(data);
  };

  // user login apicall
  const loginApiCall = async form => {
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
      if (fcmToken && fcmToken != '') formdata.append('fcm', fcmToken);
      formdata.append('platform', Platform.OS);
      if (form.mail && form.password && deviceId && deviceId != '') {
        formdata.append('email', form.mail);
        formdata.append('password', form.password);
        formdata.append('device_id', deviceId);
        // formdata.append('remember_me', form.remember ? 1 : 0);
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
        // redirect: "follow"
      };
      setLoading(true);
      // print(formdata, 'form');
      const response = await fetch(Url().login, requestOptions);
      // print(response, 'resp');
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse,"resp")
        if (resparse.status == 'success') {
          toast.show(
            resparse?.data?.message ? resparse?.data?.message : 'success',
            {
              type: 'success',
              duration: 2000,
            },
          );

          // calling the usersetting after successfull login
          dispatch(setUserId(resparse.data.id));
          dispatch(setIsLogged(true));
          dispatch(userSettingApi());
          reset();
          navigation.dispatch(StackActions.popToTop());
          navigation.navigate('account');
        }
        if (resparse.status == 'warning') {
          toast.show(
            resparse?.data?.message ? resparse?.data?.message : 'error',
            {
              type: 'danger',
              duration: 2000,
            },
          );
          setValue('password', '');
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
        <AuthBack auth>
          <View
            style={{
              marginBottom: widthResponse ? 10 : 20,
            }}>
            {/* title */}
            {authContent?.login?.title && (
              <Text style={[commenStyle.authTitle]}>
                {authContent.login.title}
              </Text>
            )}

            {/* para content */}
            {authContent?.login?.content && (
              <HtmlView url={authContent.login.content} />
            )}
          </View>
          <Controller
            name="mail"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <InputText
                  label={authContent?.login?.Email && authContent.login.Email}
                  placeholder={
                    authContent?.login?.Email && authContent.login.Email
                  }
                  autoCapitalize={false}
                  keyboardType={'email-address'}
                  onChangeText={onChange}
                  value={value}
                  formError={errors.mail}
                />
              );
            }}
          />
          <Controller
            name="password"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <InputText
                  autoCapitalize={true}
                  secureTextEntry
                  label={
                    authContent?.login?.password && authContent.login.password
                  }
                  placeholder={
                    authContent?.login?.password_placeholder &&
                    authContent.login.password_placeholder
                  }
                  onChangeText={onChange}
                  value={value}
                  formError={errors.password}
                />
              );
            }}
          />
          <View
            style={[
              commenStyle.hFlex,
              {justifyContent: 'space-between', marginTop: 5, flexWrap: 'wrap'},
            ]}>
            {/* <Controller
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
            /> */}
            {/* forget password */}
            <Pressable
              onPress={() => navigation.navigate('forget')}
              style={{marginLeft: 'auto'}}>
              {authContent?.login?.subtitle1 && (
                <Text style={[commenStyle.authSubButton]}>
                  {authContent.login.subtitle1}
                </Text>
              )}
            </Pressable>
            {/* {errors.remember && (
              <Text style={[commenStyle.error]}>{errors.remember.message}</Text>
            )} */}
          </View>
          {/* submit button */}
          <PrimaryButton
            text={authContent?.login?.button && authContent.login.button}
            onPress={handleSubmit(formSubmit)}
            withLoad={true}
            load={loading}
            style={{
              marginTop: 20,
            }}
          />
          <AuthRouteText
            label={authContent?.login?.subtitle2 && authContent.login.subtitle2}
            text={authContent?.login?.subtitle3 && authContent.login.subtitle3}
            onPress={() => {
              reset();
              navigation.navigate('register');
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

export default Login;

const styles = StyleSheet.create({});
