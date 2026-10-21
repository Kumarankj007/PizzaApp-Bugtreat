import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import appColors from '../../Utilities/appColors';
import {widthResponse} from '../../Utilities/helperFunction';
import NavButton from '../../components/Buttons/NavButton';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useStyle} from '../../Utilities/styleSheet';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import {Url} from '../../Utilities/appApi';
import FavoritesFlour from './FavoritesFlour';
import FavoritesMill from './FavoritesMill';
import PageLoader from '../../components/Loader/PageLoader';

const Favorites = () => {
  const [favContent, setFavContent] = useState({});
  const [load, setLoad] = useState(false);
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const [activeButtons, setActiveButtons] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {setters, deviceId, userId} = useSelector(State => State.appSettings);

  // favorite content apicall
  const favoriteContentApiCall = async () => {
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
      const response = await fetch(Url().favoriteContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setFavContent(resparse.data);
          navigation.setOptions({
            title: resparse?.data?.pageTitle,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the favorite content api call');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  useEffect(() => {
    favoriteContentApiCall();
  }, [setters?.language]);

  const Navtabs = ({activeButtons}) => {
    switch (activeButtons) {
      case 0:
        return <FavoritesFlour content={favContent} />;
      case 1:
        return <FavoritesMill content={favContent} />;
    }
  };
  return (
    <>
      {!load ? (
        <View
          style={{
            flex: 1,
            backgroundColor: appColor.bgWhite,
          }}>
          <View
            style={[
              commenStyle.container,
              {
                paddingVertical: widthResponse ? 20 : 25,
              },
            ]}>
            {favContent?.tab_titles && (
              <NavButton
                title={favContent?.tab_titles}
                dual
                activeButtons={activeButtons}
                onPress={setActiveButtons}
              />
            )}
          </View>
          <Navtabs activeButtons={activeButtons} />
        </View>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default Favorites;

const styles = StyleSheet.create({});
