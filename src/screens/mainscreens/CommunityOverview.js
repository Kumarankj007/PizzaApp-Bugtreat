import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavButton from '../../components/Buttons/NavButton';
import {useStyle} from '../../Utilities/styleSheet';
import {print, widthResponse} from '../../Utilities/helperFunction';
import {community} from '../../Utilities/contents';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {setTitleLoad} from '../../Redux/HeaderSlice';
import PageLoader from '../../components/Loader/PageLoader';
import {Url} from '../../Utilities/appApi';
import CommunityRecipe from './CommunityRecipe';
import CommunityUser from './CommunityUser';
import {useAppVideos} from '../../Hooks/useAppVideos';
import {setCommunityVideoShow} from '../../Redux/AppSettingSlice';
import VideoPlayer from '../../components/Video/VideoPlayer';

const CommunityOverview = () => {
  const [content, setContent] = useState({});
  const [communityContent, setCommunityContent] = useState({});
  const [load, setLoad] = useState(false);
  const [activeButtons, setActiveButtons] = useState(0);
  const {commenStyle} = useStyle();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {setters, deviceId, communityVideoShow} = useSelector(
    State => State.appSettings,
  );
  const {communityVideo} = useAppVideos();

  // community content apicall
  const communityContentApiCall = async () => {
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
      const response = await fetch(Url().communityContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setCommunityContent(resparse.data);
          navigation.setOptions({
            title: resparse?.data?.pageTitle,
          });
        }
      }
      setLoad(false);
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in the community  content api call');
      setLoad(false);
      dispatch(setTitleLoad(false));
    }
  };

  useEffect(() => {
    communityContentApiCall();
  }, [setters?.language]);

  const Navtabs = ({activeButtons}) => {
    switch (activeButtons) {
      case 0:
        return <CommunityRecipe data={communityContent.recipe_page_content} />;
      case 1:
        return <CommunityUser data={communityContent.user_page_content} />;
    }
  };
  return (
    <>
      {!load ? (
        <View
          style={[
            commenStyle.rootPage,
            {
              // paddingTop: widthResponse ? 20 : 25,
            },
          ]}>
          {communityVideo && (
            <VideoPlayer
              source={communityVideo}
              onClose={() => dispatch(setCommunityVideoShow(false))}
              onOpen={() => dispatch(setCommunityVideoShow(true))}
              show={communityVideoShow}
              showText={communityContent?.show_demo_video}
              containerStyle={{
                marginBottom: widthResponse ? 15 : 20,
              }}
            />
          )}
          {communityContent?.tab_titles && (
            <NavButton
              title={communityContent.tab_titles}
              activeButtons={activeButtons}
              onPress={setActiveButtons}
              altStyle={{
                marginBottom: 15,
              }}
              dual
            />
          )}
          <Navtabs activeButtons={activeButtons} />
        </View>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default CommunityOverview;

const styles = StyleSheet.create({});
