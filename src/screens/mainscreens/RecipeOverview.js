import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {print, widthResponse} from '../../Utilities/helperFunction';
import SortingCard from '../../components/Cards/SortingCard';
import ShowSwitch from '../../components/Buttons/ShowSwitch';
import ScrollCard from '../../components/Cards/ScrollCard';
import Recipe from '../../components/Cards/Recipe';
import SpinLoader from '../../components/Loader/SpinLoader';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {setTitle, setTitleLoad} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import PageLoader from '../../components/Loader/PageLoader';
import {FlourCardShimmer, RecipeCardShimmer} from '../../Utilities/appShimmer';
import Empty from '../../components/Loader/Empty';
import VideoPlayer from '../../components/Video/VideoPlayer';
import {setRecipeVideoShow} from '../../Redux/AppSettingSlice';
import {useAppVideos} from '../../Hooks/useAppVideos';

const RecipeOverview = ({route}) => {
  const forRefresh = route?.params?.delete && route.params.delete == 'delete';
  const isFocus = useIsFocused();
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const separator = widthResponse ? 15 : 20;
  const numColumns = widthResponse ? 2 : 3; //@@
  const [sortType, setSortType] = useState();
  const [showOption, setShowOption] = useState(2);
  const dispatch = useDispatch();
  const Navigation = useNavigation();
  const [load, setLoad] = useState(false);
  const [recipeLoad, setRecipeLoad] = useState(false);
  const [recipeContent, setRecipeContent] = useState({});
  const {setters, deviceId, userId, recipeVideoShow} = useSelector(
    State => State.appSettings,
  );
  const {isLogged, isSubscribed} = useSelector(State => State.authSettings);
  const [refresh, setRefresh] = useState(false);
  const [recipes, setRecipes] = useState({
    recipes: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });

  const {recipesVideo} = useAppVideos();

  const [start, setStart] = useState(0);

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
      dispatch(setTitleLoad(true));
      const response = await fetch(Url().recipeOverviewContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse,"resp")
        if (resparse.status == 'success') {
          setRecipeContent(resparse.data);
          Navigation.setOptions({
            title: resparse.data.title,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the recipe overview content screen');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  const handleSortChange = sort => {
    setSortType(sort);
    setRecipes({
      recipes: [],
      start: 0,
      limit: 0,
      total: 0,
      count: 0,
      page: 0,
      currentSortKey: sort?.sorting_key,
    });

    setStart(0);
    setRefresh(true);
  };

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
    setSortType(null);
    // setRefresh(true);
  };

  //pull to refresh
  const onRefresh = useCallback(() => {
    setRecipeLoad(true);
    resetState();
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (!refresh && isFocus) {
      recipeOverViewApicall();
    }
  }, [start, showOption, isLogged, isFocus]);

  useEffect(() => {
    if (!refresh || !isFocus) {
      resetState();
    }
  }, [setters?.language, isFocus]);

  useEffect(() => {
    if (refresh) {
      recipeOverViewApicall();
    }
  }, [refresh]);

  // overview datas apicall
  const recipeOverViewApicall = async () => {
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

      if (deviceId) formdata.append('uuId', deviceId);
      if (isLogged) formdata.append('show_community', showOption == 2 ? 0 : 1);
      formdata.append('user_id', userId ? userId : 0);

      if (
        sortType?.sorting_key &&
        recipes.currentSortKey !== sortType.sorting_key
      ) {
        setRecipes({
          recipes: [],
          start: 0,
          limit: recipes.limit || 8,
          total: 0,
          count: 0,
          page: 0,
          currentSortKey: sortType.sorting_key,
        });
        setStart(0);
      }
      if (recipes?.currentSortKey) {
        formdata.append('sort', recipes.currentSortKey);
      }
      if (recipes.recipes.length == 0) setRecipeLoad(true);
      // print(formdata, 'form');
      const response = await fetch(Url().recipeOverview, requestOptions);
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
            currentSortKey: sortType?.sorting_key || prev.currentSortKey,
          }));
        }
      }
      setRecipeLoad(false);
      setRefresh(false);
    } catch (error) {
      console.log(error, 'error in the recipe overview results screen');
      setRecipeLoad(false);
      setRefresh(false);
    }
  };

  // overView Content content
  useEffect(() => {
    overViewContentApicall();
  }, [setters.language]);

  return (
    <>
      {!load ? (
        <View style={[commenStyle.rootPage]}>
          {recipesVideo && (
            <VideoPlayer
              source={recipesVideo}
              onClose={() => dispatch(setRecipeVideoShow(false))}
              onOpen={() => dispatch(setRecipeVideoShow(true))}
              show={recipeVideoShow}
              showText={recipeContent?.show_demo_video}
              containerStyle={{
                marginBottom: widthResponse ? 15 : 20,
              }}
            />
          )}
          {/* sort card */}
          <SortingCard
            label={recipeContent?.sort}
            placeholder={recipeContent?.sort}
            Type={sortType}
            // setType={setSortType}
            onPress={it => handleSortChange(it)}
            sortArray={recipeContent?.sort_value}
            altStyle={{marginBottom: widthResponse ? 15 : 20}}
          />

          {/* show switch */}
          {/* recipe switch show  */}

          {isLogged && userId && userId != '' && isSubscribed && (
            <ShowSwitch
              title={recipeContent?.show_used_recipes}
              yesText={recipeContent?.yes}
              noText={recipeContent?.no}
              activeButton={num => {
                setRecipes({
                  recipes: [],
                  start: 0,
                  limit: 0,
                  total: 0,
                  count: 0,
                  page: 0,
                });
                setStart(0);
                setRefresh(true);
                setSortType(null);
                setShowOption(num);
              }}
              value={showOption}
              style={[commenStyle.container]}
            />
          )}
          {/* recipe list */}
          {!recipeLoad ? (
            recipes?.recipes && recipes?.recipes.length > 0 ? (
              <FlatList
                data={recipes.recipes}
                contentContainerStyle={[
                  commenStyle.container,
                  {
                    paddingVertical: 15,
                  },
                ]}
                numColumns={numColumns} //@@
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                  return <View style={{height: separator}} />;
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
                  start == recipes.start &&
                    recipes.page < recipes.count &&
                    setStart(Number(recipes.limit) + Number(start));
                }}
                ListFooterComponent={() =>
                  recipes.page != recipes.count && <SpinLoader />
                }
                renderItem={({item, index}) => (
                  <Recipe
                    share={recipeContent?.share}
                    shareText={recipeContent?.share_message}
                    shared={recipeContent?.recipe_shared}
                    notshared={recipeContent?.recipe_not_shared}
                    lastused={recipeContent?.last_used}
                    created={recipeContent?.created_on}
                    used={recipeContent?.used}
                    key={index}
                    numColumns={numColumns} //@@
                    data={item}
                    id={index}
                    seperator={separator}
                    availabelText={recipeContent?.plan_available}
                    onPress={() => {
                      // dispatch(setTitle(item.name));
                      if (item?.users_recipes == '1') {
                        Navigation.navigate('recipedetail', {
                          detail: item,
                        });
                      }
                      if (item?.users_recipes == '0') {
                        Navigation.navigate('Community', {
                          screen: 'recipeDetail',
                          params: {
                            value: 'community',
                            item,
                          },
                        });
                      }
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
            <RecipeCardShimmer />
          )}
        </View>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default RecipeOverview;

const styles = StyleSheet.create({});
