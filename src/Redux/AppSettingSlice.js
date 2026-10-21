import {createSlice} from '@reduxjs/toolkit';

export const appSettings = createSlice({
  name: 'appsetting',
  initialState: {
    setters: {},
    allUnits: {
      language: [],
      weight: [],
      temperature: [],
    },
    deviceId: '',
    userId: '',
    fcmToken: '',
    searchVideoShow: true,
    planVideoShow: true,
    recipeVideoShow: true,
    communityVideoShow: true,
    plannerVideoShow: true,
    calculatorVideoShow: true,
    notificationEnable: 1,
    logo: '',
  },
  reducers: {
    setSetters: (state, action) => {
      state.setters = action.payload;
    },
    setAllUnits: (state, action) => {
      state.allUnits = action.payload;
    },
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setSearchVideoShow: (state, action) => {
      state.searchVideoShow = action.payload;
    },
    setPlanVideoShow: (state, action) => {
      state.planVideoShow = action.payload;
    },
    setPlannerVideoShow: (state, action) => {
      state.plannerVideoShow = action.payload;
    },
    setCalculatorVideoShow: (state, action) => {
      state.calculatorVideoShow = action.payload;
    },
    setCommunityVideoShow: (state, action) => {
      state.communityVideoShow = action.payload;
    },
    setRecipeVideoShow: (state, action) => {
      state.recipeVideoShow = action.payload;
    },
    setNotificationEnable: (state, action) => {
      state.notificationEnable = action.payload;
    },
    setLogo: (state, action) => {
      state.logo = action.payload;
    },
  },
});

export const {
  setSetters,
  setAllUnits,
  setDeviceId,
  setUserId,
  setFcmToken,
  setSearchVideoShow,
  setPlanVideoShow,
  setRecipeVideoShow,
  setCommunityVideoShow,
  setPlannerVideoShow,
  setCalculatorVideoShow,
  setNotificationEnable,
  setLogo,
} = appSettings.actions;

export default appSettings.reducer;
