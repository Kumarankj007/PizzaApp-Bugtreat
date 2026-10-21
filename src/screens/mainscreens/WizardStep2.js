import {FlatList, RefreshControl, ScrollView, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import ShowSwitch from '../../components/Buttons/ShowSwitch';
import {
  formatedNewDate,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import SortingTab from '../../components/Buttons/SortingTab';
import WizardRecipe from '../../components/Cards/WizardRecipe';
import {useSelector} from 'react-redux';
import {Url} from '../../Utilities/appApi';
import SpinLoader from '../../components/Loader/SpinLoader';
import Empty from '../../components/Loader/Empty';
import {HistoryCardShimmer} from '../../Utilities/appShimmer';
import {Toast} from 'react-native-toast-notifications';
import WizardContent from '../../Hooks/WizardContent';
import {useNavigation} from '@react-navigation/native';
import PageLoader from '../../components/Loader/PageLoader';
import SortingCard from '../../components/Cards/SortingCard';

const WizardStep2 = ({route}) => {
  const {searchdatas} = route?.params ? route.params : '';
  const {setters, allUnits, userId} = useSelector(State => State.appSettings);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const navigation = useNavigation();
  const [showOption, setShowOption] = useState(2);
  const [sort, setSort] = useState(1);
  const [showDetail, setShowDetail] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [start, setStart] = useState(0);
  const [recipes, setRecipes] = useState({
    recipes: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });
  const [recipeLoad, setRecipeLoad] = useState(false);

  const {wizContent, load} = WizardContent();

  useEffect(() => {
    navigation.setOptions({
      title: wizContent?.button_one,
    });
  }, [wizContent]);

  const resetState = () => {
    setRecipeLoad(true);
    setRecipes({
      recipes: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
    });
    setStart(0);
    setSort(null);
    // setRefresh(true);
  };

  const handleSortChange = sort => {
    setSort(sort);
    setRecipes({
      recipes: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
      currentSortKey: sort?.sorting_key,
    });
    // console.log(sort,"sor");

    setStart(0);
    setRefresh(true);
  };

  const handleOptionChange = opt => {
    setRecipes({
      recipes: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
      currentSortKey: sort?.sorting_key,
    });
    // console.log(sort,"sor");

    setStart(0);
    setRefresh(true);
  };

  //pull to refresh
  const onRefresh = useCallback(() => {
    setRecipeLoad(true);
    resetState();
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      wizardRecipeApiCall();
    }
  }, [refresh]);

  // wizard recipe result content apicall
  const wizardRecipeApiCall = async () => {
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

      formData.append('showOwnOnly', showOption == 2 ? 0 : 1);

      if (sort?.sorting_key && recipes.currentSortKey !== sort.sorting_key) {
        setRecipes({
          recipes: [],
          start: 0,
          limit: recipes.limit || 8,
          total: 0,
          count: 0,
          page: 0,
          currentSortKey: sort.sorting_key,
        });
        setStart(0);
      }
      if (recipes?.currentSortKey) {
        formData.append('sort', recipes.currentSortKey);
      }
      if (recipes.recipes.length == 0) setRecipeLoad(true);
      if (searchdatas) {
        formData.append('flour_id', searchdatas?.flourName?.flourId);
        // formData.append('flour_id', 3213);
        formData.append(
          'pizza_eat_date',
          formatedNewDate(searchdatas?.cookingDate),
        );
        formData.append('pizza_eat_time', searchdatas?.cookingTime);
        if (searchdatas?.persons)
          formData.append('persons_count', searchdatas?.persons);
        if (searchdatas?.apetite?.sorting_key)
          formData.append('hungry_key', searchdatas?.apetite?.sorting_key);
        if (searchdatas?.size)
          formData.append('flour_strength', searchdatas?.size);
        formData.append('start', start);
      }
      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      // print(formData, 'form');
      if (recipes.recipes.length == 0) setRecipeLoad(true);
      const response = await fetch(Url().wizardRecipeSearch, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setRecipes(prev => ({
            recipes: refresh
              ? resparse.data.card
              : [...prev.recipes, ...resparse.data.card],
            start: Number(resparse.data.start),
            limit: Number(resparse.data.limit),
            total: Number(resparse.data.total),
            count: Number(resparse.data.count),
            page: refresh ? 1 : prev.page + 1,
            currentSortKey: sort?.sorting_key || prev.currentSortKey,
          }));
        }
      }
      setRecipeLoad(false);
      setRefresh(false);
    } catch (error) {
      console.log(error, 'error in the wizard content api call');
      setRecipeLoad(false);
      setRefresh(false);
    }
  };

  useEffect(() => {
    if (Object.keys(searchdatas).length > 0 && !refresh) {
      wizardRecipeApiCall();
    }
  }, [searchdatas, showOption, sort, searchdatas?.flourName?.flourId, start]);

  // saving the choose recipe
  const wizardRecipeSave = async item => {
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
      if (searchdatas) {
        formData.append('flour_id', searchdatas?.flourName?.flourId);
        // formData.append('flour_id', 3213);
        formData.append(
          'pizza_eat_date',
          formatedNewDate(searchdatas?.cookingDate),
        );
        formData.append('pizza_eat_time', searchdatas?.cookingTime);
        if (searchdatas?.persons)
          formData.append('persons_count', searchdatas?.persons);
        if (searchdatas?.apetite?.sorting_key)
          formData.append('hungry_key', searchdatas?.apetite?.sorting_key);
        if (searchdatas?.size)
          formData.append('flour_strength', searchdatas?.size);
      }
      formData.append('calcid', item?.id);

      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      // print(formData, 'form');
      const response = await fetch(Url().wizardRecipeSave, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse, 'resp');
          Toast.show(resparse?.data, {
            type: 'success',
            duration: 2000,
          });
          setTimeout(() => {
            navigation.navigate('wizardQue');
          }, 2000);
        }
      }
    } catch (error) {
      console.log(error, 'error in the wizard content api call');
    }
  };

  return (
    <>
      {!load ? (
        <View style={{flex: 1}}>
          <View
            style={[
              commenStyle.container,
              {paddingVertical: widthResponse ? 15 : 20, zIndex: 1},
            ]}>
            {/* side heading */}
            {wizContent?.step2?.title && (
              <Text style={[commenStyle.sideHead]}>
                {wizContent?.step2?.title}
              </Text>
            )}
            {/* paragraph */}
            {wizContent?.step2?.paragraph && (
              <Text
                style={[
                  commenStyle.para,
                  {
                    marginBottom: widthResponse ? 20 : 25,
                  },
                ]}>
                {wizContent?.step2?.paragraph}
              </Text>
            )}

            {/* recipe show  */}
            <ShowSwitch
              title={wizContent?.step2?.showRecepie?.title}
              yesText={wizContent?.step2?.showRecepie?.yes}
              noText={wizContent?.step2?.showRecepie?.no}
              activeButton={num => {
                handleOptionChange(num);
                setShowOption(num);
              }}
              value={showOption}
            />
            {/* sort card */}
            {wizContent?.step2?.sort_value &&
              wizContent?.step2?.sort_value.length > 0 && (
                <SortingCard
                  label={wizContent?.step2?.sort}
                  Type={sort}
                  placeholder={wizContent?.step2?.sort}
                  setType={setSort}
                  sortArray={wizContent?.step2?.sort_value}
                  altStyle={{paddingHorizontal: 0}}
                  onPress={num => {
                    handleSortChange(num);
                    setSort(num);
                  }}
                  dropStyle={{
                    left: 0,
                  }}
                />
              )}
            {/* <SortingTab
              title={wizContent?.step2?.sort}
              datas={wizContent?.step2?.sort_value}
              activeButton={num => {
                handleSortChange(num);
                setSort(num);
              }}
              value={sort}
              style={{
                marginBottom: 15,
              }}
            /> */}
          </View>
          <View style={{flex: 1}}>
            {!recipeLoad ? (
              recipes.recipes && recipes.recipes.length > 0 ? (
                <FlatList
                  data={recipes.recipes}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View style={{height: 10}} />}
                  refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={onRefresh}
                      colors={[appColor.primary]}
                      tintColor={appColor.primary}
                    />
                  }
                  onEndReached={() => {
                    start == recipes.start &&
                      recipes.page < recipes.count &&
                      setStart(Number(recipes.limit) + Number(start));
                  }}
                  ListFooterComponent={() =>
                    recipes.page != recipes.count && <SpinLoader />
                  }
                  contentContainerStyle={{
                    paddingHorizontal: widthResponse ? 15 : 20,
                    paddingVertical: widthResponse ? 20 : 30,
                  }}
                  renderItem={({item, index}) => {
                    return (
                      <WizardRecipe
                        key={index}
                        buttonText={wizContent?.step2?.recipes?.recipeButton}
                        usedContent={wizContent?.step2?.recipes?.used}
                        data={item}
                        drop={showDetail.includes(index)}
                        onpress={() => setShowDetail([index])}
                        onSelect={() => wizardRecipeSave(item)}
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
        </View>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default WizardStep2;
