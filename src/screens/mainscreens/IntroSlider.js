import {
  Animated,
  Button,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUserStatus} from '../../Redux/AuthSlice';
import {useNavigation} from '@react-navigation/native';
import appColors from '../../Utilities/appColors';
import {
  Capitalize,
  fontScalling,
  print,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {useStyle} from '../../Utilities/styleSheet';
import {appFont} from '../../Utilities/appFont';
import Carousel from 'react-native-reanimated-carousel';
import {interpolate} from 'react-native-reanimated';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CarDots from '../../components/Cards/CarDots';
import PageLoader from '../../components/Loader/PageLoader';
import {Url} from '../../Utilities/appApi';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const IntroSlider = () => {
  const [introContent, setIntroContent] = useState({});
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const width = widthResponse ? 15 : 20;
  const {setters, deviceId} = useSelector(State => State.appSettings);
  const safeArea = useSafeAreaInsets();

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const carouselRef = useRef(null);
  const buttonRef = useRef(null);

  const handleCarouselScroll = index => {
    setActiveIndex(index);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
    buttonRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const itemSize = scrnWidth / 2;

  // const centerOffset = scrnWidth / 2.6 - scrnHeight / 6;
  const centerOffset = 0; //@@

  const animationStyle = React.useCallback(
    value => {
      'worklet';

      const itemGap = interpolate(
        value,
        [-3, -2, -1, 0, 1, 2, 3],
        [-30, -15, 0, 0, 0, 15, 30],
      );

      const translateX =
        interpolate(
          value,
          [-1, 0, 1],
          [-itemSize - width, 0, itemSize + width],
        ) +
        centerOffset -
        itemGap;

      const translateY = interpolate(
        value,
        [-1, -0.5, 0, 0.5, 1],
        [60, 45, 30, 45, 60],
      );

      const scale = interpolate(
        value,
        [-1.5, -0.5, 0, 0.5, 1],
        [0.8, 0.85, 1.1, 0.85, 0.8],
      );

      return {
        transform: [
          {
            translateX,
          },
          {
            translateY,
          },
          {scale},
        ],
      };
    },
    [centerOffset],
  );

  const handleNext = () => {
    const nextIndex = activeIndex + 1;

    if (introContent?.slides && nextIndex < introContent.slides.length) {
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      buttonRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      carouselRef.current?.scrollTo({index: nextIndex, animated: true});
    } else {
      dispatch(setUserStatus(2));
      navigation.navigate('bottomTab');
    }
  };

  // apicall for introslider
  const apiCall = async () => {
    try {
      const formdata = new FormData();
      formdata.append(
        'lcode',
        setters?.language?.language_code
          ? setters?.language?.language_code
          : 'nl',
      );
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      setLoad(true);
      const response = await fetch(Url().introSlider, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse,"resp")
        if (resparse.status == 'success') {
          setIntroContent(resparse?.data);
        }
      }
      setLoad(false);
    } catch (error) {
      console.log(error, 'error in privacy policy');
      setLoad(false);
    }
  };

  // page enter api call
  useEffect(() => {
    apiCall();
    visitorApiCall();
  }, []);

  // visitor api call
  const visitorApiCall = async () => {
    try {
      const formdata = new FormData();
      if (deviceId) formdata.append('uuId', deviceId);
      formdata.append('deviceId', deviceId);
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      // print(formdata, 'formdata');

      const response = await fetch(Url().appVisitor, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resp');
        if (resparse.status == 'success') {
        }
      }
    } catch (error) {
      console.log(error, 'error in app visitor api call ');
    }
  };

  return (
    <>
      {!load ? (
        <View
          style={{
            flex: 1,
            paddingTop: safeArea.top + 20, //@@
            position: 'relative',
          }}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={'transparent'}
            translucent
          />
          {/* slider list */}
          <View
            style={{
              flex: 1,
            }}>
            {introContent?.slides && introContent?.slides.length > 0 && (
              <FlatList
                horizontal
                ref={flatListRef}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                data={introContent.slides}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        width: scrnWidth,
                        paddingHorizontal: width,
                        height: scrnWidth / (widthResponse ? 1 : 1.8) - 100,
                        // backgroundColor:appColor.TextInputborderbg
                      }}>
                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                          paddingBottom: widthResponse ? 30 : 40,
                        }}>
                        {/* subtitle */}
                        {item.subtitle && (
                          <Text
                            style={[
                              styles.center,
                              {
                                fontFamily: appFont.lB,
                                fontSize: fontScalling(1.8),
                                color: appColor.Textlightblack,
                                marginBottom: fontScalling(1.6),
                                letterSpacing: 2,
                              },
                            ]}>
                            {Capitalize(item.subtitle)}
                          </Text>
                        )}

                        {/* title */}
                        {item.title && (
                          <Text
                            style={[
                              styles.center,
                              {
                                fontFamily: appFont.pDSb,
                                fontSize: fontScalling(3.7),
                                color: appColor.black,
                                marginBottom: fontScalling(2),
                              },
                            ]}>
                            {item.title}
                          </Text>
                        )}

                        {/* paragraph */}
                        {item.content && (
                          <Text
                            style={[
                              styles.center,
                              commenStyle.para,
                              {
                                marginBottom: 0,
                              },
                            ]}>
                            {item.content}
                          </Text>
                        )}
                      </ScrollView>
                    </View>
                  );
                }}
              />
            )}
          </View>

          {/* icons */}
          <View
            style={{
              flex: 1,
              paddingTop: widthResponse ? 40 : 150, //@@
              paddingBottom: 50,
            }}>
            {introContent?.slides && introContent?.slides.length > 0 && (
              <Carousel
                width={scrnWidth}
                height={widthResponse ? scrnWidth : scrnHeight / 2.2} //@@
                ref={carouselRef}
                loop={false}
                data={introContent.slides}
                customAnimation={animationStyle}
                onSnapToItem={handleCarouselScroll}
                style={{
                  marginTop: widthResponse ? -70 : -scrnHeight / 7, //@@
                }}
                renderItem={({item, index}) => {
                  return (
                    <View
                      key={index}
                      id="carousel-component"
                      dataSet={{kind: 'custom-animations', name: 'circular'}}
                      style={{
                        alignItems: 'center',
                      }}>
                      <View
                        style={[
                          styles.logo,
                          {
                            padding: item.logo ? 0 : widthResponse ? 30 : 45,
                            backgroundColor: item.logo
                              ? 'transparent'
                              : appColor.bgWhite,
                          },
                        ]}>
                        {item.image && item.image != '' && (
                          <Image
                            source={{uri: item.image}}
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            )}

            {/* buttons and pagination */}
            <View>
              {/* button */}
              {introContent?.slides && introContent?.slides.length > 0 && (
                <FlatList
                  horizontal
                  ref={buttonRef}
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                  data={introContent.slides}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        key={index}
                        style={{
                          width: scrnWidth,
                          paddingHorizontal: width,
                        }}>
                        {item.button && (
                          <PrimaryButton
                            text={item.button}
                            onPress={handleNext}
                          />
                        )}
                      </View>
                    );
                  }}
                />
              )}

              {/* pagination */}
              {introContent?.slides && introContent?.slides.length > 0 && (
                <CarDots
                  datas={introContent?.slides}
                  currentIndex={activeIndex}
                  activeButtonWidth={widthResponse ? 40 : 50}
                />
              )}
            </View>
          </View>

          {/* bottom color */}
          <View
            style={{
              backgroundColor: appColor.primaryLight,
              position: 'absolute',
              bottom: -130,
              left: -90,
              right: -90,
              borderTopLeftRadius: 400,
              borderTopRightRadius: 400,
              height: scrnHeight / 1.8,
              zIndex: -1,
            }}
          />
          {/* bottom color */}
        </View>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default IntroSlider;

const pageStyle = () => {
  const appColor = appColors();
  const width = scrnWidth / (widthResponse ? 2 : 2.5);
  const styles = StyleSheet.create({
    center: {
      textAlign: 'center',
    },
    logo: {
      width: width,
      height: width,
      borderRadius: width,
      backgroundColor: appColor.bgWhite,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return {styles};
};
