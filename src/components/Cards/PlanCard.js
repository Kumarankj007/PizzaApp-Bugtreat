import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {
  Capitalize,
  fontScalling,
  parseDate,
  parseTime,
  print,
  scrnHeight,
  splitTime,
  toLocalTime,
  widthResponse,
} from '../../Utilities/helperFunction';
import {Icon} from '../../Utilities/icon';
import CheckBox from '../InputFields/CheckBox';
import {InputText} from '../InputFields/InputText';
import {useSelector} from 'react-redux';
import {appFont} from '../../Utilities/appFont';
import DateTimePick from '../InputFields/DateTimePick';
import SelectDropDown from '../DropDowns.js/SelectDropDown';
import {TimerPicker} from 'react-native-timer-picker';
import ModalPopup from '../Modal/ModalPopup';

const InputPlan = ({
  Key,
  Val,
  altStyle = {},
  time,
  disabled = false,
  date = false,
  onchangeLeft = () => {},
  onchangeRight = () => {},
  rightEdit = false,
  leftEdit = false,
  temperature = false,
  duration = false,
  onDatePick = () => {},
  onTimePick = () => {},
  onDurationPress = () => {},
  onDurationBlur = () => {},
  inOven = false,
  secondsShow = false,
  content,
  showText = false,
}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const {styles} = pageStyle();
  const {setters, deviceId} = useSelector(state => state.appSettings);
  return (
    <View
      style={[
        styles.hFlexStart,
        {
          alignItems: 'center',
        },
        altStyle,
      ]}>
      {Key && Key != '' && (
        <Text
          style={[
            commenStyle.authSubButton,
            {
              color: appColor.black,
              width: ['en', 'it', 'es'].includes(
                setters?.language?.language_code,
              )
                ? '26%'
                : duration
                ? '26%'
                : '23%',
              fontSize: fontScalling(2),
            },
          ]}>
          {Key}
        </Text>
      )}
      <Text
        style={[
          commenStyle.authSubButton,
          {
            color: appColor.black,
            marginRight: widthResponse ? 8 : 13,
            width: ['en', 'it', 'es'].includes(setters?.language?.language_code)
              ? widthResponse
                ? 12
                : 20
              : widthResponse
              ? 18
              : 27,
          },
        ]}>
        :
      </Text>
      <View style={[commenStyle.hFlex, {flex: 1}]}>
        <Pressable
          onPress={!disabled && onDatePick}
          style={{
            flex: temperature ? 0 : 1,
            marginRight: time ? (widthResponse ? 10 : 13) : 0,
            opacity: disabled ? (showText ? 1 : 0.6) : 1,
            width: temperature && '50%',
            position: 'relative',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <InputText
            onPress={() =>
              !disabled && date ? onDatePick() : onDurationPress()
            }
            editable={leftEdit}
            customStyle={{
              flex: 1,
              paddingBottom: 0,
            }}
            onBlur={onDurationBlur}
            borderRadius={10}
            inputStyle={{
              paddingVertical: widthResponse ? 5 : 8,
              paddingHorizontal: 0,
            }}
            value={Val}
            // autoFocus={true}
            onChangeText={onchangeLeft}
            keyboardType={'numeric'}
            containerStyle={{
              paddingLeft: 5,
            }}
          />
          {!disabled && date && (
            <View style={{position: 'absolute', right: widthResponse ? 8 : 13}}>
              <Icon
                ComponentName={'MaterialIcons'}
                name={'date-range'}
                size={widthResponse ? 20 : 24}
                color={appColor.bgBlack}
              />
            </View>
          )}
        </Pressable>
        {temperature && (
          <Text
            style={[
              commenStyle.sideHead,
              {
                fontSize: fontScalling(2),
                paddingLeft: 5,
                marginBottom: 0,
                fontFamily: appFont.lR,
              },
            ]}>
            {setters?.temperature?.tshort}
          </Text>
        )}
        {secondsShow &&
          content?.fixed_point?.duration_show != 0 &&
          disabled && (
            <Text
              style={[
                commenStyle.sideHead,
                {
                  fontSize: fontScalling(2),
                  paddingLeft: 5,
                  marginBottom: 0,
                  fontFamily: appFont.lR,
                },
              ]}>
              {content?.seconds}
            </Text>
          )}
        {secondsShow &&
          content?.fixed_point?.duration_show != 0 &&
          !disabled && (
            <Text
              style={[
                commenStyle.sideHead,
                {
                  fontSize: fontScalling(2),
                  paddingLeft: 5,
                  marginBottom: 0,
                  fontFamily: appFont.lR,
                },
              ]}>
              {/* {content?.hours + ':' + content?.minutes} */}
              Hrs : Min
            </Text>
          )}
        {time && (
          <Pressable
            onPress={!disabled && onTimePick}
            style={{
              // flex: 1,
              width: '35%',
              opacity: disabled ? 0.6 : 1,
              position: 'relative',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <InputText
              onPress={() => (!disabled && time ? onTimePick() : {})}
              editable={rightEdit}
              customStyle={{
                flex: 1,
                paddingBottom: 0,
              }}
              borderRadius={10}
              inputStyle={{
                paddingVertical: widthResponse ? 5 : 8,
                paddingHorizontal: 0,
              }}
              value={time}
              // autoFocus={true}
              onChangeText={onchangeRight}
              containerStyle={{
                paddingLeft: 5,
              }}
            />
            {!disabled && (
              <View
                style={{
                  position: 'absolute',
                  right: widthResponse ? 8 : 13,
                  // justifyContent: 'center',
                }}>
                <Icon
                  ComponentName={'AntDesign'}
                  name={'caretup'}
                  color={appColor.black}
                  size={widthResponse ? 10 : 15}
                />
                <Icon
                  ComponentName={'AntDesign'}
                  name={'caretdown'}
                  color={appColor.black}
                  size={widthResponse ? 10 : 15}
                />
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
};

const PlanCard = ({
  item,
  content,
  removePizzaPlan,
  onchangeLeft = () => {},
  onchangeRight = () => {},
  id,
  leftEdit,
  rightEdit,
  title,
  temperatureShow,
  temperatureValue,
  disabled,
  startDate,
  startTime,
  duration,
  onDatePick = () => {},
  onTimePick = () => {},
  minimumDate,
  maximumDate,
  onSecondChange = () => {},
  seconds,
  inOven,
  secondsShow = false,
  ovens,
  ovenValue,
  ovenLabel,
  ovenPlaceholder,
  onOvenChange = () => {},
  showText = false,
  onDurationPress,
  onDurationBlur = () => {},
  tempEdit = false,
}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const {styles} = pageStyle();
  const margin = widthResponse ? 8 : 15;

  const [durationPopup, setDurationPopup] = useState(false);

  const [pickerShow, setPickerShow] = useState({
    date: false,
    time: false,
  });

  const [show, setShow] = useState(false);

  // console.log(pickerShow, 'dur', show);
  return (
    <View
      style={[
        commenStyle.whiteCard,
        // styles.hFlexStart,
        commenStyle.shadow,
        {
          padding: widthResponse ? 15 : 20,
          paddingBottom: widthResponse ? 5 : 15,
          // marginBottom: widthResponse ? 10 : 15,
        },
      ]}>
      {/* heading */}
      <View
        style={[
          commenStyle.hFlex,
          {
            marginBottom: widthResponse ? 10 : 15,
            paddingLeft: disabled ? (widthResponse ? 30 : 40) : 0,
            flexDirection: 'row',
          },
        ]}>
        {!disabled && <CheckBox checked={true} bordered />}
        <View style={{flexDirection: 'row', flex: 1}}>
          {/* title */}
          {title && (
            <Text
              style={[
                commenStyle.sideHead,
                {
                  fontSize: fontScalling(2),
                  paddingRight: 5,
                  marginBottom: 0,
                  flex: 1,
                },
              ]}>
              {title}
            </Text>
          )}
          {!disabled && (
            <TouchableOpacity
              style={[commenStyle.hFlex, {flex: 1, justifyContent: 'flex-end'}]}
              onPress={() => removePizzaPlan(id)}>
              <Icon
                ComponentName={'FontAwesome6'}
                name={'trash-can'}
                size={fontScalling(1.8)}
                color={appColor.bgBlack}
              />
              <Text style={[commenStyle.checkLabel, {marginLeft: 7}]}>
                {content?.remove}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* bottom block */}
      <View
        style={{
          flex: 1,
          paddingLeft: widthResponse ? 30 : 40,
        }}>
        {(startDate || startTime) && (
          <>
            <InputPlan
              Key={content?.time}
              Val={startDate}
              time={startTime}
              date
              onDatePick={() => {
                setShow(true);
                setPickerShow(pre => ({
                  ...pre,
                  date: true,
                  time: false,
                }));
              }}
              onTimePick={() => {
                setShow(true);
                setPickerShow(pre => ({
                  ...pre,
                  time: true,
                  date: false,
                }));
              }}
              disabled={disabled}
              altStyle={{
                marginBottom: margin,
              }}
            />
            {/* <DateTimePick
              mode={
                pickerShow.date ? 'date' : pickerShow.time ? 'time' : 'datetime'
              }
              show={show}
              date={
                pickerShow.date
                  ? parseDate(startDate)
                  : pickerShow.time
                  ? parseTime(startTime)
                  : new Date()
              }
              minimumDate={minimumDate ? parseDate(minimumDate) : new Date()}
              maximumDate={maximumDate ? parseDate(maximumDate) : new Date()}
              minuteInterval={15}
              onchange={chosen => {
                pickerShow.date
                  ? onDatePick(chosen)
                  : pickerShow.time
                  ? onTimePick(chosen)
                  : console.log('nev');
                setShow(false);
              }}
              close={() => setShow(false)}
            /> */}
            <DateTimePick
              mode={'date'}
              show={pickerShow.date}
              date={startDate ? parseDate(startDate) : new Date()}
              minimumDate={minimumDate ? parseDate(minimumDate) : null}
              maximumDate={maximumDate ? parseDate(maximumDate) : null}
              onchange={chosen => onDatePick(chosen)}
              close={() =>
                setPickerShow(pre => ({
                  ...pre,
                  time: false,
                  date: false,
                }))
              }
            />
            <DateTimePick
              mode={'time'}
              show={pickerShow.time}
              date={startTime ? parseTime(startTime) : new Date()}
              minuteInterval={15}
              onchange={chosen => onTimePick(chosen)}
              close={() =>
                setPickerShow(pre => ({
                  ...pre,
                  time: false,
                  date: false,
                }))
              }
            />
          </>
        )}

        {/* temperature */}
        {temperatureShow != 0 && (
          <InputPlan
            Key={content?.temp}
            Val={temperatureValue}
            altStyle={{
              marginBottom: margin,
            }}
            onchangeLeft={onchangeLeft}
            leftEdit={tempEdit}
            rightEdit={rightEdit}
            temperature
          />
        )}
        <View
          style={[
            commenStyle.hFlex,
            {
              // flex: 1,
              marginBottom: widthResponse ? 15 : 20,
            },
          ]}>
          {/* time */}
          {/* {duration && ( */}
          <InputPlan
            content={content}
            Key={content?.duration}
            Val={duration}
            onchangeLeft={onSecondChange}
            leftEdit={leftEdit}
            onDurationBlur={onDurationBlur}
            // onDurationPress={() => setDurationPopup(true)}
            rightEdit={rightEdit}
            secondsShow={secondsShow}
            disabled={disabled}
            showText={showText}
            // duration
            // inOven={inOven}
            altStyle={{
              flex: 1,
              width: secondsShow ? '50%' : '100%',
            }}
            // Val={item?.time}
            // Val={
            //   (splitTime(item.time)[0] > 0
            //     ? `${splitTime(item.time)[0]} ${
            //         content?.hours
            //       } `
            //     : '') +
            //   (splitTime(item.time)[1] > 0
            //     ? `${splitTime(item.time)[1]} ${
            //         content?.minutes
            //       } `
            //     : '')
            // }
          />

          <ModalPopup
            visible={durationPopup}
            onBackButtonPress={() => setDurationPopup(false)}
            onBackdropPress={() => setDurationPopup(false)}
            onClosePress={() => setDurationPopup(false)}>
            <TimerPicker
              // padWithNItems={3}
              hideSeconds
              // initialValue={{
              //   hours: Number(splitTime(duration)[0]),
              //   minutes: Number(splitTime(duration)[1]),
              //   seconds: null,
              // }}
              hourLabel={'hours'}
              minuteLabel={'minutes'}
              onDurationChange={e => {
                onSecondChange(`${e.hours}:${e.minutes}`);
              }}
              styles={{
                backgroundColor: appColor.bgWhite,
                theme: 'light',
                pickerItem: {
                  fontSize: fontScalling(1.8),
                  lineHeight: fontScalling(2),
                  fontFamily: appFont.lR,
                  color: appColor.black,
                },
                pickerLabel: {
                  fontSize: fontScalling(2),
                  lineHeight: fontScalling(2),
                  right: -fontScalling(3.8),
                },
                pickerLabelContainer: {
                  width: widthResponse ? 60 : 100,
                },
                pickerItemContainer: {
                  width: widthResponse ? 100 : 180,
                },
              }}
            />
          </ModalPopup>
          {/* )} */}
        </View>
        {disabled && (
          <View
            style={{
              paddingTop: widthResponse ? 10 : 15,
              borderTopWidth: 1,
              borderTopColor: appColor.borderColor,
            }}>
            <SelectDropDown
              sorting
              withOutDrop
              // steps
              label={ovenLabel}
              placeholder={ovenPlaceholder}
              datas={ovens}
              value={ovenValue}
              modal
              // contStyle={{marginBottom: widthResponse ? 10 : 15}}
              onChange={onOvenChange}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default PlanCard;

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    hFlexStart: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    textmodal: {
      height: scrnHeight / 10,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return {styles};
};
