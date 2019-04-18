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
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      formEmail: '',
      formPassword: '',
      dialog: false,
      emailreset: ''
    }
  },
  methods: {
    snackTime: function(snack, color) {
      this.setSnack({ msg: 'awdawdw', color: 'warning' })
      // this.$router.push('/')
    },
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    emailLogin() {
      this.$store
        .dispatch('user/signInWithEmail', {
          email: this.formEmail,
          password: this.formPassword
        })
        .then(() => {
          this.formEmail = ''
          this.formPassword = ''
          this.setSnack({ msg: 'Đăng nhập thành công', color: 'success' })
        })
        .catch(data => {
          this.formEmail = ''
          this.formPassword = ''
          this.setSnack({ msg: data.message, color: 'error' })
        })
    },
    googleSignUp() {
      this.$store
        .dispatch('user/signInWithGoogle')
        .then(() => {
          console.log('inside then statement on login')
        })
        .catch(e => {
          this.setSnack({ msg: e.message, color: 'error' })
        })
    },
    facebookSignUp() {
      this.$store
        .dispatch('user/signInWithFacebook')
        .then(() => {
          console.log('inside then statement on login')
        })
        .catch(e => {
          this.setSnack({ msg: e.message, color: 'error' })
        })
    },
    emailSignUp() {
      this.$store
        .dispatch('user/signUp', {
          email: 'lychautrinha@gmail.com',
          password: 'lychautrinha'
        })
        .then(this.setSnack({ msg: 'Đăng nhập thành công', color: 'success' }))
        .catch(e => {
          this.setSnack({ msg: e.message, color: 'error' })
        })
    },
    resetPassword() {
      this.$store
        .dispatch('user/resetPassword', {
          email: 'lychautrinha@gmail.com'
        })
        .then(() => {
          this.emailreset = ''
          this.setSnack({
            msg: 'Một email xác nhận đã được gửi đến mail của bạn',
            color: 'warning'
          })
        })
        .catch(data => {
          this.emailreset = ''
          this.setSnack({ msg: data.message, color: 'error' })
        })
    }
  }
}
</script>

<style lang="css">
</style>
