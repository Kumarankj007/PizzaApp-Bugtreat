import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import CalcInput from './CalcInput';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import {Icon} from '../../Utilities/icon';

const CountInput = ({
  slideTitle,
  keyboardType,
  value,
  onChangeText = () => {},
  unit,
}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const {styles} = customStyles();
  const width = 70;

  const onUp = () => {
    onChangeText(Number(value) + 1);
  };
  const onDown = () => {
    if (value > 0) onChangeText(Number(value) - 1);
  };

  return (
    <View
      style={{
        marginBottom: widthResponse ? 15 : 20,
      }}>
      <Text style={[commenStyle.sideHead, {fontSize: fontScalling(2.1)}]}>
        {slideTitle}
      </Text>
      <View style={[commenStyle.hFlex, {}]}>
        <View
          style={[
            commenStyle.hFlex,
            {
              paddingHorizontal: widthResponse ? 15 : 20,
              backgroundColor: appColor.cardBack,
              height: widthResponse ? 40 : 45,
              flex: 1,
              marginRight: widthResponse ? 10 : 15,
              paddingRight: widthResponse ? 35 : 40,
              borderRadius: 15,
              // width:'100%'
            },
          ]}>
          <TextInput
            style={{
              width: '100%',
              fontFamily: appFont.lR,
              color: appColor.black,
              fontSize: fontScalling(2),
            }}
            keyboardType={keyboardType}
            value={value}
            onChangeText={onChangeText}
          />

          {/* buttons */}
          <View
            style={{
              marginLeft: widthResponse ? 6 : 8,
            }}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  marginBottom: -3,
                },
              ]}
              onPress={onUp}>
              <Icon
                ComponentName={'AntDesign'}
                name={'caretup'}
                color={appColor.black}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn]} onPress={onDown}>
              <Icon
                ComponentName={'AntDesign'}
                name={'caretdown'}
                color={appColor.black}
              />
            </TouchableOpacity>
          </View>
        </View>
        <CalcInput
          width={width}
          unitShow={true}
          unit={unit}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default CountInput;

const customStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    btn: {
      padding: 3,
      // backgroundColor:appColor.ToastError,
      borderRadius: 50,
    },
  });

  return {styles};
};
