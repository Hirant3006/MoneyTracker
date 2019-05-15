<template>
  <v-dialog v-model="transferDialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Chuyển khoản</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="transferForm">
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field label="Số tiền" type="number" v-model="transferAmount" prefix="đ"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                prepend-icon="featured_play_list"
                label="Từ tài khoản"
                :value="accountItem ? accountItem.name :null "
                required
                disabled
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-select
                prepend-icon="featured_play_list"
                item-text="name"
                :items="accountList"
                label="Đến tài khoản*"
                v-model="selectAccount"
                required
              ></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-layout justify-space-between>
              <!-- <v-flex xs9 sm9 md9>
                <v-text-field prepend-icon="calendar_today" label="Ngày" required></v-text-field>
              </v-flex>-->
              <v-dialog
                ref="dialog"
                v-model="modaldate"
                :return-value.sync="date"
                persistent
                lazy
                full-width
                width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date"
                    label="Ngày"
                    prepend-icon="calendar_today"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="modaldate = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
              <v-flex xs3 sm3 md3>
                <v-dialog
                  ref="dialog"
                  v-model="modaltime"
                  :return-value.sync="time"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="time"
                      label="Giờ"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-if="modaltime" v-model="time" full-width>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="modaltime = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.dialog.save(time)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
                <!-- <v-text-field prepend-icon="access_time" label="Giờ" required></v-text-field> -->
              </v-flex>
            </v-layout>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="$emit('close-dialog')">Đóng</v-btn>
        <v-btn color="blue darken-1" flat @click="onTransfer">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
import firebase from '@/services/fireinit.js'
import moment from 'moment'

export default {
  data: function() {
    return {
      selectAccount: null,
      selectAccountList: null,
      date: new Date().toISOString().substr(0, 10),
      modaltime: false,
      modaldate: false,
      transferAmount: null,
      time: '00:00'
    }
  },
  props: {
    transferDialog: {
      type: Boolean,
      required: true
    },
    accountItem: {
      required: true
    },
    accountList: {
      required: true
    }
  },
  methods: {
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    async onTransfer() {
      const { transferAmount, date, time, accountList, selectAccount } = this,
        fromAccount = this.accountItem.name,
        fromAccountKey = this.accountItem.key,
        fromAccountBalance = this.accountItem.balance
      let toAccountdata = null
      if (this.selectAccount !== null) {
        toAccountdata = await this.accountList.filter(
          element => element.name == selectAccount
        )[0]
        const toAccount = toAccountdata.name,
          toAccountKey = toAccountdata.key,
          toAccountBalance = toAccountdata.balance
        if (transferAmount === null) {
          this.setSnack({
            msg: 'Số tiền chuyển khoản phải lớn hơn 0',
            color: 'error'
          })
        } else if (fromAccount == '') {
          this.setSnack({
            msg: 'Vui lòng chọn tài khoản cần chuyển đi',
            color: 'error'
          })
        } else if (toAccount == '') {
          this.setSnack({
            msg: 'Vui lòng chọn tài khoản cần chuyển đến',
            color: 'error'
          })
        } else if (fromAccountKey === toAccountKey) {
          this.setSnack({
            msg: 'Không thể chuyển tiền trên cùng một tài khoản',
            color: 'error'
          })
        } else if (transferAmount > fromAccountBalance) {
          this.setSnack({
            msg: 'Không thể chuyển số tiền lớn hơn tài khoản',
            color: 'error'
          })
        } else {
          this.writeUserData(
            transferAmount,
            fromAccount,
            date,
            time,
            fromAccountKey,
            toAccount,
            toAccountKey,
            toAccountBalance,
            fromAccountBalance
          )
        }
      } else {
        this.setSnack({
          msg: 'Vui lòng chọn tài khoản cần chuyển đến',
          color: 'error'
        })
      }

      //   console.log('Heelo', {
      //     fromAccount,
      //     fromAccountKey,
      //     fromAccountBalance,
      //     toAccount,
      //     toAccountKey,
      //     toAccountBalance
      //   })
    },
    async writeUserData(
      transferAmount,
      fromAccount,
      date,
      time,
      fromAccountKey,
      toAccount,
      toAccountKey,
      toAccountBalance,
      fromAccountBalance
    ) {
      const uid = await firebase.auth().currentUser.uid
      var newDealKey = firebase
        .database()
        .ref()
        .child(`${uid}/Account`)
        .push().key
      await firebase
        .database()
        .ref(
          `${uid}/Deals/${fromAccountKey}/${moment(date).format(
            'YYYY/M/D'
          )}/${newDealKey}`
        )
        .set({
          amount: parseInt(transferAmount),
          categories: 'Chuyển khoản',
          date: date,
          time: time,
          note: `Chuyển khoản cho ${toAccount}`,
          event: '',
          people: '',
          account: fromAccount,
          type: 'expense',
          key: newDealKey,
          accountKey: fromAccountKey,
          toAccountKey: toAccountKey
        })
        .then(data => {
          let balanceChanged =
            parseInt(fromAccountBalance) - parseInt(transferAmount)
          firebase
            .database()
            .ref(`${uid}/Account/${fromAccountKey}`)
            .update({
              balance: balanceChanged
            })
        })
        .catch(error => {
          //error callback
          console.log('error ', error)
        })
      await firebase
        .database()
        .ref(
          `${uid}/Deals/${toAccountKey}/${moment(date).format(
            'YYYY/M/D'
          )}/${newDealKey}`
        )
        .set({
          amount: parseInt(transferAmount),
          categories: 'Chuyển khoản',
          date: date,
          time: time,
          note: `Được chuyển khoản từ ${fromAccount}`,
          event: '',
          people: '',
          account: toAccount,
          type: 'income',
          key: newDealKey,
          accountKey: toAccountKey,
          fromAccountKey: fromAccountKey
        })
        .then(data => {
          let balanceChanged =
            parseInt(toAccountBalance) + parseInt(transferAmount)
          firebase
            .database()
            .ref(`${uid}/Account/${toAccountKey}`)
            .update({
              balance: balanceChanged
            })
        })
        .catch(error => {
          //error callback
          console.log('error ', error)
        })
      this.setSnack({
        msg: 'Đã chuyển khoản thành công',
        color: 'success'
      })
      this.$emit('close-dialog')
      ;(this.selectAccount = null),
        (this.selectAccountList = null),
        (this.date = new Date().toISOString().substr(0, 10)),
        (this.transferAmount = null),
        (this.time = '00:00')
    }
  },
  watch: {
    date() {
      console.log(this.date)
    }
  }
}
</script>

<style>
</style>
