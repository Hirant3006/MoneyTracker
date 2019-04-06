import Vuex from 'vuex'
import firebase, { auth, GoogleProvider,FacebookProvider } from '@/services/fireinit.js'

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null
    },
    getters: {
      activeUser: (state, getters) => {
        return state.user
      }
    },
    mutations: {
      setUser(state, payload) {
        state.user = payload
      }
    },
    actions: {
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
      signInWithEmail({ commit }, payload) {
        console.log(payload)
        return null
      },

      signOut({ commit }) {
        auth.signOut().then(() => {
          commit('setUser', null)
        }).catch(err => console.log(error))
      }
    }
  })
}

export default createStore
