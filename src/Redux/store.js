import {combineReducers, configureStore} from '@reduxjs/toolkit';
import storage from '@react-native-async-storage/async-storage';
import AppSettingSlice from './AppSettingSlice';
import HeaderSlice from './HeaderSlice';
// import AuthSetting from './AuthSlice';
import persistReducer from 'redux-persist/es/persistReducer';
import {version} from 'react';
import {FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import CalculationSlice from './CalculationSlice';
import TriggerSlice from './TriggerSlice';
import AuthSlice from './AuthSlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['headSettings', 'calcuationValues', 'trigger'], // do not store this state
};

const reducer = combineReducers({
  appSettings: AppSettingSlice,
  headSettings: HeaderSlice,
  authSettings: AuthSlice,
  calcuationValues: CalculationSlice,
  trigger: TriggerSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
