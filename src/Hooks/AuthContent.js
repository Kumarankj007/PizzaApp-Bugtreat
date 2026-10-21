import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Url} from '../Utilities/appApi';
import {print} from '../Utilities/helperFunction';
import {setHeadLoad, setTitleLoad} from '../Redux/HeaderSlice';

export const useAuthenticationContent = () => {
  const {setters} = useSelector(State => State.appSettings);
  const dispatch = useDispatch();

  const [authContent, setAuthContent] = useState(null);
  const [error, setError] = useState(null);
  const [load, setLoad] = useState(false);

  const fetchAuthenticationContent = async () => {
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
      setLoad(true);
      dispatch(setHeadLoad(true));
      dispatch(setTitleLoad(true));
      const response = await fetch(Url().authenticationContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setAuthContent(resparse.data);
        }
      }
      setLoad(false);
      dispatch(setHeadLoad(false));
      dispatch(setTitleLoad(false));
    } catch (error) {
      console.log(error, 'error in authentication content api call');
      setLoad(false);
      dispatch(setHeadLoad(false));
      dispatch(setTitleLoad(false));
    }
  };

  useEffect(() => {
    fetchAuthenticationContent();
  }, [setters.language]);

  return {authContent, load, error};
};
