import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import Carousel from 'react-native-reanimated-carousel';
import {date} from 'yup';
import {print, scrnWidth} from '../../Utilities/helperFunction';

const SliderCaousel = ({containerStyle, data}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();

  const baseOptions = {
    vertical: false,
    width: scrnWidth / 3,
    height: scrnWidth / 4,
  };
  return (
    <View style={[containerStyle]}>
      <Carousel
        data={data}
        {...baseOptions}
        loop
        scrollAnimationDuration={1000}
        style={{
          // backgroundColor:appColor.black,
          position: 'relative',
          width: '100%',
          justifyContent: 'center',
        }}
        autoPlay={true}
        snapEnabled
        renderItem={({item}) => {
          return (
            <View>
              <Image
                source={{uri: item}}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default SliderCaousel;

const styles = StyleSheet.create({});
