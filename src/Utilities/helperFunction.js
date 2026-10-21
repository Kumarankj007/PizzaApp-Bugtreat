import {
  Alert,
  BackHandler,
  Dimensions,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {number} from 'yup';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';
import {setFcmToken} from '../Redux/AppSettingSlice';
import messaging from '@react-native-firebase/messaging';

const {width} = Dimensions.get('screen');

export const scrnWidth = Dimensions.get('screen').width;
export const scrnHeight = Dimensions.get('screen').height;
export const bottom_Height = scrnWidth < 500 ? 60 : 70;
export const widthResponse = scrnWidth < 500 ? true : false;

// for getting the flag

const countries = require('./dialCode.json');
// export const getFlag = country => {
//   const cleanedCountry = country
//     .replace(/\s*\(.?\)\s/g, '')
//     .toUpperCase()
//     .trim();
//   console.log(cleanedCountry, 'country');
//   const flag = countries.find(cnt => {
//     return cnt.name.toUpperCase().trim() == cleanedCountry;
//   });
//   return flag ? flag.emoji : '🌍';
// };

export const getFlag = country => {
  const cleanedCountry = country
    .replace(/\s*\([^)]*\)/g, '')
    .toUpperCase()
    .trim();
  const flag = countries.find(cnt => {
    return cnt.name.toUpperCase().trim() === cleanedCountry;
  });
  return flag ? flag.emoji : '🌍';
};

export const print = (data, str) => {
  console.log(JSON.stringify(data, undefined, 2), str);
};

export const MyStatusBar = ({backgroundColor, ...props}) => {
  return (
    <View style={[{backgroundColor}]}>
      <SafeAreaView>
        <StatusBar backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );
};

// first letter caps:
export const Capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const fontScalling = size => {
  if (size > 0) {
    return width > 500
      ? responsiveFontSize(size - 0.7)
      : responsiveFontSize(size - 0.1);
  }
};

// price with symbol:
export const euro = (currency = 0) => {
  return (
    '€ ' +
    Number(currency).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
    })
  );
};

export const backPress = fn => {
  // BackHandler.removeEventListener('hardwareBackPress', () => BackHandler.exitApp());
  const backHandler = BackHandler.addEventListener('hardwareBackPress', fn);
  return () => backHandler.remove();
};

export const backPressGoback = fn => {
  BackHandler.removeEventListener('hardwareBackPress', () =>
    BackHandler.exitApp(),
  );
  BackHandler.addEventListener('hardwareBackPress', fn);
};

// for even number
export const isEven = n => {
  return n % 2 == 0;
};

// for odd number
export const isOdd = n => {
  return Math.abs(n % 2) == 1;
};

//format -> 04/03/24
export function formatedDate(dateString, format = '0') {
  const date = new Date(dateString);
  const dates = String(date.getDate()).padStart(2, 0);
  const month = String(date.getMonth() + 1).padStart(2, 0);
  const year = String(date.getFullYear());
  return format == '1'
    ? `${month}/${dates}/${year}`
    : `${dates}/${month}/${year}`;
}

// Convert time format from "10:00:00" to "10:00"
export function convertTimeFormat(inputTime) {
  // Split the input time string by space to separate time and "uur"
  const [time] = inputTime.split(' ');

  // Split the time string by colon to extract hours and minutes
  const [hours, minutes, sec] = time.split(':');

  // Format the hours and minutes
  const formattedHours = parseInt(hours, 10).toString().padStart(2, '0');
  const formattedMinutes = parseInt(minutes, 10).toString().padStart(2, '0');

  // Concatenate the formatted hours and minutes
  const formattedTime = `${formattedHours}:${formattedMinutes}`;

  return formattedTime;
}

export const splitTime = time => {
  const timeSplited = time.split(':');
  return timeSplited;
};

//format -> 04/03/24
export function formatedNewDate(dateString) {
  const [date, month, year] = dateString.split('/');
  return `${year}-${month}-${date}`;
}

// getting the current time
export const getCurrentTime = () => {
  const time = new Date();
  return `${time.getHours()}:${time.getMinutes()}`;
};

// camera permission:
export const requestCameraPermission = async () => {
  if (Platform.OS == 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return true;
    }
  } else if (Platform.OS == 'ios') {
    return check(PERMISSIONS.IOS.CAMERA).then(status => {
      switch (status) {
        case RESULTS.UNAVAILABLE:
          console.log(RESULTS.UNAVAILABLE);
          return RESULTS.UNAVAILABLE;
        case RESULTS.DENIED:
          console.log(RESULTS.DENIED);
          request('ios.permission.CAMERA').then(e => {
            console.log(e, 'e');
          });
          return RESULTS.DENIED;
        case RESULTS.BLOCKED:
          console.log(RESULTS.BLOCKED);
          permissionAlert('Camera');
          return RESULTS.BLOCKED;
        case RESULTS.GRANTED:
          console.log(RESULTS.GRANTED);
          return RESULTS.GRANTED;
        case RESULTS.LIMITED:
          console.log(RESULTS.LIMITED);
          return RESULTS.LIMITED;
      }
    });
  }
};

