import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    accountModalOpen: false,
    loginModalOpen: false,
    eventModalOpen: false,
    commentModalOpen: false,
    emojiModalOpen: false,
    commentTweetDetails: {
        id: null,
        tweet: null,
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
    setCommentTweet: (state, action) => {        
        state.commentTweetDetails.username = action.payload.username,
        state.commentTweetDetails.name = action.payload.name,
        state.commentTweetDetails.id = action.payload.id,
        state.commentTweetDetails.photoUrl = action.payload.photoUrl        
        state.commentTweetDetails.tweet = action.payload.tweet
    }
  }
});

export const { openAccountModal, closeAccountModal, openLoginModal, closeLoginModal, openCommentModal, closeCommentModal, setCommentTweet, openEventModal, closeEventModal,
    openEmojiModal, closeEmojiModal,
  } = modalSlice.actions

export default modalSlice.reducer