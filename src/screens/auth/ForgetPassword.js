import {Keyboard, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import AuthBack from '../../components/Cards/AuthBack';
import {useStyle} from '../../Utilities/styleSheet';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {InputText} from '../../components/InputFields/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import AuthRouteText from '../../components/Cards/AuthRouteText';
import {useAuthenticationContent} from '../../Hooks/AuthContent';
import PageLoader from '../../components/Loader/PageLoader';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import {useSelector} from 'react-redux';
import {Url} from '../../Utilities/appApi';
import {useToast} from 'react-native-toast-notifications';
import {print} from '../../Utilities/helperFunction';
import AuthLoading from '../../components/Loader/AuthLoading';
import ValidationContent from '../../Hooks/ValidationContent';

const ForgetPassword = ({navigation}) => {
  const {commenStyle} = useStyle();
  const [loading, setLoading] = useState(false);
  const {setters} = useSelector(State => State.appSettings);
  const toast = useToast();
  const {valContent} = ValidationContent();
  // schema
  const schema = yup
    .object()
    .shape({
      mail: yup
        .string()
        .email(valContent?.enter_validmail)
        .required(valContent?.enter_mail),
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

  // apicall for the authentication content
  const {authContent, load, error} = useAuthenticationContent();

  if (authContent?.terug) {
    navigation.setOptions({
      title: authContent.terug,
    });
  }

  //   handling submission
  const forgetSubmit = data => {
    Keyboard.dismiss();
    resetPasswordApiCall(data);
  };

  // user reset password apicall
  const resetPasswordApiCall = async form => {
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
      if (form.mail) {
        formdata.append('reset_email', form.mail);
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
        // redirect: "follow"
      };

      setLoading(true);
      const response = await fetch(Url().forgetPassword, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse');
        if (resparse.status == 'success') {
          toast.show(resparse?.data ? resparse?.data : 'success', {
            type: 'success',
            duration: 2000,
          });
        }
        if (resparse.status == 'warning' || resparse.status == 'error') {
          toast.show(resparse?.data ? resparse?.data : 'error', {
            type: 'danger',
            duration: 2000,
          });
        }
      }
      reset();
      setLoading(false);
    } catch (error) {
      console.log(error, 'error in the reset password submit');
      setLoading(false);
    }
  };
  return (
    <>
      {!load ? (
        <AuthBack auth>
          {/* title */}
          {authContent?.reset?.title && (
            <Text style={[commenStyle.authTitle]}>
              {authContent.reset.title}
            </Text>
          )}

          {/* para content */}
          {authContent?.reset?.content && (
            <HtmlView url={authContent.reset.content} />
          )}

          {/* for mail */}
          <Controller
            name="mail"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <InputText
                  label={authContent?.reset?.Email && authContent.reset.Email}
                  placeholder={
                    authContent?.reset?.reset_email_placeholder &&
                    authContent.reset.reset_email_placeholder
                  }
                  autoCapitalize={true}
                  onChangeText={onChange}
                  value={value}
                  formError={errors.mail}
                  keyboardType={'email-address'}
                />
              );
            }}
          />

          {/* submit button */}
          <PrimaryButton
            text={authContent?.reset?.button && authContent.reset.button}
            onPress={handleSubmit(forgetSubmit)}
            style={{
              marginTop: 10,
            }}
          />
          <AuthRouteText
            label={authContent?.reset?.subtitle1 && authContent.reset.subtitle1}
            text={authContent?.reset?.subtitle2 && authContent.reset.subtitle2}
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

export default ForgetPassword;
