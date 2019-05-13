<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-container grid-list-lg>
        <v-flex xs12>
          <h2 class="mb-4">Tài khoản</h2>
          <v-card color class="dark--text">
            <v-card-title primary-title>
              <div style="width:100%">
                <h4>Tổng tiền</h4>
                <v-divider/>
                <h3 class="headline blue--text mt-2">{{ formatPrice(total) }} vnđ</h3>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>

        <v-layout justify-space-between row wrap>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-card>
              <v-card-title primary-title>
                <div style="width:100%">
                  <v-layout pl-1 pr-1 justify-space-between>
                    <h4 style="align-self:center">Tài khoản</h4>
                    <v-btn icon>
                      <v-icon @click="toggleModalAddAccount">add</v-icon>
                    </v-btn>
                  </v-layout>
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
                      style="padding:0"
                    >
                      <v-divider class="mb-2"/>
                      <v-layout justify-space-between mt-4 mb-2 align-center>
                        <v-layout class="ml-2">
                          <v-avatar :size="40" color=" lighten-4">
                            <img
                              :src="accountIcon(item)"
                              alt="avatar"
                            >
                          </v-avatar>
                          <div class="ml-3" >
                            <span>{{item.accountType}}</span>
                            <br>
                            <span>{{formatPrice(item.balance)}} vnđ</span>
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
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <!-- Add account -->
    <add-account-dialog
      :addAccountDialog="addAccountDialog"
      @close-dialog="addAccountDialog=false"
    />
    <v-dialog v-model="editTotalDialog" max-width="600px">
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
  </v-layout>
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
import listAccountType from '@/common/accountType.js'

export default {
  components: { 'add-account-dialog': addAccountDialog },
  data: function() {
    return {
      active: null,
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      total: 0,
      addAccountDialog: false,
      categoriesDialog: false,
      editTotalDialog: false,
      transferDialog: false,
      accountLoading: false,
      account: [],
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
    this.readAccountData()
  },

  methods: {
    accountIcon(item){
      switch (item.accountType) {
            case "Thẻ tín dụng":
                return require('@/assets/Image/credit-card.png')
            case "Tiền mặt":
                return require('@/assets/Image/cash.png')
            case "Tài khoản ngân hàng":
                return require('@/assets/Image/bank.png')
            case "Tài khoản khác":
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
      if (info.title === 'Điều chỉnh số dư') this.editTotalDialog = true
      if (info.title === 'Chuyển khoản') this.transferDialog = true
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
          console.log('Array ', array)
        })
        this.accountLoading = false
        this.total = totalBalance
        this.account = array
      })
      totalBalance = 0
      array = []
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  watch: {
    editTotalDialog() {
      if (this.editTotalDialog == false) this.$refs.editTotalForm.reset()
    }
  }
}
</script>
<style>
</style>
