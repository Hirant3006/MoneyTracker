<template>
  <v-layout>
    <v-flex text-xs-center xs12 sm6 offset-sm3>
      Logo
      <v-text-field
        prepend-icon="person"
        name="login"
        label="Login"
        type="text"
        v-model="formEmail"
      ></v-text-field>
      <v-text-field
        prepend-icon="lock"
        name="password"
        label="Password"
        id="password"
        type="password"
        v-model="formPassword"
      ></v-text-field>
      <v-btn class="signIn m-t-10 w-200" @click="emailLogin" primary>Login</v-btn>
      <v-layout class="m-tb-10" justify-space-between>
        <span class="red--text" @click="snackTime" style="cursor:pointer">Forgot</span>
        <router-link to="/signup">Đăng ký</router-link>
      </v-layout>
      <span>________OR________</span>
      <div class="m-t-20">
        <v-btn class="m-5 w-200" primary @click.native="googleSignUp">
          <v-icon>fas fa-google</v-icon>Sign in with Google
        </v-btn>
        <v-btn class="m-5 w-200" primary @click.native="facebookSignUp">
          <v-icon>fas fa-facebook</v-icon>Sign In with Facebook
        </v-btn>
      </div>
    </v-flex>
    <v-snackbar v-model="snackbar" :color="color" :top="true" :timeout="5000">
      {{ text }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Privacy Policy</v-card-title>

        <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">I accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      formEmail: '',
      formPassword: '',
      snackbar: false,
      color: '',
      text: '',
      dialog: false,
      emailreset: ''
    }
  },
  methods: {
    // snackTime: function(snack) {
    //   this.setSnack('hello')
    //   // this.$router.push('/')
    // },
    // ...mapMutations({
    //   setSnack: 'snackbar/setSnack'
    // }),
    emailLogin() {
      console.log('log in')
      this.$store
        .dispatch('users/signInWithEmail', {
          email: this.formEmail,
          password: this.formPassword
        })
        .then(() => {
          this.formEmail = ''
          this.formPassword = ''
        })
        .catch(data => {
          this.text = data.message
          this.color = 'error'
          this.snackbar = true
          this.formEmail = ''
          this.formPassword = ''
        })
    },
    googleSignUp() {
      this.$store
        .dispatch('signInWithGoogle')
        .then(() => {
          console.log('inside then statement on login')
        })
        .catch(e => {
          console.log(e.message)
        })
    },
    facebookSignUp() {
      this.$store
        .dispatch('signInWithFacebook')
        .then(() => {
          console.log('inside then statement on login')
        })
        .catch(e => {
          console.log(e.message)
        })
    },
    emailSignUp() {
      this.$store
        .dispatch('signUp', {
          email: 'lychautrinha@gmail.com',
          password: 'lychautrinha'
        })
        .then(console.log('Sucess in vue file'))
    },
    resetPassword() {
      this.$store
        .dispatch('resetPassword', {
          email: 'lychautrinha@gmail.com'
        })
        .then(() => {
          this.text = 'Một email xác nhận đã được gửi đến mail của bạn'
          this.color = 'warning'
          this.snackbar = true
          this.dialog = false
          this.emailreset = ''
        })
        .catch(data => {
          this.text = data.message
          this.color = 'error'
          this.snackbar = true
          this.emailreset = ''
        })
    }
  }
}
</script>

<style lang="css">
</style>
