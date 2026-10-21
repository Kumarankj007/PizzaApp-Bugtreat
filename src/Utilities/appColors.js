import React, { useState } from 'react'

const appColors = () => {
  const [Theme, setTheme] = useState('light');
  return Theme == 'light' ? {
    primary : '#fe4f1b',
    primaryLight : '#ffeae3',
    tooLight : '#fff6f3',
    black: '#000',
    white: '#fff',
    textWhite: '#fff',
    textBlack: '#000',
    bgWhite: '#fff',
    bgBlack: '#000',
    ToastSuccess: '#228B22',
    ToastInfo: '#ffcc00',
    ToastError: '#ff0000',
    ToastSuccessBack: '#e5f6df',
    ToastInfoBack: '#FFFACD',
    ToastErrorBack: '#FFCCCB',
    formError: '#cc3300',
    boldBlacktext: '#333333',
    Textlightblack: '#666666',
    TextInputborderbg: '#d3d3d3',
    placeHolderText: '#b4b3b3',
    placeHolderTextDark: '#b9b9b9',
    inputBackDark: '#111111',
    borderColor: '#e5e5e5',
    cardBack: '#f3f3f3',
    greyBg: '#f4f4f4',
    searchPlaceHolder: '#bbbbbb',
    smokeBack: '#f4f4f4',
    gold: '#f4a045',
    sliderGreyBg: '#dedede',
    ratingGold: '#e5a820',
    textGrey: '#a3a2a2',
    cardbg: '#f4f4f4',
    subtotalBack: '#fef5ec',
    ratingGray: '#dbdbdb',
    overlayBg: 'rgba(0, 0, 0, 0.3)',
    loadOverlay : '#fff',
    paid: '#32ba7c',
    cancel: '#e51313',
    cancelLight: '#fce7e7',
    themeyellowLight: '#fdecda',
    yellowDotBorder: '#fce2c7',
    yellowLine: '#fbdab7',
    lightGreyLine: '#d9d9d9',
    lightBlue: '#43bbd9',
    themeYellowDark: '#ea9a43',
    lightBlue2: '#6dcef6',
    activegreen: '#06a23a',
    lightGreen: '#daf5e3',
    active: '#06a23a',
    deactive: '#f2252c',
    lightBlackBack: '#939393',
    tabText : '#808080',


  } :
  {

  }
}

export default appColors