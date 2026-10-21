import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import ScrollCard from '../../components/Cards/ScrollCard';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {notifyContent} from '../../Utilities/contents';
import NotificationCard from '../../components/Cards/NotificationCard';
import {print, widthResponse} from '../../Utilities/helperFunction';
import SpinLoader from '../../components/Loader/SpinLoader';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Icon} from '../../Utilities/icon';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Url} from '../../Utilities/appApi';
import Empty from '../../components/Loader/Empty';
import {HistoryCardShimmer} from '../../Utilities/appShimmer';
import {userSettingApi} from '../../Redux/AuthSlice';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import messaging from '@react-native-firebase/messaging';
import {Toast} from 'react-native-toast-notifications';

const Notification = () => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const {setters, userId} = useSelector(State => State.appSettings);
  const {trigger} = useSelector(state => state.trigger);
  const [refresh, setRefresh] = useState(false);
  const [load, setLoad] = useState(false);
  const [start, setStart] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [notificationList, setNotificationList] = useState({
    notification: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });

  //pull to refresh
  const onRefresh = useCallback(() => {
    setLoad(true);
    setStart(0);
    setNotificationList({
      notification: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
    });
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (!refresh) {
      notificationApiCall();
    }
  }, [start]);
  useEffect(() => {
    if (refresh) {
      notificationApiCall();
    }
  }, [refresh]);

  useEffect(() => {
    if (userId) {
      dispatch(userSettingApi());
    }
  }, []);

  // notification listing api
  const notificationApiCall = async () => {
    try {
      const formData = new FormData();
      if (setters && setters?.language?.language_code && userId) {
        formData.append('user_id', userId);
        formData.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }

      formData.append('start', start);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      if (notificationList.notification.length == 0) {
        setLoad(true);
        dispatch(setTitleLoad(true));
      }
      const response = await fetch(Url().notification, requestOptions);
      // print(response, 'resparse');
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse, 'resp');
          navigation.setOptions({
            title: resparse?.data?.pageTitle
              ? resparse?.data?.pageTitle
              : 'Notifications',
          });
          setNotificationList(prev => ({
            notification: refresh
              ? resparse.data.notification
              : [...prev.notification, ...resparse.data.notification],
            start: Number(resparse.data.start),
            limit: Number(resparse.data.limit),
            total: Number(resparse.data.total),
            count: Number(resparse.data.count),
            page: refresh ? 1 : prev.page + 1,
          }));
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
      setRefresh(false);
    } catch (error) {
      console.log(error, 'error in the notification list api call');
      setLoad(false);
      dispatch(setTitleLoad(false));
      setRefresh(false);
    }
  };

  // delete notification api call
  const deleteNotification = async id => {
    try {
      const formData = new FormData();
      if (setters && setters?.language?.language_code && userId) {
        formData.append('user_id', userId);
        formData.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
      }
      formData.append('id', id);
      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      const response = await fetch(Url().notificationDelete, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          Toast.show(resparse?.data ? resparse.data : 'Deleted successfully', {
            type: 'success',
            duration: 2000,
          });
        }
      }
      setRefresh(true);
      // print(await response.json(), 're');
    } catch (error) {
      console.log(error, 'error in the delete notification api call');
    }
  };

  // for getting the messages on the foreground state
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // onRefresh();
      setRefresh(true);
    });
    return unsubscribe;
  }, []);
  return (
    <>
      {!load ? (
        notificationList?.notification &&
        notificationList?.notification?.length > 0 ? (
          <FlatList
            data={notificationList.notification}
            style={[commenStyle.scrollContainer]}
            contentContainerStyle={{
              paddingBottom: widthResponse ? 70 : 100,
            }}
            ItemSeparatorComponent={() => {
              return <View style={{height: widthResponse ? 10 : 15}} />;
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                colors={[appColor.primary]}
                tintColor={appColor.primary}
              />
            }
            onEndReached={() => {
              start == notificationList.start &&
                notificationList.page < notificationList.count &&
                setStart(Number(notificationList.limit) + Number(start));
            }}
            ListFooterComponent={() =>
              notificationList.page != notificationList.count && <SpinLoader />
            }
            renderItem={({item, index}) => {
              return (
                <NotificationCard
                  id={item.id}
                  key={index}
                  // index={index}
                  title={item?.title}
                  time={item?.time}
                  date={item?.date}
                  image={item?.image}
                  item={item}
                  onDelPress={deleteNotification}
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
        <HistoryCardShimmer />
      )}
    </>
  );
};

export default Notification;

const styles = StyleSheet.create({});
