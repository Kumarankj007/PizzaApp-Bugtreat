import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AuthStack} from './src/Navigations/Stack';
import {
  checkNotificationPermission,
  print,
} from './src/Utilities/helperFunction';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Subscribe from './src/components/Paywalls/Subscribe';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {setDeviceId} from './src/Redux/AppSettingSlice';
import {useNetInfo} from '@react-native-community/netinfo';
import NetworkUnavailable from './src/components/Unavailable/NetworkUnavailable';
import {ToastProvider} from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {usePaywallContent} from './src/Hooks/PaywallContent';
import {setIsSubscribed, userSettingApi} from './src/Redux/AuthSlice';
import CancelSubscription from './src/components/Paywalls/CancelSubscription';
import useUserSetting from './src/Hooks/UserSetting';

const App = () => {
  const {paywallSheet} = useSelector(state => state.headSettings);
  const {cancelSheet} = useSelector(state => state.headSettings);
  const {userStatus, userDatas} = useSelector(State => State.authSettings);
  const {userId, fcmToken} = useSelector(State => State.appSettings);

  const {isConnected} = useNetInfo();
  const dispatch = useDispatch();

  const {payWallContent, payWallLoad} = usePaywallContent();
  const [fcmTrigger, setTriggerFcmToken] = useState(0);
  const fetchUserSettings = useUserSetting();

  // get the devices id:
  useEffect(() => {
    if (isConnected != null) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
    }

    // for getting the device unique id
    const fetchDeviceId = async () => {
      try {
        const uniqueId = await DeviceInfo.getUniqueId();
        if (uniqueId && uniqueId != '') {
          dispatch(setDeviceId(uniqueId));
        }
      } catch (error) {
        console.error('Failed to fetch device ID:', error);
      }
    };
    fetchDeviceId();

    if (userId) {
      // dispatch(userSettingApi());
      fetchUserSettings();
    }
  }, [isConnected]);

  useEffect(() => {
    if (userDatas?.freeavail == 1 || userDatas?.subscription == 1) {
      dispatch(setIsSubscribed(true));
    } else dispatch(setIsSubscribed(false));
  }, [userDatas]);

  // push notification permissions and token generation
  useEffect(() => {
    checkNotificationPermission(dispatch, setTriggerFcmToken);
    // print(fcmToken, 'fcmToken');
  }, [fcmTrigger]);

  // clear async:
  // useEffect(() => {
  //   (async () => {
  //     await AsyncStorage.clear();
  //   })();
  // }, []);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              {isConnected ? (
                <>
                  <AuthStack />
                  {/* paywall popup */}
                  <Subscribe
                    visible={paywallSheet}
                    content={payWallContent}
                    load={payWallLoad}
                  />
                  {/* renewable sheet */}
                  <CancelSubscription
                    visible={cancelSheet}
                    content={payWallContent}
                    load={payWallLoad}
                  />
                </>
              ) : (
                <NetworkUnavailable />
              )}
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
