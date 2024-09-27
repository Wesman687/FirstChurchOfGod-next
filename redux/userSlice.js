
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    username: null,
    firstName: null,
    lastName: null,
    email: null,
    uid: null,
    photoUrl: null,
    phone: null,
    isAdmin: false,

}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

    setUser: (state, action) => {
        state.username = action.payload.username,
        state.firstName = action.payload.firstName,
        state.lastName = action.payload.lastName,
        state.email = action.payload.email,
        state.uid = action.payload.uid,
        state.phone = action.payload.phone,
        state.photoUrl = action.payload.photoUrl
        state.isAdmin = action.payload.isAdmin
    },

    signOutUser : (state) =>{
        state.username = null
        state.firstName = null
        state.lastName = null
        state.email = null
        state.uid = null
        state.photoUrl = null
        state.phone = null
        state.isAdmin = null
    }
  }
});

export const { setUser, signOutUser } = userSlice.actions

export default userSlice.reducer