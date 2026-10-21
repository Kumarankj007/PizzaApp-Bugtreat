import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Url} from '../Utilities/appApi';
import {useDispatch, useSelector} from 'react-redux';
import {setTitleLoad} from '../Redux/HeaderSlice';

const WizardContent = () => {
  const {setters} = useSelector(State => State.appSettings);
  const [wizContent, setWizContent] = useState({});
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const wizardContentApiCall = async () => {
    try {
      const formData = new FormData();
      formData.append(
        'lcode',
        setters?.language?.language_code
          ? setters?.language?.language_code
          : 'nl',
      );

      const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      };
      dispatch(setTitleLoad(true));
      setLoad(true);
      const response = await fetch(Url().wizardContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setWizContent(resparse?.data);
        }
      }
      dispatch(setTitleLoad(false));
      setLoad(false);
    } catch (error) {
      console.log(error, 'error in wizard content api call');
      dispatch(setTitleLoad(false));
      setLoad(false);
    }
  };

  useEffect(() => {
    wizardContentApiCall();
  }, [setters?.language]);

  return {wizContent, load};
};

export default WizardContent;

const styles = StyleSheet.create({});
