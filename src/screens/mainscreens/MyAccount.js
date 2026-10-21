import {
  ActivityIndicator,
  BackHandler,
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import MainBack from '../../components/Cards/MainBack';
import {
  Capitalize,
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {appFont} from '../../Utilities/appFont';
import {account} from '../../Utilities/contents';
import AccountOptions from '../../components/Cards/AccountOptions';
import {useDispatch, useSelector} from 'react-redux';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import ModalPopup from '../../components/Modal/ModalPopup';
import {setIsLogged} from '../../Redux/AuthSlice';
import {
  setPaywallSheet,
  setCancelSheet,
  setTitleLoad,
} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import {useToast} from 'react-native-toast-notifications';
import AuthLoading from '../../components/Loader/AuthLoading';
import {setUserId} from '../../Redux/AppSettingSlice';

const MyAccount = () => {
  const [accountContent, setAccountContent] = useState({});
  const [logoutModal, setLogoutModal] = useState(false);
  const [load, setLoad] = useState(false);
  const [outLoad, setOutLoad] = useState(false);
  const {setters, userId} = useSelector(State => State.appSettings);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {isLogged, isSubscribed, userDatas, userSetLoad} = useSelector(
    state => state.authSettings,
  );
  const [profHover, setProfHover] = useState(false);

  const handleSubscription = () => {
    if (userDatas?.freeavail == 1 && userDatas?.subscription == 0) {
      dispatch(setPaywallSheet(true));
    }

    if (userDatas?.freeavail == 0 && userDatas?.subscription == 0) {
      dispatch(setPaywallSheet(true));
    }
    if (userDatas?.freeavail == 0 && userDatas?.subscription == 1) {
      dispatch(setCancelSheet(true));
    }
    if (userDatas?.freeavail == 1 && userDatas?.subscription == 1) {
      dispatch(setCancelSheet(true));
    }
  };

  const handleLogout = async () => {
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
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      setOutLoad(true);
      const response = await fetch(Url().logOut, requestOptions);
      // print(response, 'response');
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          toast.show(resparse?.data ? resparse.data : 'success', {
            type: 'success',
            duration: 2000,
          });
          setLogoutModal(!logoutModal);
          dispatch(setIsLogged(false));
          dispatch(setUserId(''));
          navigation.navigate('search');
        }
      }
      setOutLoad(false);
    } catch (error) {
      console.log(error, 'error in delete profile api call');
      setOutLoad(false);
    }
  };

  // setting content apicall
  const accountContentApiCall = async () => {
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

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      setLoad(true);
      dispatch(setTitleLoad(true));
      const response = await fetch(Url().myAccount, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse, 'resp');
          setAccountContent(resparse.data);
          navigation.setOptions({
            title: resparse.data.pageTitle,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the account content api call');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  useEffect(() => {
    accountContentApiCall();
  }, [setters?.language, setters?.weight]);

  return (
    <>
      {!load ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={[commenStyle.scrollContainer]}>
            {/* profile detail */}

            {isLogged && (
              <Pressable
                onPress={() => {
                  navigation.navigate('userDetail', {id: userId});
                }}
                onPressIn={() => setProfHover(true)}
                onPressOut={() => setProfHover(false)}
                style={[
                  commenStyle.hFlex,
                  !profHover ? commenStyle.shadow : null,
                  {
                    padding: widthResponse ? 15 : 20,
                    borderRadius: 10,
                    backgroundColor: appColor.bgWhite,
                    marginBottom: fontScalling(4),
                    borderColor: profHover ? appColor.primary : 'transparent',
                    borderWidth: 1,
                  },
                ]}>
                {/* profile */}
                <View
                  style={{
                    width: scrnWidth / (widthResponse ? 6 : 9),
                    height: scrnWidth / (widthResponse ? 6 : 9),
                    borderRadius: scrnWidth / 6,
                    overflow: 'hidden',
                    backgroundColor: appColor.cardbg,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: widthResponse ? 15 : 20,
                  }}>
                  {!userSetLoad ? (
                    userDatas?.image && userDatas?.image != '' ? (
                      <Image
                        source={{uri: userDatas?.image}}
                        resizeMode="cover"
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    ) : (
                      <Text
                        style={{
                          fontFamily: appFont.lB,
                          fontSize: fontScalling(6),
                          lineHeight: fontScalling(7),
                          color: appColor.primary,
                          textTransform: 'uppercase',
                        }}>
                        {userDatas?.name && userDatas?.name != ''
                          ? userDatas.name.charAt(0)
                          : 'p'}
                      </Text>
                    )
                  ) : (
                    <ActivityIndicator
                      color={appColor.primary}
                      size={'large'}
                    />
                  )}
                </View>
                {/* details */}
                <View
                  style={[
                    commenStyle.hFlex,
                    {
                      flex: 1,
                    },
                  ]}>
                  <View
                    style={{
                      flex: 1,
                      paddingRight: 10,
                    }}>
                    {/* name */}
                    {userDatas?.name && userDatas?.name != '' && (
                      <Text
                        style={{
                          fontFamily: appFont.lBl,
                          fontSize: fontScalling(2.4),
                          marginBottom: fontScalling(1),
                          color: appColor.black,
                        }}>
                        {userDatas.name}
                      </Text>
                    )}
                    {/* dates */}

                    {isSubscribed && userDatas?.renewal_date && (
                      <View style={[commenStyle.hFlex, {}]}>
                        {accountContent?.profile_Detail?.extends && (
                          <Text
                            style={[
                              commenStyle.para,
                              {
                                marginBottom: 0,
                                fontSize: fontScalling(1.6),
                              },
                            ]}>
                            {Capitalize(accountContent.profile_Detail.extends)}{' '}
                            :
                          </Text>
                        )}
                        <Text
                          style={[
                            commenStyle.para,
                            {
                              marginBottom: 0,
                              fontFamily: appFont.lB,
                              marginLeft: 2,
                              fontSize: fontScalling(1.6),
                            },
                          ]}>
                          {userDatas?.renewal_date}
                        </Text>
                      </View>
                    )}
                  </View>
                  {isSubscribed && (
                    <View
                      style={[
                        {
                          borderRadius: 10,
                          overflow: 'hidden',
                        },
                      ]}>
                      {accountContent?.premium_active?.premium && (
                        <Text
                          style={[
                            commenStyle.para,
                            {
                              marginBottom: 0,
                              padding: 7,
                              backgroundColor: appColor.cardBack,
                              textAlign: 'center',
                            },
                          ]}>
                          {accountContent?.premium_active?.premium}
                        </Text>
                      )}
                      {accountContent?.premium_active?.active && (
                        <Text
                          style={[
                            {
                              fontFamily: appFont.lBl,
                              color: appColor.white,
                              fontSize: fontScalling(2),
                              backgroundColor: appColor.activegreen,
                              padding: 7,
                              textAlign: 'center',
                            },
                          ]}>
                          {accountContent?.premium_active?.active}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </Pressable>
            )}

            {/*  */}

            {/* options  */}
            {isLogged && (
              <View style={[styles.card]}>
                {/* edit profile */}
                {accountContent?.options?.editprofile && (
                  <AccountOptions
                    text={accountContent.options.editprofile}
                    component={'FontAwesome5'}
                    name={'edit'}
                    onPress={() => navigation.navigate('editprofile')}
                  />
                )}
                {/* premium */}
                {accountContent?.options?.subscription && (
                  <AccountOptions
                    component={'FontAwesome6'}
                    name={'crown'}
                    text={accountContent.options.subscription}
                    onPress={handleSubscription}
                  />
                )}
                {/* favorites */}
                {accountContent?.options?.favorites && (
                  <AccountOptions
                    text={accountContent.options.favorites}
                    component={'Octicons'}
                    name={'feed-heart'}
                    size={widthResponse ? 23 : 26}
                    onPress={() => navigation.navigate('favorites')}
                  />
                )}
                {/* history */}
                {accountContent?.options?.history && (
                  <AccountOptions
                    border
                    component={'Octicons'}
                    name={'history'}
                    text={accountContent.options.history}
                    onPress={() => navigation.navigate('history')}
                    spaceBottom={false}
                  />
                )}
              </View>
            )}

            {/* all options  */}
            <View style={[styles.card]}>
              {/* about us */}
              {accountContent?.pages_new?.about_us && (
                <AccountOptions
                  text={accountContent.pages_new.about_us}
                  component={'FontAwesome'}
                  name={'exclamation-circle'}
                  size={widthResponse ? 22 : 26}
                  onPress={() => navigation.navigate('aboutus')}
                />
              )}

              {/* shop */}
              {accountContent?.pages_new?.shop && (
                <AccountOptions
                  text={accountContent.pages_new.shop}
                  component={'Entypo'}
                  name={'shop'}
                  size={widthResponse ? 22 : 26}
                  onPress={() => navigation.navigate('shop')}
                />
              )}

              {/* contact */}
              {accountContent?.pages_new?.contact && (
                <AccountOptions
                  text={accountContent.pages_new.contact}
                  component={'MaterialCommunityIcons'}
                  name={'phone-dial'}
                  border
                  size={widthResponse ? 22 : 26}
                  onPress={() => navigation.navigate('contact')}
                  spaceBottom={false}
                />
              )}
            </View>

            {/* logout  */}
            {isLogged && accountContent?.options?.logout && (
              <View style={[styles.card]}>
                <AccountOptions
                  border
                  component={'MaterialIcons'}
                  name={'logout'}
                  size={widthResponse ? 23 : 28}
                  text={accountContent.options.logout}
                  onPress={() => setLogoutModal(!logoutModal)}
                  spaceBottom={false}
                />
              </View>
            )}

            {/* login  */}

            {!isLogged && accountContent?.options?.login && (
              <View style={[styles.card]}>
                <AccountOptions
                  text={accountContent.options.login}
                  component={'AntDesign'}
                  name={'login'}
                  onPress={() => navigation.navigate('login')}
                  size={widthResponse ? 21 : 26}
                  border={!isLogged}
                  spaceBottom={false}
                />
              </View>
            )}
          </ScrollView>
          {/* logout modal */}
          <ModalPopup
            visible={logoutModal}
            onBackButtonPress={() => setLogoutModal(!logoutModal)}
            onBackdropPress={() => setLogoutModal(!logoutModal)}
            onClosePress={() => {
              setLogoutModal(!logoutModal);
            }}
            style={{
              justifyContent: 'center',
            }}>
            {accountContent?.modal?.description && (
              <Text
                style={[
                  commenStyle.modalTitle,
                  {
                    textAlign: 'center',
                  },
                ]}>
                {accountContent.modal.description}
              </Text>
            )}
            {!outLoad ? (
              <View
                style={[
                  commenStyle.hFlex,
                  {
                    justifyContent: 'center',
                  },
                ]}>
                <PrimaryButton
                  modal
                  text={accountContent?.modal?.yes && accountContent.modal.yes}
                  style={{
                    marginRight: 10,
                  }}
                  onPress={handleLogout}
                />
                <PrimaryButton
                  invert
                  modal
                  text={accountContent?.modal?.no && accountContent.modal.no}
                  onPress={() => setLogoutModal(!logoutModal)}
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

export default MyAccount;

const styles = StyleSheet.create({
  card: {
    padding: widthResponse ? 10 : 15,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
    marginBottom: fontScalling(2),
  },
});