export const permissionAlert = (type = '') => {
  Alert.alert(
    'Permission Required',
    `${type} permission is required. Please enable it in the app settings.`,
    [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings(),
      },
    ],
  );
};

export const strEmptyCheck = str => {
  return str && str != '' ? true : false;
};

// export const requestPermissions = async (type, fn = () => {}) => {
//   let types =
//     type == 'storage'
//       ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
//       : type == 'camera'
//       ? PERMISSIONS.ANDROID.CAMERA
//       : null;
//   const req = await request(types);
//   const status =
//     type == 'storage' && req == 'unavailable'
//       ? await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
//       : req;
//   console.log(status, type, 'status');
//   if (status == 'granted') {
//     fn();
//   } else if (status == 'blocked') {
//     Alert.alert(
//       'Permission Required',
//       `${type} permission is required. Please enable it in the app settings.`,
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Open Settings',
//           onPress: () => Linking.openSettings(),
//         },
//       ],
//     );
//   }
//   return status;
// };

// for getting the month number
export const getMonthNumber = string => {
  const monthNumber =
    [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ].indexOf(string) + 1;

  return monthNumber < 10 ? `0${monthNumber}` : monthNumber;
};

export const toLocalTime = time => {
  const date = new Date(time);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
};

export const parseDate = dateStr => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day); // Month is 0-based in JS Date
};

// Convert "16:30" (HH:mm) into a JavaScript Date object
export const parseTime = timeStr => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const checkNotificationPermission = (
  dispatch,
  setTriggerFcmToken = () => {},
) => {
  const checkPermission = async () => {
    await messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled != -1) {
          registerRemoteMessage();
        } else {
          requestUserPermission();
        }
      })
      .catch(error => {
        console.log('error checking permisions ' + error);
      });
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      registerRemoteMessage();
    } else {
      console.log('auth failed');
    }
  }

  const registerRemoteMessage = async () => {
    try {
      const registered = messaging().isDeviceRegisteredForRemoteMessages;

      if (registered) {
        getFCMToken();
      } else {
        await messaging()
          .registerDeviceForRemoteMessages()
          .then(value => {
            if (value) {
              getFCMToken();
            }
          });
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };

  const getFCMToken = async () => {
    try {
      await messaging()
        .getToken()
        .then(token => {
          dispatch(setFcmToken(token));
          // console.log(token, 'token');x
        })
        .catch(error => {
          console.log(error.message, 'error');
          if (
            !error.message.includes(
              'The Internet connection appears to be offline.',
            )
          ) {
            setTriggerFcmToken(pre => pre + 1);
          }
        });
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };

  checkPermission();
};

// Alert to open App Settings
export const showPermissionAlert = () => {
  Alert.alert(
    'Permission Required',
    'To access photos, please enable permissions in Settings.',
    [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Open Settings',
        onPress: () => openSettings(), // Opens app settings
      },
    ],
  );
};

export const getImageUrl = async (url = '', type = 'flour') => {
  const fallbackImage = `${process.env.BASE_URL}assets/images/wheat-white.png`;

  if (!url) return fallbackImage;

  // If it's a local path, add base URL
  if (!url.startsWith('http')) {
    return `${process.env.BASE_URL}uploads/${type}/${url}`;
  }

  try {
    const response = await fetch(url, {method: 'HEAD'});
    // type == 'mills' && console.log(response.status, url)
    // Return URL only if the response is OK (status 200)
    if (response.status == 200) {
      return url;
    } else {
      return fallbackImage;
    }
  } catch (error) {
    // In case of network error or other issues
    return fallbackImage;
  }
};

export const getMillImageUrl = async (url = '') => {
  const fallbackImage = `${process.env.BASE_URL}assets/images/wheat-white.png`;

  if (!url) return fallbackImage;

  // If it's a local path, add base URL
  if (!url.startsWith('http')) {
    return `${process.env.BASE_URL}uploads/mills/${url}`;
  }

  try {
    const response = await fetch(url, {method: 'HEAD'});

    // Return URL only if the response is OK (status 200)
    if (response.status == 200) {
      return url;
    } else {
      return fallbackImage;
    }
  } catch (error) {
    // In case of network error or other issues
    return fallbackImage;
  }
};
