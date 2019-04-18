import { auth, GoogleProvider, FacebookProvider } from '@/services/fireinit.js'

const state = () => ({
  user: null
})

const getters = {
  activeUser: (state, getters) => {
    return state.user
  }
}

const mutations = {
  setUser(state, payload) {
    state.user = payload
  }
}

const actions ={
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters // <== make sure this is defined
}