import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import {print, widthResponse} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import PageLoader from '../../components/Loader/PageLoader';

const AboutUs = () => {
  const [content, setContent] = useState({});
  const [aboutContent, setAboutContent] = useState({});
  const navigation = useNavigation();
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const {commenStyle} = useStyle();
  const {setters} = useSelector(State => State.appSettings);
  const dispatch = useDispatch();
  const appColor = appColors();

  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);
  // content set call
  const apiCall = async () => {
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

      if (Object.keys(aboutContent).length == 0) {
        setLoad(true);
        dispatch(setTitleLoad(true));
      }

      const response = await fetch(Url().aboutUs, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setAboutContent(resparse.data);
          navigation.setOptions({
            title: resparse.data.pageTitle,
          });
        }
      }
      setRefresh(false);
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the about us api call');
      setRefresh(false);
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  useEffect(() => {
    apiCall();
  }, [setters.language, refresh]);
  return (
    <>
      {!load ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              colors={[appColor.primary]}
              tintColor={appColor.primary}
            />
          }
          style={[
            commenStyle.container,
            {
              backgroundColor: appColor.bgWhite,
              paddingVertical: widthResponse ? 15 : 20,
            },
          ]}
          contentContainerStyle={{
            paddingBottom: widthResponse ? 60 : 80,
          }}>
          {aboutContent?.images?.imageOne && (
            <Image
              source={{uri: aboutContent.images.imageOne}}
              style={[commenStyle.aboutImage]}
              resizeMode="cover"
            />
          )}
          {aboutContent?.title?.titleOne && (
            <Text
              style={[
                commenStyle.title,
                {
                  marginBottom: 0,
                },
              ]}>
              {aboutContent.title.titleOne}
            </Text>
          )}
          {aboutContent?.description?.descriptionOne && (
            <HtmlView
              url={aboutContent?.description?.descriptionOne}
              padding={30}
            />
          )}
          {aboutContent?.lists?.listOne && (
            <HtmlView url={aboutContent?.lists?.listOne} padding={30} />
          )}
          {aboutContent?.images?.imageTwo && (
            <Image
              source={{uri: aboutContent.images.imageTwo}}
              style={[
                commenStyle.aboutImage,
                {
                  marginTop: widthResponse ? 15 : 20,
                },
              ]}
              resizeMode="cover"
            />
          )}
          {aboutContent?.title?.titleTwo && (
            <Text
              style={[
                commenStyle.title,
                {
                  marginBottom: 0,
                },
              ]}>
              {aboutContent.title.titleTwo}
            </Text>
          )}
          {aboutContent?.description?.descriptionTwo && (
            <HtmlView
              url={aboutContent?.description?.descriptionOne}
              padding={30}
            />
          )}
        </ScrollView>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default AboutUs;

const styles = StyleSheet.create({});
