<template>
  <div>
    <v-layout v-if="account.length!==0" justify-center align-center>
      <v-flex xs12 sm7 md5 lg5 xl5>
        <v-container grid-list-lg style="padding-bottom:0px">
          <v-flex xs12>
            <v-card color class="dark--text">
              <v-card-title primary-title>
                <v-layout pl-1 pr-1 justify-center>
                  <div class="selectedAccount">
                    <v-layout
                      style="border:1px solid #E0E0E0;border-radius:5px;cursor:pointer;width:300px"
                      @click="accountListDialog=true"
                      pa-3
                      mr-2
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
                      <div class="ml-3 mr-3" style="display:flex;flex-direction:column;width:100px">
                        <span class="headline">{{account[selectedAccountIndex].name}}</span>
                        <span
                          class="subheading"
                          :style="account[selectedAccountIndex].balance>=0 ? 'color:#80CBC4' : 'color:red'"
                        >{{formatPrice(account[selectedAccountIndex].balance)}} đ</span>
                      </div>
                      <v-icon>expand_more</v-icon>
                    </v-layout>
                  </div>
                </v-layout>
              </v-card-title>
              <v-layout v-if="account.length!==0" justify-space-around mt-1>
                <v-btn @click="onClickPrevMonth" small depressed>
                  <v-icon dark>arrow_back</v-icon>
                  &nbsp;
                  {{listMonth[0]}}
                </v-btn>
                <span class="title" style="align-self:center">{{monthFilter}}</span>
                <v-btn @click="onClickNextMonth" small depressed>
                  {{listMonth[2]}} &nbsp;
                  <v-icon dark>arrow_forward</v-icon>
                </v-btn>
              </v-layout>
            </v-card>
          </v-flex>
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout v-if="account.length!==0" justify-center align-center>
      <v-flex xs12 sm7 md5 lg5 xl5>
        <v-container grid-list-lg style="padding-top:2px;padding-bottom:0px">
          <v-card>
            <v-card-text primary-title>
              <div style="display:flex;justify-content:space-around">
                <div style="display:flex;flex-direction:column;text-align:center">
                  <span class="font-weight-bold" style="color:green">Tổng thu</span>
                  <span class="font-weight-bold">{{formatPrice(countAmountByType[0])}} đ</span>
                </div>
                <div style="display:flex;flex-direction:column;text-align:center">
                  <span class="font-weight-bold" style="color:red">Tổng chi</span>
                  <span class="font-weight-bold">{{formatPrice(countAmountByType[1])}} đ</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout v-if="account.length!==0" justify-center align-center>
      <v-flex xs12 sm7 md5 lg5 xl5>
        <v-container grid-list-lg>
          <v-card
            v-for="(listItemByMonth,index) in filterDealbyDate(monthFilter,dealList)"
            :key="index"
            class="mb-2"
          >
            <v-card-title style="justify-content:space-between;padding-bottom:2px">
              <div style="display:flex">
                <span class="display-1 mr-1">{{formatDate(listItemByMonth[0].date,'D')}}</span>
                <div style="align-self:center;display:flex;flex-direction:column">
                  <span
                    class="caption font-weight-regular"
                  >{{formatDate(listItemByMonth[0].date,'W')}}</span>
                  <span
                    class="caption font-weight-thin"
                  >{{formatDate(listItemByMonth[0].date,'MY')}}</span>
                </div>
              </div>
              <span
                class="sub-heading font-weight-bold"
              >{{formatPrice(countAmount(listItemByMonth))}} đ</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text
              v-for="(item,index) in listItemByMonth"
              :key="index"
              style="display:flex;justify-content:space-between"
            >
              <div style="display:flex;cursor:pointer" @click="onClickDetailDialog(item)">
                <v-avatar>
                  <img :src="getIconCategories(item.categories)" alt>
                </v-avatar>
                <div class="ml-2" style="display:flex;flex-direction:column;align-self:center;">
                  <span class="font-weight-bold">{{item.categories}}</span>
                  <span>{{item.note}}</span>
                </div>
              </div>
              <span
                class="font-weight-bold"
                v-if="item.type==='expense'"
                style="color:red;align-self:center"
              >- {{formatPrice(item.amount)}} đ</span>
              <span
                class="font-weight-bold"
                v-else
                style="color:green;align-self:center"
              >+ {{formatPrice(item.amount)}} đ</span>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>

    <v-dialog v-model="accountListDialog" max-width="300px" style="height:300px">
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
            <div v-else class="font-weight-medium" v-for="(item,index) in account" :key="index">
              <v-divider class="mb-2"/>
              <v-layout justify-space-between mt-2 mb-2 align-center>
                <v-layout
                  class="ml-2"
                  style="cursor:pointer"
                  @click="selectedAccountIndex=index,accountListDialog=false"
                >
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
    <!-- Deal Detail -->
    <detailDealDialog
      :detailDealDialog="detailDealDialog"
      @close-dialog="detailDealDialog=false"
      :dealItem="selecetedDealItem"
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
import detailDealDialog from '@/components/deals/detailDealDialog.vue'
import listAccountType from '@/common/accountType.js'
import { mapMutations } from 'vuex'
import moment from 'moment'

