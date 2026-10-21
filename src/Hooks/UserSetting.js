import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Url} from '../Utilities/appApi';
import {setUserDatas, setUserSetLoad} from '../Redux/AuthSlice';

const UserSetting = () => {
  const {setters, userId, deviceId} = useSelector(State => State.appSettings);
  const {userDatas} = useSelector(State => State.authSettings);

  const dispatch = useDispatch();
  const fetchUserSettings = async () => {
    try {
      if (Object.keys(userDatas).length === 0) {
        dispatch(setUserSetLoad(true));
      }

      const formData = new FormData();
      formData.append('lcode', setters?.language?.language_code ?? 'nl');
      if (userId) {
        formData.append('id', userId);
      }

      formData.append('device_id', deviceId);

      // print(formData, 'form hooks');

      const response = await fetch(Url().userSetting, {
        method: 'POST',
        body: formData,
        // redirect: 'follow',
      });

      // print(response, 'responx');
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          // print(resparse.data, 'resparse');
          dispatch(setUserDatas(resparse.data));
          // Optionally update Redux state here if needed
        }
      }
      dispatch(setUserSetLoad(false));
    } catch (error) {
      console.log(error, 'error in user setting api call');
    }
  };
  return fetchUserSettings;
  useEffect(() => {
    apiCall();
  }, [isLogged, setters?.language]);
};

export default UserSetting;

const styles = StyleSheet.create({});
