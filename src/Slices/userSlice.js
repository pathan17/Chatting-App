import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")) : null,
  },
  reducers: {
    userLogInfo: (state , action) => {
        state.userInfo = action.payload

    },
  
  },
})


export const { userLogInfo } = userSlice.actions

export default userSlice.reducer