import {StyleSheet} from 'react-native';
import appColors from './appColors';
import {appFont} from './appFont';
import {
  fontScalling,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from './helperFunction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useStyle = () => {
  const safeArea = useSafeAreaInsets();
  const appColor = appColors();
  const commenStyle = StyleSheet.create({
    whiteCard: {
      backgroundColor: 'white',
      // elevation: 10,
      borderRadius: 13,
      shadowOffset: {width: 0, height: 5},
      shadowColor: 'black',
      shadowRadius: 5,
    },
    rootPage: {
      flex: 1,
      backgroundColor: appColor.bgWhite,
    },
    container: {
      paddingHorizontal: widthResponse ? 15 : 20,
    },
    scrollContainer: {
      paddingVertical: widthResponse ? 20 : 25,
      paddingHorizontal: widthResponse ? 15 : 20,
      backgroundColor: appColor.bgWhite,
    },
    title: {
      fontFamily: appFont.pDSb,
      fontSize: fontScalling(2.8),
      color: appColor.black,
      marginBottom: 10,
    },
    para: {
      fontFamily: appFont.lR,
      fontSize: fontScalling(1.9),
      lineHeight: fontScalling(2.2),
      color: appColor.black,
      marginBottom: 10,
    },
    sideHead: {
      fontFamily: appFont.lB,
      fontSize: fontScalling(2.5),
      lineHeight: fontScalling(2.8),
      color: appColor.black,
      marginBottom: 10,
    },
    hFlex: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    authLogo: {
      width: scrnWidth / 3,
      height: scrnWidth / 3,
      objectFit: 'contain',
      alignSelf: 'center',
      position: 'absolute',
      bottom: -scrnWidth / 6,
      // left:scrnWidth/2.8
    },
    authContainer: {
      paddingHorizontal: widthResponse ? 15 : 20,
      paddingTop: scrnWidth / 3.5,
      // height:scrnHeight - scrnWidth/3,
      // flex:1,
    },
    authTitle: {
      fontFamily: appFont.pDSb,
      fontSize: fontScalling(4.5),
      color: appColor.textBlack,
      textAlign: 'center',
    },
    authTitle: {
      fontFamily: appFont.pDSb,
      fontSize: fontScalling(4.5),
      color: appColor.textBlack,
      textAlign: 'center',
      marginBottom: fontScalling(0),
    },
    authPara: {
      fontFamily: appFont.lR,
      fontSize: fontScalling(2),
      lineHeight: fontScalling(2.5),
      color: appColor.textBlack,
      textAlign: 'center',
      marginBottom: fontScalling(2),
    },
    checkLabel: {
      fontSize: fontScalling(1.8),
      lineHeight: fontScalling(2),
      fontFamily: appFont.lR,
      color: appColor.black,
    },
    authSubButton: {
      fontFamily: appFont.lB,
      color: appColor.primary,
      fontSize: fontScalling(1.8),
      lineHeight: fontScalling(2.3),
    },
    authNavContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    authNavText: {
      fontFamily: appFont.lB,
      color: appColor.black,
      fontSize: fontScalling(1.8),
      lineHeight: fontScalling(2),
      textAlign: 'center',
      marginTop: fontScalling(2),
    },
    authNavUnderline: {
      textDecorationLine: 'underline',
    },
    error: {
      color: appColor.formError,
      fontSize: fontScalling(1.45),
      fontFamily: appFont.lR,
      marginTop: 6,
      width: '100%',
    },
    settingLinks: {
      fontFamily: appFont.lB,
      color: appColor.primary,
      fontSize: fontScalling(2.3),
      lineHeight: fontScalling(2.8),
      textTransform: 'capitalize',
      marginRight: widthResponse ? 15 : 20,
      marginBottom: 10,
    },
    popUpStyle: {
      flex: 1,
      marginVertical: safeArea.top,
      paddingTop: widthResponse ? 60 : 70,
    },
    aboutImage: {
      width: '100%',
      height: scrnHeight / 4.5,
      borderRadius: 15,
      overflow: 'hidden',
      marginBottom: fontScalling(2),
    },
    darkContainer: {
      paddingHorizontal: widthResponse ? 15 : 20,
      paddingVertical: widthResponse ? 25 : 30,
      backgroundColor: appColor.cardbg,
    },
    contactCircle: {
      width: scrnWidth / (widthResponse ? 8 : 11),
      height: scrnWidth / (widthResponse ? 8 : 11),
      backgroundColor: appColor.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: scrnWidth / 8,
    },
    modalTitle: {
      fontFamily: appFont.pDSb,
      fontSize: fontScalling(2.6),
      marginBottom: fontScalling(2.6),
      color: appColor.black,
      textAlign: 'center',
    },
    shadow: {
      shadowOffset: {width: 1, height: 5},
      shadowColor: 'black',
      shadowRadius: 5,
      shadowOpacity: 0.2,
    },
  });
  return {commenStyle};
};
