import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import {Url} from '../Utilities/appApi';
import {print} from '../Utilities/helperFunction';

export const userSettingApi = createAsyncThunk(
  'userSettingApi',
  async (_, {getState}) => {
    try {
      const state = getState();
      // print(state.appSettings.userId, 'statr');
      const formData = new FormData();
      if (state?.appSettings?.userId) {
        formData.append('id', state.appSettings.userId);
      }
      formData.append(
        'lcode',
        state?.appSettings?.setters?.language?.language_code
          ? state?.appSettings?.setters?.language?.language_code
          : 'nl',
      );

      var requestOptions = {
        method: 'POST',
        body: formData,
      };
      const response = await fetch(Url().userSetting, requestOptions);
      if (response.status == 200) {
        const resparse = await response.json();
        // print(resparse, 'resp');
        return resparse.data;
      }
    } catch (error) {
      console.log(error, 'error in user setting api call');
      return isRejectedWithValue(error.message);
    }
  },
);
const AuthSetting = createSlice({
  name: 'authSetting',
  initialState: {
    userSetLoad: false,
    userStatus: 0,
    isLogged: false,
    isSubscribed: false,
    userDatas: {},
    userDetails: {
      username: '',
      usermail: '',
      password: '',
      country: {},
      profilepicture: {
        name: 'profile.jpeg',
        uri: '',
        type: 'image/jpeg',
      },
      profileStatus: false,
    },
  },
  reducers: {
    setUserStatus: (state, action) => {
      state.userStatus = action.payload;
    },
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
    setIsSubscribed: (state, action) => {
      state.isSubscribed = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setUserSetLoad: (state, action) => {
      state.userSetLoad = action.payload;
    },
    setUserDatas: (state, action) => {
      state.userDatas = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(userSettingApi.fulfilled, (state, action) => {
      state.userDatas = action.payload;
      state.userSetLoad = false;
    });
    builder.addCase(userSettingApi.pending, (state, action) => {
      // state.userDatas = {};
      if (Object.keys(state.userDatas).length == 0) {
        state.userSetLoad = true;
      }
    });
    builder.addCase(userSettingApi.rejected, (state, action) => {
      // state.userDatas = {};
      state.userSetLoad = false;
    });
  },
});

export const {
  setUserDetails,
  setUserStatus,
  setIsLogged,
  setUserSetLoad,
  setIsSubscribed,
  setUserDatas,
} = AuthSetting.actions;
export default AuthSetting.reducer;
