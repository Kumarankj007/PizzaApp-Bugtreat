import {createSlice} from '@reduxjs/toolkit';

export const CalculationSlice = createSlice({
  name: 'calcuationValues',
  initialState: {
    calcValues: {},
    onFlourcalcValues: {},
  },
  reducers: {
    setCalcValues: (state, action) => {
      state.calcValues = action.payload;
    },
    setOnFlourCalcValue: (state, action) => {
      state.onFlourcalcValues = action.payload;
    },
  },
});

export const {setCalcValues, setOnFlourCalcValue} = CalculationSlice.actions;
export default CalculationSlice.reducer;
