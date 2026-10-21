import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Url} from '../Utilities/appApi';
import {print} from '../Utilities/helperFunction';

export const usePaywallContent = () => {
  const {setters} = useSelector(State => State.appSettings);

  const [payWallContent, setPayWallContent] = useState({});
  const [payWallLoad, setPayWallLoad] = useState(false);

  const fetchPayWallContent = async () => {
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
      setPayWallLoad(true);
      const response = await fetch(Url().subscriptionContent, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        if (resparse.status == 'success') {
          setPayWallContent(resparse?.data);
        }
      }
      setPayWallLoad(false);
    } catch (error) {
      console.log(error, 'error in authentication content api call');
      setPayWallLoad(false);
    }
  };

  useEffect(() => {
    fetchPayWallContent();
  }, [setters?.language]);

  return {payWallContent, payWallLoad};
};
