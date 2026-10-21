import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import appColors from '../../Utilities/appColors';
import {Icon} from '../../Utilities/icon';
import {appFont} from '../../Utilities/appFont';
import {
  Capitalize,
  fontScalling,
  print,
  widthResponse,
} from '../../Utilities/helperFunction';
import {useNavigation} from '@react-navigation/native';
import {useStyle} from '../../Utilities/styleSheet';
import {useDispatch, useSelector} from 'react-redux';
import {HeadTitleShimmer} from '../../Utilities/appShimmer';
import {setPaywallSheet} from '../../Redux/HeaderSlice';

const AppHeader = ({
  title,
  privacy,
  myaccount = false,
  backBtnDisabled = false,
}) => {
  const height = StatusBar.currentHeight + (widthResponse ? 10 : 15);
  const {isLogged, isSubscribed} = useSelector(State => State.authSettings);
  const {titleLoad} = useSelector(state => state.headSettings);
  const navigation = useNavigation();
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const {styles} = useCustomStyle();
  const dispatch = useDispatch();
  const {userDetails, userSetLoad} = useSelector(state => state.authSettings);
  const {userDatas} = useSelector(state => state.authSettings);

  const iconsWidth = widthResponse ? 25 : 30;
  const handleBack = () => {
    if (myaccount) {
      navigation.navigate('search');
    } else {
      if (navigation.canGoBack) {
        navigation.goBack();
      } else {
        navigation.navigate('Zoeken');
      }
    }
  };

  const handleUser = () => {
    // if (isLogged) {
    navigation.navigate('Zoeken', {
      screen: 'NoTabStack',
      params: {
        screen: 'account',
      },
    });
    // } else {
    //   navigation.navigate('Zoeken', {
    //     screen: 'NoTabStack',
    //     params: {
    //       screen: 'login',
    //     },
    //   });
    // }
  };

  const handleNotificationNavig = () => {
    if (isLogged) {
      if (isSubscribed) {
        navigation.navigate('Zoeken', {
          screen: 'NoTabStack',
          params: {
            screen: 'notification',
          },
        });
      } else dispatch(setPaywallSheet(true));
    } else {
      navigation.navigate('Zoeken', {
        screen: 'NoTabStack',
        params: {
          screen: 'login',
        },
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: appColor.bgWhite,
      }}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingBottom: widthResponse ? 10 : 15,
            paddingTop: widthResponse ? 0 : fontScalling(1.5),
            borderBottomWidth: 2,
            borderBottomColor: appColor.borderColor,
            backgroundColor: appColor.white,
          },
        ]}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'transparent'}
          translucent
        />
        {/* back & title */}
        <View
          style={{
            // backgroundColor:appColor.ToastError,
            flex: 1,
            paddingRight: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {/* back button */}
          {!backBtnDisabled && (
            <Pressable
              onPress={handleBack}
              style={{
                width: widthResponse ? 30 : 40,
                height: widthResponse ? 30 : 40,
                marginRight: 8,
                justifyContent: 'center',
                // backgroundColor: appColor.ToastError,
              }}>
              <Icon
                ComponentName={'FontAwesome6'}
                name={'arrow-left'}
                color={appColor.black}
                size={iconsWidth}
              />
            </Pressable>
          )}
          {/* title */}
          <Text
            style={{
              fontFamily: appFont.pDSb,
              fontSize: fontScalling(2.7),
              color: appColor.black,
              flex: 1,
              paddingRight: 10,
            }}
            numberOfLines={1}>
            {!titleLoad ? (
              title && title != ' ' && Capitalize(title)
            ) : (
              <HeadTitleShimmer />
            )}
          </Text>
        </View>
        {/* setting , notification & user */}
        {!privacy && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* setting */}
            <Pressable
              style={styles.rgt_pres}
              onPress={() =>
                navigation.navigate('Zoeken', {
                  screen: 'NoTabStack',
                  params: {
                    screen: 'setting',
                  },
                })
              }>
              <Icon
                ComponentName={'Ionicons'}
                name={'settings'}
                color={appColor.black}
                size={iconsWidth}
              />
            </Pressable>
            {/* notification */}
            <Pressable
              style={[styles.rgt_pres, {position: 'relative'}]}
              onPress={handleNotificationNavig}>
              <Icon
                ComponentName={'MaterialCommunityIcons'}
                name={'bell'}
                color={appColor.black}
                size={iconsWidth}
              />
              {isLogged && userDatas?.badge && userDatas?.badge > 0 && (
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 15,
                    borderWidth: 2,
                    borderColor: appColor.white,
                    backgroundColor: appColor.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    right: -7,
                  }}>
                  <Text
                    style={{
                      color: appColor.white,
                      fontFamily: appFont.lB,
                      fontSize: fontScalling(1.3),
                    }}>
                    {userDatas.badge}
                  </Text>
                </View>
              )}
            </Pressable>
            {/* user */}
            <Pressable
              style={[commenStyle.rgt_pres, {marginRight: 0}]}
              onPress={handleUser}>
              {!userSetLoad ? (
                isLogged ? (
                  <View
                    style={{
                      width: widthResponse ? 28 : 32,
                      height: widthResponse ? 28 : 32,
                      borderRadius: 50,
                      backgroundColor: appColor.cardbg,
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                    }}>
                    {userDatas?.image && userDatas?.image != '' ? (
                      <Image
                        source={{uri: userDatas?.image}}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text
                        style={{
                          fontFamily: appFont.lB,
                          fontSize: fontScalling(2),
                          lineHeight: fontScalling(3),
                          color: appColor.primary,
                          textTransform: 'uppercase',
                        }}>
                        {userDatas?.name && userDatas?.name != ''
                          ? userDatas.name.charAt(0)
                          : 'p'}
                      </Text>
                    )}
                  </View>
                ) : (
                  <Icon
                    ComponentName={'FontAwesome'}
                    name={'user'}
                    color={appColor.black}
                    size={iconsWidth}
                  />
                )
              ) : (
                <ActivityIndicator color={appColor.primary} />
              )}
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;

const useCustomStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    rgt_pres: {
      marginRight: 15,
      // backgroundColor:appColor.TextInputborderbg
    },
  });
  return {styles};
};
