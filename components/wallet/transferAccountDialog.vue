<template>
  <v-dialog v-model="transferDialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Chuyển khoản</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="transferForm">
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field label="Số tiền" value="10.00" prefix="$"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select
                prepend-icon="featured_play_list"
                :items="['0-17', '18-29', '30-54', '54+']"
                label="Từ tài khoản*"
                required
              ></v-select>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select
                prepend-icon="featured_play_list"
                :items="['0-17', '18-29', '30-54', '54+']"
                label="Đến tài khoản*"
                required
              ></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-layout justify-space-between>
              <v-flex xs9 sm9 md9>
                <v-text-field prepend-icon="calendar_today" label="Ngày" required></v-text-field>
              </v-flex>
              <v-flex xs3 sm3 md3>
                <v-text-field prepend-icon="access_time" label="Giờ" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-flex xs12 sm12 md12>
              <v-text-field prepend-icon="note" label="Ghi chú" persistent-hint></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="transferDialog = false">Đóng</v-btn>
        <v-btn color="blue darken-1" flat @click="transferDialog = false">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    addAccountDialog: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    })
  }
}
</script>

<style>
</style>
