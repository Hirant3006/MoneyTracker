<template>
  <v-dialog v-model="detailDealDialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline pb-1">Chi tiết giao dịch</span>
      </v-card-title>
      <v-card-text v-if="dealItem" style="padding-top:0">
        <v-form ref="forgetAccountForm">
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field label="Số tiền" type="number" v-model="amount" prefix="đ"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                prepend-icon="help"
                label="Chọn hạng mục"
                @click="categoriesDialog=true"
                required
                v-model="categoriesType"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field prepend-icon="note" v-model="note" label="Ghi chú" persistent-hint></v-text-field>
            </v-flex>
            <v-layout justify-space-between>
              <!-- <v-flex xs9 sm9 md9>
                <v-text-field prepend-icon="calendar_today" label="Ngày" required></v-text-field>
              </v-flex>-->
              <v-dialog ref="dialog" v-model="modaldate" persistent lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date"
                    label="Ngày"
                    prepend-icon="calendar_today"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable></v-date-picker>
              </v-dialog>
              <v-flex xs3 sm3 md3>
                <v-dialog ref="dialog" v-model="modaltime" persistent lazy full-width width="290px">
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
            <v-flex xs12 sm12 md12>
              <v-text-field prepend-icon="featured_play_list" v-model="selectAccount" disabled></v-text-field>
            </v-flex>
            <v-flex align-center xs12 sm12 md12>Chi tiết</v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field prepend-icon="event" v-model="event" label="Sự kiện" persistent-hint></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field prepend-icon="people" v-model="people" label="Với ai" persistent-hint></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" flat @click="confirmDialog=true">Xóa</v-btn>
        <v-btn color="green darken-1" :loading="editLoading" flat @click="onPressAddDeals">Lưu</v-btn>
        <v-btn color="blue darken-1" flat @click="$emit('close-dialog')">Đóng</v-btn>
      </v-card-actions>
    </v-card>
    <!-- Add categories -->
    <v-dialog v-model="categoriesDialog" width="400px">
      <v-tabs v-model="active" slider-color="cyan">
        <v-tab v-for="type in listCategoriesType" :key="type" ripple>{{ type}}</v-tab>
        <v-tab-item v-for="(cateType,index) in categories" :key="index">
          <v-card v-if="index!=='dataExpense'" style="height:400px">
            <!-- {{cateType}} -->
            <v-layout ml-2 mr-2 wrap justify-space-around>
              <div
                style="display:flex;flex-direction:column;align-items:center"
                class="mt-2 ml-1 mr-1 mb-2"
                v-for="(item,index) in cateType"
                :key="index"
                xs4
                @click="onClickCategoryType(item)"
              >
                <img :src="item.icon" class="image" alt="item.icon" width="50px" height="50px">
                <span>{{item.name}}</span>
              </div>
            </v-layout>
          </v-card>
          <v-card v-else style="height:400px">
            <div
              class="pt-2"
              style="background-color:white"
              v-for="(item,index) in cateType"
              :key="index"
            >
              <b>&nbsp;&nbsp; {{item.title}}</b>
              <br>

              <!-- <v-layout>
                  <div v-for="(item,index) in item.data" :key="index" xs4>
                    <img :src="item.icon" class="image" alt="item.icon" width="50px" height="50px">
                  </div>
              </v-layout>-->
              <v-layout justify-space-around ml-2 mr-2 wrap>
                <div
                  style="display:flex;flex-direction:column;align-items:center"
                  class="mt-2 ml-1 mr-1 mb-2"
                  v-for="(item,index) in  item.data"
                  :key="index"
                  xs4
                  @click="onClickCategoryType(item)"
                >
                  <img :src="item.icon" class="image" alt="item.icon" width="50px" height="50px">
                  <span>{{item.name}}</span>
                </div>
              </v-layout>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Bạn có chắc muốn xóa giao dịch này ?</v-card-title>
        <!-- <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :loading="deleteLoading" color="green darken-1" flat @click="onSelectDeleteDeal">Có</v-btn>
          <v-btn color="green darken-1" flat @click="confirmDialog = false">Không</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import moment from 'moment'
