import React, {useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {Icon} from '../../Utilities/icon';
import * as Animatable from 'react-native-animatable';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';

const SortingCard = ({
  altStyle,
  dropStyle,
  sortArray,
  label,
  Type,
  onPress = () => {},
  setType = () => {},
  placeholder,
  dropHide,
}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();

  const [drop, setDrop] = useState(false);

  useEffect(() => {
    if (dropHide) {
      setDrop(false); //
    }
  }, [dropHide]);
  return (
    <View
      style={[
        commenStyle.container,
        altStyle,
        {
          zIndex: 4,
          position: 'relative',
        },
      ]}>
      <View
        style={[
          commenStyle.hFlex,
          {
            backgroundColor: appColor.bgBlack,
            padding: widthResponse ? 2.5 : 4,
            borderRadius: 15,
          },
        ]}>
        {/* label */}
        <Text
          style={[
            commenStyle.checkLabel,
            {
              color: appColor.textWhite,
              marginHorizontal: 15,
              fontSize: fontScalling(1.9),
            },
          ]}>
          {label}
        </Text>
        <Pressable
          onPress={() => setDrop(!drop)}
          style={[
            commenStyle.hFlex,
            {
              flex: 1,
              backgroundColor: appColor.bgWhite,
              borderRadius: 12,
              paddingHorizontal: 15,
              paddingVertical: widthResponse ? 13 : 17,
              justifyContent: 'space-between',
            },
          ]}>
          <Text
            style={[
              commenStyle.checkLabel,
              {
                color: Type?.sorting
                  ? appColor.textBlack
                  : appColor.lightBlackBack,
                fontSize: fontScalling(1.9),
              },
            ]}>
            {Type?.sorting ? Type.sorting : placeholder}
          </Text>
          <Icon
            ComponentName={'FontAwesome6'}
            name={drop ? 'chevron-up' : 'chevron-down'}
            color={appColor.black}
            size={widthResponse ? 16 : 25}
          />
        </Pressable>
      </View>
      {drop && (
        <Animatable.View
          duration={700}
          direction={drop ? 'normal' : 'reverse'}
          animation={'zoomIn'}
          style={[
            commenStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderRadius: 10,
              position: 'absolute',
              top: widthResponse ? 60 : 80,
              left: widthResponse ? 15 : 20,
              zIndex: 1,
              width: '100%',
              // overflow: 'hidden',
              maxHeight: 150,
              elevation: 10,
            },
            dropStyle,
          ]}>
          <ScrollView
            nestedScrollEnabled={true}
            style={{
              borderRadius: 10,
              overflow: 'hidden',
            }}
            showsVerticalScrollIndicator={false}>
            {sortArray.map((item, index) => {
              return (
                <TouchableHighlight
                  delayLongPress={2000}
                  onPress={() => {
                    setDrop(false);
                    setType(item);
                    onPress(item, index);
                  }}
                  key={index}
                  underlayColor={appColor.lightGreyLine}
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      commenStyle.checkLabel,
                      {
                        flex: 1,
                      },
                    ]}>
                    {item.sorting}
                  </Text>
                </TouchableHighlight>
              );
            })}
          </ScrollView>
        </Animatable.View>
      )}
    </View>
  );
};

export default SortingCard;
