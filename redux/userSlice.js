
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
    isMember: false,
    isSuper: false,
    isSuperSuper: false,
    userRef: null,
    commentRef: null,

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
        state.isMember = action.payload.isMember
        state.isSuper = action.payload.isSuper
        state.userRef = action.payload.userRef
        state.commentRef = action.payload.commentRef
        state.isSuperSuper = action.payload.isSuperSuper
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
        state.isMember = null
        state.isSuper = null
        state.userRef = null
        state.commentRef = null
        state.isSuperSuper = null
    }
  }
});

export const { setUser, signOutUser } = userSlice.actions

export default userSlice.reducer