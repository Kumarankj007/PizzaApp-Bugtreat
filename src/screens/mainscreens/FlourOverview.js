import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import ImageCropPicker from 'react-native-image-crop-picker';

import {useStyle} from '../../Utilities/styleSheet';
import RightButtonCard from '../../components/Cards/RightButtonCard';
import {
  fontScalling,
  permissionAlert,
  print,
  requestCameraPermission,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import SortingCard from '../../components/Cards/SortingCard';
import {countries} from '../../Utilities/contents';
import FlourCard from '../../components/Cards/FlourCard';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import appColors from '../../Utilities/appColors';
import Scanner from '../../components/Modal/Scanner';
import {InputText} from '../../components/InputFields/InputText';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import {appFont} from '../../Utilities/appFont';
import {Icon} from '../../Utilities/icon';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import {useDispatch, useSelector} from 'react-redux';
import {setOptions, setTitle, setTitleLoad} from '../../Redux/HeaderSlice';
import PageLoader from '../../components/Loader/PageLoader';
import {Url} from '../../Utilities/appApi';
import CountryPick from '../../components/Modal/CountryPick';
import ModalPopup from '../../components/Modal/ModalPopup';
import SearchCard from '../../components/Cards/SearchCard';
import SpinLoader from '../../components/Loader/SpinLoader';
import {FlourCardShimmer} from '../../Utilities/appShimmer';
import {useIsFocused} from '@react-navigation/native';
import Empty from '../../components/Loader/Empty';
import {useToast} from 'react-native-toast-notifications';
import {RESULTS} from 'react-native-permissions';

export default FlourOverview = ({navigation, route}) => {
  const [load, setLoad] = useState(false);
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const {styles} = pageStyle();
  const separator = widthResponse ? 20 : 25;
  const textFocus = useRef(null);
  const {setters, deviceId, userId} = useSelector(State => State.appSettings);
  const dispatch = useDispatch();
  const keyboardVisible = KeyboardVisible().valueOf();
  const [countryShow, setCountryShow] = useState(false);
  const isFocus = useIsFocused();
  const [requestSheet, setRequestSheet] = useState(false);
  const [sortType, setSortType] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [dropHide, setDropHide] = useState(false);
  const [imgUploadBtn, setImgUploadBtn] = useState(false);
  const [overviewContent, setOverviewContent] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [searchModal, setSearchModal] = useState(false);
  const {searchData, country, mills} = route.params && route.params;
  const toast = useToast();
  const numColumns = widthResponse ? 2 : 3; //@@

  const [start, setStart] = useState(0);
  const [flourData, setFlourData] = useState({
    flours: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });
  const [refresh, setRefresh] = useState(false);
  const [flourLoad, setFlourLoad] = useState(false);
  const [hide, setHide] = useState(false);

  // print(mills)
  useEffect(() => {
    if (keyboardVisible) {
      setDropHide(false); //
    }
  }, [keyboardVisible]);

  // Request for Flour:
  const schema = yup.object().shape({
    flourName: yup.string().required('Geef een bloemnaam op'),
    millName: yup.string(),
    flourWeight: yup.string(),
    barCode: yup.object(),
    Country: yup.object(),
    flourImage: yup
      .mixed()
      .required('Een bloemafbeelding is vereist')
      .test('fileType', 'Niet-ondersteund bestandsformaat', value => {
        if (!value) return false;
        const supportedFormats = ['image/jpeg', 'image/png'];
        return supportedFormats.includes(value.type);
      }),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors, isValid},
    watch,
  } = useForm({resolver: yupResolver(schema)});

  const currentValues = watch();

  const barcodeReceived = e => {
    const data = e?.nativeEvent?.codeStringValue
      ? e?.nativeEvent?.codeStringValue
      : '';
    const type = e?.nativeEvent?.codeFormat ? e?.nativeEvent?.codeFormat : '';
    // console.log(e, 'datas');
    if (data != '' && type != '') {
      const scanData = {data: data, type: type};
      setValue('barCode', scanData);
    }
    setScanModal(false);
  };

  // set country:
  const handleCountry = val => {
    setValue('Country', val);
  };

  const OpenCamera = async () => {
    ImageCropPicker.openCamera({
      mediaType: 'photo',
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        let fileName = 'FlourImg.' + image.mime.split('/')[1];
        setValue('flourImage', {
          name: fileName,
          uri: image.path,
          type: image.mime,
        });
      })
      .catch(error => {
        console.log(error);
        if (error.message == 'User did not grant camera permission.') {
          permissionAlert('Camera');
        }
      });
  };

  const OpenGallery = async () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        let fileName = 'FlourImg.' + image.mime.split('/')[1];
        setValue('flourImage', {
          name: fileName,
          uri: image.path,
          type: image.mime,
        });
      })
      .catch(error => {
        console.log(error);
        if (error.message == 'User did not grant library permission.') {
          permissionAlert('Gallery');
        }
      });
  };

  // mill filter function
  const millFilter = txt => {
    if (txt && txt.trim() !== '') {
      const data =
        mills &&
        mills.length > 0 &&
        mills.filter(val =>
          val.millName.toLowerCase().includes(txt.toLowerCase()),
        );
      setFilteredData(data);
    } else {
      setFilteredData([]);
    }
  };

  // overView Content content apicall
  const overViewContentApicall = async () => {
    try {
      const formdata = new FormData();
      if (setters && setters?.language?.language_code) {
        formdata.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }
      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      setLoad(true);
      // setFlourLoad(true);
      dispatch(setTitleLoad(true));
      const response = await fetch(Url().flourOverviewContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse,"resp")
        if (resparse.status == 'success') {
          setOverviewContent(resparse.data);
          // print(overviewContent,"esea")
          navigation.setOptions({
            title: resparse.data.pageTitle,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the flouroverview content screen');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  //pull to refresh
  const onRefresh = useCallback(() => {
    setFlourLoad(true);
    setFlourData({
      flours: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
    });
    setStart(0);
    setRefresh(true);
    setSortType({});
  }, []);

  useEffect(() => {
    if (!refresh) {
      flourResultapiCall();
    }
  }, [start]);

  useEffect(() => {
    if (refresh) {
      flourResultapiCall();
    }
  }, [refresh]);

  const handleSortChange = newSortKey => {
    setFlourLoad(true);
    setFlourData({
      flours: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
      currentSortKey: newSortKey.sorting_key,
    });
    setStart(0);
    setRefresh(true);
  };

  const flourResultapiCall = async filter => {
    try {
      const formdata = new FormData();

      if (setters?.language?.language_code) {
        formdata.append('lcode', setters.language.language_code || 'nl');
      }

      if (searchData?.scanValue)
        formdata.append('flourEan', searchData.scanValue);
      if (searchData?.flourName)
        formdata.append('flourName', searchData.flourName);
      if (searchData?.countryCode?.name?.en)
        formdata.append('country', searchData.countryCode.name.en);
      if (searchData?.millName)
        formdata.append('millName', searchData.millName);

      const sortKey = filter?.sorting_key || flourData?.currentSortKey;
      if (sortKey) {
        formdata.append('sort', sortKey);
        if (filter?.sorting_key) {
          setFlourData({
            flours: [],
            start: 0,
            limit: flourData.limit || 20,
            total: 0,
            count: 0,
            page: 0,
          });
          setStart(0);
          setFlourLoad(true);
        }
      }

      // Append start value
      formdata.append('start', refresh ? 0 : start);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      // print(formdata, 'FormData:');

      if (flourData.flours.length === 0) setFlourLoad(true);
      const response = await fetch(Url().flourOverviewResult, requestOptions);

      if (response.status === 200) {
        const resparse = await response.json();
        // print(resparse,"resp")
        if (resparse.status === 'success') {
          setFlourData(prev => ({
            flours: refresh
              ? resparse.data.flour
              : [...prev.flours, ...resparse.data.flour],
            start: Number(resparse.data.start),
            limit: Number(resparse.data.limit),
            total: Number(resparse.data.total),
            count: Number(resparse.data.count),
            page: refresh ? 1 : prev.page + 1,
          }));

          if (sortKey) {
            // Save current sorting key for subsequent calls
            setFlourData(prev => ({...prev, currentSortKey: sortKey}));
          }
        }
      }

      setRefresh(false);
      setFlourLoad(false);
    } catch (error) {
      console.error('Error in the flour overview result:', error);
      setRefresh(false);
      setFlourLoad(false);
    }
  };

  // overView Content content
  useEffect(() => {
    overViewContentApicall();
    // flourResultapiCall()
  }, [setters.language]);

  // flour suggestion api call
  const suggestFlourRequest = async data => {
    try {
      const formdata = new FormData();
      if (setters && setters?.language?.language_code) {
        formdata.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }

      if (deviceId && deviceId != '') {
        formdata.append('deviceId', deviceId);
      }
      if (data && data?.flourName) {
        formdata.append('flourName', data.flourName);
      }
      if (data && data?.Country && data?.Country?.name?.en) {
        formdata.append('country', data?.Country?.name?.en);
      }
      if (data && data?.millName) {
        formdata.append('millName', data.millName);
      }
      if (data && data?.flourWeight) {
        formdata.append('package_content', data.flourWeight);
      }
      if (data && data?.barCode?.data) {
        formdata.append('ean_code', data.barCode.data);
      }
      formdata.append('user_id', userId ? userId : 0);

      if (
        data &&
        data.flourImage &&
        data.flourImage.uri &&
        data.flourImage.uri != ''
      ) {
        const file = {
          uri: data.flourImage.uri,
          name: 'flourImage.jpg', // Adjust the name and type as needed
          type: 'image/jpeg',
        };
        formdata.append('file', file);
      } else {
        formdata.append('file', 'file');
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };
      const response = await fetch(Url().flourSuggestion, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          toast.show(resparse?.data ? resparse.data : 'sent successfully', {
            type: 'success',
            duration: 2000,
          });
        }
        reset();
        setRequestSheet(false);
      }
    } catch (error) {
      console.log(error, 'error in suggest flour');
    }
  };

  return (
    <Pressable
      style={{flex: 1}}
      onPressIn={() => setHide(true)}
      onPressOut={() => setHide(false)}>
      {!load ? (
        <View style={[commenStyle.rootPage, {paddingTop: 15}]}>
          {/* request flour btn */}
          <RightButtonCard
            load={flourLoad}
            altStyle={{marginBottom: 10}}
            textVal={flourData?.total + ' ' + overviewContent?.result}
            btnVal={overviewContent?.request}
            onPress={() => setRequestSheet(!requestSheet)}
            btnHover={requestSheet}
            iconComponent={'MaterialCommunityIcons'}
            iconName={'pencil'}
            iconSize={widthResponse ? 20 : 30}
          />
          {/* sort card */}
          {overviewContent?.sort_value &&
            overviewContent?.sort_value.length > 0 && (
              <SortingCard
                label={overviewContent?.sort}
                Type={sortType}
                placeholder={overviewContent?.sort}
                setType={setSortType}
                sortArray={overviewContent?.sort_value}
                altStyle={{marginBottom: 7}}
                onPress={it => handleSortChange(it)}
                dropHide={hide}
              />
            )}
          {/* Flour list */}
          {!flourLoad ? (
            flourData?.flours && flourData?.flours.length > 0 ? (
              <FlatList
                data={flourData.flours}
                numColumns={numColumns} //@@
                // scrollEnabled={false}
                style={[commenStyle.container]}
                contentContainerStyle={{
                  paddingVertical: widthResponse ? 15 : 20,
                }}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                  return <View style={{marginBottom: separator}} />;
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    colors={[appColor.primary]}
                    tintColor={appColor.primary}
                  />
                }
                onEndReached={() => {
                  start == flourData.start &&
                    flourData.page < flourData.count &&
                    setStart(Number(flourData.limit) + Number(start));
                }}
                ListFooterComponent={() =>
                  flourData.page != flourData.count && <SpinLoader />
                }
                renderItem={({item, index}) => {
                  // console.log(index, 'index')
                  return (
                    <FlourCard
                      key={index}
                      item={item}
                      milltitle={overviewContent?.millTitle}
                      index={index}
                      onPress={() => {
                        navigation.navigate('flourDetail', {
                          Detail: item,
                        });
                        dispatch(setTitle(item.flourName));
                      }}
                      separator={separator}
                      numColumns={numColumns} //@@
                    />
                  );
                }}
              />
            ) : (
              <ScrollView
                contentContainerStyle={{
                  flex: 1,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    colors={[appColor.primary]}
                    tintColor={appColor.primary}
                  />
                }>
                <Empty />
              </ScrollView>
            )
          ) : (
            <FlourCardShimmer />
          )}
          {/* Request for Flour */}
          <ModalBottomSheet
            isVisible={requestSheet}
            snapPoints={['80%', '80%']}
            close={() => {
              setRequestSheet(false);
              setImgUploadBtn(false);
              reset();
            }}
            sheetTitle={overviewContent?.request}>
            {/* <View style={{flex: 1}}>
              <BottomSheetScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                keyboardShouldPersistTaps={'always'}> */}
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps={'always'}
              contentContainerStyle={{paddingBottom: 40}}
              scrollEnabled={true}
              nestedScrollEnabled
              enableAutomaticScroll={true}
              extraHeight={400}
              ref={textFocus}
              showsVerticalScrollIndicator={false}>
              <Pressable
                onPressIn={() => setDropHide(true)}
                onPressOut={() => setDropHide(false)}>
                {/* note */}
                {overviewContent?.formCnt && (
                  <Text
                    style={[
                      commenStyle.checkLabel,
                      {
                        lineHeight: fontScalling(2.2),
                      },
                    ]}>
                    {overviewContent.formCnt}
                  </Text>
                )}
                {/* form */}
                <View style={{marginTop: 20}}>
                  {/* flour name */}
                  <Controller
                    name="flourName"
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <InputText
                          label={overviewContent?.flour?.title}
                          placeholder={overviewContent?.flour?.placeholder}
                          value={value}
                          onChangeText={onChange}
                          noelevation
                          onFocus={event =>
                            textFocus.current.scrollToFocusedInput(event.target)
                          }
                          formError={errors.flourName}
                        />
                      );
                    }}
                  />

                  {/* mill name */}
                  <Controller
                    name="millName"
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <InputText
                          label={overviewContent?.mill?.title}
                          placeholder={overviewContent?.mill?.placeholder}
                          value={currentValues?.millName}
                          noelevation
                          onChangeText={e => {
                            onChange(e);
                            millFilter(e);
                          }}
                          editable={false}
                          onPress={() => setSearchModal(true)}
                          onFocus={event =>
                            textFocus.current.scrollToFocusedInput(event.target)
                          }
                        />
                      );
                    }}
                  />

                  {/* package content */}
                  <Controller
                    name="flourWeight"
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <InputText
                          label={overviewContent?.package?.title}
                          noelevation
                          placeholder={overviewContent?.package?.placeholder}
                          keyboardType={'numeric'}
                          value={value}
                          onChangeText={onChange}
                          onFocus={event =>
                            textFocus.current.scrollToFocusedInput(event.target)
                          }
                        />
                      );
                    }}
                  />
                  {/* bar code */}
                  <Controller
                    name="barCode"
                    control={control}
                    render={({field: {value}}) => {
                      return (
                        <InputText
                          placeholder={overviewContent?.barcode?.title}
                          label={overviewContent?.barcode?.placeholder}
                          onPressRight={() => {
                            (async () => {
                              const status = await requestCameraPermission();
                              if (status == RESULTS.GRANTED) {
                                setScanModal(!scanModal);
                              }
                            })();
                          }}
                          keyboardType={'numeric'}
                          value={value && value}
                          onChangeText={e => {
                            setValue('barCode', {data: e, type: ''});
                          }}
                          rightIcon={'MaterialCommunityIcons'}
                          iconRightName={'barcode-scan'}
                          onFocus={event => {
                            textFocus.current.scrollToFocusedInput(
                              event.target,
                            );
                          }}
                        />
                      );
                    }}
                  />

                  {/* country */}
                  <Controller
                    name="Country"
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <SelectDropDown
                          dropHide={dropHide}
                          contStyle={{zIndex: 100}}
                          label={overviewContent?.country?.title}
                          placeholder={overviewContent?.country?.placeholder}
                          datas={countries}
                          value={currentValues?.Country?.name?.en}
                          nodrop
                          onPress={() => setCountryShow(true)}
                          bottomSheet
                          onChange={handleCountry}
                        />
                      );
                    }}
                  />

                  {/* country picker */}
                  {country && country.length > 0 && (
                    <Controller
                      name="Country"
                      control={control}
                      render={({field: {onChange, value}}) => {
                        return (
                          <CountryPick
                            country={country}
                            Show={countryShow}
                            backPress={() => setCountryShow(false)}
                            onPick={item => {
                              onChange(item);
                              setCountryShow(false);
                            }}
                          />
                        );
                      }}
                    />
                  )}
                  {/* image upload */}
                  <Controller
                    control={control}
                    name="flourImage"
                    render={({field: {value}}) => (
                      <>
                        {overviewContent?.image?.title && (
                          <Text
                            style={{
                              fontFamily: appFont.lB,
                              fontSize: fontScalling(2.2),
                              color: appColor.textBlack,
                              marginBottom: 10,
                            }}>
                            {overviewContent.image.title}
                          </Text>
                        )}
                        {value?.uri && value?.uri != '' ? (
                          <View
                            style={[
                              {
                                alignSelf: 'center',
                                height: scrnWidth / 4,
                                width: scrnWidth / 4,
                              },
                            ]}>
                            <Image
                              source={{uri: value?.uri}}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 15,
                              }}
                            />
                          </View>
                        ) : (
                          <>
                            <View style={[commenStyle.hFlex]}>
                              {/* button */}
                              <Pressable
                                onPress={() => setImgUploadBtn(!imgUploadBtn)}
                                style={{
                                  maxWidth: '70%',
                                  backgroundColor: imgUploadBtn
                                    ? appColor.bgWhite
                                    : appColor.bgBlack,
                                  borderRadius: 15,
                                  elevation: imgUploadBtn ? 5 : 0,
                                  borderWidth: 2,
                                  zIndex: 2,
                                  padding: 15,
                                  borderColor: appColor.bgBlack,
                                }}>
                                {overviewContent?.image?.placeholder && (
                                  <Text
                                    style={[
                                      commenStyle.authPara,
                                      {
                                        color: imgUploadBtn
                                          ? appColor.textBlack
                                          : appColor.textWhite,
                                        marginBottom: 0,
                                      },
                                    ]}>
                                    {overviewContent?.image?.placeholder}
                                  </Text>
                                )}
                              </Pressable>
                              {/* icons */}
                              {imgUploadBtn && (
                                <Animatable.View
                                  animation={'slideInLeft'}
                                  duration={700}
                                  style={[commenStyle.hFlex]}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      OpenGallery();
                                    }}
                                    style={[
                                      styles.parentIcon,
                                      {
                                        marginHorizontal: 15,
                                        elevation: imgUploadBtn ? 3 : 0,
                                      },
                                    ]}>
                                    <Icon
                                      ComponentName={'MaterialCommunityIcons'}
                                      name={'folder-multiple-image'}
                                      color={appColor.bgWhite}
                                      size={widthResponse ? 15 : 20}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      requestCameraPermission().then(e => {
                                        if (e) {
                                          OpenCamera();
                                        }
                                      });
                                    }}
                                    style={[
                                      styles.parentIcon,
                                      {
                                        elevation: imgUploadBtn ? 3 : 0,
                                      },
                                    ]}>
                                    <Icon
                                      ComponentName={'FontAwesome'}
                                      name={'camera'}
                                      color={appColor.bgWhite}
                                      size={widthResponse ? 15 : 20}
                                    />
                                  </TouchableOpacity>
                                </Animatable.View>
                              )}
                            </View>
                            {errors?.flourImage && errors?.flourImage != '' && (
                              <Text style={[commenStyle.error]}>
                                {errors.flourImage.message}
                              </Text>
                            )}
                          </>
                        )}
                      </>
                    )}
                  />
                  <PrimaryButton
                    style={{marginTop: 13}}
                    onPress={handleSubmit(suggestFlourRequest)}
                    text={overviewContent?.formBtn}
                  />
                </View>
              </Pressable>
            </KeyboardAwareScrollView>
            {/* </BottomSheetScrollView>
            </View> */}
            <Scanner
              isVisible={scanModal}
              barcodeReceived={barcodeReceived}
              setScannerSheet={setScanModal}
            />
            <ModalPopup
              visible={searchModal}
              onBackButtonPress={() => setSearchModal(false)}
              onBackdropPress={() => setSearchModal(false)}
              onClosePress={() => setSearchModal(false)}
              style={[commenStyle.popUpStyle]}>
              {/* search input */}
              {/* <Controller
                name="millName"
                control={control}
                render={({field: {onChange, value}}) => {
                  return (
                  );
                }}
              /> */}
              <InputText
                placeholder={overviewContent?.mill?.placeholder}
                // value={value}
                bgWhite
                noelevation
                autoFocus={true}
                onChangeText={e => {
                  // onChange(e);
                  millFilter(e);
                }}
              />

              {/* filtered datas */}
              {filteredData && filteredData.length > 0 ? (
                <>
                  <Controller
                    name="millName"
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <FlatList
                          data={filteredData}
                          showsVerticalScrollIndicator={false}
                          ItemSeparatorComponent={() => (
                            <View
                              style={{marginBottom: widthResponse ? 15 : 20}}
                            />
                          )}
                          contentContainerStyle={{
                            padding: widthResponse ? 10 : 15,
                          }}
                          renderItem={({item, index}) => {
                            // print(item, 'item');
                            return (
                              <SearchCard
                                type="mills"
                                title={item?.millName}
                                image={item?.millImage}
                                onPress={() => {
                                  onChange(item.millName);
                                  setSearchModal(false);
                                }}
                              />
                            );
                          }}
                        />
                      );
                    }}
                  />
                </>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    ComponentName={'Feather'}
                    name={'search'}
                    color={appColor.primary}
                    size={100}
                  />
                  <Text
                    style={[
                      commenStyle.sideHead,
                      {
                        textTransform: 'uppercase',
                        marginTop: fontScalling(3),
                        fontSize: fontScalling(2.5),
                        lineHeight: fontScalling(3),
                      },
                    ]}>
                    {overviewContent?.mill?.placeholder}
                  </Text>
                </View>
              )}
            </ModalPopup>
          </ModalBottomSheet>
        </View>
      ) : (
        <PageLoader />
      )}
    </Pressable>
  );
};

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    parentIcon: {
      backgroundColor: appColor.primary,
      borderRadius: 100,
      padding: 8,
    },
  });
  return {styles};
};