export default {
  components: {
    'add-account-dialog': addAccountDialog,
    'transfer-account-dialog': transferAccountDialog,
    'edit-account-dialog': editAccountDialog,
    detailDealDialog: detailDealDialog
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
      detailDealDialog: false,
      deleteItem: null,
      editAccountItem: null,
      account: [],
      transferAccountItem: null,
      selectedAccountIndex: 0,
      totalExpense: 0,
      totalIncome: 0,
      monthFilter: moment().format('YYYY-MM'),
      activeSelectmonthTab: 1,
      dealList: [],
      listMonth: [],
      preMonth: null,
      nextMonth: null,
      selecetedDealItem: {},
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
      modelDieuChinhSoDu: false,
      totalExpense: 0,
      totalIncome: 0
    }
  },
  async mounted() {
    await this.readAccountData()
    var startdate = moment()
    // startdate = startdate.subtract(1, 'days')
    // startdate = startdate.format('DD-YYYY-MM')
    this.listMonth[0] = moment()
      .subtract(1, 'months')
      .format('YYYY-MM')
    this.listMonth[1] = moment().format('YYYY-MM')
    this.listMonth[2] = moment()
      .add(1, 'months')
      .format('YYYY-MM')
    // await this.readDealData()
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
    countAmount(list) {
      let array = 0
      list.forEach(element => {
        if (element.type === 'expense') array -= element.amount
        else array += element.amount
      })
      return array
    },

    formatDate(date, type) {
      switch (type) {
        case 'MY':
          return moment(date).format('MM-YYYY')
        case 'YMD':
          // code block
          return moment(date).format('YYYY-MM-DD')
        case 'D':
          return moment(date).format('DD')
        case 'M':
          return moment(date).format('MM')
        case 'Y':
          return moment(date).format('YYYY')
        case 'W':
          switch (moment(date).day()) {
            case 1:
              return 'Monday'
            case 2:
              return 'Tuesday'
            case 3:
              return 'Wednesday'
            case 4:
              return 'Thursday'
            case 5:
              return 'Friday'
            case 6:
              return 'Saturday'
            case 7:
              return 'Sunday'
          }
        default:
          return null
      }
    },
    filterDealbyDate(date, dealList) {
      let listDealByDay = []
      const dealbyDate = dealList.filter(
        item => moment(item.date).format('YYYY-MM') == this.monthFilter
      )
      for (let i = 32; i > 0; i--) {
        let array = dealbyDate.filter(
          element => parseInt(moment(element.date).format('DD')) == i
        )
        if (array.length !== 0) {
          listDealByDay.push(array)
        }
      }
      return listDealByDay
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
    },
    onClickPrevMonth() {
      this.monthFilter = moment(this.monthFilter)
        .subtract(1, 'months')
        .format('YYYY-MM')
      this.listMonth[0] = moment(this.monthFilter)
        .subtract(1, 'months')
        .format('YYYY-MM')
      this.listMonth[1] = this.monthFilter
      this.listMonth[2] = moment(this.monthFilter)
        .add(1, 'months')
        .format('YYYY-MM')
    },
    onClickNextMonth() {
      this.monthFilter = moment(this.monthFilter)
        .add(1, 'months')
        .format('YYYY-MM')
      this.listMonth[0] = moment(this.monthFilter)
        .subtract(1, 'months')
        .format('YYYY-MM')
      this.listMonth[1] = this.monthFilter
      this.listMonth[2] = moment(this.monthFilter)
        .add(1, 'months')
        .format('YYYY-MM')
    },
    onClickDetailDialog(item) {
      this.selecetedDealItem = item
      this.detailDealDialog = true
    }
  },
  computed: {
    countAmountByType: function() {
      let totalIncome = 0,
        totalExpense = 0
      this.filterDealbyDate(this.monthFilter, this.dealList).forEach(
        element => {
          element.forEach(element => {
            if (element.type == 'expense') totalExpense += element.amount
            else if ((element.type = 'income')) {
              totalIncome += element.amount
            }
          })
        }
      )
      return [totalIncome, totalExpense]
    }
  },
  watch: {
    editTotalDialog() {
      if (this.editTotalDialog == false) this.$refs.editTotalForm.reset()
    },
    async account() {
      await this.readDealData()
    },
    activeSelectmonthTab() {
      // if (this.activeSelectmonthTab===0)
      // this.activeSelectmonthTab=1;
      if (this.activeSelectmonthTab === 2) this.activeSelectmonthTab = 1
      if (this.activeSelectmonthTab === 0) {
        this.monthFilter = moment(this.monthFilter)
          .subtract(1, 'months')
          .format('YYYY-MM')
        this.listMonth[0] = moment(this.monthFilter)
          .subtract(1, 'months')
          .format('YYYY-MM')
        this.listMonth[1] = this.monthFilter
        this.listMonth[2] = moment(this.monthFilter)
          .add(1, 'months')
          .format('YYYY-MM')
        // this.activeSelectmonthTab = 1
      }
      // if (this.activeSelectmonthTab === 2) {
      //   console.log(
      //     moment(this.monthFilter)
      //       .subtract(1, 'months')
      //       .format('YYYY-MM')
      //   )
      this.monthFilter = moment(this.monthFilter)
        .add(1, 'months')
        .format('YYYY-MM')
      this.listMonth[0] = moment(this.monthFilter)
        .subtract(1, 'months')
        .format('YYYY-MM')
      this.listMonth[1] = this.monthFilter
      this.listMonth[2] = moment(this.monthFilter)
        .add(1, 'months')
        .format('YYYY-MM')
      //   this.activeSelectmonthTab = 1
      // }
    },
    monthFilter() {
     
    },
    selectedAccountIndex() {
      this.readDealData()
    }
  }
}
</script>
<style>
</style>
