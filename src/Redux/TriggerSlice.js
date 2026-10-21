import { createSlice } from "@reduxjs/toolkit";

export const TriggerSlice = createSlice({
    name : 'trigger',
    initialState : {
        trigger : 0
    },
    reducers : {
        setTrigger : (state,action) => {
            state.trigger = state.trigger + 1
        }
    }
})


export const { setTrigger } = TriggerSlice.actions
export default TriggerSlice.reducer