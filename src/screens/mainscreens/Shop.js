import {
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import MainBack from '../../components/Cards/MainBack';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import List from '../../components/Cards/List';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import PageLoader from '../../components/Loader/PageLoader';
import HtmlView from '../../components/HtmlElement/RenderHtml';

const Shop = () => {
  const [shop, setShop] = useState({});
  const [content, setContent] = useState({});
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const {setters} = useSelector(State => State.appSettings);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
        // redirect: "follow"
      };

      if (Object.keys(shop).length == 0) {
        setLoad(true);
        dispatch(setTitleLoad(true));
      }

      // print(formdata, 'resp');
      const response = await fetch(Url().shop, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setShop(resparse.data);
          navigation.setOptions({
            title: resparse.data.pageTitle,
          });
        }
      }
      setLoad(false);
      setRefresh(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the about us api call');
      setLoad(false);
      setRefresh(false);
      dispatch(setTitleLoad(false));
    }
  };

  useEffect(() => {
    apiCall();
  }, [setters?.language, refresh]);
  return (
    <>
      {!load ? (
        <ScrollView
          style={{
            backgroundColor: appColor.bgWhite,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={onRefresh}
              colors={[appColor.primary]}
              tintColor={appColor.primary}
            />
          }
          showsVerticalScrollIndicator={false}>
          {/* banner image */}
          {shop?.images && shop?.images != '' && (
            <View
              style={{
                backgroundColor: appColor.primaryLight,
                height: scrnHeight / 3.5,
                position: 'relative',
                overflow: 'hidden',
              }}>
              <Image
                source={{uri: shop?.images}}
                resizeMode="contain"
                style={{
                  width: scrnWidth / 1.3,
                  // backgroundColor:appColor.bgBlack,
                  height: '100%',
                  position: 'absolute',
                  bottom: -20,
                  alignSelf: 'center',
                }}
              />
            </View>
          )}
          <View
            style={{
              padding: widthResponse ? 20 : 25,
            }}>
            {/* title */}
            {shop?.title && (
              <Text
                style={[
                  commenStyle.title,
                  {
                    color: appColor.primary,
                    fontSize: fontScalling(3.3),
                  },
                ]}>
                {shop.title}
              </Text>
            )}

            {/* discrition */}
            {shop?.description && (
              <HtmlView url={shop.description} padding={30} />
            )}

            {/* list */}
            {content?.lists?.listOne && (
              <List
                data={content.lists.listOne}
                style={{
                  marginBottom: fontScalling(3),
                }}
              />
            )}
            {/* button */}
            {shop?.buttonOne && (
              <PrimaryButton
                text={shop.buttonOne}
                style={{
                  marginTop: 20,
                }}
                onPress={() => Linking.openURL('https://shop.italieplein.nl/')}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default Shop;

const styles = StyleSheet.create({});
