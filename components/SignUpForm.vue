<template>
  <v-layout>
    <v-flex text-xs-center xs12 sm6 offset-sm3>
      Đăng ký
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
        <span class="red--text">Forgot</span>
        <span @click="snackTime">Signup</span>
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
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    snackTime: function(snack) {
      this.setSnack('hello')
      // this.$router.push('/')
    },
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    })
  }
}
</script>

<style>
</style>
