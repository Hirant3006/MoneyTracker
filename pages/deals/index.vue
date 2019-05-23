<template>
  <div>
    <v-layout justify-center align-center column>
      <v-flex xs12 sm8>
        <v-container grid-list-lg>
          <v-layout v-if="account.length!==0" justify-space-between row wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-card>
                <v-card-title primary-title>
                  <v-layout pl-1 pr-1 justify-center>
                    <div class="selectedAccount">
                      <v-layout
                        style="border:1px solid #E0E0E0;border-radius:5px;cursor:pointer"
                        @click="accountListDialog=true"
                        pa-3
                        mr-4
                        class
                        justify-space-around
                        mt-2
                        mb-2
                        ml-2
                        align-center
                      >
                        <v-avatar :size="70" color=" lighten-4">
                          <img :src="accountIcon(account[selectedAccountIndex])" alt="avatar">
                        </v-avatar>
                        <div class="ml-2 mr-5" style="display:flex;flex-direction:column">
                          <span class="headline">{{account[selectedAccountIndex].name}}</span>
                          <span
                            class="subheading"
                            style="color:#80CBC4"
                          >{{formatPrice(account[selectedAccountIndex].balance)}} đ</span>
                        </div>
                        <v-icon>expand_more</v-icon>
                      </v-layout>
                    </div>
                    <v-menu offset-y>
                      <template v-slot:activator="{ on }">
                        <v-btn flat icon v-on="on">
                          <v-icon>more_vert</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-tile
                          v-for="(info, index) in items"
                          :key="index"
                          @click="onToggleMore(info,item)"
                        >
                          <v-icon style="margin-right: 20px;" class>{{info.icon}}</v-icon>
                          <v-list-tile-title>{{ info.title }}</v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </v-layout>
                </v-card-title>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout v-if="account.length!==0" justify-space-between row wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
              <v-card>asdsad</v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>

      <v-dialog v-model="accountListDialog" max-width="600px" style="height:300px">
        <v-card>
          <v-card-title>
            <span class="headline">Danh sách tài khoản</span>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-layout v-if="accountLoading" justify-center mt-1>
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-layout>
              <v-layout
                mt-1
                mb-1
                style="color:red"
                justify-center
                v-if="accountLoading==false && account.length===0"
              >Hiện chưa có tài khoản nào</v-layout>
              <div
                v-else
                class="font-weight-medium"
                v-for="(item,index) in account"
                :key="index"
                @click="selectedAccountIndex=index"
              >
                <v-divider class="mb-2"/>
                <v-layout justify-space-between mt-2 mb-2 align-center>
                  <v-layout class="ml-2">
                    <v-avatar :size="40" color=" lighten-4">
                      <img :src="accountIcon(item)" alt="avatar">
                    </v-avatar>
                    <div class="ml-3">
                      <span>{{item.name}}</span>
                      <br>
                      <span>{{formatPrice(item.balance)}} đ</span>
                    </div>
                  </v-layout>

                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn flat icon v-on="on">
                        <v-icon>more_vert</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-tile
                        v-for="(info, index) in items"
                        :key="index"
                        @click="onToggleMore(info,item)"
                      >
                        <v-icon style="margin-right: 20px;" class>{{info.icon}}</v-icon>
                        <v-list-tile-title>{{ info.title }}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-layout>
              </div>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- Add account -->
      <add-account-dialog
        :addAccountDialog="addAccountDialog"
        @close-dialog="addAccountDialog=false"
      />
      <!-- Transfer account -->
      <transfer-account-dialog
        :transferDialog="transferDialog"
        @close-dialog="transferDialog=false"
        :accountItem="transferAccountItem"
        :accountList="account"
      />
      <edit-account-dialog
        :editDialog="editDialog"
        @close-dialog="editDialog=false"
        :accountItem="editAccountItem"
        :accountList="account"
      />
      <v-dialog v-model="editTotalDialog" max-width="600px" persistent style="height:40px">
        <v-card>
          <v-card-title>
            <span class="headline">Điều chỉnh số dư</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="editTotalForm">
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field prepend-icon="featured_play_list" label="Chọn tài khoản" required></v-text-field>
                </v-flex>
                <v-layout justify-space-between>
                  <v-flex xs9 sm9 md9>
                    <v-text-field prepend-icon="calendar_today" label="Ngày" required></v-text-field>
                  </v-flex>
                  <v-flex xs3 sm3 md3>
                    <v-text-field prepend-icon="access_time" label="Giờ" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout justify-space-between ml-1 mr-1 mt-1>
                  <h4>Số dư trên tài khoản</h4>
                  <h4>5.000.000đ</h4>
                </v-layout>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="Số dư thực tế" required></v-text-field>
                </v-flex>
                <v-layout justify-space-between ml-1 mr-1>
                  <h5>Chênh lệch</h5>
                  <h5>0đ</h5>
                </v-layout>

                <v-flex xs12 sm12 md12>
                  <v-text-field prepend-icon="note" label="Ghi chú" persistent-hint></v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="editTotalDialog = false">Đóng</v-btn>
            <v-btn color="blue darken-1" flat @click="editTotalDialog = false">Lưu</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="confirmDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">
            <h4>Bạn muốn xoá ví này ?</h4>
            <br>
            <span
              class="caption"
            >**Lưu ý khi bạn xoá tài khoản tất cả các giao dịch của tài khoản này sẽ bị xoá theo</span>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="confirmDialog = false">Không</v-btn>
            <v-btn color="green darken-1" flat @click="onSelectDeleteAccount">Có</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
