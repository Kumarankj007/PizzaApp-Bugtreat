import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Text} from 'react-native';
import BottomTab from './BottomTab';
import AppHeader from '../components/Header/AppHeader';
import Search from '../screens/mainscreens/Search';
import FirstTimeOpen from '../screens/mainscreens/FirstTimeOpen';
import PrivacyPolicy from '../screens/mainscreens/PrivacyPolicy';
import Setting from '../screens/mainscreens/Setting';
import MyAccount from '../screens/mainscreens/MyAccount';
import Login from '../screens/auth/Login';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {setTabs} from '../Redux/HeaderSlice';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Notification from '../screens/mainscreens/Notification';
import FlourOverview from '../screens/mainscreens/FlourOverview';
import IntroSlider from '../screens/mainscreens/IntroSlider';
import Register from '../screens/auth/Register';
import ForgetPassword from '../screens/auth/ForgetPassword';
import AboutUs from '../screens/mainscreens/AboutUs';
import Shop from '../screens/mainscreens/Shop';
import Contact from '../screens/mainscreens/Contact';
import AuthHeader from '../components/Header/AuthHeader';
import FlourDetail from '../screens/mainscreens/FlourDetail';
import MillDetail from '../screens/mainscreens/MillDetail';
import EditProfile from '../screens/mainscreens/EditProfile';
import CommunityOverview from '../screens/mainscreens/CommunityOverview';
import ComunityUserDetail from '../screens/mainscreens/ComunityUserDetail';
import CommunityRecipeDetail from '../screens/mainscreens/CommunityRecipeDetail';
import Calculator from '../screens/mainscreens/Calculator';
import CalcDetail from '../screens/mainscreens/CalcDetail';
import RecipeDetail from '../screens/mainscreens/RecipeDetail';
import RecipeOverview from '../screens/mainscreens/RecipeOverview';
import SetPlan from '../screens/mainscreens/SetPlan';
import History from '../screens/mainscreens/History';
import Wizard from '../screens/mainscreens/Wizard';
import {setCalcValues} from '../Redux/CalculationSlice';
import Iframe from '../screens/mainscreens/Iframe';
import WizardStep2 from '../screens/mainscreens/WizardStep2';
import WizardQue from '../screens/mainscreens/WizardQue';
import WizardHistory from '../screens/mainscreens/WizardHistory';
import WizardStep1 from '../screens/mainscreens/WizardStep1';
import Favorites from '../screens/mainscreens/Favorites';

const Stack = createStackNavigator();
// const appColor = appColors()
export const AuthStack = () => {
  const [route, setRoute] = useState(null);

  const initialised = useSelector(State => State.appSettings);
  const {userStatus} = useSelector(State => State.authSettings);
  const {title} = useSelector(state => state.headSettings);

  // setting the initial route
  useEffect(() => {
    switch (userStatus) {
      case 0:
        setRoute('opening');
        break;
      case 1:
        setRoute('intro');
        break;
      case 2:
        setRoute('bottomTab');
        break;
    }
  }, [userStatus]);

  if (!route) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={route}>
      <Stack.Group
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="opening" component={FirstTimeOpen} />
        <Stack.Screen name="intro" component={IntroSlider} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          header: ({options}) => <AppHeader title={options.title} privacy />,
        }}>
        <Stack.Screen
          name="privacy"
          component={PrivacyPolicy}
          options={{title: title}}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="bottomTab"
          component={BottomTab}
          options={{title: 'Zoomer pizza'}}
        />
      </Stack.Group>
      <Stack.Screen
        name="login"
        component={Login}
        options={{title: 'Zoomer pizza'}}
      />
    </Stack.Navigator>
  );
};

