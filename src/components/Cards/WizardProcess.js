import {Animated, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import * as Animatable from 'react-native-animatable';
import {useSelector} from 'react-redux';

const WizardProcess = ({
  title,
  duration,
  temp,
  dateTime,
  description,
  status,
  ovenName,
  hours,
  minute,
  seconds,
  hoursPlaceholder = '',
  minutePlaceholder = '',
  secondsPlaceholder = '',
}) => {
  const {setters} = useSelector(State => State.appSettings);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  return (
    <View
      style={{
        paddingLeft: widthResponse ? 10 : 15,
        position: 'relative',
        // marginBottom: 15,
        // marginTop:20
        // backgroundColor:appColor.boldBlacktext
      }}>
      <View
        style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: 10,
          borderBottomWidth: 15,
          borderRightWidth: 10,
          borderLeftColor: 'transparent',
          borderBottomColor:
            status == 0
              ? appColor.bgBlack
              : status == 1
              ? appColor.primary
              : appColor.TextInputborderbg,
          borderRightColor: 'transparent',
          transform: [{rotate: '-90deg'}],
          position: 'absolute',
          left: widthResponse ? -3 : 0,
          top: widthResponse ? 12 : 17,
        }}
      />
      <View
        style={{
          borderRadius: 10,
          overflow: 'hidden',
        }}>
        <Animatable.View
          style={[
            commenStyle.hFlex,
            {
              padding: widthResponse ? 10 : 15,
              backgroundColor:
                status == 0
                  ? appColor.bgBlack
                  : status == 1
                  ? appColor.primary
                  : appColor.TextInputborderbg,
            },
          ]}>
          <View
            style={{
              flex: 2,
            }}>
            {title && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    fontFamily: appFont.lB,
                    paddingRight: 10,
                    marginBottom: 3,
                    flex: 1,
                    color:
                      status == 0 || status == 1
                        ? appColor.white
                        : appColor.black,
                  },
                ]}
                numberOfLines={1}>
                {title}
              </Text>
            )}
            {/* oven name */}
            {ovenName && (
              <Animated.Text
                style={[
                  commenStyle.para,
                  {
                    fontFamily: appFont.lB,
                    paddingRight: 10,
                    flex: 1,
                    marginBottom: 3,
                    color:
                      status == 0 || status == 1
                        ? appColor.white
                        : appColor.black,
                  },
                ]}
                numberOfLines={1}>
                ( {ovenName} )
              </Animated.Text>
            )}
            {dateTime && dateTime != '' && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    color:
                      status == 0 || status == 1
                        ? appColor.white
                        : appColor.black,
                    // fontSize: fontScalling(1.6),
                  },
                ]}>
                {dateTime}
              </Text>
            )}
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              // flex: 1,
            }}>
            <Text
              style={{
                color:
                  status == 0 || status == 1 ? appColor.white : appColor.black,
                marginBottom: widthResponse ? 5 : 8,
              }}>
              {(hours && hours != '00' ? hours + ' ' + hoursPlaceholder : '') +
                ' ' +
                (minute && minute != '00'
                  ? minute + ' ' + minutePlaceholder
                  : '') +
                ' ' +
                (seconds && temp && temp != '' && temp != '0'
                  ? seconds != '00'
                    ? seconds + ' ' + secondsPlaceholder
                    : ''
                  : '')}
            </Text>
            {temp && temp != '' && temp != '0' && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    color:
                      status == 0 || status == 1
                        ? appColor.white
                        : appColor.black,
                    fontSize: fontScalling(1.6),
                  },
                ]}>
                {`${temp}${
                  setters?.temperature?.tshort
                    ? setters?.temperature?.tshort
                    : '°C'
                }`}
              </Text>
            )}
          </View>
        </Animatable.View>
        {description && (
          <Text
            style={[
              commenStyle.para,
              {
                marginBottom: 0,
                padding: widthResponse ? 10 : 15,
                backgroundColor: appColor.bgWhite,
                fontSize: fontScalling(1.7),
              },
            ]}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};

export default WizardProcess;

const styles = StyleSheet.create({});
