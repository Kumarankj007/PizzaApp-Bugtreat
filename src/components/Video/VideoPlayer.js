import {
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import Video from 'react-native-video';
import appColors from '../../Utilities/appColors';
import {
  fontScalling,
  scrnHeight,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import {Icon} from '../../Utilities/icon';
import {Text} from 'react-native';
import {useStyle} from '../../Utilities/styleSheet';
import {useIsFocused} from '@react-navigation/native';
import Sliders from '@react-native-community/slider';

const {width, height} = Dimensions.get('screen');

const VideoPlayer = ({
  customStyle,
  source,
  uri,
  show = true,
  onOpen = () => {},
  showText,
  onClose = () => {},
  closeShow = true, //ncc
  containerStyle, //ncc
}) => {
  const {commenStyle} = useStyle(); //io
  const appColor = appColors();
  const [sound, setSound] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [fullScrn, setFullScrn] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [paused, setPaused] = useState(true);
  const [leftTap, setLeftTap] = useState(false);
  const [rightTap, setRightTap] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isBuffer, setIsBuffer] = useState(false);
  const [progress, setProgress] = useState({
    currentTime: '',
    seekableDuration: '',
    playableDuration: '',
  });
  const ref = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isFocused = useIsFocused(); // Check if screen is focused

  useEffect(() => {
    if (!isFocused) {
      setPaused(true); // Pause video when screen is not focused
    }
  }, [isFocused]);

  const buttonSize = widthResponse ? 30 : 40;

  // const handleGestureStateChange = event => {
  //   if (event.nativeEvent.state === State.END) {
  //     // Handle touch-up event
  //     if (!autoRotate && event.nativeEvent.translationY < 0) {
  //       Orientation.lockToLandscape();
  //       SystemNavigationBar.navigationHide();
  //       StatusBar.setHidden(true);
  //       setAutoRotate(true);
  //     } else if (autoRotate && event.nativeEvent.translationY > 0) {
  //       // setPaused1(false);
  //       Orientation.lockToPortrait();
  //       SystemNavigationBar.navigationShow();
  //       StatusBar.setHidden(false);
  //       setFullScrn(false);
  //       setAutoRotate(false);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   SystemSetting.getVolume().then(volume => {
  //     setSound(volume);
  //   });
  // }, []);

  // useEffect(() => {
  //   setPaused(false);
  // }, [props.videoUrl]);

  const onLoad = e => {
    setDuration(e.duration);
    setIsBuffer(false);
    setClicked(true);
    setPaused(true);
  };

  const onLoadStart = () => {
    setIsBuffer(true);
  };

  // const onProgress = x => {
  //   setProgress(x);
  //   if (Math.round(x.currentTime) === Math.trunc(x.seekableDuration)) {
  //     if (x.currentTime !== 0) {
  //       if (props.handleSkip) {
  //         props.handleSkip('next');
  //       }
  //     }
  //     ref.current.seek(0);
  //     x.currentTime = 0;
  //     setPaused(true);
  //     setClicked(true);
  //   }
  // };

  // handleFullscrn:
  // const handleFullscrn = () => {
  //   console.log('its work');
  //   setFullScrn(!fullScrn);
  //   setClicked(true);
  //   if (fullScrn) {
  //     // setPaused1(false);
  //     SystemNavigationBar.navigationShow();
  //     StatusBar.setHidden(false);
  //   } else {
  //     StatusBar.setHidden(true);
  //     SystemNavigationBar.navigationHide();
  //   }
  // };
  // handleAutorotate:
  // const handleAutoRotate = () => {
  //   setAutoRotate(!autoRotate);
  //   setClicked(true);
  //   if (autoRotate) {
  //     // setPaused1(false);
  //     Orientation.lockToPortrait();
  //     SystemNavigationBar.navigationShow();
  //     StatusBar.setHidden(false);
  //     setFullScrn(false);
  //   } else {
  //     Orientation.lockToLandscape();
  //     SystemNavigationBar.navigationHide();
  //     StatusBar.setHidden(true);
  //   }
  // };

  // backArrow:
  // const backArrow = () => {
  //   if (autoRotate === false && fullScrn === false) {
  //     props.navigation.goBack();
  //     if (props.dispatch) {
  //       props.dispatch(setVideoPage(false));
  //     }
  //   } else if (autoRotate === true) {
  //     handleAutoRotate();
  //   } else if (fullScrn === true) {
  //     handleFullscrn();
  //   }
  // };

  // backhandler:
  // useEffect(() => {
  //   if (autoRotate === true) {
  //     BackHandler.removeEventListener('hardwareBackPress', () => {
  //       props.navigation.goBack();
  //       return true;
  //     });
  //     BackHandler.addEventListener('hardwareBackPress', () => {
  //       setAutoRotate(!autoRotate);
  //       Orientation.lockToPortrait();
  //       SystemNavigationBar.navigationShow();
  //       StatusBar.setHidden(false);
  //       return true;
  //     });
  //   } else {
  //     BackHandler.addEventListener('hardwareBackPress', () => {
  //       props.navigation.goBack();
  //       if (props.dispatch) {
  //         props.dispatch(setVideoPage(false));
  //       }
  //       return true;
  //     });
  //   }
  //   if (fullScrn == true) {
  //     BackHandler.removeEventListener('hardwareBackPress', () => {
  //       props.navigation.goBack();
  //       return true;
  //     });
  //     BackHandler.addEventListener('hardwareBackPress', () => {
  //       setFullScrn(!fullScrn);
  //       SystemNavigationBar.navigationShow();
  //       StatusBar.setHidden(false);
  //       return true;
  //     });
  //   }
  // }, [autoRotate, fullScrn]);

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  // const format = seconds => {
  //   let mins = parseInt(seconds / 60)
  //     .toString()
  //     .padStart(2, '0');
  //   let secs = (Math.floor(seconds) % 60).toString().padStart(2, '0');
  //   return `${mins}:${secs}`;
  // };
  // const formats = seconds => {
  //   let mins = parseInt(seconds / 60)
  //     .toString()
  //     .padStart(2, '0');
  //   let secs = (Math.trunc(seconds) % 60) - 1;
  //   secs = secs.toString().padStart(2, '0');
  //   return `${mins}:${secs}`;
  // };

  // auto hide controls:
  // useEffect(() => {
  //   clearTimeout(Timeout);
  // }, [progress.currentTime]);

  // Bufferhandle:
  // useEffect(() => {
  //   if (paused == false) {
  //     setIsBuffer(true);
  //   }
  // });
  // useEffect(() => {
  //   if (paused === false) {
  //     setIsBuffer(false);
  //   }
  // }, [progress.currentTime]);

  return (
    <>
      {show ? (
        <View
          style={[
            {
              justifyContent: 'center',
            },
            containerStyle,
          ]}>
          {!paused && (
            <Pressable
              style={{
                width: '100%',
                height: scrnWidth / 1.8,
                position: 'absolute',
                zIndex: 1000,
              }}
              onPress={() => setPaused(true)}
            />
          )}

          {/* Close Button */}
          {closeShow && (
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize,
                backgroundColor: appColor.cardBack,
                position: 'absolute',
                right: '5%',
                zIndex: 1000,
                top: '5%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                ComponentName={'Entypo'}
                name={'cross'}
                size={widthResponse ? 22 : 26}
                color={appColor.primary}
              />
            </TouchableOpacity>
          )}

          {/* Buffer Loader or Pause UI */}
          {isBuffer ? (
            <ActivityIndicator
              size={50}
              color={appColor.white}
              style={{
                height: scrnWidth / 1.8,
                position: 'absolute',
                zIndex: 20,
                width: '100%',
              }}
            />
          ) : (
            paused && (
              <View
                style={{
                  height: scrnWidth / 1.8,
                  position: 'absolute',
                  zIndex: 20,
                  width: '100%',
                  justifyContent: 'center',
                  backgroundColor: appColor.overlayBg,
                }}>
                <TouchableOpacity onPress={() => setPaused(false)}>
                  <Image
                    source={require('../../../assets/images/play_icon.png')}
                    style={{
                      width: '13%',
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
              </View>
            )
          )}

          {/* Video Component */}
          <Video
            ref={ref}
            source={source ? source : {uri: uri}}
            // onLoad={data => {
            //   setDuration(data.duration);
            // }}
            onLoad={onLoad}
            onLoadStart={onLoadStart}
            onProgress={data => setCurrentTime(data.currentTime)}
            muted={muted}
            paused={paused}
            style={[
              {
                width: autoRotate ? '100%' : fullScrn ? scrnWidth : '100%',
                height: autoRotate
                  ? '100%'
                  : fullScrn
                  ? scrnHeight
                  : scrnWidth / 1.8,
                backgroundColor: appColor.bgBlack,
                zIndex: 10,
              },
              customStyle,
            ]}
            resizeMode="contain"
          />
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              width: '100%',
              paddingHorizontal: 10,
              zIndex: 2000,
            }}>
            {/* Time Row */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: -5,
              }}>
              <Text style={{color: 'white', fontSize: 12}}>
                {formatTime(currentTime)}
              </Text>
              <Text style={{color: 'white', fontSize: 12}}>
                {formatTime(duration)}
              </Text>
            </View>
            {/* Slider */}
            <Sliders
              style={{width: '100%', height: 15}}
              minimumValue={0}
              tapToSeek
              maximumValue={duration}
              value={currentTime}
              minimumTrackTintColor="#FFF"
              maximumTrackTintColor="#888"
              thumbTintColor="#FFF"
              onSlidingComplete={value => ref.current.seek(value)}
            />
          </View>

          {/* Video Controls */}
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: -170,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              zIndex: 2000,
            }}>
            <TouchableOpacity onPress={() => setMuted(m => !m)}>
              <Icon
                ComponentName={'MaterialIcons'}
                name={muted ? 'volume-off' : 'volume-up'}
                size={27}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Closed Preview
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
            marginVertical: 10,
          }}>
          {showText && (
            <Text
              style={[
                commenStyle.sideHead,
                {
                  marginBottom: 0,
                  paddingRight: 10,
                  fontSize: fontScalling(2.7),
                },
              ]}>
              {showText}
            </Text>
          )}
          <TouchableOpacity
            onPress={onOpen}
            style={{
              width: widthResponse ? 40 : 60,
              height: widthResponse ? 40 : 60,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: appColor.black,
            }}>
            <Icon
              ComponentName={'Entypo'}
              name={'video'}
              size={widthResponse ? 20 : 30}
              color={appColor.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default VideoPlayer;
