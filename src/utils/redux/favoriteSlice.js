import { createSlice } from '@reduxjs/toolkit'

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    favoriteCount: 0
  },
  reducers: {
    updateCount: (state, action) => {
      state.favoriteCount = action.payload
    }
  }
})

export const { updateCount } = favoriteSlice.actions
export default favoriteSlice.reducer