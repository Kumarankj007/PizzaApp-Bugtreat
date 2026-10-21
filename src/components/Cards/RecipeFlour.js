import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {scrnWidth, widthResponse} from '../../Utilities/helperFunction';
// import FastImage from 'react-native-fast-image';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';

const RecipeFlour = ({title, flourName, flourimage}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  return (
    <View>
      {title && <Text style={[commenStyle.sideHead]}>{title}</Text>}
      <View
        style={[
          commenStyle.hFlex,
          {
            padding: widthResponse ? 10 : 15,
            borderRadius: 10,
            backgroundColor: appColor.bgWhite,
            marginBottom: widthResponse ? 10 : 15,
            justifyContent: 'space-between',
          },
        ]}>
        {flourName && (
          <Text style={[commenStyle.sideHead, {flex: 1, paddingRight: 15}]}>
            {flourName}
          </Text>
        )}

        {flourimage && flourimage != '' && (
          <Image
            source={{
              uri: flourimage,
            }}
            resizeMode="contain"
            style={{
              width: scrnWidth / 6,
              aspectRatio: 1,
              borderWidth: 1,
              borderColor: appColor.borderColor,
              borderRadius: 10,
              marginLeft: 10,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default RecipeFlour;

const styles = StyleSheet.create({});
