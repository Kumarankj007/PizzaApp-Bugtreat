import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HistoryCard from '../../components/Cards/HistoryCard';
import {print, widthResponse} from '../../Utilities/helperFunction';
import {Url} from '../../Utilities/appApi';
import {useSelector} from 'react-redux';
import {HistoryCardShimmer} from '../../Utilities/appShimmer';
import SpinLoader from '../../components/Loader/SpinLoader';
import Empty from '../../components/Loader/Empty';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {useNavigation} from '@react-navigation/native';
import WizardContent from '../../Hooks/WizardContent';
import PageLoader from '../../components/Loader/PageLoader';
import PrimaryButton from '../../components/Buttons/PrimaryButton';

const WizardHistory = ({content}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const {setters, userId} = useSelector(State => State.appSettings);
  const [refresh, setRefresh] = useState(false);
  const [historyload, setHistoryLoad] = useState(false);
  const [start, setStart] = useState(0);
  const [historyList, setHistoryList] = useState({
    history: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });

  const navigation = useNavigation();
  const {wizContent, load} = WizardContent();

  useEffect(() => {
    navigation.setOptions({
      title: wizContent?.button_three,
    });
  }, [wizContent]);

  //pull to refresh
  const onRefresh = useCallback(() => {
    setHistoryLoad(true);
    setStart(0);
    setHistoryList({
      history: [],
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
      wizardHistoryApi();
    }
  }, [start]);
  useEffect(() => {
    if (refresh) {
      wizardHistoryApi();
    }
  }, [refresh]);
  // wizard content apicall
  const wizardHistoryApi = async () => {
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
      //   print(formData, 'form');
      if (historyList.history.length == 0) setHistoryLoad(true);
      const response = await fetch(Url().wizardHistory, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setHistoryList(prev => ({
            history: refresh
              ? resparse.data.recipes
              : [...prev.history, ...resparse.data.recipes],
            start: Number(resparse.data.start),
            limit: Number(resparse.data.limit),
            total: Number(resparse.data.total),
            count: Number(resparse.data.count),
            page: refresh ? 1 : prev.page + 1,
          }));
        }
      }
      setHistoryLoad(false);
      setRefresh(false);
    } catch (error) {
      console.log(error, 'error in the wizard history api call');
      setHistoryLoad(false);
      setRefresh(false);
    }
  };
  return (
    <>
      {!load ? (
        <View style={{paddingTop: widthResponse ? 15 : 20, flex: 1}}>
          <View
            style={[
              commenStyle.hFlex,
              commenStyle.container,
              {
                justifyContent: 'space-between',
                marginBottom: widthResponse ? 15 : 20,
              },
            ]}>
            {wizContent?.button_three && (
              <Text style={[commenStyle.sideHead, {marginBottom: 0}]}>
                {wizContent?.button_three}
              </Text>
            )}

            {wizContent?.step3?.sorting?.buttonOne && (
              <PrimaryButton
                text={wizContent?.step3?.sorting?.buttonOne}
                invert
                onPress={() => navigation.navigate('wizardQue')}
              />
            )}
          </View>
          {!historyload ? (
            historyList.history && historyList.history.length > 0 ? (
              <FlatList
                data={historyList.history}
                style={{
                  paddingHorizontal: widthResponse ? 15 : 20,
                }}
                contentContainerStyle={{
                  paddingBottom: widthResponse ? 20 : 30,
                }}
                ItemSeparatorComponent={() => {
                  return <View style={{height: widthResponse ? 15 : 20}} />;
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
                  start == historyList.start &&
                    historyList.page < historyList.count &&
                    setStart(Number(historyList.limit) + Number(start));
                }}
                ListFooterComponent={() =>
                  historyList.page != historyList.count && <SpinLoader />
                }
                renderItem={({item, index}) => {
                  return (
                    <HistoryCard
                      key={index}
                      index={index}
                      wizard={true}
                      item={item}
                      title={item?.recipe_name}
                      image={item?.recipe_image}
                      subhead={item?.step}
                      time={item?.start_time}
                      date={item?.start_date}
                      process={item?.current_queue}
                      processText={wizContent?.step3?.pizza_in_the_oven}
                      History={true}
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

export default WizardHistory;

const styles = StyleSheet.create({});
