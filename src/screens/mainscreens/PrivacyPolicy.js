import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appFont} from '../../Utilities/appFont';
import appColors from '../../Utilities/appColors';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {useStyle} from '../../Utilities/styleSheet';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {setOptions, setTitleLoad} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import PageLoader from '../../components/Loader/PageLoader';

const PrivacyPolicy = ({route}) => {
  const {language} = route?.params?.value == 'first' && route.params;
  const {terms} = route?.params ?? false;
  const [privContent, setPrivContent] = useState({});
  const [load, setLoad] = useState(false);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const options = useSelector(state => state.headSettings);

  useEffect(() => {
    if (isFocus) {
      // console.log(options);
      dispatch(setOptions(false));
      // console.log(options);
    } else if (!isFocus) {
      dispatch(setOptions(true));
      // console.log(options);
    }
  }, [isFocus]);

  const apiCall = async () => {
    try {
      const formdata = new FormData();
      formdata.append(
        'lcode',
        language?.language_code ? language.language_code : 'en',
      );
      // formdata.append("devId", );
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };
      setLoad(true);
      dispatch(setTitleLoad(true));
      // const response = await fetch(Url().privacyPolicy, requestOptions);
      const response = await fetch(
        terms ? Url().termsandconditions : Url().privacyPolicy,
        requestOptions,
      );
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setPrivContent(resparse?.data);
          // dispatch(setTitle(resparse?.data?.pageTitle))
          navigation.setOptions({
            title: resparse.data.pageTitle,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in privacy policy');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  useEffect(() => {
    apiCall();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}>
      {!load ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              commenStyle.container,
              {
                paddingVertical: 20,
              },
            ]}>
            {privContent?.pageContent && (
              <HtmlView url={privContent?.pageContent} padding={40} />
            )}
          </View>
        </ScrollView>
      ) : (
        <PageLoader />
      )}
    </View>
  );
};

export default PrivacyPolicy;
