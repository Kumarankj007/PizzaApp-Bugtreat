import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import RightButtonCard from '../../components/Cards/RightButtonCard';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  isEven,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {InputText} from '../../components/InputFields/InputText';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import UserCommunity from '../../components/Cards/UserCommunity';
import SpinLoader from '../../components/Loader/SpinLoader';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setTitle} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import {FlourCardShimmer} from '../../Utilities/appShimmer';
import Empty from '../../components/Loader/Empty';
import KeyboardVisible from '../../Hooks/KeyboardVisible';

const CommunityUser = ({data}) => {
  const keyboardVisible = KeyboardVisible(true); //@@
  const [sheet, setSheet] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [load, setLoad] = useState(false);
  const [sortType, setSortType] = useState();
  const [sortName, setSortName] = useState('');
  const [sortError, setSortError] = useState(false);
  const [users, setUsers] = useState({
    user: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });
  const [start, setStart] = useState(0);
  const textFocus = useRef(null);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const separator = widthResponse ? 15 : 20;
  const container = widthResponse ? 30 : 40;
  const numColumns = widthResponse ? 2 : 3;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {setters, deviceId, userId} = useSelector(State => State.appSettings);

  //pull to refresh
  const onRefresh = useCallback(() => {
    setLoad(true);
    setUsers({
      user: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
    });
    setStart(0);
    setRefresh(true);
    setSortName('');
    setSortType('');
  }, []);

  useEffect(() => {
    if (!refresh) {
      communityUsersApiCall();
    }
  }, [start, setters?.language]);

  useEffect(() => {
    if (refresh) {
      communityUsersApiCall();
    }
  }, [refresh]);

  const handleSortChange = () => {
    if (sortName == '' || (sortType && Object.keys(sortType).length == 0)) {
      setSortError(true);
    }
    setSortError(false);
    setLoad(true);
    setUsers({
      user: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
      currentSortKey: sortType?.sorting_key,
      sortName: sortName,
    });
    setSheet(false);
    setStart(0);
    setRefresh(true);
  };

  // community Users apicall
  const communityUsersApiCall = async filter => {
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
      formData.append('start', start);

      if (userId) {
        formData.append('user_id', userId);
      }

      const sortKey = users?.currentSortKey || users?.sortName;
      if (sortKey) {
        if (sortType && Object.keys(sortType).length != 0)
          formData.append('sort', sortType.sorting_key);
        if (sortName != '') formData.append('search', sortName);
      }

      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      // print(formData,"formdata")

      if (users.user.length == 0) setLoad(true);
      const response = await fetch(Url().communityUsers, requestOptions);
      if (response.status == 200) {
        // print(response,"resp")
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setUsers(prev => ({
            user: refresh
              ? resparse.data.details
              : [...prev.user, ...resparse.data.details],
            start: Number(resparse.data.start),
            limit: Number(resparse.data.limit),
            total: Number(resparse.data.total),
            count: Number(resparse.data.count),
            page: refresh ? 1 : prev.page + 1,
          }));

          if (sortKey) {
            setUsers(prev => ({
              ...prev,
              currentSortKey: sortType?.sorting_key,
              sortName: sortName,
            }));
          }
        }
      }
      setLoad(false);
      setRefresh(false);
    } catch (error) {
      console.log(error, 'error in the community users api call');
      setLoad(false);
      setRefresh(false);
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
        }}>
        <RightButtonCard
          textVal={data?.users}
          btnVal={data?.filter_users}
          iconComponent={'MaterialCommunityIcons'}
          iconName={'tune'}
          iconSize={widthResponse ? 20 : 30} //@@
          onPress={() => setSheet(!sheet)}
          btnHover={sheet}
          altStyle={{
            marginBottom: widthResponse ? 15 : 20,
          }}
        />

        {!load ? (
          users && users?.user && users?.user?.length > 0 ? (
            <FlatList
              data={users.user}
              style={[
                commenStyle.container,
                {
                  paddingVertical: widthResponse ? 15 : 20,
                },
              ]}
              showsVerticalScrollIndicator={false}
              numColumns={numColumns}
              contentContainerStyle={{
                paddingBottom: widthResponse ? 40 : 60,
              }}
              keyExtractor={(data, index) => index}
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={onRefresh}
                  colors={[appColor.primary]}
                  tintColor={appColor.primary}
                />
              }
              ItemSeparatorComponent={() => (
                <View style={{height: separator}} />
              )}
              ListFooterComponent={() =>
                users.page != users.count && <SpinLoader />
              }
              onEndReached={() => {
                start == users.start &&
                  users.page < users.count &&
                  setStart(Number(users.limit) + Number(start));
              }}
              renderItem={({item, index}) => (
                <UserCommunity
                  key={index}
                  index={index}
                  data={item}
                  count={data?.no_of_recpies}
                  style={{
                    width:
                      (scrnWidth - container - separator * (numColumns - 1)) /
                      numColumns,
                    marginRight: (index + 1) % numColumns == 0 ? 0 : separator,
                  }}
                  onPress={() => {
                    navigation.navigate('userDetail', {id: item.id});
                  }}
                />
              )}
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
      </View>
      {/* user filter sheet */}
      <ModalBottomSheet
        isVisible={sheet}
        snapPoints={['50%', '50%']}
        sheetTitle={data?.filter}
        close={() => {
          setSheet(false);
        }}>
        {/* <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}> */}
        <ScrollView
          contentContainerStyle={{
            marginBottom: keyboardVisible == 0 ? 40 : keyboardVisible,
          }} //@@
          scrollEnabled={true}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps={'always'}
          showsVerticalScrollIndicator={false}>
          <InputText
            placeholder={data?.filter_placeholder}
            rightIcon={'Feather'}
            iconRightName={'search'}
            iconrightSize={25}
            value={sortName}
            onChangeText={setSortName}
          />
          <SelectDropDown
            horizontal
            top
            sorting
            modal={true}
            withOutDrop
            label={data?.sort}
            placeholder={data?.sort}
            datas={data?.sort_value}
            onChange={setSortType}
            value={sortType}
          />
          {sortError && <Text>please select on sort</Text>}
          <PrimaryButton
            text={data?.filter_button}
            style={{
              marginBottom: 0,
            }}
            onPress={handleSortChange}
          />
        </ScrollView>
        {/* </BottomSheetScrollView> */}
      </ModalBottomSheet>
    </>
  );
};

export default CommunityUser;

const styles = StyleSheet.create({});
