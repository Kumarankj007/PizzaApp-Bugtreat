import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Icon} from '../../Utilities/icon';
import appColors from '../../Utilities/appColors';
import {backPress, widthResponse} from '../../Utilities/helperFunction';
import Modal from 'react-native-modal';
import {Camera, CameraType} from 'react-native-camera-kit';

export default Scanner = ({
  isVisible,
  barcodeReceived = () => {},
  setScannerSheet = () => {},
}) => {
  // styles:
  const {styles} = pageStyle();
  const appColor = appColors();

  const [flash, setFlash] = useState(false);
  const navigation = useNavigation();

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={isVisible}
        backdropColor={appColor.overlayBg}
        // onBackdropPress={() => {
        //   setScannerSheet(false);
        // }}
        onBackButtonPress={() => setScannerSheet(false)}
        backdropOpacity={1}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{flex: 1, alignItems: 'center'}}>
          {/* close and flash btn */}
          <View
            style={[
              styles.fRow,
              {
                marginTop: 20,
              },
            ]}>
            <Pressable onPress={() => setFlash(!flash)}>
              <Icon
                ComponentName={'MaterialCommunityIcons'}
                name={flash ? 'flashlight' : 'flashlight-off'}
                color={appColor.bgWhite}
                size={widthResponse ? 30 : 40}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setScannerSheet(false);
                setFlash(false);
              }}>
              <Icon
                ComponentName={'FontAwesome'}
                name={'close'}
                color={appColor.bgWhite}
                size={widthResponse ? 30 : 40}
              />
            </Pressable>
          </View>
          {/* scanner */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 50,
            }}>
            <Camera
              scanBarcode={true}
              style={{width: widthResponse ? 250 : 300, height: widthResponse ? 230 : 300}}
              flashMode={flash ? 'on' : 'off'}
              cameraType={CameraType.Back}
              onError={e => {
                Alert.alert('Error', String(e));
              }}
              onReadCode={barcodeReceived} // optional
              showFrame={true}
              laserColor={appColor.bgWhite} // (default red) optional, color of laser in scanner frame
              frameColor={appColor.ToastError} // (default white) optional, color of border of scanner frame
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    fRow: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
  });
  return {styles};
};
