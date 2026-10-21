import React, {useMemo, useRef, useCallback, useEffect} from 'react';
import {BottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {Pressable, Text, View} from 'react-native';
import appColors from '../../Utilities/appColors';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {Icon} from '../../Utilities/icon';
import {appFont} from '../../Utilities/appFont';
import {BottomSheet} from '@rneui/base';
import {useStyle} from '../../Utilities/styleSheet';
import SpinLoader from '../Loader/SpinLoader';

const ModalBottomSheet = ({
  children,
  snapPoints,
  SheetStyle,
  isVisible,
  close,
  old = false,
  swipeClose,
  indicateStyle,
  paywall,
  sheetTitle,
  sheetLoad = false,
}) => {
  const bottomSheetModalRef = useRef(null);
  const {commenStyle} = useStyle();
  const appColor = appColors();

  // Backdrop close:
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        enableTouchThrough={true}
        pressBehavior={'close'}
      />
    ),
    [],
  );

  //---------bottom sheet handlers--------//
  const handleModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  // modal Toggle:
  useEffect(() => {
    if (isVisible) {
      handleModalPress();
    } else {
      handleCloseModalPress();
    }
  }, [isVisible]);

  return (
    <>
      {old ? (
        <BottomSheetModal
          enableDismissOnClose={true}
          ref={bottomSheetModalRef}
          backgroundStyle={{
            backgroundColor: appColor.bgWhite,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
          // enableContentPanningGesture
          // enableDynamicSizing
          // enableHandlePanningGesture
          // enableOverDrag
          index={1}
          snapPoints={useMemo(() => snapPoints, [])}
          style={[
            {
              paddingHorizontal: widthResponse ? 20 : 25,
              paddingVertical: widthResponse ? 20 : 25,
            },
            SheetStyle,
          ]}
          handleComponent={null}
          enablePanDownToClose={swipeClose}
          onDismiss={close}
          backdropComponent={renderBackdrop}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: widthResponse ? 15 : 20,
            }}>
            <Text
              style={{
                fontSize: fontScalling(2.6),
                fontFamily: appFont.lBl,
                color: appColor.textBlack,
              }}>
              {sheetTitle}
            </Text>
            <Pressable
              onPress={() => handleCloseModalPress()}
              style={{
                width: 30,
                height: 30,
                borderRadius: 50,
                // backgroundColor:'#000'
              }}>
              <Icon
                ComponentName={'Ionicons'}
                name={'close'}
                color={appColor.black}
                size={widthResponse ? 28 : 29}
              />
            </Pressable>
          </View>
          {children}
        </BottomSheetModal>
      ) : (
        <BottomSheet
          isVisible={isVisible}
          onBackdropPress={close}
          backdropStyle={{
            backgroundColor: appColor.overlayBg,
          }}
          scrollViewProps={{
            keyboardShouldPersistTaps: 'always',
            bounces: false,
          }}
          // containerStyle={{
          //   paddingTop:widthResponse ? 60 : 80,
          //   // backgroundColor: appColor.bgWhite,
          //     // borderTopLeftRadius:50,
          //     // borderTopRightRadius:50,
          //     // flex:1,
          // }}
        >
          <View
            style={[
              !paywall && commenStyle.container,
              {
                backgroundColor: appColor.bgWhite,
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                paddingBottom: widthResponse ? 30 : 40,
                overflow: 'hidden',
                position: 'relative',
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: widthResponse ? 15 : 20,
                paddingHorizontal: !paywall ? 0 : widthResponse ? 20 : 25,
                paddingTop: widthResponse ? 30 : 50,
              }}>
              <Text
                style={{
                  fontSize: fontScalling(2.2),
                  fontFamily: appFont.lBl,
                  color: appColor.textBlack,
                  flex: 1,
                  textAlign: paywall ? 'center' : 'left',
                }}>
                {sheetTitle}
              </Text>
              <Pressable
                onPress={close}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  // backgroundColor:'#000'
                }}>
                <Icon
                  ComponentName={'Ionicons'}
                  name={'close'}
                  color={appColor.black}
                  size={widthResponse ? 28 : 29}
                />
              </Pressable>
            </View>
            {children}
            {sheetLoad ? (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  zIndex: 2,
                }}>
                <SpinLoader />
              </View>
            ) : null}
          </View>
        </BottomSheet>
      )}
    </>
  );
};

export default ModalBottomSheet;
