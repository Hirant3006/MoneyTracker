import Vuex from 'vuex'
import firebase, { auth, GoogleProvider, FacebookProvider } from '@/services/fireinit.js'
import snackbar from './snackbar'
import users from './users'

const createStore = () => {
  return new Vuex.Store({
    namespaced: true,
    modules: {
      snackbar:snackbar,
      user:users
    },
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
      signInWithEmail({ commit }, { email, password }) {

        return auth.signInWithEmailAndPassword(email, password)
      },

      signOut({ commit }) {
        auth.signOut().then(() => {
          commit('setUser', null)
        }).catch(err => console.log(error))
      },

      signUp({ commit }, { email, password }) {
        return auth.createUserWithEmailAndPassword(email, password)
      },
      resetPassword({ commit }, { email }) {
        return auth.sendPasswordResetEmail(email)
      }
    }
  })
}

export default createStore
