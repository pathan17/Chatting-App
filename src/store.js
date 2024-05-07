import { configureStore } from '@reduxjs/toolkit'
import userSlice from './Slices/userSlice'
import activeChatSlice from './Slices/activeChatSlice'



export default configureStore({
  reducer: {
    userLogInfo: userSlice,
    activeChatSlice:activeChatSlice
  },
})