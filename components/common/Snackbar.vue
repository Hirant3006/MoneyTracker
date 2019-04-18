<template>
  <v-snackbar v-model="show" :color="color" :top="true" :timeout="5000">
    {{message}}
    <v-btn flat color="accent" @click.native="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: '',
      color: ''
    }
  },
  created: function() {
    this.$store.watch(
      state => state.snackbar.snack,
      () => {
        console.log('Vue ',this.$store.state.snackbar)
        const msg = this.$store.state.snackbar.snack
        if (msg !== '') {
          // console.log('state ', this.$store.state)
          this.show = true
          this.color = this.$store.state.snackbar.snack.color
          this.message = this.$store.state.snackbar.snack.msg
          this.$store.commit('snackbar/setSnack', '')
        }
      }
    )
  }
}
</script>