export const RecipeStack = () => {
  const {title} = useSelector(state => state.headSettings);
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Group
        screenOptions={{
          header: ({options}) => (
            <AppHeader title={options.title} backBtnDisabled />
          ),
        }}>
        <Stack.Screen
          name="recipeoverview"
          component={RecipeOverview}
          options={{title: 'recepten'}}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          header: ({options}) => <AppHeader title={options.title} />,
        }}>
        <Stack.Screen
          name="recipedetail"
          component={RecipeDetail}
          options={{title: title}}
        />
        <Stack.Screen
          name="setplan"
          component={SetPlan}
          options={{title: 'Maak een plan'}}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const CalculateStack = () => {
  const {title} = useSelector(state => state.headSettings);
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const {calcValues} = useSelector(state => state.calcuationValues);
  // reset the calculator tab:
  useEffect(() => {
    if (!isFocus) {
      dispatch(setCalcValues({}));
      // dispatch(setOnFlourCalcValue({}));
    }
    navigation.reset({
      index: 1,
      routes: [{name: 'calculator'}],
    });
  }, [isFocus]);
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Group
        screenOptions={{
          header: ({options}) => <AppHeader title={options.title} />,
        }}>
        <Stack.Screen
          name="calculator"
          component={Calculator}
          options={{title: 'Deeg calculator'}}
        />
        <Stack.Screen
          name="calculatorDetail"
          component={CalcDetail}
          options={{title: title}}
        />
        <Stack.Screen
          name="iframe"
          component={Iframe}
          options={{title: title}}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const SearchStack = () => {
  const {title} = useSelector(state => state.headSettings);
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Group
        screenOptions={{
          header: ({options}) => <AppHeader title={options.title} />,
        }}>
        <Stack.Screen
          name="search"
          component={Search}
          options={{title: title}}
        />
        <Stack.Screen
          name="flourOverview"
          component={FlourOverview}
          options={{title: title}}
        />
        <Stack.Screen
          name="flourDetail"
          component={FlourDetail}
          options={{title: title}}
        />
        <Stack.Screen
          name="milldetail"
          component={MillDetail}
          options={{title: title}}
        />
      </Stack.Group>
      <Stack.Screen
        name="NoTabStack"
        component={NoTabStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export const CommunityStack = () => {
  const {title} = useSelector(state => state.headSettings);
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isFocus) {
      const currentRoute =
        navigation.getState().routes[navigation.getState().index].name;
      if (currentRoute == 'Community') {
        navigation.reset({
          index: 1,
          routes: [{name: 'Community'}],
        });
      } else if (currentRoute == 'Search') {
        navigation.reset({
          index: 1,
          routes: [{name: 'Zoeken'}],
        });
      }
    }
  }, [isFocus, navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Group
        screenOptions={{
          header: ({options}) => <AppHeader title={options.title} />,
        }}>
        <Stack.Screen
          name="community"
          component={CommunityOverview}
          options={{title: 'Community'}}
        />
        <Stack.Screen
          name="userDetail"
          component={ComunityUserDetail}
          options={{title: title}}
        />
        <Stack.Screen
          name="recipeDetail"
          component={CommunityRecipeDetail}
          options={{title: title}}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const PlannerStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Group
        screenOptions={{
          header: ({options}) => <AppHeader title={options.title} />,
        }}>
        <Stack.Screen
          name="Wizard"
          component={Wizard}
          options={{title: 'wizard'}}
        />
        <Stack.Screen
          name="wizardStep1"
          component={WizardStep1}
          options={{title: 'wizard'}}
        />
        <Stack.Screen
          name="wizardStep2"
          component={WizardStep2}
          options={{title: 'wizard'}}
        />
        <Stack.Screen
          name="wizardQue"
          component={WizardQue}
          options={{title: 'wizard'}}
        />
        <Stack.Screen
          name="wizardHistory"
          component={WizardHistory}
          options={{title: 'wizard'}}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

// stack for without bottomtab
export const NoTabStack = () => {
  const {title} = useSelector(state => state.headSettings);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const {isLogged} = useSelector(State => State.authSettings);

  useEffect(() => {
    if (isFocus) {
      dispatch(setTabs(false));
    } else if (!isFocus) {
      dispatch(setTabs(true));
    }
  }, [isFocus]);
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      {!isLogged && (
        <Stack.Group
          screenOptions={{
            header: ({options}) => <AuthHeader title={options.title} />,
          }}>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="forget" component={ForgetPassword} />
        </Stack.Group>
      )}
      <Stack.Group
        screenOptions={{
          header: ({options}) => <AppHeader title={options.title} />,
        }}>
        <Stack.Screen
          name="account"
          component={MyAccount}
          options={{title: 'Mijn account'}}
        />
        <Stack.Screen
          name="userDetail"
          component={ComunityUserDetail}
          options={{title: title}}
        />
        <Stack.Screen
          name="recipeDetail"
          component={CommunityRecipeDetail}
          options={{title: title}}
        />
        <Stack.Screen
          name="favorites"
          component={Favorites}
          options={{title: title}}
        />
        <Stack.Screen
          name="setting"
          component={Setting}
          options={{title: 'Instellingen'}}
        />
        <Stack.Screen
          name="notification"
          component={Notification}
          options={{title: 'Notificaties'}}
        />
        <Stack.Screen
          name="aboutus"
          component={AboutUs}
          options={{title: title}}
        />
        <Stack.Screen name="shop" component={Shop} options={{title: title}} />
        <Stack.Screen
          name="contact"
          component={Contact}
          options={{title: title}}
        />
        <Stack.Screen
          name="editprofile"
          component={EditProfile}
          options={{title: 'profiel wijzigen'}}
        />
        <Stack.Screen
          name="history"
          component={History}
          options={{title: 'geschiedenis'}}
        />
        <Stack.Screen
          name="privacy"
          component={PrivacyPolicy}
          options={{title: 'Privacy policy'}}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
