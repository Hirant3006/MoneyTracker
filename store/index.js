import Vuex from 'vuex'
import firebase, { auth, GoogleProvider, FacebookProvider } from '@/services/fireinit.js'

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
      signInWithEmail({ commit }, {email,password}) {
        
        return firebase.auth().signInWithEmailAndPassword(email, password)
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

        // return auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        //   // Handle Errors here.

        //   var errorCode = error.code;
        //   var errorMessage = error.message;
        //   // ...
        //   console.log('Error ', error)

        // }

      }
    }
  })
}

export default createStore