const dummieAccount = [
  {
    name: 'Ví chính',
    total: 2500000
  },
  {
    name: 'Quỹ đen',
    total: 5000000
  },
  {
    name: 'Thẻ',
    total: 2000000
  }
]

import firebase from '@/services/fireinit.js'
import addAccountDialog from '@/components/wallet/addAccountDialog.vue'
import transferAccountDialog from '@/components/wallet/transferAccountDialog.vue'
import editAccountDialog from '@/components/wallet/editAccountDialog.vue'
import listAccountType from '@/common/accountType.js'
import { mapMutations } from 'vuex'
import moment from 'moment'

export default {
  components: {
    'add-account-dialog': addAccountDialog,
    'transfer-account-dialog': transferAccountDialog,
    'edit-account-dialog': editAccountDialog
  },
  data: function() {
    return {
      active: null,
      uid: firebase.auth().currentUser.uid,
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      total: 0,
      addAccountDialog: false,
      categoriesDialog: false,
      editTotalDialog: false,
      transferDialog: false,
      accountLoading: false,
      editDialog: false,
      accountListDialog: false,
      confirmDialog: false,
      deleteItem: null,
      editAccountItem: null,
      account: [],
      transferAccountItem: null,
      selectedAccountIndex: 0,
      totalExpense: 0,
      totalIncome: 0,
      monthFilter: moment().format('YYYY-MM-DD'),
      dealList: [],
      items: [
        {
          title: 'Chuyển khoản',
          icon: 'swap_horiz'
        },
        {
          title: 'Sửa',
          icon: 'edit'
        },
        { title: 'Xóa', icon: 'delete' },
        { title: 'Điều chỉnh số dư', icon: 'equalizer' }
      ],
      modelChuyenKhoan: false,
      modelDieuChinhSoDu: false
    }
  },
  async mounted() {
    await this.readAccountData()
    // await this.readDealData()
    
  },

  methods: {
    filterDealbyDate(){

    },
    async readDealData() {
      const uid = await firebase.auth().currentUser.uid
      firebase
        .database()
        .ref(`${uid}/Deals/${this.account[this.selectedAccountIndex].key}`)
        .on('value', async snapshot => {
          let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
          if (keys) {
            this.dealList = []

            keys.map((item, index) => {
              this.dealList.push(snapshot.val()[item])
            })
          }
        })
    },
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    accountIcon(item) {
      switch (item.accountType) {
        case 'Thẻ tín dụng':
          return require('@/assets/Image/credit-card.png')
        case 'Tiền mặt':
          return require('@/assets/Image/cash.png')
        case 'Tài khoản ngân hàng':
          return require('@/assets/Image/bank.png')
        case 'Tài khoản khác':
          return require('@/assets/Image/money.png')
        default:
          return require('@/assets/Image/question-mark.png')
      }
    },
    onClickAccount(e) {
      // if (e.target.textContent==="Chuyển khoản")
    },
    toggleModalAddAccount() {
      this.addAccountDialog = true
    },
    onToggleMore(info, item) {
      if (info.title === 'Điều chỉnh số dư') {
        this.editTotalDialog = true
      }
      if (info.title === 'Chuyển khoản') {
        this.transferDialog = true
        this.transferAccountItem = item
      }
      if (info.title === 'Xóa') {
        this.confirmDialog = true
        this.deleteItem = item
      }
      if (info.title === 'Sửa') {
        this.editDialog = true
        this.editAccountItem = item
      }
    },
    async readAccountData() {
      let array = []
      let totalBalance = 0
      const uid = await firebase.auth().currentUser.uid
      var ref = await firebase.database().ref(`${uid}/Account`)

      await ref.on('value', snapshot => {
        this.accountLoading = true
        let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
        keys.map((item, index) => {
          array.push(snapshot.val()[item])
          totalBalance = totalBalance + snapshot.val()[item].balance
        })
        this.accountLoading = false
        this.total = totalBalance
        this.account = array
        totalBalance = 0
        array = []
      })
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    async onSelectDeleteAccount() {
      await firebase
        .database()
        .ref(`${this.uid}/Account/${this.deleteItem.key}`)
        .remove()
      this.setSnack({ msg: 'Xóa ví thành công', color: 'success' })
      this.confirmDialog = false
      await firebase
        .database()
        .ref(`${this.uid}/Deals/${this.deleteItem.key}`)
        .remove()
      await firebase
        .database()
        .ref(`${this.uid}/Borrow/${this.deleteItem.key}`)
        .remove()
      await firebase
        .database()
        .ref(`${this.uid}/Lend/${this.deleteItem.key}`)
        .remove()
      for (var j = 0; j < 12; j++) {
        var month = (j + 1).toString()
        for (var i = 0; i < 31; i++) {
          var day = (i + 1).toString()
          await firebase
            .database()
            .ref(
              `${this.uid}/TotalDeals/${moment().format(
                'YYYY'
              )}/${month}/${day}`
            )
            .once('value', async snapshot => {
              let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
              if (keys.length != 0) {
                keys.map(async (item, index) => {
                  if (snapshot.val()[item].accountKey === key) {
                    await firebase
                      .database()
                      .ref(
                        `${this.uid}/TotalDeals/${moment(
                          snapshot.val()[item].date
                        ).format('YYYY/M/D')}/${snapshot
                          .val()
                          [item].key.toString()}`
                      )
                      .remove()
                  }
                })
              }
            })
        }
      }
    }
  },
  watch: {
    editTotalDialog() {
      if (this.editTotalDialog == false) this.$refs.editTotalForm.reset()
    },
    async account() {
      await this.readDealData()
    },
    array19() {
      this.array19.forEach((element, index) => {
        // console.log('Element ', element.categories)
      })
    }
  }
}
</script>
<style>
</style>
