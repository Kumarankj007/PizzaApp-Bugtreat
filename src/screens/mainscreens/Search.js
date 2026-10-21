import {
  BackHandler,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';

// file import:
import VideoPlayer from '../../components/Video/VideoPlayer';
import {
  fontScalling,
  getCurrentTime,
  print,
  requestCameraPermission,
  widthResponse,
} from '../../Utilities/helperFunction';
import {useStyle} from '../../Utilities/styleSheet';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import {InputText} from '../../components/InputFields/InputText';
import appColors from '../../Utilities/appColors';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {Icon} from '../../Utilities/icon';
import Scanner from '../../components/Modal/Scanner';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {countries} from '../../Utilities/contents';
import {Url} from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import ModalPopup from '../../components/Modal/ModalPopup';
import SearchCard from '../../components/Cards/SearchCard';
import CountryPick from '../../components/Modal/CountryPick';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RESULTS} from 'react-native-permissions';
import {setSearchVideoShow} from '../../Redux/AppSettingSlice';
import {userSettingApi} from '../../Redux/AuthSlice';
import moment from 'moment';
import {useAppVideos} from '../../Hooks/useAppVideos';

const Search = () => {
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const {setters, searchVideoShow, userId} = useSelector(
    State => State.appSettings,
  );
  const {logo} = useSelector(state => state.appSettings);
  const {isLogged} = useSelector(state => state.authSettings);
  const dispatch = useDispatch();
  const safeArea = useSafeAreaInsets();

  // styles:
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const appColor = appColors();
  const [countryShow, setCountryShow] = useState(false);
  const [searchModal, setSearchModal] = useState(false);

  // ref:
  const textFocus = useRef(null);
  const options = useSelector(state => state.headSettings);

  // state:
  const [barcodeSheet, setBarcodeSheet] = useState(false);
  const [dropHide, setDropHide] = useState(false);
  const [filteredFlour, setFilteredFlour] = useState([]);
  const [floursearchModal, setFlourSearchModal] = useState(false);
  const [searchContent, setSearchContent] = useState({});
  const [searchData, setSearchData] = useState({
    scanValue: '',
    flourName: '',
    countryCode: '',
    millName: '',
  });

  const [load, setLoad] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [flour, setFlour] = useState({});
  const [videoShow, setVideoShow] = useState(true);
  const {searchVideo} = useAppVideos();
  // print(searchContent, 'content');

  // set country:
  const handleCountry = val =>
    setSearchData(pre => ({...pre, countryCode: val}));

  // setbarcodeValue:
  const barcodeReceived = e => {
    const data = e?.nativeEvent?.codeStringValue
      ? e?.nativeEvent?.codeStringValue
      : '';
    const type = e?.nativeEvent?.codeFormat ? e?.nativeEvent?.codeFormat : '';
    console.log(e, 'datas');
    setBarcodeSheet(false);
    if (isLogged && userId) getFlourApiCall(data);

    setSearchData(pre => ({
      ...pre,
      scanValue: data ? data : '',
    }));
  };

  // getting the flour details from the scanner
  const getFlourApiCall = async ean => {
    try {
      const formData = new FormData();
      if (setters && setters?.language?.language_code) {
        formData.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }

      formData.append('barcode', ean);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      // print(formData, 'form');
      const response = await fetch(Url().flourScan, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          resparse?.data?.flourId &&
            userId &&
            isLogged &&
            historyCallApi(resparse?.data?.flourId);
        }
      }
    } catch (error) {
      console.log(error, 'error in bar code scanner api');
    }
  };

  // api for the history api call
  const historyCallApi = async flourId => {
    try {
      const saveDate = dateString => {
        const [date, month, year] = dateString.split('/');
        return `${year}-${date}-${month}`;
      };
      const formData = new FormData();

      if (userId) formData.append('user_id', userId);

      formData.append('flour_id', flourId);
      formData.append('save_time', getCurrentTime());
      formData.append('save_date', saveDate(moment().format('L')));

      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      const response = await fetch(Url().historyCall, requestOptions);
      const resparse = await response.json();
    } catch (error) {
      console.log(error, 'error in the history call recipe detail api call');
    }
  };

  // search screen content apicall
  const searchScreenApicall = async () => {
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
      if (Object.keys(searchContent).length == 0) {
        dispatch(setTitleLoad(true));
        setLoad(true);
      }
      const response = await fetch(Url().searchScreen, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setSearchContent(resparse.data);
          if (resparse.data.pageTitle) {
            navigation.setOptions({
              title: resparse.data.pageTitle,
            });
          }
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the search screen');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  // search screen content
  useEffect(() => {
    searchScreenApicall();
    dispatch(userSettingApi());
  }, [setters.language]);

  // mill filter function
  const millFilter = async txt => {
    if (txt && txt.trim() !== '') {
      const data =
        searchContent?.mill?.value &&
        searchContent?.mill?.value.length > 0 &&
        searchContent?.mill?.value.filter(val =>
          val.millName.toLowerCase().includes(txt.toLowerCase()),
        );
      setFilteredData(data);
    } else {
      setFilteredData([]);
    }
  };

  // flour filter search
  const flourFilter = async item => {
    if (item && item.trim() !== '') {
      const data =
        searchContent?.name?.value &&
        searchContent?.name?.value.length > 0 &&
        searchContent?.name?.value.filter(val =>
          val.flourName.toLowerCase().includes(item.toLowerCase()),
        );
      setFilteredFlour(data);
    } else {
      setFilteredFlour([]);
    }
  };

  return (
    <>
      {/* <Button title="clear" onPress={() => AsyncStorage.clear()} /> */}
      {!load ? (
        // <ScrollView
        //   style={{
        //     backgroundColor: appColor.bgWhite,
        //   }}
        //   showsVerticalScrollIndicator={false}>
        // </ScrollView>
        <Pressable
          onPressIn={() => setDropHide(true)}
          onPressOut={() => setDropHide(false)}
          style={{flex: 1, backgroundColor: appColor.bgWhite}}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            scrollEnabled={true}
            enableAutomaticScroll={true}
            extraHeight={300}
            ref={textFocus}
            showsVerticalScrollIndicator={false}>
            {/* video content */}
            {searchVideo && (
              <VideoPlayer
                source={searchVideo}
                onClose={() => dispatch(setSearchVideoShow(false))}
                onOpen={() => dispatch(setSearchVideoShow(true))}
                show={searchVideoShow}
                showText={searchContent?.show_demo_video}
              />
            )}
            <View style={[commenStyle.container, {marginTop: 20}]}>
              {/* Heading and reset btn */}
              <View
                style={[styles.fRow, {alignItems: 'center', marginBottom: 10}]}>
                {/* heading */}
                {searchContent?.formTitle && (
                  <Text style={[commenStyle.title]}>
                    {searchContent.formTitle}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setSearchData({
                      scanValue: '',
                      flourName: '',
                      countryCode: '',
                      millName: '',
                    });
                  }}>
                  <Icon
                    ComponentName={'Ionicons'}
                    name={'reload-circle'}
                    size={widthResponse ? 25 : 35}
                    color={appColor.bgBlack}
                  />
                </TouchableOpacity>
              </View>

              {/* Flour bar code */}
              <InputText
                label={searchContent?.ean?.title}
                placeholder={searchContent?.ean?.placeholder}
                onPressRight={() => {
                  (async () => {
                    const status = await requestCameraPermission();
                    if (status == RESULTS.GRANTED) {
                      setBarcodeSheet(!barcodeSheet);
                    }
                  })();
                }}
                value={searchData.scanValue}
                onChangeText={e => {
                  setSearchData(pre => ({
                    ...pre,
                    scanValue: e,
                  }));
                }}
                rightIcon={'MaterialCommunityIcons'}
                iconRightName={'barcode-scan'}
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
              />
              {/* flour name */}
              <InputText
                label={searchContent?.name?.title}
                placeholder={searchContent?.name?.placeholder}
                onChangeText={e => {
                  // setSearchData(pre => ({...pre, flourName: e}));
                  flourFilter(e);
                }}
                editable={false}
                onPress={() => setFlourSearchModal(true)}
                value={searchData.flourName}
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
              />
              {/* country dropdown */}
              <SelectDropDown
                dropHide={dropHide}
                label={searchContent?.country?.title}
                placeholder={searchContent?.country?.placeholder}
                datas={countries}
                value={searchData.countryCode?.name?.en}
                onChange={handleCountry}
                nodrop
                onPress={() => setCountryShow(true)}
              />
              {/* Mill */}
              <InputText
                label={searchContent?.mill?.title}
                placeholder={searchContent?.mill?.placeholder}
                rightIcon={'AntDesign'}
                editable={false}
                onPress={() => {
                  setSearchModal(true);
                }}
                value={searchData?.millName}
                iconRightName={'search1'}
                onFocus={event => {
                  textFocus.current.scrollToFocusedInput(event.target);
                }}
              />
              {/* Search btn */}
              {/* <PrimaryButton
                  text={searchContent?.formBtn}
                  style={{marginTop: 15}}
                  onPress={() =>
                    navigation.navigate('flourOverview', {
                      searchData: searchData,
                      country: searchContent?.country?.value,
                      mills: searchContent?.mill?.value,
                    })
                  }
                /> */}
            </View>
            {/* flour scan  */}
            <Scanner
              isVisible={barcodeSheet}
              barcodeReceived={barcodeReceived}
              setScannerSheet={setBarcodeSheet}
              // exitBack
            />
          </KeyboardAwareScrollView>
          <View
            style={[
              commenStyle.container,
              {
                paddingVertical: widthResponse ? 10 : 15,
              },
            ]}>
            {/* Search btn */}
            <PrimaryButton
              text={searchContent?.formBtn}
              // style={{marginTop: widthResponse ? 10 : 15}}
              onPress={() =>
                navigation.navigate('flourOverview', {
                  searchData: searchData,
                  country: searchContent?.country?.value,
                  mills: searchContent?.mill?.value,
                })
              }
            />
          </View>
          {/* country picker */}
          <CountryPick
            Show={countryShow}
            backPress={() => setCountryShow(false)}
            country={searchContent?.country?.value}
            onPick={item => {
              setSearchData(e => ({
                ...e,
                countryCode: item,
              }));
              setCountryShow(false);
            }}
          />
        </Pressable>
      ) : (
        <PageLoader />
      )}

      {/* mill search */}
      <ModalPopup
        visible={searchModal}
        onBackButtonPress={() => setSearchModal(false)}
        onBackdropPress={() => setSearchModal(false)}
        onClosePress={() => setSearchModal(false)}
        style={[commenStyle.popUpStyle]}>
        {/* search input */}
        <InputText
          placeholder={searchContent?.mill?.placeholder}
          value={flour?.flour_name}
          bgWhite
          autoFocus={true}
          onChangeText={e => {
            setFlour(e);
            millFilter(e);
          }}
        />

        {/* filtered datas */}
        {filteredData && filteredData.length > 0 ? (
          <>
            <FlatList
              data={filteredData}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={{marginBottom: widthResponse ? 15 : 20}} />
              )}
              contentContainerStyle={{
                padding: widthResponse ? 10 : 15,
              }}
              keyboardShouldPersistTaps={'always'}
              renderItem={({item, index}) => (
                <SearchCard
                  key={index}
                  type="mills"
                  title={item?.millName}
                  image={item?.millImage}
                  onPress={() => {
                    navigation.navigate('milldetail', {
                      detail: item,
                    });
                    setSearchModal(false);
                    setFilteredData([]);
                    setSearchData(pre => ({
                      ...pre,
                      millName: item?.millName,
                    }));
                  }}
                />
              )}
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
                  fontSize: fontScalling(2.6),
                  lineHeight: fontScalling(2.7),
                },
              ]}>
              {searchContent?.mill?.placeholder}
            </Text>
          </View>
        )}
      </ModalPopup>
      {/* flour search */}
      <ModalPopup
        visible={floursearchModal}
        onBackButtonPress={() => setFlourSearchModal(false)}
        onBackdropPress={() => setFlourSearchModal(false)}
        onClosePress={() => setFlourSearchModal(false)}
        style={[commenStyle.popUpStyle]}>
        {/* search input */}
        <InputText
          placeholder={searchContent?.name?.placeholder}
          value={searchData?.flourName}
          bgWhite
          autoFocus={true}
          onChangeText={e => {
            setSearchData(pre => ({
              ...pre,
              flourName: e,
            }));
            flourFilter(e);
          }}
        />
        {/* filtered datas */}
        {filteredFlour && filteredFlour.length > 0 ? (
          <>
            {/* <Text>{filteredFlour.length}</Text> */}
            <FlatList
              data={filteredFlour}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={{marginBottom: widthResponse ? 15 : 20}} />
              )}
              contentContainerStyle={{
                padding: widthResponse ? 10 : 15,
              }}
              keyboardShouldPersistTaps={'always'}
              renderItem={({item, index}) => {
                return (
                  <SearchCard
                    title={item?.flourName}
                    image={item?.flourImg}
                    onPress={() => {
                      setSearchData(e => {
                        return {
                          ...e,
                          flourName: item.flourName,
                        };
                      });
                      navigation.navigate('flourOverview', {
                        searchData: {...searchData, flourName: item.flourName},
                        country: searchContent?.country?.value,
                        mills: searchContent?.mill?.value,
                      });
                      setFlourSearchModal(false);
                      setFilteredFlour([]);
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
                  fontSize: fontScalling(3),
                  lineHeight: fontScalling(4),
                },
              ]}>
              {searchContent?.name?.placeholder}
            </Text>
          </View>
        )}
      </ModalPopup>
    </>
  );
};

export default Search;

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
