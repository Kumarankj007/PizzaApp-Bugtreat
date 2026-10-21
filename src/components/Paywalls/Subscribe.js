import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import ModalBottomSheet from '../BottomSheet/ModalBottomSheet';
import {PaywallContent} from '../../Utilities/contents';
import {
  euro,
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {appFont} from '../../Utilities/appFont';
import PrimaryButton from '../Buttons/PrimaryButton';
import Usp from '../Cards/Usp';
import SliderCaousel from '../Carousel/SliderCaousel';
import NavButton from '../Buttons/NavButton';
import {useDispatch, useSelector} from 'react-redux';
import {setPaywallSheet} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import {Toast} from 'react-native-toast-notifications';

const Subscribe = ({visible, content, load}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState(0);
  const [monthIndex, setMonthIndex] = useState(0);
  const [yearIndex, setYearIndex] = useState(0);
  const {setters, deviceId, userId} = useSelector(state => state.appSettings);
  const [btnload, setbtnLoad] = useState(false);

  const monthFlatRef = useRef(null);
  const yearFlatRef = useRef(null);

  const {styles} = pageStyle();

  const PaymentBlock = ({data}) => {
    const handleMonthNext = () => {
      // console.log('mn nx');
      const nextIndex = monthIndex + 1;
      monthFlatRef.current?.scrollToIndex({
        index: nextIndex,
      });
      setMonthIndex(nextIndex);
    };
    const handleMonthPrev = () => {
      // console.log('mn prv');
      const prevIndex = monthIndex - 1;
      monthFlatRef.current?.scrollToIndex({
        index: prevIndex,
      });
      setMonthIndex(prevIndex);
    };

    const handleYearNext = () => {
      // console.log('ye nx');

      const nextIndex = yearIndex + 1;
      yearFlatRef.current?.scrollToIndex({
        index: nextIndex,
      });
      setYearIndex(nextIndex);
    };
    const handleYearPrev = () => {
      // console.log('ye prv');
      const prevIndex = yearIndex - 1;
      yearFlatRef.current?.scrollToIndex({
        index: prevIndex,
      });
      setYearIndex(prevIndex);
    };

    const buttonShow = data?.length > 1;

    // apicall for payment
    const apiCall = async planId => {
      try {
        const formdata = new FormData();
        // if (setters && setters?.language?.language_code && userId) {
        //   formdata.append(
        //     'lcode',
        //     setters?.language?.language_code
        //       ? setters?.language?.language_code
        //       : 'nl',
        //   );
        //   formdata.append('user_id', userId);
        // }
        // formdata.append('plan_id', planId);
        const data = JSON.stringify({
          lcode: setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
          user_id: userId,
          plan_id: planId,
        });
        // formdata.append('value', JSON.stringify(data));

        const requestOptions = {
          method: 'POST',
          body: data,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        };
        setbtnLoad(true);

        const response = await fetch(Url().paywallConnect, requestOptions);
        // print(response, 'resp');
        const resparse = await response.json();
        if (response.status == 200) {
          if (resparse.status == 'success') {
            if (resparse?.data?.redirect_url) {
              Linking.openURL(resparse?.data?.redirect_url);
            }
            dispatch(setPaywallSheet(false));
          }
        }
        setbtnLoad(false);
      } catch (error) {
        console.log(error, 'error in payment api');
        setbtnLoad(false);
      }
    };
    return (
      <View
        style={{
          position: 'relative',
        }}>
        {data && data.length > 0 && (
          <FlatList
            ref={activeButton == 0 ? monthFlatRef : yearFlatRef}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={data}
            pagingEnabled
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <View
                  key={index}
                  style={{
                    width: scrnWidth,
                  }}>
                  {/* usps */}
                  {item?.point && item?.point.length > 0 && (
                    <View
                      style={[
                        commenStyle.container,
                        {
                          flexWrap: 'wrap',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          marginBottom: widthResponse ? 15 : 25,
                        },
                      ]}>
                      {item?.point.map((item, id) => {
                        return <Usp key={id} text={item} />;
                      })}
                    </View>
                  )}
                  {/* mid block */}
                  <View
                    style={[
                      commenStyle.container,
                      {
                        paddingVertical: widthResponse ? 20 : 30,
                        alignItems: 'center',
                        backgroundColor: appColor.cardbg,
                      },
                    ]}>
                    {item?.planCost && (
                      <Text
                        style={[
                          {
                            fontFamily: appFont.lBl,
                            color: appColor.black,
                            fontSize: fontScalling(4),
                            marginBottom: 6,
                          },
                        ]}>
                        {euro(item?.planCost)}
                      </Text>
                    )}

                    {content?.subscription?.per_year &&
                      content?.subscription?.per_month && (
                        <Text style={[commenStyle.para]}>
                          {activeButton == 0
                            ? content?.subscription?.per_month
                            : content?.subscription?.per_year}
                        </Text>
                      )}
                    {/* subscribe text */}
                    {item?.plan_id && (
                      <PrimaryButton
                        onPress={() => apiCall(item.plan_id)}
                        text={
                          btnload
                            ? content?.redirect_message
                            : content?.subscription?.button
                        }
                        style={{
                          width: '100%',
                        }}
                      />
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}
        {/* {buttonShow && (
            <Pressable
              style={[
                styles.button,
                {
                  left: widthResponse ? 20 : 30,
                },
              ]}
              onPress={activeButton == 0 ? handleMonthPrev : handleYearPrev}>
              <Text>prev</Text>
            </Pressable>
          )}
          {buttonShow && (
            <Pressable
              style={[
                styles.button,
                {
                  right: widthResponse ? 20 : 30,
                },
              ]}
              onPress={activeButton == 0 ? handleMonthNext : handleYearNext}>
              <Text>next</Text>
            </Pressable>
          )} */}
      </View>
    );
  };

  const Navtabs = ({button}) => {
    switch (button) {
      case 0:
        return <PaymentBlock data={content?.subscription?.month} />;
      case 1:
        return <PaymentBlock data={content?.subscription?.year} />;
    }
  };

  return (
    <>
      <ModalBottomSheet
        close={() => dispatch(setPaywallSheet(false))}
        snapPoints={['65%', '65%']}
        isVisible={visible}
        sheetTitle={content?.subscription?.pageTitle}
        paywall>
        <NavButton
          dual
          title={content?.subscription?.tab_titles}
          onPress={setActiveButton}
          activeButtons={activeButton}
        />
        {/* top block */}
        {content?.subscription?.sliderImage &&
          content?.subscription?.sliderImage.length > 0 && (
            <View
              style={{
                paddingVertical: widthResponse ? 15 : 25,
                // backgroundColor: appColor.ToastInfoBack,
              }}>
              {/* pizza caousel */}
              <SliderCaousel
                data={content?.subscription?.sliderImage}
                containerStyle={{
                  // marginBottom: 20,
                  height: widthResponse ? 100 : 150,
                }}
              />
            </View>
          )}

        <Navtabs button={activeButton} />

        {/* last block */}
        <View
          style={[
            commenStyle.container,
            {
              paddingVertical: widthResponse ? 15 : 25,
              alignItems: 'center',
            },
          ]}>
          {content?.subscription?.disclaimer?.title && (
            <Text
              style={[
                commenStyle.sideHead,
                {
                  textTransform: 'uppercase',
                  fontSize: fontScalling(2),
                  marginBottom: 5,
                },
              ]}>
              {content?.subscription?.disclaimer?.title}
            </Text>
          )}
          {content?.subscription?.disclaimer?.text && (
            <Text
              style={[
                commenStyle.para,
                {
                  textAlign: 'center',
                  paddingHorizontal: 10,
                  marginBottom: 0,
                },
              ]}>
              {content?.subscription?.disclaimer?.text}
            </Text>
          )}
        </View>
      </ModalBottomSheet>
    </>
  );
};

export default Subscribe;

const pageStyle = () => {
  const dimen = widthResponse ? 40 : 60;
  const appColor = appColors();
  const styles = StyleSheet.create({
    button: {
      position: 'absolute',
      top: '37%',
      justifyContent: 'center',
      alignItems: 'center',
      width: dimen,
      height: dimen,
      borderRadius: dimen,
      backgroundColor: appColor.TextInputborderbg,
    },
  });
  return {styles};
};
