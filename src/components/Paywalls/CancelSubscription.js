import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ModalBottomSheet from '../BottomSheet/ModalBottomSheet';
import {RenewContent} from '../../Utilities/contents';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {appFont} from '../../Utilities/appFont';
import {
  euro,
  fontScalling,
  print,
  widthResponse,
} from '../../Utilities/helperFunction';
import TickList from '../Cards/TickList';
import PrimaryButton from '../Buttons/PrimaryButton';
import {useDispatch, useSelector} from 'react-redux';
import {setCancelSheet} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import {userSettingApi} from '../../Redux/AuthSlice';
import ModalPopup from '../Modal/ModalPopup';
import SpinLoader from '../Loader/SpinLoader';

const CancelSubscription = ({visible, content, load}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const dispatch = useDispatch();
  const [bodyload, setBodyLoad] = useState(false);
  const {setters, deviceId, userId} = useSelector(state => state.appSettings);
  const [cancelContent, setCancelContent] = useState({});

  // console.log(visible, 'visible');

  const [cancelpop, setCancelpop] = useState(false);
  useEffect(() => {
    if (visible) {
      apiCall();
    }
  }, [setters?.language, visible]);

  // apicall for payment
  const apiCall = async (del = 0) => {
    try {
      const formdata = new FormData();
      if (setters && setters?.language?.language_code && userId) {
        formdata.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
        formdata.append('user_id', userId);
      }
      formdata.append('delete', del);
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      setBodyLoad(true);
      const response = await fetch(Url().subscriptionCancel, requestOptions);
      const resparse = await response.json();
      if (response.status == 200) {
        if (resparse.status == 'success') {
          setCancelContent(resparse?.data);
          if (del == 1) {
            setCancelpop(false);
            dispatch(setCancelSheet(false));
            dispatch(userSettingApi());
          }
        }
      }
      setBodyLoad(false);
    } catch (error) {
      console.log(error, 'error in cancel payment api');
      setBodyLoad(false);
    }
  };

  const cancelSubscriptionapiCall = async () => {
    try {
      const formdata = new FormData();
      if (setters && setters?.language?.language_code && userId) {
        formdata.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
        formdata.append('user_id', userId);
      }
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      const response = await fetch(Url().subscription_cancel, requestOptions);
      const resparse = await response.json();
      if (response.status == 200) {
        if (resparse.status == 'success') {
          setCancelpop(false);
          dispatch(setCancelSheet(false));
          dispatch(userSettingApi());
        }
      }
    } catch (error) {
      console.log(error, 'error in cancel payment api');
    }
  };
  return (
    <>
      <ModalBottomSheet
        close={() => dispatch(setCancelSheet(false))}
        snapPoints={['50%', '50%']}
        isVisible={visible}
        sheetTitle={content?.cancellation?.title}>
        {!bodyload ? (
          <>
            {/* date detail */}
            <View
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: appColor.cardbg,
                marginBottom: 20,
              }}>
              {cancelContent?.date && (
                <Text
                  style={[
                    {
                      fontFamily: appFont.lBl,
                      color: appColor.black,
                      fontSize: fontScalling(3),
                      textAlign: 'center',
                      padding: 10,
                      paddingBottom: 4,
                    },
                  ]}>
                  {cancelContent?.date}
                </Text>
              )}

              {cancelContent?.rate && cancelContent?.duration && (
                <Text
                  style={[
                    // commenStyle.checkLabel,
                    {
                      marginBottom: widthResponse ? 7 : 10,
                      textAlign: 'center',
                      color: appColor.boldBlacktext,
                    },
                  ]}>{`${euro(cancelContent.rate)} / ${
                  cancelContent.duration
                }`}</Text>
              )}
              {content?.cancellation?.sub_title && (
                <Text
                  style={[
                    {
                      fontFamily: appFont.lB,
                      color: appColor.black,
                      fontSize: fontScalling(2),
                      textAlign: 'center',
                      padding: 10,
                      backgroundColor: appColor.borderColor,
                    },
                  ]}>
                  {content?.cancellation?.sub_title}
                </Text>
              )}
            </View>

            {/* content  */}
            {content?.cancellation?.description && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: widthResponse ? 10 : 14,
                  },
                ]}>
                {content?.cancellation?.description}
              </Text>
            )}
            {/* ticks */}
            {cancelContent?.points && cancelContent?.points.length > 0 && (
              <TickList list={cancelContent?.points} />
            )}
            {/* button */}
            {content?.cancellation?.button && (
              <PrimaryButton
                text={content?.cancellation?.button}
                style={{
                  marginTop: 20,
                }}
                onPress={() => setCancelpop(true)}
              />
            )}
          </>
        ) : (
          <SpinLoader />
        )}
        {/* cancel popup */}
        <ModalPopup
          visible={cancelpop}
          onBackButtonPress={() => setCancelpop(false)}
          onBackdropPress={() => setCancelpop(false)}
          onClosePress={() => setCancelpop(false)}>
          {content?.cancellation?.cancel_popup?.question && (
            <Text style={[commenStyle.sideHead, {textAlign: 'center'}]}>
              {content?.cancellation?.cancel_popup?.question}
            </Text>
          )}

          <View
            style={[
              commenStyle.hFlex,
              {
                justifyContent: 'center',
              },
            ]}>
            {content?.cancellation?.cancel_popup?.yes && (
              <PrimaryButton
                modal
                text={content?.cancellation?.cancel_popup?.yes}
                style={{
                  marginRight: 10,
                }}
                onPress={() => cancelSubscriptionapiCall()}
              />
            )}
            {content?.cancellation?.cancel_popup?.no && (
              <PrimaryButton
                modal
                invert
                text={content?.cancellation?.cancel_popup?.no}
                onPress={() => setCancelpop(false)}
              />
            )}
          </View>
        </ModalPopup>
      </ModalBottomSheet>
    </>
  );
};

export default CancelSubscription;

const styles = StyleSheet.create({});
