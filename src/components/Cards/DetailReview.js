import {
  Image,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {DropAnimation} from '../../components/AnimatedComp/DropAnimation';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import Ratings from './Ratings';
import * as Animatable from 'react-native-animatable';
const DetailReview = ({
  item,
  drop,
  onPress = () => {},
  onDoublePress = () => {},
  index,
}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();

  const rating =
    item?.recipe_rating == 0 ? String(item.recipe_rating) : item?.recipe_rating;

  const count =
    item?.review_count == 0 ? String(item?.review_count) : item?.review_count;
  return (
    <Pressable onPress={drop && onDoublePress}>
      <Pressable
        style={[
          commenStyle.shadow,
          {
            padding: widthResponse ? 10 : 15,
            backgroundColor: appColor.bgWhite,
            borderRadius: 15,
          },
        ]}
        onPress={!drop ? onPress : onDoublePress}>
        <View
          style={[
            commenStyle.hFlex,
            {
              justifyContent: 'space-between',
            },
          ]}>
          {/* left */}
          <View style={[commenStyle.hFlex, {flex: 1, paddingRight: 15}]}>
            {item?.image && (
              <Animatable.Image
                animation={'zoomIn'}
                delay={index * 200}
                source={{uri: item.image}}
                style={{
                  width: widthResponse ? 35 : 50,
                  height: widthResponse ? 35 : 50,
                  marginRight: 10,
                  borderRadius: 50,
                }}
              />
            )}
            {item?.name && (
              <Text
                style={[
                  commenStyle.sideHead,
                  {
                    marginBottom: 0,
                    fontFamily: appFont.lBl,
                    flex: 1,
                    fontSize: fontScalling(2.2),
                  },
                ]}
                numberOfLines={1}>
                {item.name}
              </Text>
            )}
          </View>
          {/* right */}
          {item?.date && (
            <Text
              style={[
                commenStyle.para,
                {
                  marginBottom: 0,
                },
              ]}>
              {item.date}
            </Text>
          )}
        </View>
      </Pressable>
      {drop && (
        <View
          style={{
            paddingTop: widthResponse ? 15 : 20,
          }}>
          {item?.description && (
            <Text style={[commenStyle.para]}>{item.description}</Text>
          )}

          {item?.reviewer_name && (
            <Text
              style={[
                commenStyle.sideHead,
                {
                  marginBottom: widthResponse ? 4 : 12,
                },
              ]}>
              {item.reviewer_name}
            </Text>
          )}

          <View style={[commenStyle.hFlex]}>
            {rating && <Ratings counts={rating} />}
            {count && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    marginLeft: widthResponse ? 7 : 15,
                  },
                ]}>
                ({count} reviews)
              </Text>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default DetailReview;

const styles = StyleSheet.create({});
