import {
  Keyboard,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import appColors from '../Utilities/appColors';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {appFont} from '../Utilities/appFont';
import {Icon} from '../Utilities/icon';
import {
  Capitalize,
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../Utilities/helperFunction';
import {
  CalculateStack,
  CommunityStack,
  PlannerStack,
  RecipeStack,
  SearchStack,
} from './Stack';
import {useDispatch, useSelector} from 'react-redux';
import KeyboardVisible from '../Hooks/KeyboardVisible';
import {Url} from '../Utilities/appApi';
import {Toast} from 'react-native-toast-notifications';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {setPaywallSheet} from '../Redux/HeaderSlice';
import {setIsSubscribed, userSettingApi} from '../Redux/AuthSlice';
import {LocalSvg} from 'react-native-svg';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import {setTrigger} from '../Redux/TriggerSlice';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

// custom tab
const CustomTab = ({state, descriptors, navigation, load, tabs}) => {
  const appColor = appColors();
  const safeArea = useSafeAreaInsets();
  const keyboardVisible = KeyboardVisible().valueOf();
  const dispatch = useDispatch();

  const {isLogged, isSubscribed} = useSelector(State => State.authSettings);

  return (
    <>
      {!keyboardVisible && (
        <View
          style={{
            width: scrnWidth,
            flexDirection: 'row',
            backgroundColor: appColor.bgBlack,
            // justifyContent: 'space-between',
            // alignItems: 'stretch',
          }}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const label =
              options.title !== undefined
                ? options.title
                : options.title !== undefined
                ? options.title
                : route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                if (route.name == 'recepten') navigation.navigate(route.name);
                if (route.name == 'Calculeer') navigation.navigate(route.name);
                if (route.name == 'Zoeken') navigation.navigate(route.name);
                if (route.name == 'Community') {
                  if (isLogged) {
                    if (isSubscribed) {
                      navigation.navigate(route.name);
                    } else {
                      dispatch(setPaywallSheet(true));
                    }
                  } else {
                    navigation.navigate('Zoeken', {
                      screen: 'NoTabStack',
                    });
                  }
                }
                if (route.name == 'Planner') {
                  if (isLogged) {
                    if (isSubscribed) {
                      navigation.navigate(route.name);
                    } else {
                      dispatch(setPaywallSheet(true));
                    }
                  } else {
                    navigation.navigate('Zoeken', {
                      screen: 'NoTabStack',
                    });
                  }
                }
              }
            };

            const tabLabel = () => {
              switch (route.name) {
                case 'recepten':
                  return tabs?.recipes;
                case 'Calculeer':
                  return tabs?.Calculate;
                case 'Zoeken':
                  return tabs?.Search;
                case 'Community':
                  return tabs?.community;
                case 'Planner':
                  return tabs?.Planner;
                default:
                  break;
              }
            };
            return (
              <Pressable
                key={index}
                onPress={onPress}
                style={{
                  padding: widthResponse ? 7 : 20, //@@
                  paddingHorizontal: widthResponse ? 1 : 6,
                  flex: 1,
                  backgroundColor: isFocused ? appColor.primary : null,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: safeArea.bottom,
                }}>
                {route.name == 'Zoeken' ? (
                  <LocalSvg
                    asset={require('../../assets/images/grain1.svg')}
                    stroke={isFocused ? appColor.white : appColor.tabText}
                    fill={isFocused ? appColor.white : appColor.tabText}
                    width={widthResponse ? 15 : 22}
                    height={widthResponse ? 33 : 40}
                  />
                ) : (
                  <Icon
                    ComponentName={
                      route.name == 'recepten' || route.name == 'Calculeer'
                        ? 'MaterialCommunityIcons'
                        : route.name == 'Zoeken' || route.name == 'Community'
                        ? 'FontAwesome'
                        : 'FontAwesome5'
                    }
                    name={
                      route.name == 'recepten'
                        ? 'food-variant'
                        : route.name == 'Calculeer'
                        ? 'calculator-variant'
                        : route.name == 'Zoeken'
                        ? 'search'
                        : route.name == 'Community'
                        ? 'group'
                        : 'pizza-slice'
                    }
                    color={isFocused ? appColor.white : appColor.tabText}
                    size={widthResponse ? 25 : 29}
                  />
                )}
                <Text
                  // numberOfLines={1}
                  style={{
                    color: isFocused ? appColor.textWhite : appColor.tabText,
                    fontSize: fontScalling(widthResponse ? 1.4 : 1.7),
                    marginTop: 5,
                    marginTop: 'auto',
                  }}>
                  {load ? '.......' : tabLabel()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </>
  );
};

const BottomTab = () => {
  const appColor = appColors();
  const [load, setLoad] = useState(false);
  const [tabs, setTabs] = useState({});

  const {bottomTabs} = useSelector(state => state.headSettings);
  const {setters} = useSelector(State => State.appSettings);
  const {isLogged, isSubscribed} = useSelector(state => state.authSettings);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const bottomContentApiCall = async () => {
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
      setLoad(true);

      const response = await fetch(Url().bottomTab, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        setTabs(resparse.data);
        // print(resparse, 'reps');
      }
      setLoad(false);
    } catch (error) {
      console.log(error, 'Error in bottom tab content api');
      setLoad(false);
    }
  };

  useEffect(() => {
    // Function to handle the deep link
    const handleDeepLink = event => {
      const {url} = event;
      processUrl(url);
    };
    // Function to process the URL
    const processUrl = url => {
      if (!url) return;
      if (isLogged) {
        console.log(url, 'url');

        if (url.includes('to_app')) {
          dispatch(userSettingApi());
          navigation.navigate('Zoeken', {
            screen: 'NoTabStack',
            params: {
              screen: 'account',
            },
          });
        }
        if (url.includes('recipes')) {
          const recipeId = url.split('/').pop();
          if (recipeId) {
            if (isSubscribed) {
              navigation.navigate('Community', {
                screen: 'recipeDetail',
                params: {item: {id: recipeId}},
              });
            } else {
              navigation.navigate('Zoeken', {
                screen: 'NoTabStack',
                params: {
                  screen: 'account',
                },
              });
              dispatch(setPaywallSheet(true));
            }
          } else {
            navigation.navigate('Community');
          }
        }
      } else {
        navigation.navigate('Zoeken', {screen: 'NoTabStack'});
      }
    };
    // Get the initial URL when the app is launched from a closed state
    const getInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      processUrl(initialUrl);
    };
    getInitialUrl();
    // Add event listener for when the app is opened from the background
    const linkingListener = Linking.addEventListener('url', handleDeepLink);
    // Cleanup the event listener on unmount
    return () => {
      linkingListener.remove();
    };
  }, []);

  // // foreGround Message handler

  //foreground background and quit state handling
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(remoteMessage, 'onNotificationOpenedApp');
      // try {
      //   navigation.navigate('Zoeken', {
      //     screen: 'NoTabStack',
      //     params: {
      //       screen: 'notification',
      //     },
      //   });
      // } catch (error) {
      //   console.log('navigation error:', error);
      // }
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {});
  }, []);

  // for getting the messages on the foreground state
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        // console.log(remoteMessage, 'its work in foreground');
        dispatch(setTrigger());
        dispatch(userSettingApi());
      }
    });
    return unsubscribe;
  }, []);

  // background
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'ios' || 'android') {
        await messaging().requestPermission();
      }
    };
    requestPermission();
    // push notification permissions and token generation
    const registerBackgroundHandler = async () => {
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        if (remoteMessage) {
          const {title, body} = remoteMessage.notification;
          console.log(remoteMessage, 'registerBackgroundHandler');
          dispatch(userSettingApi());
        }
      });
    };
    registerBackgroundHandler();
  }, []);

  // useEffect(() => {
  //   return notifee.onBackgroundEvent(({type, detail}) => {
  //     console.log(detail, 'detail', type);
  //     switch (type) {
  //       case EventType.DISMISSED:
  //         break;
  //       case EventType.PRESS:
  //         // navigation.navigate('notification');
  //         break;
  //     }
  //   });
  // }, []);

  useEffect(() => {
    bottomContentApiCall();
  }, [setters?.language]);

  let lastTapTime = 0;
  let newlastTapTime = 0;

  return (
    <Tab.Navigator
      tabBar={props => {
        return bottomTabs ? (
          <CustomTab {...props} load={load} tabs={tabs} />
        ) : null;
      }}
      initialRouteName="Zoeken">
      <Tab.Group
        screenOptions={({route}) => ({
          tabBarStyle: {
            backgroundColor: appColor.black,
            // height: 65
          },
          headerShown: false,
          tabBarLabelPosition: 'below-icon',
          tabBarActiveTintColor: appColor.white,
          tabBarActiveBackgroundColor: appColor.primary,
          tabBarLabelStyle: {
            // color:appColor.Textlightblack,
            marginBottom: 9,
            fontSize: fontScalling(1.9),
            fontFamily: appFont.lB,
            textTransform: 'capitalize',
          },
          tabBarIcon: ({focused}) => {
            switch (route.name) {
              case 'recepten':
                return (
                  <Icon
                    ComponentName={'MaterialCommunityIcons'}
                    name={'food-variant'}
                    size={25}
                    color={focused ? appColor.white : appColor.tabText}
                  />
                );
              case 'Calculeer':
                return (
                  <Icon
                    ComponentName={'MaterialCommunityIcons'}
                    name={'calculator-variant'}
                    size={25}
                    color={focused ? appColor.white : appColor.tabText}
                  />
                );
              case 'Zoeken':
                return (
                  <Icon
                    ComponentName={'FontAwesome'}
                    name={'search'}
                    size={25}
                    color={focused ? appColor.white : appColor.tabText}
                  />
                );
              case 'Community':
                return (
                  <Icon
                    ComponentName={'FontAwesome'}
                    name={'group'}
                    size={25}
                    color={focused ? appColor.white : appColor.tabText}
                  />
                );
              case 'Planner':
                return (
                  <Icon
                    ComponentName={'FontAwesome5'}
                    name={'pizza-slice'}
                    size={25}
                    color={focused ? appColor.white : appColor.tabText}
                  />
                );
            }
          },
        })}>
        <Tab.Screen
          name="recepten"
          component={RecipeStack}
          options={{title: 'recepten'}}
        />
        <Tab.Screen
          name="Calculeer"
          component={CalculateStack}
          options={{title: 'Calculeer'}}
        />
        <Tab.Screen
          name="Zoeken"
          component={SearchStack}
          options={{title: 'search'}}
        />
        <Tab.Screen
          name="Community"
          component={CommunityStack}
          options={{title: 'Community'}}
          listeners={({navigation}) => ({
            tabPress: event => {
              const now = Date.now();
              if (now - lastTapTime < 300) {
                // If tapped twice within 300ms
                event.preventDefault();
                console.log('Double Press Detected');
                navigation.reset({
                  index: 0, // Ensure reset to first screen
                  routes: [{name: 'community'}],
                });
              }
              lastTapTime = now; // Update last tap time
            },
          })}
        />
        <Tab.Screen
          name="Planner"
          component={PlannerStack}
          options={{title: 'Planner'}}
          listeners={({navigation}) => ({
            tabPress: event => {
              const now = Date.now();
              if (now - newlastTapTime < 300) {
                // If tapped twice within 300ms
                event.preventDefault();
                console.log('Double Press Detected');
                navigation.reset({
                  index: 0, // Ensure reset to first screen
                  routes: [{name: 'Wizard'}],
                });
              }
              newlastTapTime = now; // Update last tap time
            },
          })}
        />
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default BottomTab;
