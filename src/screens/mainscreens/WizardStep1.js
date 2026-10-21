import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import {InputText} from '../../components/InputFields/InputText';
import appColors from '../../Utilities/appColors';
import {
  fontScalling,
  formatedDate,
  print,
  requestCameraPermission,
  scrnWidth,
  toLocalTime,
  widthResponse,
} from '../../Utilities/helperFunction';
import {Controller, useForm} from 'react-hook-form';
import DatePick from '../../components/InputFields/DatePick';
import ModalPopup from '../../components/Modal/ModalPopup';
import SearchCard from '../../components/Cards/SearchCard';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useStyle} from '../../Utilities/styleSheet';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {FlourList} from '../../Utilities/contents';
import {Icon} from '../../Utilities/icon';
import {Url} from '../../Utilities/appApi';
import {useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {RESULTS} from 'react-native-permissions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import WizardContent from '../../Hooks/WizardContent';
import ValidationContent from '../../Hooks/ValidationContent';
import PageLoader from '../../components/Loader/PageLoader';

const WizardStep1 = () => {
  const {setters} = useSelector(State => State.appSettings);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const safeArea = useSafeAreaInsets();
  const navigation = useNavigation();
  const [barcodeSheet, setBarcodeSheet] = useState(false);
  const [flourModal, setFlourModal] = useState(false);
  const [dateModal, setDateModal] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [searchData, setSearchData] = useState({
    flourName: '',
    cookingDate: '',
    cookingTime: '',
    persons: '',
    apetite: '',
    size: '',
  });
  const [dateShow, setDateShow] = useState(false);
  const [timeShow, setTimeShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const {wizContent, load} = WizardContent();

  useEffect(() => {
    navigation.setOptions({
      title: wizContent?.button_one,
    });
  }, [wizContent]);

  const {valContent} = ValidationContent();

  // schema validation
  const schema = yup.object().shape({
    flourName: yup
      .mixed()
      .required(valContent?.select_your_flour)
      .test('is-object', valContent?.select_your_flour, value => {
        return value !== '' && typeof value === 'object' && value !== null;
      }),
    cookingDate: yup.string().required(valContent?.select_date),
    cookingTime: yup.string().required(valContent?.select_time),
    persons: yup.string().notRequired(),
    apetite: yup
      .mixed()
      .notRequired()
      .test(
        'is-valid-apetite',
        'Apetite must be an object or an empty value',
        value => {
          if (!value) return true; // Allow null, undefined, or empty
          return typeof value === 'object'; // Ensure it's an object if provided
        },
      ),
    size: yup.string().notRequired(),
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: searchData,
    resolver: yupResolver(schema),
  });

  // looks for the updated value
  const updatedValue = watch();

  // if (updatedValue.flourName != '' && barcodeSheet) {
  //   setBarcodeSheet(!barcodeSheet);
  // }

  // step one submit funct
  const handleStepOneSubmit = data => {
    navigation.navigate('wizardStep2', {
      searchdatas: data,
    });
  };
  // received scanner data
  const barcodeReceived = e => {
    const data = e?.nativeEvent?.codeStringValue
      ? e?.nativeEvent?.codeStringValue
      : '';
    const type = e?.nativeEvent?.codeFormat ? e?.nativeEvent?.codeFormat : '';
    if (data != '' && type != '') {
      // const scanData = {data: data, type: type};
      getFlourApiCall(data);
    }
    setBarcodeSheet(!barcodeSheet);
  };

  // search handler
  const searchHandle = text => {
    const filteredProduct = FlourList.data.filter(item => {
      return item.flourName.toLowerCase().includes(text.toLowerCase());
    });
    setSearchList(filteredProduct);
  };

  // flour filter search

  const flourFilter = async item => {
    if (item && item.trim() !== '') {
      const data =
        wizContent?.response_flours.value &&
        wizContent?.response_flours.value.length > 0 &&
        wizContent?.response_flours.value.filter(val =>
          val.flourName.toLowerCase().includes(item.toLowerCase()),
        );

      // if (data) {
      //   const finalData = await Promise.all(
      //     data.map(async element => ({
      //       ...element,
      //       flourImg: element.flourImg
      //         ? await getImageUrl(element.flourImg)
      //         : null,
      //     })),
      //   );

      //   // print(finalData, 'Filtered with images');
      // }
      setSearchList(data);
    } else {
      setSearchList([]);
    }
  };

  // // flour filter search
  // const flourFilter = item => {
  //   if (item && item.trim() !== '') {
  //     const data =
  //       wizContent?.response_flours?.value &&
  //       wizContent?.response_flours?.value.length > 0 &&
  //       wizContent?.response_flours?.value.filter(val =>
  //         val.flourName.toLowerCase().includes(item.toLowerCase()),
  //       );
  //     setSearchList(data);
  //   } else {
  //     setSearchList([]);
  //   }
  // };

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
        // print(resparse, 'resp');
        if (resparse.status == 'success') {
          // print(resparse.data, 'data');
          setValue('flourName', {flourName: resparse?.data?.flourName});
          setValue('size', resparse?.data?.strength);
          setBarcodeSheet(false);
        }
      }
    } catch (error) {
      console.log(error, 'error in bar code scanner api');
    }
  };

  return (
    <>
      {!load ? (
        <>
          <ScrollView
            style={[commenStyle.scrollContainer]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: widthResponse ? 40 : 60,
            }}>
            {/* scan flours*/}
            <InputText
              labelCenter
              bgWhite
              label={wizContent?.step1?.search?.label}
              placeholder={wizContent?.step1?.search?.placeholder}
              editable={false}
              onPress={() => setFlourModal(!flourModal)}
              value={updatedValue.flourName?.flourName}
              rightIcon={'Feather'}
              iconRightName={'search'}
              iconrightSize={25}
              formError={errors.flourName}
            />
            {/* scanner */}
            <View
              style={{
                alignItems: 'center',
                borderTopColor: appColor.borderColor,
                borderTopWidth: 1,
                marginVertical: fontScalling(2),
              }}>
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: 0,
                    backgroundColor: appColor.white,
                    padding: 10,
                    marginTop: -20,
                    marginBottom: 10,
                  },
                ]}>
                or
              </Text>
              <Pressable
                onPress={() => {
                  (async () => {
                    const status = await requestCameraPermission();
                    if (status == RESULTS.GRANTED) {
                      setBarcodeSheet(!barcodeSheet);
                    }
                  })();
                }}>
                <Image
                  source={require('../../../assets/images/scanner.png')}
                  resizeMode="contain"
                  style={{
                    width: scrnWidth / 7,
                    height: scrnWidth / 7,
                  }}
                />
              </Pressable>
            </View>

            {/* time and date */}
            <View
              style={{
                flexDirection: 'row',
                // alignItems: 'flex-end',
              }}>
              {/* date select */}
              <InputText
                label={wizContent?.step1?.inputs?.date?.label}
                placeholder={wizContent?.step1?.inputs?.date?.placeholder}
                value={updatedValue.cookingDate}
                rightIcon={'MaterialIcons'}
                iconRightName={'date-range'}
                iconrightSize={22}
                editable={false}
                onPress={() => setDateShow(true)}
                onPressRight={() => setDateShow(true)}
                formError={errors.cookingDate}
                customStyle={{
                  flex: 1,
                }}
              />

              <Controller
                name="cookingDate"
                control={control}
                render={({field: {onChange}}) => (
                  <DatePicker
                    mode="date"
                    theme="auto"
                    modal
                    open={dateShow}
                    date={date}
                    onConfirm={date => {
                      setDateShow(false);
                      onChange(formatedDate(date));
                    }}
                    onCancel={() => {
                      setDateShow(false);
                    }}
                    // buttonColor={appColor.primary}
                  />
                )}
              />
              {/* time select */}
              <Controller
                name="cookingTime"
                control={control}
                render={({field: {onChange, value}}) => (
                  <SelectDropDown
                    nodrop
                    withOutDrop
                    onPress={() => setTimeShow(true)}
                    datas={wizContent?.step1?.inputs?.time?.timeValues}
                    placeholder={wizContent?.step1?.inputs?.time?.placeholder}
                    onChange={onChange}
                    error={errors.cookingTime}
                    value={value}
                    contStyle={{
                      width: '30%',
                      marginLeft: 10,
                      marginBottom: 0,
                      marginTop: widthResponse ? 5 : 10,
                    }}
                  />
                )}
              />

              {/* time select */}
              <Controller
                name="cookingTime"
                control={control}
                render={({field: {onChange, value}}) => (
                  <DatePicker
                    mode="time"
                    theme="auto"
                    modal
                    open={timeShow}
                    is24hourSource="device"
                    date={date}
                    minuteInterval={15}
                    onConfirm={time => {
                      setTimeShow(false);
                      onChange(toLocalTime(time));
                    }}
                    onCancel={() => {
                      setTimeShow(false);
                    }}
                    // buttonColor={appColor.primary}
                  />
                )}
              />
            </View>

            {/* persons */}
            <Controller
              name="persons"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  label={wizContent?.step1?.inputs?.person?.label}
                  placeholder={wizContent?.step1?.inputs?.person?.placeholder}
                  keyboardType={'number-pad'}
                  onChangeText={onChange}
                  value={value}
                  formError={errors.persons}
                />
              )}
            />

            {/* apetite */}
            <Controller
              name="apetite"
              control={control}
              render={({field: {onChange, value}}) => (
                <SelectDropDown
                  sorting
                  modal
                  withOutDrop
                  datas={wizContent?.step1?.inputs?.apetite?.values}
                  label={wizContent?.step1?.inputs?.apetite?.label}
                  placeholder={wizContent?.step1?.inputs?.apetite?.placeholder}
                  onChange={onChange}
                  value={value}
                  error={errors.apetite}
                />
              )}
            />

            {/* size */}
            <Controller
              name="size"
              control={control}
              render={({field: {onChange, value}}) => (
                <SelectDropDown
                  top
                  modal
                  datas={wizContent?.step1?.inputs?.size?.values}
                  label={wizContent?.step1?.inputs?.size?.label}
                  placeholder={wizContent?.step1?.inputs?.size?.placeholder}
                  onChange={onChange}
                  value={value}
                  error={errors.size}
                />
              )}
            />
          </ScrollView>
          {/* submit */}
          <View style={[commenStyle.container]}>
            <PrimaryButton
              text={wizContent?.step1?.button}
              onPress={handleSubmit(handleStepOneSubmit)}
              style={{
                marginVertical: fontScalling(widthResponse ? 1 : 2),
              }}
            />
          </View>
          {/* flour scan  */}
          <Controller
            name="flourName"
            control={control}
            render={({field: {onChange, value}}) => {
              return (
                <Scanner
                  isVisible={barcodeSheet}
                  barcodeReceived={barcodeReceived}
                  setScannerSheet={setBarcodeSheet}
                  // exitBack
                />
              );
            }}
          />
          {/* flour search modal */}
          <ModalPopup
            visible={flourModal}
            onBackButtonPress={() => setFlourModal(!flourModal)}
            onBackdropPress={() => setFlourModal(!flourModal)}
            onClosePress={() => setFlourModal(!flourModal)}
            style={{
              flex: 1,
              marginVertical: safeArea.top,
              // backgroundColor:appColor.bgBlack
            }}>
            <Text style={[commenStyle.title]}>
              {wizContent?.step1?.search?.label}
            </Text>
            {/* search input */}
            <Controller
              name="flourName"
              control={control}
              render={({field: {onChange, value}}) => (
                <InputText
                  placeholder={wizContent?.step1?.search?.placeholder}
                  value={value.flourName}
                  onChangeText={text => {
                    onChange(text);
                    flourFilter(text);
                  }}
                  autoFocus={true}
                  rightIcon={'Feather'}
                  iconRightName={'search'}
                  iconrightSize={25}
                />
              )}
            />

            {/* result list */}
            {searchList.length > 0 ? (
              <FlatList
                data={searchList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={{marginBottom: widthResponse ? 15 : 20}} />
                )}
                contentContainerStyle={{
                  padding: widthResponse ? 10 : 15,
                }}
                renderItem={({item, index}) => {
                  return (
                    <Controller
                      name="flourName"
                      control={control}
                      render={({field: {onChange}}) => (
                        <SearchCard
                          image={item.flourImg}
                          title={item.flourName}
                          country={item.country}
                          onPress={() => {
                            onChange(item);
                            setValue('size', item?.strength);
                            setTimeout(() => {
                              setFlourModal(!flourModal);
                              setSearchList([]);
                            }, 500);
                          }}
                        />
                      )}
                    />
                  );
                }}
              />
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
                      fontSize: fontScalling(2),
                      lineHeight: fontScalling(4),
                    },
                  ]}>
                  {wizContent?.step1?.search?.placeholder}
                </Text>
              </View>
            )}
          </ModalPopup>

          {/* date pick modal */}
          <ModalPopup
            visible={dateModal}
            onBackButtonPress={() => setDateModal(!dateModal)}
            onBackdropPress={() => setDateModal(!dateModal)}
            onClosePress={() => setDateModal(!dateModal)}>
            <Text style={[commenStyle.sideHead]}>
              {wizContent?.step1?.inputs?.date?.label}
            </Text>
            {/* Calendar */}
          </ModalPopup>
        </>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default WizardStep1;

const styles = StyleSheet.create({});
