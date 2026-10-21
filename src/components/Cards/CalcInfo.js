import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {appFont} from '../../Utilities/appFont';
import {
  Capitalize,
  fontScalling,
  widthResponse,
} from '../../Utilities/helperFunction';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';

const CalcInfo = ({title, datas, style}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const {styles} = pageStyle();
  return (
    <View style={[style]}>
      {title && <Text style={[commenStyle.sideHead]}>{Capitalize(title)}</Text>}
      {datas && datas.length > 0 && (
        <FlatList
          data={datas}
          contentContainerStyle={{
            backgroundColor: appColor.primaryLight,
            borderRadius: 10,
            paddingVertical: widthResponse ? 10 : 15,
          }}
          renderItem={({item, index}) => {
            return (
              <View
                key={index}
                style={[
                  {
                    flexDirection: 'row',
                    paddingHorizontal: widthResponse ? 10 : 15,
                    marginBottom:
                      datas.length == index + 1 ? 0 : widthResponse ? 10 : 15,
                  },
                ]}>
                {item?.type && (
                  <Text
                    style={[
                      styles.text,
                      {
                        fontFamily: appFont.lR,
                        // flex: 1,
                        // paddingRight: 10,
                        width: '60%',
                      },
                    ]}>
                    {item?.type}
                  </Text>
                )}
                {item?.value && (
                  <Text style={[styles.text, {textAlign: 'right', flex: 1}]}>
                    {item?.value}
                  </Text>
                )}
              </View>
            );
          }}
        />
      )}
      <View></View>
    </View>
  );
};

export default CalcInfo;

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    text: {
      fontFamily: appFont.lB,
      color: appColor.black,
      fontSize: fontScalling(1.9),
      lineHeight: fontScalling(1.9),
    },
  });
  return {styles};
};
