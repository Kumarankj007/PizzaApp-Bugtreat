import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  fontScalling,
  getMonthNumber,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import Ratings from './Ratings';
import {Icon} from '../../Utilities/icon';

const ReviewCard = ({review, onLike = () => {}, load, communityRecipe}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();

  let date = '';
  if (!communityRecipe) {
    date = `${review?.date}-${review?.month}-${review?.year}`;
  }

  return (
    <View
      style={[
        commenStyle.whiteCard,
        commenStyle.shadow,
        {
          paddingHorizontal: widthResponse ? 15 : 20,
          paddingVertical: widthResponse ? 10 : 15,
          overflow: 'visible',
        },
      ]}>
      {/* title */}
      {review?.title && (
        <Text
          style={[
            commenStyle.sideHead,
            {
              marginBottom: 5,
              fontSize: fontScalling(2.2),
              fontFamily: appFont.lBl,
            },
          ]}>
          {review.title}
        </Text>
      )}

      {/* rating */}
      {review?.rating && <Ratings counts={String(1)} />}

      {/* description */}

      {review?.content && (
        <Text
          style={[
            commenStyle.para,
            {
              marginTop: 5,
            },
          ]}>
          {review.content}
        </Text>
      )}

      {/* date & likes */}
      <View
        style={[
          commenStyle.hFlex,
          {
            paddingTop: widthResponse ? 8 : 13,
            borderTopColor: appColor.borderColor,
            borderTopWidth: 1,
            justifyContent: 'space-between',
          },
        ]}>
        {!communityRecipe
          ? date && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    fontSize: fontScalling(1.7),
                    color: appColor.primary,
                  },
                ]}>
                {date}
              </Text>
            )
          : review.created_at && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    fontSize: fontScalling(1.7),
                    color: appColor.primary,
                  },
                ]}>
                {review?.created_at}
              </Text>
            )}

        {/* likes */}
        {review?.likes && (
          <Pressable
            style={[commenStyle.hFlex]}
            onPress={() => onLike(review.id)}>
            <Icon
              ComponentName={'AntDesign'}
              name={review?.liked && review.liked == '0' ? 'hearto' : 'heart'}
              color={appColor.primary}
              size={widthResponse ? 12 : 15}
            />
            <Text
              style={[
                commenStyle.para,
                {
                  marginBottom: 0,
                  fontSize: fontScalling(1.7),
                  color: appColor.primary,
                  marginLeft: 5,
                },
              ]}>
              {review.likes}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({});
