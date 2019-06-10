<template>
  <v-layout>
    <v-flex text-xs-center xs12 sm6 offset-sm3>
      <span class="title">Đăng ký</span>
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
      <div style="text-align:end;cursor:pointer;color:#3C5A99" @click="$router.push('/')">Quay lại</div>
      <v-btn class="signIn m-t-10 w-200" :loading="loading" @click="emailSignUp" primary>Đăng ký</v-btn>
      <br>

      <span>________OR________</span>
      <div class="m-t-20">
        <v-btn
          class="m-5 w-200"
          color="#DB4437"
          style="color:white;width: 250px;"
          primary
          @click.native="googleSignUp"
        >
          <v-icon>fas fa-google</v-icon>Đăng nhập với Google
        </v-btn>
        <v-btn
          class="m-5 w-200"
          color="#3C5A99"
          style="color:white;width: 250px;"
          primary
          @click.native="facebookSignUp"
        >
          <v-icon>fas fa-facebook</v-icon>Đăng nhập với Facebook
        </v-btn>
      </div>
    </v-flex>
    <v-snackbar v-model="snackbar" :color="color" :timeout="5000" :top="true">
      {{ text }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      formEmail: '',
      formPassword: '',
      snackbar: false,
      color: '',
      text: ''
    }
  },
  methods: {
    emailLogin() {
      this.loading = true
      this.$store
        .dispatch('signInWithEmail', {
          email: this.formEmail,
          password: this.formPassword
        })
        .then(() => {
          this.formEmail = ''
          this.formPassword = ''
          this.loading = false
        })
        .catch(e => {
          this.loading = false
          console.log(e.message)
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
          email: this.formEmail,
          password: this.formPassword
        })
        .then(
          data => {
            this.$router.push('/login')
            this.text = 'Sign up success'
            this.color = 'success'
            this.snackbar = true
          }
          // this.$router.push('/login')
        )
        .catch(data => {
          console.log('catch')
          this.text = data.message
          this.color = 'error'
          this.snackbar = true
          this.formEmail = ''
          this.formPassword = ''
        })
    }
  }
}
</script>

<style>
</style>
