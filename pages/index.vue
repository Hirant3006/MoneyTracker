<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <div >
        <div class="mt-5" v-if="!$store.state.user">
          <login-form></login-form>
        </div>
        <div v-else>
          <!-- <h4 class="blue--text">You're logged in!</h4>
            <v-btn icon class="blue white--text">
              <v-icon>thumb_up</v-icon>
          </v-btn>-->
          <Home/>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import LoginForm from '~/components/LoginForm'
import Home from '~/components/Home'
export default {
  components: {
    LoginForm,
    Home
  }
}
</script>

<style scoped>
.fake {
  background: blue;
}
.wrapper {
  margin-top: -7.5em;
}
.flexWrapper {
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
}
.container {
  height: calc(100vh - 100px);
  align-items: center;
  align-content: center;
  display: flex;
  justify-content: center;
}
.title {
  font-size: 2.5em !important;
  /*margin-top: -5em;*/
}

@media (min-width: 750px) {
  .title {
    font-size: 3.5em !important;
  }
}
</style>
