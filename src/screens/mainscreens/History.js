import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import HistoryCard from '../../components/Cards/HistoryCard';
import {
  fontScalling,
  print,
  widthResponse,
} from '../../Utilities/helperFunction';
import ScrollCard from '../../components/Cards/ScrollCard';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Url} from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import Empty from '../../components/Loader/Empty';
import SpinLoader from '../../components/Loader/SpinLoader';
import {HistoryCardShimmer} from '../../Utilities/appShimmer';

const History = () => {
  const [load, setLoad] = useState(false);
  const [historyLoad, setHistoryLoad] = useState(false);
  const [content, setContent] = useState([]);
  const [history, setHistory] = useState({
    datas: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {commenStyle} = useStyle();
  const [refresh, setRefresh] = useState(false);
  const [start, setStart] = useState(0);
  const appColor = appColors();
  const {setters, userId} = useSelector(State => State.appSettings);

  //pull to refresh
  const onRefresh = useCallback(() => {
    // setFlourLoad(true);
    setHistory({
      datas: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
    });
    setStart(0);
    setRefresh(true);
    setHistoryLoad(true);
  }, []);

  useEffect(() => {
    if (!refresh) {
      console.log('-------');
      historyApiCall();
    }
  }, [start]);

  useEffect(() => {
    if (refresh) {
      historyApiCall();
    }
  }, [refresh]);

  // history api call
  const historyApiCall = async () => {
    try {
      const formData = new FormData();

      if (setters && setters?.language?.language_code && userId) {
        formData.append(
          'lcode',
          setters?.language?.language_code
            ? setters?.language?.language_code
            : 'nl',
        );
        formData.append('user_id', userId);
      }

      // Append start value
      formData.append('start', start);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      print(formData, 'form');
      if (history.datas.length == 0) setHistoryLoad(true);
      // dispatch(setTitleLoad(true));
      const response = await fetch(Url().history, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resparse')
        if (resparse.status == 'success') {
          setHistory(pre => ({
            datas: refresh
              ? resparse.data.users_data
              : [...pre.datas, ...resparse.data.users_data],
            start: Number(resparse.data.start),
            limit: Number(resparse.data.limit),
            total: Number(resparse.data.total),
            count: Number(resparse.data.count),
            page: refresh ? 1 : pre.page + 1,
          }));

          // navigation.setOptions({
          //   title: resparse.data.pageTitle,
          // });
        }
      }
      setHistoryLoad(false);
      // dispatch(setTitleLoad(false));
      setRefresh(false);
    } catch (error) {
      console.log(error, 'error in the history api call');
      setHistoryLoad(false);
      // dispatch(setTitleLoad(false));
      setRefresh(false);
    }
  };

  const HistoryContentApiCall = async () => {
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

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      setLoad(true);
      dispatch(setTitleLoad(true));

      const response = await fetch(Url().historyContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          navigation.setOptions({
            title: resparse?.data?.pageTitle,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the history content api call');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  // api call
  useEffect(() => {
    HistoryContentApiCall();
  }, [setters?.language]);

  // print(history.datas, 'datas---');

  return (
    <>
      {!load ? (
        <View
          style={{
            flex: 1,
            backgroundColor: appColor.bgWhite,
          }}>
          {!historyLoad ? (
            history?.datas && history?.datas.length > 0 ? (
              <FlatList
                maxToRenderPerBatch={12}
                initialNumToRender={12}
                bounces={false}
                alwaysBounceVertical={false}
                data={history.datas}
                style={[
                  commenStyle.container,
                  {
                    paddingVertical: widthResponse ? 20 : 30,
                  },
                ]}
                contentContainerStyle={{
                  paddingBottom: widthResponse ? 60 : 80,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    colors={[appColor.primary]}
                    tintColor={appColor.primary}
                  />
                }
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                  start == history.start &&
                    history.page < history.count &&
                    setStart(Number(history.limit) + Number(start));
                }}
                ListFooterComponent={() =>
                  history.page != history.count && <SpinLoader />
                }
                ItemSeparatorComponent={() => (
                  <View style={{marginBottom: fontScalling(1.4)}} />
                )}
                keyExtractor={({item, index}) => index}
                renderItem={({item, index}) => {
                  return (
                    <HistoryCard
                      index={index}
                      // key={index}
                      item={item}
                      image={item?.img}
                      title={item?.name}
                      subhead={item?.subtitle}
                      date={item?.created_date}
                      time={item?.created_time}
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
        </View>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default History;

const styles = StyleSheet.create({});
