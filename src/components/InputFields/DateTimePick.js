import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import DatePicker from 'react-native-date-picker';
import {formatedDate, print, toLocalTime} from '../../Utilities/helperFunction';

const DateTimePick = ({
  onchange,
  show,
  close,
  mode,
  date,
  minimumDate,
  maximumDate,
  minuteInterval,
}) => {
  return (
    <DatePicker
      mode={mode}
      theme="light"
      modal
      open={show}
      date={date || new Date()} // Default date to prevent undefined
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      onConfirm={selectedDate => {
        close();
        mode == 'time'
          ? onchange(toLocalTime(selectedDate))
          : onchange(formatedDate(selectedDate)); // Ensure formatted date is correctly set
      }}
      onCancel={close}
      minuteInterval={minuteInterval}
    />
  );
};

export default DateTimePick;

const styles = StyleSheet.create({});
