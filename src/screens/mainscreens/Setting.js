import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {setTabs, setTitleLoad} from '../../Redux/HeaderSlice';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../Utilities/helperFunction';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import {
  setAllUnits,
  setNotificationEnable,
  setSetters,
} from '../../Redux/AppSettingSlice';
import {Icon} from '../../Utilities/icon';
import SwitchToggle from '../../components/Buttons/SwitchToggle';
import {contents} from '../../Utilities/contents';
import DarkBack from '../../components/Cards/DarkBack';
import {Url} from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import {RefreshControl} from 'react-native-gesture-handler';

const Setting = () => {
  const [content, setContent] = useState({});
  const [settingContent, setSettingContent] = useState({});
  const [load, setLoad] = useState(false);
  const [settings, setSettings] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [translateEnable, setTranslateEnable] = useState(false);
  const [hide, setHide] = useState(false);
  const {setters, allUnits, userId, notificationEnable} = useSelector(
    State => State.appSettings,
  );
  const {isLogged} = useSelector(state => state.authSettings);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    setSettings(setters);
    // print(setters,"setters")
  }, [setters]);

  // handling the value changes
  const handleLanguageChange = val => {
    setSettings(pre => {
      const updatedSettings = {...pre, language: {...pre.language, ...val}};
      dispatch(setSetters(updatedSettings));
      return updatedSettings;
    });
  };

  const handleWeightChange = val => {
    setSettings(pre => {
      const updatedSettings = {...pre, weight: val};
      dispatch(setSetters(updatedSettings));
      return updatedSettings;
    });
  };

  const handleTemperatureChange = val => {
    setSettings(pre => {
      const updatedSettings = {...pre, temperature: val};
      dispatch(setSetters(updatedSettings));
      return updatedSettings;
    });
  };
  // setting content apicall
  const settingApiCall = async () => {
    try {
      const formData = new FormData();
      if (setters && setters?.language?.language_code) {
        formData.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }
      if (setters && setters?.weight?.ushort) {
        formData.append(
          'uShort',
          setters?.weight?.ushort ? setters?.weight?.ushort : 'g',
        );
      }

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      setLoad(true);
      dispatch(setTitleLoad(true));
      const response = await fetch(Url().settings, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse, 'resp');
          setSettingContent(resparse.data);
          navigation.setOptions({
            title: resparse.data.pageTitle,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the calculator content api call');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  // setting content apicall
  const userLcodeApiCall = async () => {
    try {
      const formData = new FormData();
      if (setters && setters?.language?.language_code) {
        formData.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }
      if (setters && setters?.temperature?.tshort) {
        formData.append(
          'tshort',
          setters?.temperature?.tshort ? setters?.temperature?.tshort : '°c',
        );
      }
      if (userId) formData.append('user_id', userId);
      formData.append('notify', notificationEnable ? 1 : 0);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      await fetch(Url().userLcode, requestOptions);
    } catch (error) {
      console.log(error, 'error in the calculator content api call');
    }
  };

  // ncc
  // apicall for the apiCallForDropVAlues
  const apiCallForDropVAlues = async () => {
    try {
      const formdata = new FormData();
      formdata.append('context', 'pizza');
      // formdata.append("devId", );
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };
      // setLoad(true);
      const response = await fetch(Url().firseSetting, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          dispatch(
            setAllUnits({
              language: resparse?.data?.languages,
              weight: resparse?.data?.units,
              temperature: resparse?.data?.temperatures,
            }),
          );
        }
      }
      // setLoad(false);
      setRefresh(false);
    } catch (error) {
      console.log(error, 'error in first screen settings');
      // setLoad(false);
      setRefresh(false);
    }
  };
  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);
  useEffect(() => {
    if (!refresh) {
      apiCallForDropVAlues();
    }
  }, []);
  useEffect(() => {
    if (refresh) {
      apiCallForDropVAlues();
    }
  }, [refresh]);

  useEffect(() => {
    settingApiCall();
  }, [setters]);

  useEffect(() => {
    if (userId) userLcodeApiCall();
  }, [setters, notificationEnable, userId]);
  return (
    // <Pressable
    //   style={{flex: 1}}
    //   onPressIn={() => setHide(false)}
    //   onPressOut={() => setHide(true)}>
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
          }>
          <View
            style={[
              commenStyle.container,
              {
                backgroundColor: appColor.white,
                paddingVertical: widthResponse ? 20 : 25,
                zIndex: 1,
                flex: 1,
              },
            ]}>
            {/* <language choose */}
            <View
              style={[
                commenStyle.hFlex,
                {
                  justifyContent: 'space-between',
                  marginBottom: fontScalling(2),
                  zIndex: 5,
                },
              ]}>
              {settingContent?.langTitle && (
                <Text
                  style={[
                    commenStyle.sideHead,
                    {
                      paddingRight: 10,
                      marginBottom: 0,
                      flex: 1,
                      fontSize: fontScalling(2),
                    },
                  ]}>
                  {settingContent.langTitle}
                </Text>
              )}
              <SelectDropDown
                placeholder={
                  settingContent?.langTitle && settingContent.langTitle
                }
                datas={allUnits.language}
                value={settings.language}
                onChange={handleLanguageChange}
                language
                horizontal
                parentZindex={7}
                contStyle={{
                  width: '60%',
                  marginBottom: 0,
                }}
                dropHide={hide}
              />
            </View>
            {/* description */}
            <View
              style={{
                borderBottomWidth: 1,
                marginBottom: fontScalling(4),
                borderBottomColor: appColor.borderColor,
              }}>
              <View
                style={[commenStyle.hFlex, {marginBottom: fontScalling(1)}]}>
                {settingContent?.translateHead && (
                  <Text
                    style={[commenStyle.title, {fontSize: fontScalling(3.1)}]}>
                    {settingContent.translateHead}
                  </Text>
                )}
                <Image
                  source={require('../../../assets/images/vip-icon.png')}
                  resizeMode="contain"
                  style={{
                    width: widthResponse ? 40 : 50,
                    height: widthResponse ? 40 : 50,
                    marginLeft: 9,
                  }}
                />
              </View>
              {settingContent?.pageParagraph && (
                <Text
                  style={[
                    commenStyle.para,
                    {
                      color: appColor.black,
                      // lineHeight: fontScalling(2.8),
                      paddingBottom: fontScalling(3),
                    },
                  ]}>
                  {settingContent.pageParagraph}
                </Text>
              )}
            </View>
            {/* translation button */}
            {/* <View
              style={[
                commenStyle.hFlex,
                {
                  justifyContent: 'space-between',
                  marginBottom: fontScalling(3),
                },
              ]}>
              {settingContent?.translateHead && (
                <View style={[commenStyle.hFlex]}>
                  <Icon
                    ComponentName={'MaterialCommunityIcons'}
                    name={'google-translate'}
                    color={appColor.bgBlack}
                    size={widthResponse ? 27 : 32}
                  />
                  <Text
                    style={[
                      commenStyle.sideHead,
                      {paddingLeft: 10, marginBottom: 0},
                    ]}>
                    {settingContent.translateHead}
                  </Text>
                </View>
              )}
              <SwitchToggle
                isActive={translateEnable}
                onPress={() => setTranslateEnable(!translateEnable)}
                type={'green'}
              />
            </View> */}
            {/* weight choose */}
            <View
              style={[
                commenStyle.hFlex,
                {
                  justifyContent: 'space-between',
                  marginBottom: fontScalling(2.3),
                  zIndex: 4,
                },
              ]}>
              {settingContent?.dispTitle && (
                <Text
                  style={[
                    commenStyle.sideHead,
                    {
                      paddingRight: 10,
                      marginBottom: 0,
                      fontSize: fontScalling(2),
                      flex: 1,
                    },
                  ]}>
                  {settingContent.dispTitle}
                </Text>
              )}
              <SelectDropDown
                placeholder={
                  settingContent?.dispTitle && settingContent.dispTitle
                }
                datas={allUnits.weight}
                value={settings.weight}
                horizontal
                parentZindex={6}
                weight
                onChange={handleWeightChange}
                contStyle={{
                  width: '60%',
                  marginBottom: 0,
                }}
                dropHide={hide}
              />
            </View>
            {/* temperature choose */}
            <View
              style={[
                commenStyle.hFlex,
                {
                  zIndex: 3,
                  justifyContent: 'space-between',
                  marginBottom: fontScalling(2),
                },
              ]}>
              {settingContent?.temperatureTitle &&
                settingContent.temperatureTitle && (
                  <Text
                    style={[
                      commenStyle.sideHead,
                      {
                        paddingRight: 10,
                        marginBottom: 0,
                        flex: 1,
                        fontSize: fontScalling(2),
                      },
                    ]}>
                    {settingContent?.temperatureTitle &&
                      settingContent.temperatureTitle}
                  </Text>
                )}
              <SelectDropDown
                placeholder={
                  settingContent?.temperatureTitle &&
                  settingContent.temperatureTitle
                }
                parentZindex={5}
                datas={allUnits.temperature}
                value={settings.temperature}
                onChange={handleTemperatureChange}
                horizontal
                temperature
                contStyle={{
                  width: '60%',
                  marginBottom: 0,
                }}
                dropHide={hide}
              />
            </View>
            {/* additional link navigation */}
            <View
              style={[
                commenStyle.hFlex,
                {justifyContent: 'center', flexWrap: 'wrap', display: 'none'},
              ]}>
              {/* about us */}
              {settingContent?.pages_new?.about_us && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('aboutus')}>
                  <Text style={[commenStyle.settingLinks]}>
                    {settingContent.pages_new.about_us}
                  </Text>
                </TouchableOpacity>
              )}
              {/* shop */}
              {settingContent?.pages_new?.shop && (
                <TouchableOpacity onPress={() => navigation.navigate('shop')}>
                  <Text style={[commenStyle.settingLinks]}>
                    {settingContent.pages_new.shop}
                  </Text>
                </TouchableOpacity>
              )}
              {/* contact */}
              {settingContent?.pages_new?.contact && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('contact')}>
                  <Text style={[commenStyle.settingLinks]}>
                    {settingContent.pages_new.contact}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* pushnotification enable */}
          {isLogged && (
            <DarkBack>
              <View
                style={[commenStyle.hFlex, {justifyContent: 'space-between'}]}>
                {settingContent?.push_notification && (
                  <Text
                    style={[
                      commenStyle.sideHead,
                      {
                        marginBottom: 0,
                        flex: 1,
                      },
                    ]}>
                    {settingContent.push_notification}
                  </Text>
                )}
                <SwitchToggle
                  type="lightGreen"
                  isActive={notificationEnable == 1 ? true : false}
                  onPress={() => {
                    dispatch(
                      setNotificationEnable(notificationEnable == 0 ? 1 : 0),
                    );
                  }}
                />
              </View>
            </DarkBack>
          )}
        </ScrollView>
      ) : (
        <PageLoader />
      )}
    </>
    //  </Pressable>
  );
};

export default Setting;

const styles = StyleSheet.create({});
