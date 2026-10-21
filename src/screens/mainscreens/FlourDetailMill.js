import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {print, scrnWidth, widthResponse} from '../../Utilities/helperFunction';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setTitle} from '../../Redux/HeaderSlice';
import HtmlView from '../../components/HtmlElement/RenderHtml';

export default FlourDetailMill = ({data}) => {
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const appColor = appColors();
  const Navigation = useNavigation();
  const dispatch = useDispatch();
  const container = widthResponse ? 15 : 20;
  const imgWidth =  scrnWidth / (widthResponse ? 4 : 7);
  return (
    <View style={[commenStyle.container]}>
      {data &&
        data?.mills &&
        data.mills.length > 0 &&
        data.mills.map((item, index) => (
          <TouchableOpacity
            style={[commenStyle.hFlex, {marginBottom: widthResponse ? 15 : 10}]}
            onPress={() => {
              Navigation.navigate('milldetail', {
                detail: item,
              });
            }}
            key={index}>
            {/* Mill img */}
            {item?.millImg && item.millImg != '' && (
              <Image
                source={{uri: item.millImg}}
                style={[
                  {
                    width: imgWidth,
                    aspectRatio: 1,
                    // height: scrnWidth / 4,
                    borderRadius: 10,
                  },
                ]}
                resizeMode="contain"
              />
            )}
            {/* mill detail */}
            <View style={{flex: 1, marginLeft: widthResponse ? 15 : 20}}>
              {item?.millName && (
                <Text style={[commenStyle.sideHead, {marginBottom: 5}]}>
                  {item.millName}
                </Text>
              )}
              {item?.millDesc && (
                <View style={{flex: 1}}>
                  <HtmlView
                    url={item?.millDesc}
                    width={container - imgWidth}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    paragraph: {
      color: appColor.textBlack,
    },
  });
  return {styles};
};
