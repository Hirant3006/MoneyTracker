<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app v-if="user">
      <v-list>
        <v-list-tile router nuxt exact v-for="(item, i) in items" :key="i" :to="item.to">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar v-if="user" app>
      <v-btn v-if="user" icon @click.native.stop="drawer = !drawer">
        <v-icon>menu</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" style="cursorLpinter" @click="toHomepage"></v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user" id="user" class="text-xs-center">
        <v-menu offset-x :close-on-content-click="false" :nudge-top="200">
          <v-btn icon slot="activator">
            <v-icon medium>settings</v-icon>
          </v-btn>
          <v-card>
            <v-list>
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="$store.state.user.photoURL" alt="user">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-if="user.displayName">{{user.displayName}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile
                v-for="(info, index) in utilItems"
                :key="index"
                @click="onToggleMore(info,item)"
              >
                <v-spacer></v-spacer>
                <v-icon style="margin-right: 20px;" class>{{info.icon}}</v-icon>
                <v-list-tile-title>{{ info.title }}</v-list-tile-title>
              </v-list-tile>
              <!-- <v-list-tile @click.native="logout">
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-icon style="margin-right: 20px;" class>logout</v-icon>
                <v-list-tile-title>Đăng xuất</v-list-tile-title>
              </v-list-tile>-->
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <nuxt/>
        <v-card-text style="height: 100px; position: relative">
          <v-fab-transition>
            <v-btn
              v-if="user"
              color="pink"
              dark
              fixed
              bottom
              @click="onToggleAddDealDialog"
              fab
              style="bottom:50px;right:50px"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-card-text>
      </v-container>
    </v-content>
    <v-dialog v-model="addDealDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline pb-1">Thêm giao dịch</span>
        </v-card-title>
        <v-card-text style="padding-top:0">
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
                  <v-dialog
                    ref="dialog"
                    v-model="modaltime"
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
              <v-flex xs12 sm12 md12>
                <v-select
                  prepend-icon="featured_play_list"
                  item-text="name"
                  item-value="key"
                  :items="accountList"
                  label="Chọn tài khoản*"
                  v-model="selectAccount"
                  required
                ></v-select>
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
          <v-btn color="blue darken-1" flat @click="onPressAddDeals">Thêm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addRecordDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline pb-1">Ghi chép mẫu</span>
        </v-card-title>
        <v-card-text style="padding-top:0">
          <v-form ref="forgetAccountForm">
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field prepend-icon="note" label="Tên ghi chép" persistent-hint></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="Số tiền" value="10.00" prefix="$"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-select
                  prepend-icon="help"
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Chọn hạng mục"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field prepend-icon="note" label="Ghi chú" persistent-hint></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-select
                  prepend-icon="featured_play_list"
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Chọn tài khoản"
                  required
                ></v-select>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="() => addDealDialog=false">Thêm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-footer app :fixed="fixed" class="justify-center px-4">
      <!-- <span>&copy; 2017</span> -->
    </v-footer>
    <snackbar/>
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
  </v-app>
</template>

<script>
import routerItems from '../common/router.js'
import snackbar from '../components/common/Snackbar'
import { mapMutations } from 'vuex'
import categories from '@/common/categories.js'
import firebase from '@/services/fireinit.js'

export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      modaltime: false,
      modaldate: false,
      time: '00:00',
      drawer: null,
      fixed: false,
      categoriesDialog: false,
      categoriesType: null,
      listCategoriesType: ['Tiền vào', 'Tiền ra', 'Ghi nợ'],
      categories: categories,
      active: null,
      items: routerItems,
      note: null,
      amount: '',
      selectAccount: null,
      event: null,
      people: null,
      accountList: [],
      selectCategory: null,
      utilItems: [
        {
          title: 'Lịch sử ghi chép',
          icon: 'note'
        },
        {
          title: 'Ghi chép mẫu',
          icon: 'note'
        },
        { title: 'Chuyển tiền', icon: 'swap_horiz' },
        { title: 'Điều chỉnh số dư', icon: 'settings' },
        { title: 'Thống kê theo tháng', icon: 'equalizer' },
        { title: 'Đăng xuất', icon: 'logout' }
      ],
      title: 'I love money',
      menu: false,
      addDealDialog: false,
      addRecordDialog: false
    }
  },
  components: {
    snackbar
  },
  computed: {
    user() {
      return this.$store.getters.activeUser
    }
  },
  async mounted() {
    await this.readAccountData()
  },
  methods: {
    async readAccountData() {
      let array = []
      const uid = await firebase.auth().currentUser.uid
      var ref = await firebase.database().ref(`${uid}/Account`)

      await ref.on('value', snapshot => {
        this.accountLoading = true
        let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
        keys.map((item, index) => {
          array.push(snapshot.val()[item])
        })
        this.accountList = array
        array = []
      })
    },
    onClickCategoryType(item) {
      this.categoriesType = item.name
      this.selectCategory = item
      this.categoriesDialog = false
    },
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    onToggleMore(info, item) {
      console.log({ info }, { item })
      if (info.title === 'Đăng xuất') this.logout()
    },
    onToggleAddDealDialog() {
      this.addDealDialog = true
    },
    logout() {
      this.$store.dispatch('user/signOut').then(() => {
        this.setSnack({ msg: 'Đăng xuất thành công', color: 'success' })
        this.$router.push('/')
      })
    },
    toHomepage() {
      this.$router.push('/')
    },
    onPressAddDeals() {
      console.log(this)
      const accountItem = this.accountList.filter(
        item => item.key == this.selectAccount
      )[0]
      const { amount, note, date, time, event, people } = this

      if (amount == '') {
        alert('Số tiền giao dịch phải lớn hơn 0')
        this.setSnack({ msg: 'Số tiền giao dịch phải lớn hơn 0', color: 'error' })
      } else if (this.selectCategory == null) {
        this.setSnack({ msg: 'Vui lòng chọn hạng mục', color: 'error' })
      } else if (this.selectAccount == null) {
        this.setSnack({ msg: 'Vui lòng chọn ví', color: 'success' })
      } else if (
        (type == 'lend' && people == '') ||
        (type == 'borrow' && people == '')
      ) {
        alert('Vui lòng điền người cùng thực hiện giao dịch')
      } else {
        const categories = this.selectCategory.name
        const accountKey = accountItem.key
        const type = this.selectCategory.type
        const accountBalance = accountItem.balance
        const selectedAccount = accountItem.name
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
        )
        this.setSnack({ msg: 'Đã thêm giao dịch thành công', color: 'success' })
        this.addDealDialog = false
        this.amount = ''
        this.note = null
        this.people = null
        this.event = null
        this.date = new Date().toISOString().substr(0, 10)
        this.time = '00:00'
        this.selectAccount = null
        this.selectCategory = null
        // this.clearData()
      }
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
    }
  },
  watch: {
    date() {
      this.modaldate = false
    }
  }
}
</script>

<style>
.v-navigation-drawer > .list:not(.list--dense) .list__tile {
  font-size: 17px;
}
.avatar {
  max-width: 75px;
}

/* .list__tile--active.list__tile.list__tile--link {

} */

a.nuxt-link-exact-active.list__tile--active.list__tile.list__tile--link {
  font-weight: 900 !important;
  color: #3f51b5 !important;
}
.v-list__tile--link {
  border-left: 10px solid transparent;
}
.v-list__tile--link.v-list__tile--active {
  color: rgba(0, 0, 0, 0.87);
  border-left: 10px solid gray;
}
</style>
