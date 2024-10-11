import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    accountModalOpen: false,
    loginModalOpen: false,
    eventModalOpen: false,
    commentModalOpen: false,
    emojiModalOpen: false,
    commentDetails: {
        id: null,
        comment: null,
        photoUrl: null,
        name: null,
        username: null,
    }

}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openAccountModal: (state) => {
        state.accountModalOpen = true
    },
    closeAccountModal: (state) => {
        state.accountModalOpen = false
    },
    openLoginModal: (state) => {
        state.loginModalOpen = true
    },
    closeLoginModal: (state) => {
        state.loginModalOpen = false
    },
    openEventModal: (state) => {
        state.eventModalOpen = true
    },
    closeEventModal: (state) => {
        state.eventModalOpen = false
    },
    openEmojiModal: (state) => {
        state.emojiModalOpen = true
    },
    closeEmojiModal: (state) => {
        state.emojiModalOpen = false
    },
    openCommentModal: (state) => {
        state.commentModalOpen = true
    },
    closeCommentModal: (state) => {
        state.commentModalOpen = false
    },
    setComment: (state, action) => {        
        state.commentDetails.username = action.payload.username,
        state.commentDetails.name = action.payload.name,
        state.commentDetails.id = action.payload.id,
        state.commentDetails.photoUrl = action.payload.photoUrl        
        state.commentDetails.comment = action.payload.comment
    }
  }
});

export const { openAccountModal, closeAccountModal, openLoginModal, closeLoginModal, openCommentModal, closeCommentModal, setComment, openEventModal, closeEventModal,
    openEmojiModal, closeEmojiModal,
  } = modalSlice.actions

export default modalSlice.reducer