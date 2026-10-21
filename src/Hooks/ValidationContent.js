import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Url} from '../Utilities/appApi';
import {useDispatch, useSelector} from 'react-redux';
import {print} from '../Utilities/helperFunction';

const ValidationContent = () => {
  const {setters} = useSelector(State => State.appSettings);
  const [valContent, setValContent] = useState({});
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const validationContentApiCall = async () => {
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
      };
      setLoad(true);
      const response = await fetch(Url().validationContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resp');
        if (resparse.status == 'success') {
          setValContent(resparse?.data);
        }
      }
      setLoad(false);
    } catch (error) {
      console.log(error, 'error in validation content api call');
      setLoad(false);
    }
  };

  useEffect(() => {
    validationContentApiCall();
  }, [setters?.language]);

  return {valContent, load};
};

export default ValidationContent;

const styles = StyleSheet.create({});
