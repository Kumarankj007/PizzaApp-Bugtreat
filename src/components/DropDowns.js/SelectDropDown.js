import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Animatable from 'react-native-animatable';
import {appFont} from '../../Utilities/appFont';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import {Icon} from '../../Utilities/icon';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import {useStyle} from '../../Utilities/styleSheet';
import Modal from 'react-native-modal';

const SelectDropDown = ({
  parentZindex = 4,
  label,
  placeholder,
  datas,
  language = false,
  value = '',
  bottomSheet = false,
  onChange = () => {},
  top,
  contStyle,
  error,
  dropHide,
  zIndex = 1,
  dark, //
  country = false, //
  horizontal = false,
  nodrop = false,
  weight = false,
  temperature = false,
  withOutDrop,
  recipe,
  modal = false,
  sorting,
  saveRecipe,
  dropStyle,
  borderRadius = 30,
  onPress = () => {},
  formError,
}) => {
  const [drop, setDrop] = useState(false);
  const [active, setActive] = useState(false);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const keyboardVisible = KeyboardVisible().valueOf();

  // print(value, 'value');

  useEffect(() => {
    if (dropHide || keyboardVisible) {
      setDrop(false); //
    }
  }, [dropHide, keyboardVisible]);

  const DropContent = ({item, index}) => {
    return (
      <TouchableHighlight
        delayLongPress={2000}
        onPress={() => {
          setDrop(!drop);
          onChange(item);
        }}
        key={index}
        underlayColor={modal ? 'transparent' : appColor.lightGreyLine}
        style={{
          padding: modal ? (!widthResponse ? 18 : 20) : widthResponse ? 10 : 15,
          marginBottom:
            recipe || !modal ? 0 : horizontal ? 0 : widthResponse ? 7 : 12,
          paddingHorizontal: modal
            ? !widthResponse
              ? 18
              : 20
            : widthResponse
            ? 10
            : 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <>
          {item?.flag && (
            <Image
              source={!country ? {uri: item.flag} : item.flag}
              resizeMode="cover"
              style={{
                width: widthResponse ? 18 : 30,
                height: widthResponse ? 18 : 30,
                borderRadius: 50,
                marginRight: 10,
              }}
            />
          )}
          <Text
            style={{
              fontSize: fontScalling(2),
              color: appColor.black,
              fontFamily: appFont.lR,
              flex: 1,
              lineHeight: fontScalling(2.3),
            }}>
            {language
              ? item.language //
              : country
              ? item.country
              : weight
              ? `${item.unit} ( ${item.ushort} )`
              : temperature
              ? `${item.temperature} ( ${item.tshort} )`
              : sorting
              ? item.sorting
              : item}
          </Text>
          {modal && (
            <View
              style={{
                width: widthResponse ? 17 : 28,
                height: widthResponse ? 17 : 28,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: appColor.primary,
                overflow: 'hidden',
              }}>
              {((language && item.language == value.language) ||
                (country && item.country == value.country) ||
                (weight && item.weight == value.weight) ||
                (temperature && item.temperature == value.temperature) ||
                (sorting && item.sorting == value.sorting) ||
                (typeof value == 'string' && value === item)) && (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: appColor.primary,
                    margin: widthResponse ? 3 : 5,
                    borderRadius: 50,
                  }}></View>
              )}
            </View>
          )}
        </>
      </TouchableHighlight>
    );
  };
  const styleDrop = {
    position: 'absolute',
    top: top ? '' : widthResponse ? 50 : 70,
    bottom: top ? (widthResponse ? 50 : 70) : '',
  };
  return (
    <View
      style={[
        {
          marginBottom: recipe ? 0 : widthResponse ? 13 : 20,
          flexWrap: horizontal ? 'wrap' : 'nowrap',
          flexDirection: horizontal ? 'row' : 'column',
          zIndex: parentZindex,
        },
        contStyle,
      ]}>
      {/* label */}
      {!saveRecipe && (
        <Text
          style={{
            fontFamily: appFont.lB,
            fontSize: fontScalling(2),
            marginBottom: recipe ? 0 : horizontal ? 0 : widthResponse ? 7 : 12,
            color: dark ? appColor.white : appColor.textBlack, //
            marginRight: horizontal ? 15 : 0,
            marginTop: horizontal ? 10 : 0,
          }}>
          {label && label}
        </Text>
      )}
      <View
        style={[
          {
            position: 'relative',
            flex: 1,
            // zIndex: 3,
          },
          // parentZindex,
        ]}>
        <Pressable
          onPress={nodrop ? onPress : () => setDrop(!drop)}
          style={{
            backgroundColor: dark ? appColor.white : appColor.smokeBack, //
            borderRadius: borderRadius,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 17,
            paddingVertical: widthResponse ? 13.5 : 16,
          }}>
          {(language || country) &&
            value?.flag && ( //
              <Image
                source={{uri: value.flag}}
                style={{
                  width: widthResponse ? 20 : 30,
                  height: widthResponse ? 20 : 30,
                  borderRadius: 50,
                  marginRight: 10,
                }}
                resizeMode="cover"
              />
            )}
          <Text
            style={{
              flex: 1,
              fontSize: fontScalling(2),
              color: value ? appColor.black : appColor.placeHolderText, //
              fontFamily: appFont.lR,
              lineHeight: fontScalling(2.5),
            }}>
            {value
              ? language
                ? value.language
                : country
                ? value
                : weight
                ? `${value.unit} ( ${value.ushort} )`
                : temperature
                ? `${value.temperature} ( ${value.tshort} )`
                : sorting
                ? value.sorting
                : value
              : placeholder}
          </Text>
          <Icon
            ComponentName={'FontAwesome6'}
            name={drop ? 'chevron-up' : 'chevron-down'}
            color={appColor.black}
            size={16}
          />
        </Pressable>
        {/* form errors */}
        {formError && (
          <Text
            style={{
              marginTop: 3,
              marginLeft: 3,
              color: appColor.formError,
              fontSize: fontScalling(1.45),
              fontFamily: appFont.lR,
            }}>
            {formError.message}
          </Text>
        )}
        {drop && modal == false && (
          <View
            style={[
              nodrop ? null : withOutDrop ? null : styleDrop,
              {
                backgroundColor: appColor.white,
                borderRadius: 10,
                borderWidth: nodrop ? 1 : 0,
                borderColor: appColor.borderColor,
                zIndex: 3,
                width: '100%',
                // overflow: 'hidden',
                height: datas?.length > 6 ? 150 : 'auto',
                shadowColor: appColor.bgBlack,
                shadowOpacity: 0.2,
                shadowRadius: 5,
              },
              dropStyle,
            ]}>
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'always'}
              style={{
                borderRadius: 10,
                overflow: 'hidden',
              }}
              showsHorizontalScrollIndicator={false} //@@
            >
              {datas?.length > 0 &&
                datas?.map((item, index) => {
                  return <DropContent item={item} index={index} key={index} />;
                })}
            </ScrollView>
          </View>
        )}
        {error && (
          <Text
            style={{
              marginTop: 3,
              color: appColor.formError,
              fontSize: fontScalling(1.45),
              fontFamily: appFont.lR,
            }}>
            {error.message}
          </Text>
        )}
      </View>
      {/* modal popup */}
      {drop && modal == true && (
        <Modal
          visible={drop}
          animationType="slide"
          onBackdropPress={() => setDrop(false)}
          backdropColor={appColor.overlayBg}
          backdropOpacity={1}
          transparent={true}
          isVisible={drop}
          onBackButtonPress={() => setDrop(false)}>
          <SafeAreaView
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            {datas && datas?.length > 0 && (
              <FlatList
                data={datas}
                showsVerticalScrollIndicator={false}
                style={{
                  backgroundColor: appColor.white,
                  width: '100%',
                  borderRadius: widthResponse ? 10 : 20,
                }}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={{
                        width: '100%',
                        height: modal ? (widthResponse ? 1 : 2) : 0,
                        backgroundColor: appColor.placeHolderText,
                      }}></View>
                  );
                }}
                renderItem={({item, index}) => {
                  return <DropContent item={item} index={index} key={index} />;
                }}
              />
            )}
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
};

export default SelectDropDown;

const styles = StyleSheet.create({});
