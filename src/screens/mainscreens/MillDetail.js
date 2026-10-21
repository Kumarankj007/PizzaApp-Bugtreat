import {Image, Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  getCurrentTime,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import Country from '../../components/Cards/Country';
import MillDetailInfo from './MillDetailInfo';
import MillDetailFlours from './MillDetailFlours';
import {useDispatch, useSelector} from 'react-redux';
import {Url} from '../../Utilities/appApi';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import {useNavigation} from '@react-navigation/native';
import PageLoader from '../../components/Loader/PageLoader';
import moment from 'moment';
import {Toast} from 'react-native-toast-notifications';

const MillDetail = ({route}) => {
  const {detail} = route?.params && route?.params;
  const [millDetail, setMillDetail] = useState({});
  const [load, setLoad] = useState(false);
  const [flourLoad, setFlourLoad] = useState(false);
  const [flour, setFlour] = useState({
    flours: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });
  const [refresh, setRefresh] = useState(false);
  const [start, setStart] = useState(0);
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const appColor = appColors();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const navs = ['Informatie', 'meel'];
  const [activeButton, setActiveButton] = useState(0);
  const {setters, userId} = useSelector(State => State.appSettings);
  const {isLogged} = useSelector(State => State.authSettings);

  // print(detail,"detail")

  // mill detail content apicall
  const millDetailApiCall = async () => {
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
      if (detail && detail?.millId) {
        formdata.append('millId', detail.millId);
      }

      if (isLogged && userId) formdata.append('user_id', userId);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      if (Object.keys(millDetail).length == 0) {
        setLoad(true);
        dispatch(setTitleLoad(true));
      }
      const response = await fetch(Url().millDetail, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resp');
        if (resparse.status == 'success') {
          setMillDetail(resparse.data);
          navigation.setOptions({
            title: resparse.data.millName,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the search screen');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  // mill detail content
  useEffect(() => {
    millDetailApiCall();
  }, [setters.language, detail.millId]);

  //pull to refresh
  const onRefresh = useCallback(() => {
    setFlourLoad(true);
    setFlour({
      flours: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
    });
    setStart(0);
    setRefresh(true);
  }, []);

  // api for the history api call
  const historyCallApi = async () => {
    //cc
    try {
      const saveDate = dateString => {
        const [date, month, year] = dateString.split('/');
        return `${year}-${date}-${month}`;
      };
      const formData = new FormData();
      if (userId) formData.append('user_id', userId);
      formData.append('mill_id', detail.millId);
      formData.append('save_time', getCurrentTime());
      formData.append('save_date', saveDate(moment().format('L')));
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
    if (isLogged && detail && detail.millId) {
      historyCallApi();
    }
  }, [detail.millId]);

  //   linked flours initial api call
  useEffect(() => {
    if (!refresh) {
      linkedFloursApi();
    }
  }, [start]);

  //   linked flours refresh api call
  useEffect(() => {
    if (refresh) {
      linkedFloursApi();
    }
  }, [refresh]);

  const linkedFloursApi = async () => {
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
      if (detail && detail?.millId) {
        formdata.append('millId', detail.millId);
      }
      formdata.append('start', refresh ? 0 : start);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      if (flour.flours.length == 0) setFlourLoad(true);
      const response = await fetch(Url().linkedFlours, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          //   print(resparse, 'resp');
          setFlour(prev => ({
            flours: refresh
              ? resparse.data.flour
              : [...prev.flours, ...resparse.data.flour],
            start: Number(resparse.data.start),
            limit: Number(resparse.data.limit),
            total: Number(resparse.data.total),
            count: Number(resparse.data.count),
            page: refresh ? 1 : prev.page + 1,
          }));
        }
      }
      setFlourLoad(false);
    } catch (error) {
      console.log(error, 'error in linked flours');
      setFlourLoad(false);
    }
  };

  // mill follow api call
  const millFollowApiCall = async () => {
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
      if (detail.millId) {
        formdata.append('mill_id', detail.millId);
        formdata.append('user_id', userId);
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const response = await fetch(Url().millFollow, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          millDetailApiCall();
          Toast.show(resparse?.data, {type: 'success', duration: 2000});
        }
      }
    } catch (error) {
      console.log(error, 'error in the mill follow api call');
    }
  };

  const Navtabs = ({activeButtons}) => {
    switch (activeButtons) {
      case 0:
        return <MillDetailInfo data={millDetail} />;
      case 1:
        return (
          <MillDetailFlours
            millTitle={millDetail?.millTitle}
            flour={flour}
            flourLoad={flourLoad}
            setStart={setStart}
            start={start}
          />
        );
    }
  };
  return (
    <>
      {!load ? (
        <>
          <View style={[commenStyle.rootPage]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                backgroundColor: appColor.cardBack,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  paddingBottom: widthResponse ? 30 : 40,
                  backgroundColor: appColor.bgWhite,
                }}>
                {millDetail?.pageBanner && (
                  <Image
                    source={{uri: millDetail.pageBanner}}
                    style={{
                      width: '100%',
                      height: scrnWidth / 2,
                      marginBottom: widthResponse ? 20 : 25,
                    }}
                    resizeMode="cover"
                  />
                )}

                {/* name */}
                {millDetail?.millName && (
                  <Text style={[commenStyle.sideHead]}>
                    {millDetail.millName}
                  </Text>
                )}

                {/* country */}
                {millDetail?.country && (
                  <Country country={millDetail.country} />
                )}

                {/* follow btn */}
                <PrimaryButton
                  onPress={millFollowApiCall}
                  text={
                    millDetail?.mill_follow && millDetail?.mill_follow == 0
                      ? millDetail?.follow_button && millDetail.follow_button
                      : millDetail?.un_follow_button &&
                        millDetail.un_follow_button
                  }
                  style={{
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    marginTop: widthResponse ? 15 : 20,
                  }}
                />
              </View>
              <View
                style={{
                  paddingTop: widthResponse ? 20 : 25,
                  // backgroundColor: appColor.cardBack
                }}>
                {millDetail?.tab_titles && millDetail.tab_titles.length > 0 && (
                  <NavButton
                    title={millDetail.tab_titles}
                    activeButtons={activeButton}
                    onPress={setActiveButton}
                    altStyle={{
                      marginBottom: 15,
                    }}
                  />
                )}
                <Navtabs activeButtons={activeButton} />
              </View>
            </ScrollView>

            {/* bottom button */}
            {millDetail?.visitbtn?.value && (
              <View
                style={[
                  commenStyle.container,
                  {
                    backgroundColor: appColor.cardbg,
                    paddingVertical: widthResponse ? 10 : 15,
                  },
                ]}>
                <PrimaryButton
                  text={
                    millDetail?.visitbtn?.button && millDetail.visitbtn.button
                  }
                  onPress={() => Linking.openURL(millDetail.visitbtn.value)}
                />
              </View>
            )}
          </View>
        </>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default MillDetail;

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    paragraph: {
      color: appColor.textBlack,
    },
  });
  return {styles};
};
