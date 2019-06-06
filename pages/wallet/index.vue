<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-container grid-list-lg>
        <v-flex xs12>
          <v-card color class="dark--text">
            <v-card-title primary-title>
              <div style="width:100%">
                <h4>Tổng tiền</h4>
                <v-divider/>
                <h3 class="headline blue--text mt-2">{{ formatPrice(total) }} đ</h3>
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
import addAccountDialog from '@/components/wallet/addAccountDialog.vue'
import transferAccountDialog from '@/components/wallet/transferAccountDialog.vue'
import editAccountDialog from '@/components/wallet/editAccountDialog.vue'
import listAccountType from '@/common/accountType.js'
import { mapMutations } from 'vuex'
import moment from 'moment'
import firebase from '@/services/fireinit.js'

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
      confirmDialog: false,
      editDialog: false,
      deleteItem: null,
      editAccountItem: null,
      account: [],
      transferAccountItem: null,
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
    getIconCategories(categorieName) {
      switch (categorieName) {
        case 'Ăn tiệm':
          return require('@/assets/Image/breakfast.png')
        case 'Cafe':
          return require('@/assets/Image/coffee-cup.png')
        case 'Ăn nhậu':
          return require('@/assets/Image/beer.png')
        case 'Đồ chơi':
          return require('@/assets/Image/toys.png')
        case 'Học phí':
          return require('@/assets/Image/money.png')
        case 'Sách vở':
          return require('@/assets/Image/open-book.png')
        case 'Sữa':
          return require('@/assets/Image/milk.png')
        case 'Tiền tiêu vặt':
          return require('@/assets/Image/money.png')
        case 'Điện':
          return require('@/assets/Image/idea.png')
        case 'Điện thoại cố định':
          return require('@/assets/Image/cellular.png')
        case 'Điện thoại di dộng':
          return require('@/assets/Image/smartphone.png')
        case 'Gas':
          return require('@/assets/Image/fire.png')
        case 'Internet':
          return require('@/assets/Image/wifi.png')
        case 'Nước':
          return require('@/assets/Image/drop.png')
        case 'Truyền hình':
          return require('@/assets/Image/television.png')
        case 'Bảo hiểm xe':
          return require('@/assets/Image/car-insurance.png')
        case 'Gửi xe':
          return require('@/assets/Image/parking.png')
        case 'Rửa xe':
          return require('@/assets/Image/car-wash.png')
        case 'Sửa chữa':
          return require('@/assets/Image/car-lift.png')
        case 'Taxi/ thuê xe':
          return require('@/assets/Image/taxi.png')
        case 'Xăng xe':
          return require('@/assets/Image/gas.png')
        case 'Biếu tặng':
          return require('@/assets/Image/gift.png')
        case 'Sinh nhật':
          return require('@/assets/Image/birthday-cake.png')
        case 'Cưới xin':
          return require('@/assets/Image/rings.png')
        case 'Du lịch':
          return require('@/assets/Image/world.png')
        case 'Làm đẹp':
          return require('@/assets/Image/lipstick.png')
        case 'Mỹ phẩm':
          return require('@/assets/Image/lipstick.png')
        case 'Phim ảnh, ca nhạc':
          return require('@/assets/Image/popcorn.png')
        case 'Khám, chữa bệnh':
          return require('@/assets/Image/stethoscope.png')
        case 'Thuốc men':
          return require('@/assets/Image/medicine.png')
        case 'Giày, dép':
          return require('@/assets/Image/shoe.png')
        case 'Quần, áo':
          return require('@/assets/Image/tshirt.png')
        case 'Phụ kiện khác':
          return require('@/assets/Image/tie.png')
        case 'Tiền thưởng':
          return require('@/assets/Image/bonus.png')
        case 'Lương':
          return require('@/assets/Image/salary.png')
        case 'Được tặng':
          return require('@/assets/Image/gift.png')
        case 'Bán đồ':
          return require('@/assets/Image/sale.png')
        case 'Khoản thu khác':
          return require('@/assets/Image/money.png')
        case 'Khoản chi khác':
          return require('@/assets/Image/money.png')
        case 'Đi vay':
          return require('@/assets/Image/offer.png')
        case 'Thu nợ':
          return require('@/assets/Image/repay.png')
        case 'Trả nợ':
          return require('@/assets/Image/payment-method.png')
        case 'Cho vay':
          return require('@/assets/Image/save-money.png')
        case 'Chuyển khoản':
          return require('@/assets/Image/transfer.png')
        default:
          return require('@/assets/Image/question-mark.png')
      }
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
    }
  }
}
</script>
<style>
</style>