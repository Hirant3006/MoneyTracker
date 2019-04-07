import Vuex from 'vuex'
import firebase, { auth, GoogleProvider, FacebookProvider } from '@/services/fireinit.js'
export const state = () => ({
  user: null
})

export const getters = () => ({
  activeUser: (state, getters) => {
    return state.user
  }
})

export const mutations = () => ({
  setUser(state, payload) {
    state.user = payload
  }
})

export const actions = () => ({
  autoSignIn({ commit }, payload) {
    commit('setUser', payload)
  },

  signInWithGoogle({ commit }) {
    return new Promise((resolve, reject) => {
      auth.signInWithRedirect(GoogleProvider)
      resolve()
    })
  },
  signInWithFacebook({ commit }) {
    return new Promise((resolve, reject) => {
      auth.signInWithRedirect(FacebookProvider)
      resolve()
    })
  },
  signInWithEmail({ commit }, { email, password }) {

    return auth.signInWithEmailAndPassword(email, password)
  },

  signOut({ commit }) {
    auth.signOut().then(() => {
      commit('setUser', null)
    }).catch(err => console.log(error))
  },

  signUp({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password)
      resolve()
    })

  }
})