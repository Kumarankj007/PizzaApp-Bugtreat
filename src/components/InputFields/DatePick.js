import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
// import DateTimePicker from 'react-native-ui-datepicker'
import dayjs from 'dayjs';
import {
  fontScalling,
  formatedDate,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {CalendarList} from 'react-native-calendars';
import appColors from '../../Utilities/appColors';
import {appFont} from '../../Utilities/appFont';

const DatePick = ({onChange}) => {
  const [selectDate, setSelectDate] = useState('');
  const appColor = appColors();

  const handleDateChange = dt => {
    const dateFormated = formatedDate(dt.dateString);
    // const formattedtDay = dt.dateString.toISOString().split('T')[0];
    setSelectDate(dt.dateString);
    onChange(dateFormated);
  };

  return (
    <View
      style={{
        width: scrnWidth - 70,
        // backgroundColor:appColor.bgBlack,
      }}>
      <CalendarList
        horizontal={true}
        scrollEnabled={false}
        hideArrows={false}
        onDayPress={day => {
          handleDateChange(day);
        }}
        current={selectDate}
        calendarStyle={
          {
            // backgroundColor:appColor.TextInputborderbg,
            // paddingRight:90
          }
        }
        calendarWidth={scrnWidth - 70}
        theme={{
          backgroundColor: appColor.bgWhite,
          calendarBackground: 'transparent',
          selectedDayBackgroundColor: appColor.bgBlack,
          arrowColor: appColor.white,
          arrowHeight: 30,
          arrowWidth: 30,
          arrowStyle: {
            backgroundColor: appColor.primary,
            borderRadius: 10,
            cursor: 'pointer',
          },

          selectedDotColor: appColor.primary,
          selectedDayTextColor: appColor.active,
          monthTextColor: appColor.textBlack,
          monthFontFamily: appFont.lB,
          monthFontSize: fontScalling(2.5),
          textInactiveColor: appColor.Textlightblack,
          textDisabledColor: appColor.Textlightblack,
          textMonthFontFamily: appFont.lB,
          textMonthFontSize: fontScalling(2.5),
          textSectionTitleDisabledColor: appColor.textBlack,
          dayTextColor: appColor.textBlack,
          textSectionTitleColor: appColor.textBlack,
        }}
        firstDay={7}
      />
    </View>
  );
};

export default DatePick;

const styles = StyleSheet.create({});
