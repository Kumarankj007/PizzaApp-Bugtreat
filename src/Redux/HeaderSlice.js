import {createSlice} from '@reduxjs/toolkit';

export const header = createSlice({
  name: 'headershow',
  initialState: {
    options: false,
    bottomTabs: true,
    title: '',
    titleLoad: false,
    paywallSheet: false,
    cancelSheet: false,
    headLoad: false,
  },
  reducers: {
    setOptions: (state, action) => {
      state.options = action.payload;
    },
    setTabs: (state, action) => {
      state.bottomTabs = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setPaywallSheet: (state, action) => {
      state.paywallSheet = action.payload;
    },
    setCancelSheet: (state, action) => {
      state.cancelSheet = action.payload;
    },
    setTitleLoad: (state, action) => {
      state.titleLoad = action.payload;
    },
    setHeadLoad: (state, action) => {
      state.headLoad = action.payload;
    },
  },
});

export const {
  setOptions,
  setTabs,
  setTitle,
  setPaywallSheet,
  setCancelSheet,
  setTitleLoad,
  setHeadLoad,
} = header.actions;
export default header.reducer;
