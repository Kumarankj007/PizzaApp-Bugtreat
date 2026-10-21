import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {useDispatch, useSelector} from 'react-redux';
import {Url} from '../../Utilities/appApi';
import RightButtonCard from '../../components/Cards/RightButtonCard';
import ModalBottomSheet from '../../components/BottomSheet/ModalBottomSheet';
import {InputText} from '../../components/InputFields/InputText';
import SelectDropDown from '../../components/DropDowns.js/SelectDropDown';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {FlourCardShimmer, RecipeCardShimmer} from '../../Utilities/appShimmer';
import RecipeCommunity from '../../components/Cards/RecipeCommunity';
import SpinLoader from '../../components/Loader/SpinLoader';
import Empty from '../../components/Loader/Empty';
import KeyboardVisible from '../../Hooks/KeyboardVisible';
import {print, widthResponse} from '../../Utilities/helperFunction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CommunityRecipe = ({data}) => {
  const [sheet, setSheet] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const keyboardVisible = KeyboardVisible(true); //@@
  const [filterData, setFilterData] = useState({});
  const textFocus = useRef(null);
  const appColor = appColors();
  const {commenStyle} = useStyle();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {setters, deviceId, userId} = useSelector(State => State.appSettings);
  const isFocus = useIsFocused();
  const [load, setLoad] = useState(false);
  const [sortType, setSortType] = useState();
  const [sortName, setSortName] = useState('');
  const [sortError, setSortError] = useState(false);
  const [recipes, setRecipes] = useState({
    recipe: [],
    start: 0,
    limit: 0,
    total: 0,
    count: 0,
    page: 0,
  });
  const [start, setStart] = useState(0);
  const numColumns = widthResponse ? 2 : 3;
  const separator = widthResponse ? 15 : 20;

  //pull to refresh
  const onRefresh = useCallback(() => {
    setLoad(true);
    setRecipes({
      recipe: [],
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
      communityRecipeApiCall();
    }
  }, [start, setters?.language]);

  useEffect(() => {
    if (!refresh || !isFocus) {
      setLoad(true);
      setRecipes({
        recipe: [],
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
    }
  }, [setters?.language, isFocus]);

  useEffect(() => {
    if (refresh) {
      communityRecipeApiCall();
    }
  }, [refresh]);

  const handleSortChange = () => {
    if (sortName == '' || (sortType && Object.keys(sortType).length == 0)) {
      setSortError(true);
    }
    setSortError(false);
    setLoad(true);
    setRecipes({
      recipe: [],
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

  // community recipe apicall
  const communityRecipeApiCall = async filter => {
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
      formData.append('start', start);

      const sortKey = recipes?.currentSortKey || recipes?.sortName;
      if (sortKey) {
        if (sortType && Object.keys(sortType).length != 0)
          formData.append('sort', sortType.sorting_key);
        if (sortName != '') formData.append('search', sortName);
      }

      const requestOptions = {
        method: 'POST',
        body: formData,
      };
      if (recipes?.recipe?.length == 0) setLoad(true);
      const response = await fetch(Url().communityRecipes, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setRecipes(prev => ({
            recipe: refresh
              ? resparse.data.card
              : [...prev.recipe, ...resparse.data.card],
            start: Number(resparse.data.start),
            limit: Number(resparse.data.limit),
            total: Number(resparse.data.total),
            count: Number(resparse.data.count),
            page: refresh ? 1 : prev.page + 1,
          }));

          if (sortKey) {
            setRecipes(prev => ({
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
      console.log(error, 'error in the community recipes api call');
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
          textVal={data?.community_recipes}
          btnVal={data?.filter_recipes}
          iconComponent={'MaterialCommunityIcons'}
          iconName={'tune'}
          iconSize={widthResponse ? 20 : 30} //@@
          onPress={() => setSheet(!sheet)}
          btnHover={sheet}
          altStyle={{
            marginBottom: 10,
          }}
        />
        {!load ? (
          recipes?.recipe && recipes.recipe.length > 0 ? (
            <FlatList
              data={recipes.recipe}
              style={[commenStyle.container]}
              numColumns={numColumns}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={onRefresh}
                  colors={[appColor.primary]}
                  tintColor={appColor.primary}
                />
              }
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
              ListFooterComponent={() =>
                recipes.page != recipes.count && <SpinLoader />
              }
              onEndReached={() => {
                start == recipes.start &&
                  recipes.page < recipes.count &&
                  setStart(Number(recipes.limit) + Number(start));
              }}
              contentContainerStyle={{
                paddingVertical: 15,
              }}
              renderItem={({item, index}) => (
                <RecipeCommunity
                  key={index}
                  index={index}
                  data={item}
                  numColumns={numColumns}
                  seperator={separator}
                  addedTime={data?.added_on}
                  readyTime={data?.ready_in}
                  topPick={data?.top_choice}
                  onPress={() => {
                    navigation.navigate('recipeDetail', {item});
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

        {/* recipe filter sheet */}
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
          <KeyboardAwareScrollView
            contentContainerStyle={{
              marginBottom: keyboardVisible == 0 ? 40 : keyboardVisible,
            }} //@@
            scrollEnabled={true}
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
              // top
              sorting
              modal
              withOutDrop
              label={data?.sort}
              placeholder={data?.sort}
              datas={data?.sort_value}
              onChange={setSortType}
              value={sortType}
            />
            {sortError && <Text>please select one sort</Text>}
            <PrimaryButton
              text={data?.filter_button}
              style={{
                marginBottom: 0,
              }}
              onPress={handleSortChange}
            />
          </KeyboardAwareScrollView>
          {/* </BottomSheetScrollView> */}
        </ModalBottomSheet>
      </View>
    </>
  );
};

export default CommunityRecipe;

const styles = StyleSheet.create({});