import firebase from '@/services/fireinit.js'
import categories from '@/common/categories.js'
import snackbar from '../common/Snackbar'
import { mapMutations } from 'vuex'

export default {
  data: function() {
    return {
      confirmDialog: false,
      categories: categories,
      active: null,
      categoriesDialog: false,
      amount: null,
      categoriesType: null,
      note: null,
      modaltime: false,
      modaldate: false,
      date: null,
      listCategoriesType: ['Tiền vào', 'Tiền ra', 'Ghi nợ'],
      selectAccount: null,
      selectCategory: null,
      event: null,
      people: null,
      time: null,
      editLoading: false,
      deleteLoading: false
    }
  },
  props: {
    detailDealDialog: {
      type: Boolean,
      required: true
    },
    dealItem: {
      type: Object,
      required: true
    },
    accountList: {
      type: Array,
      required: true
    }
  },
  methods: {
    async onSelectDeleteDeal() {
        this.deleteLoading=true;
      const accountBalance = this.accountList.filter(
        item => item.key == this.dealItem.accountKey
      )[0].balance
      await this.deleteDataOldDeal(
        this.dealItem.accountKey,
        this.dealItem.key,
        this.dealItem.type,
        this.dealItem.date,
        accountBalance,
        this.dealItem.amount
      )
      this.setSnack({
        msg: 'Đã xoá giao dịch thành công',
        color: 'success'
      })
      this.deleteLoading=false;
      this.$emit('close-dialog')
    },
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    async onPressAddDeals() {
     this.editLoading=true;
      const accountItem = this.accountList.filter(
        item => item.key == this.dealItem.accountKey
      )[0]
      console.log(accountItem)
      const { amount, note, date, time, event, people } = this

      if (amount == '') {
        this.setSnack({
          msg: 'Số tiền giao dịch phải lớn hơn 0',
          color: 'error'
        })
      } else if (this.selectCategory == null) {
        this.setSnack({ msg: 'Vui lòng chọn hạng mục', color: 'error' })
      } else if (this.selectAccount == null) {
        this.setSnack({ msg: 'Vui lòng chọn ví', color: 'success' })
      } else if (
        (this.selectCategory.type == 'lend' && people == '') ||
        (this.selectCategory.type == 'borrow' && people == '')
      ) {
        this.setSnack({
          msg: 'Vui lòng điền người cùng thực hiện giao dịch',
          color: 'success'
        })
      } else {
        const categories = this.selectCategory.name
        const accountKey = this.dealItem.accountKey
        const type = this.selectCategory.type
        const accountBalance = accountItem.balance
        const selectedAccount = this.dealItem.account
        this.writeUserData(
          amount,
          categories,
          note,
          date,
          time,
          event,
          people,
          selectedAccount,
          type,
          accountBalance,
          accountKey
        ),
          await this.deleteDataOldDeal(
            accountKey,
            this.dealItem.key,
            type,
            date,
            accountBalance,
            amount
          )
        this.setSnack({ msg: 'Đã sửa giao dịch thành công', color: 'success' })
        this.amount = ''
        this.note = null
        this.people = null
        this.event = null
        this.date = new Date().toISOString().substr(0, 10)
        this.time = '00:00'
        this.selectAccount = null
        this.selectCategory = null
        this.$emit('close-dialog')
        this.editLoading=false
        // this.clearData()
      }
    },
    async deleteDataOldDeal(
      accountKey,
      dealKey,
      type,
      date,
      accountBalance,
      amount
    ) {
      const uid = await firebase.auth().currentUser.uid

      if (type === 'income' || type === 'lend') {
        let balanceChanged = parseInt(accountBalance) - parseInt(amount)
        // if (accountKey === this.dealItem.accountKey) {
        //   this.setState({
        //     newAccountBalance: balanceChanged
        //   })
        // }
        await firebase
          .database()
          .ref(`${uid}/Account/${accountKey}`)
          .update({
            balance: balanceChanged
          })
      } else if (type === 'expense' || type === 'borrow') {
        let balanceChanged = parseInt(accountBalance) + parseInt(amount)
        // if (accountKey === this.state.newAccountKey) {
        //   this.setState({
        //     newAccountBalance: balanceChanged
        //   })
        // }
        await firebase
          .database()
          .ref(`${uid}/Account/${accountKey}`)
          .update({
            balance: balanceChanged
          })
      }

      await firebase
        .database()
        .ref(`${uid}/Borrow/${dealKey}`)
        .remove()
      await firebase
        .database()
        .ref(`${uid}/Lend/${dealKey}`)
        .remove()
      await firebase
        .database()
        .ref(`${uid}/Deals/${accountKey}/${dealKey}`)
        .remove()
      await firebase
        .database()
        .ref(`${uid}/TotalDeals/${dealKey}`)
        .remove()
    },
    async writeUserData(
      amount,
      categories,
      note,
      date,
      time,
      event,
      people,
      selectedAccount,
      type,
      accountBalance,
      accountKey
    ) {
      console.log([
        amount,
        categories,
        note,
        date,
        time,
        event,
        people,
        selectedAccount,
        type,
        accountBalance,
        accountKey
      ])
      const uid = await firebase.auth().currentUser.uid
      var newDealKey = firebase
        .database()
        .ref()
        .child(`${uid}/Account`)
        .push().key
      await firebase
        .database()
        .ref(`${uid}/Deals/${accountKey}/${newDealKey}`)
        .set({
          amount: parseInt(amount),
          categories: categories,
          date: date,
          time: time,
          note: note,
          event: event,
          people: people,
          account: selectedAccount,
          type: type,
          key: newDealKey,
          accountKey: accountKey
        })
        .then(data => {
          if (type === 'expense' || type === 'borrow') {
            let balanceChanged = parseInt(accountBalance) - parseInt(amount)
            firebase
              .database()
              .ref(`${uid}/Account/${accountKey}`)
              .update({
                balance: balanceChanged
              })
            if (type === 'borrow') {
              firebase
                .database()
                .ref(`${uid}/Borrow/${newDealKey}`)
                .set({
                  amount: parseInt(amount),
                  categories: categories,
                  date: date,
                  time: time,
                  note: note,
                  event: event,
                  people: people,
                  account: selectedAccount,
                  type: type,
                  key: newDealKey,
                  accountKey: accountKey,
                  repay: 0
                })
            }
          } else if (type === 'income' || type === 'lend') {
            let balanceChanged = parseInt(accountBalance) + parseInt(amount)
            firebase
              .database()
              .ref(`${uid}/Account/${accountKey}`)
              .update({
                balance: balanceChanged
              })
            if (type === 'lend') {
              firebase
                .database()
                .ref(`${uid}/Lend/${newDealKey}`)
                .set({
                  amount: parseInt(amount),
                  categories: categories,
                  date: date,
                  time: time,
                  note: note,
                  event: event,
                  people: people,
                  account: selectedAccount,
                  type: type,
                  key: newDealKey,
                  accountKey: accountKey,
                  repay: 0
                })
            }
          }
        })
        .catch(error => {
          //error callback
          console.log('error ', error)
        })
      await firebase
        .database()
        .ref(`${uid}/TotalDeals/${newDealKey}`)
        .set({
          amount: parseInt(amount),
          categories: categories,
          date: date,
          time: time,
          note: note,
          event: event,
          people: people,
          account: selectedAccount,
          type: type,
          key: newDealKey,
          accountKey: accountKey
        })
    },
    onClickCategoryType(item) {
      this.categoriesType = item.name
      this.selectCategory = item
      this.categoriesDialog = false
    }
  },
  watch: {
    dealItem() {
      console.log('Deal item ', this.dealItem)
    }
  },
  mounted() {},
  watch: {
    dealItem() {
      this.amount = this.dealItem.amount
      this.categoriesType = this.dealItem.categories
      this.note = this.dealItem.note
      this.date = moment(this.dealItem.date).format('YYYY-MM-DD')
      this.time = moment(this.dealItem.time).format('HH:MM')
      this.selectAccount = this.dealItem.account
      this.event = this.dealItem.event
      this.people = this.dealItem.people
    },
    date() {
      this.modaldate = false
    }
  }
}
</script>

<style>
</style>
