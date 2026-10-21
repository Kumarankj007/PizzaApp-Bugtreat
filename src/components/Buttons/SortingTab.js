import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {appFont} from '../../Utilities/appFont';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';

const SortingTab = ({datas, value, title, style, activeButton = () => {}}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const {styles} = useStyles();

  return (
    <View style={[commenStyle.hFlex, style]}>
      <Text
        style={[
          commenStyle.sideHead,
          {
            marginBottom: 0,
            // flex: 1,
            paddingRight: 8,
          },
        ]}>
        {title}
      </Text>

      <View
        style={[
          commenStyle.hFlex,
          {flex: 1, flexWrap: 'wrap', justifyContent: 'flex-end'},
        ]}>
        {datas &&
          datas.length > 0 &&
          datas.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => activeButton(item)}
              style={[
                styles.tabPress,
                {
                  marginVertical: widthResponse ? 4 : 8,
                  backgroundColor:
                    value?.sorting_key == item?.sorting_key
                      ? appColor.bgBlack
                      : appColor.bgWhite,
                  borderColor:
                    value?.sorting_key == item?.sorting_key
                      ? 'transparent'
                      : appColor.borderColor,
                },
              ]}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      value?.sorting_key == item?.sorting_key
                        ? appColor.white
                        : appColor.black,
                  },
                ]}>
                {item?.sorting}
              </Text>
            </Pressable>
          ))}
      </View>
    </View>
  );
};

export default SortingTab;

const useStyles = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    tabPress: {
      paddingHorizontal: widthResponse ? 7 : 10,
      paddingVertical: widthResponse ? 8 : 11,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: appColor.borderColor,
      backgroundColor: appColor.bgWhite,
      marginRight: 7,
    },
    tabText: {
      fontFamily: appFont.lB,
      fontSize: fontScalling(2),
      color: appColor.black,
    },
  });

  return {styles};
};
