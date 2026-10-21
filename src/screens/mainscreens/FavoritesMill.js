import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {widthResponse} from '../../Utilities/helperFunction';
import {Url} from '../../Utilities/appApi';
import SpinLoader from '../../components/Loader/SpinLoader';
import Empty from '../../components/Loader/Empty';
import {FlourCardShimmer} from '../../Utilities/appShimmer';
import FlourCard from '../../components/Cards/FlourCard';

const FavoritesMill = ({content}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const {setters, userId} = useSelector(State => State.appSettings);
  const [load, setLoad] = useState(false);
  const [mills, setMills] = useState({
    mill: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });
  const [start, setStart] = useState(0);
  const numColumns = widthResponse ? 2 : 3;
  const separator = widthResponse ? 15 : 20;

  const resetState = () => {
    setLoad(true);
    setMills({
      mill: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
    });
    setStart(0);
  };

  //pull to refresh
  const onRefresh = useCallback(() => {
    setLoad(true);
    resetState();
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      followedMillsApicall();
    }
  }, [refresh]);

  useEffect(() => {
    if (!refresh) {
      followedMillsApicall();
    }
  }, [start]);

  // overview datas apicall
  const followedMillsApicall = async () => {
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

      formdata.append('start', start);
      formdata.append('user_id', userId ? userId : 0);
      if (mills.mill.length == 0) setLoad(true);
      const response = await fetch(Url().followedMills, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setMills(prev => ({
            mill: refresh
              ? resparse?.data?.flour
              : [...prev.mill, ...resparse?.data?.flour],
            start: Number(resparse.data.start),
            limit: Number(resparse.data.limit),
            total: Number(resparse.data.total),
            count: Number(resparse.data.count),
            page: refresh ? 1 : prev.page + 1,
          }));
        }
      }
      setLoad(false);
      setRefresh(false);
    } catch (error) {
      console.log(error, 'error in the favorite mills results screen');
      setLoad(false);
      setRefresh(false);
    }
  };
  return (
    <>
      {!load ? (
        mills?.mill?.length > 0 ? (
          <FlatList
            data={mills.mill}
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
            ItemSeparatorComponent={() => <View style={{height: separator}} />}
            ListFooterComponent={() =>
              mills.page != mills.count && <SpinLoader />
            }
            onEndReached={() => {
              start == mills.start &&
                mills.page < mills.count &&
                setStart(Number(mills.limit) + Number(start));
            }}
            renderItem={({item, index}) => {
              return (
                <FlourCard
                  index={index}
                  key={index}
                  item={item}
                  numColumns={numColumns}
                  separator={separator}
                  favorite
                  onPress={() => {
                    navigation.navigate('milldetail', {
                      detail: item,
                    });
                  }}
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
    </>
  );
};

export default FavoritesMill;

const styles = StyleSheet.create({});
