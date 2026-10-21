import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import {Icon} from '../../Utilities/icon';
import appColors from '../../Utilities/appColors';
import {appFont} from '../../Utilities/appFont';
import {
  fontScalling,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const AuthHeader = ({title}) => {
  const {headLoad} = useSelector(State => State.headSettings);
  const {logo} = useSelector(state => state.appSettings);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const navigation = useNavigation();

  const height = StatusBar.currentHeight + (widthResponse ? 10 : 15);

  const handleBack = () => {
    if (navigation.canGoBack) {
      navigation.goBack();
    } else {
      navigation.navigate('setting');
    }
  };

  const circleheight = scrnWidth / 3.5;

  return (
    <>
      {!headLoad ? (
        <View
          style={[
            commenStyle.hFlex,
            commenStyle.container,
            {
              paddingTop: widthResponse ? 60 : 75,
              position: 'relative',
              backgroundColor: appColor.white,
            },
          ]}>
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={'transparent'}
            translucent
          />
          {/* back */}
          <Pressable
            style={[commenStyle.hFlex, {zIndex: 10}]}
            onPress={handleBack}>
            <Icon
              ComponentName={'FontAwesome6'}
              name={'angle-left'}
              color={appColor.primary}
              size={23}
            />
            {title && (
              <Text
                style={{
                  fontFamily: appFont.lR,
                  fontSize: fontScalling(2),
                  lineHeight: fontScalling(2.8),
                  color: appColor.primary,
                  marginLeft: 5,
                  textTransform: 'capitalize',
                }}>
                {title}
              </Text>
            )}
          </Pressable>
          <View
            style={{
              backgroundColor: appColor.primaryLight,
              position: 'absolute',
              top: -150,
              left: -90,
              right: -90,
              borderBottomLeftRadius: 700,
              borderBottomRightRadius: 700,
              height: scrnWidth / (widthResponse ? 1.5 : 2.3), //@@
            }}>
            <Image
              source={
                logo && logo != ''
                  ? {uri: logo}
                  : require('../../../assets/images/logo.png')
              }
              style={[commenStyle.authLogo]}
            />
          </View>
        </View>
      ) : null}
    </>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({});
