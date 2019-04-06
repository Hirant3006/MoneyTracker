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
        <span class="red--text">Forgot</span>
        <span @click="emailSignUp">Signup</span>
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
export default {
  data() {
    return {
      formEmail: "",
      formPassword: ""
    };
  },
  methods: {
    emailLogin() {
      this.$store
        .dispatch("signInWithEmail", {
          email: this.formEmail,
          password: this.formPassword
        })
        .then(() => {
          this.formEmail = "";
          this.formPassword = "";
        })
        .catch(e => {
          console.log(e.message);
        });
    },
    googleSignUp() {
      this.$store
        .dispatch("signInWithGoogle")
        .then(() => {
          console.log("inside then statement on login");
        })
        .catch(e => {
          console.log(e.message);
        });
    },
    facebookSignUp() {
      this.$store
        .dispatch("signInWithFacebook")
        .then(() => {
          console.log("inside then statement on login");
        })
        .catch(e => {
          console.log(e.message);
        });
    },
    emailSignUp() {
      this.$store.dispatch("signUp",{
        email:'lychautrinha@gmail.com',
        password:'lychautrinha'
      }).then(console.log('Sucess in vue file'))
    }
  }
};
</script>

<style lang="css">
</style>
