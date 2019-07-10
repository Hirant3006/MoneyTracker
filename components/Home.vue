<template>
  <div>
    <v-container grid-list-lg>
      <v-flex xs12>
        <v-card hover @click="$router.push('/wallet')" color class="dark--text">
          <v-card-title primary-title>
            <div style="width:100%">
              <h4 class>Tài chính hiện tại</h4>
              <v-divider/>
              <v-layout v-if="total===null" mt-1 mb-1 justify-center>
                <v-progress-circular indeterminate></v-progress-circular>
              </v-layout>
              <h3 v-else class="headline blue--text mt-2">{{ formatPrice(total) }} đ</h3>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-layout justify-space-between row wrap>
        <v-flex xs12 sm12 md6 lg6 xl6>
          <v-card hover @click="$router.push('/limits')" color class="dark--text">
            <v-card-title primary-title>
              <div style="width:100%">
                <h4 class>Hạn mức chi tiêu</h4>
                <v-divider mb-1/>
                <v-list class="mt-3">
                  <v-layout v-if="budgets===null" mt-1 mb-1 justify-center>
                    <v-progress-circular indeterminate></v-progress-circular>
                  </v-layout>
                  <v-layout
                    mt-1
                    mb-1
                    style="color:red"
                    justify-center
                    v-else-if="budgets.length===0"
                  >Hiện chưa có hạn mức chi nào</v-layout>
                  <v-container
                    class="font-weight-medium"
                    style="padding-top:0px;padding-bottom:0px"
                    v-for="(item,index) in budgets"
                    :key="index"
                    v-else-if="budgets.length<3"
                  >
                    <budget-item :budgetItem="item"/>
                    <v-divider class="mb-4"/>
                  </v-container>
                </v-list>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md6 lg6 xl6 style="width:100%">
          <v-card hover @click="$router.push('/deals')" color style="width:100%">
            <v-card-title primary-title>
              <div style="width:100%">
                <h4 class>Ghi chép gần đây</h4>
                <v-divider mb-1/>
                <v-list>
                  <v-layout v-if="deals===null" mt-1 mb-1 justify-center>
                    <v-progress-circular indeterminate></v-progress-circular>
                  </v-layout>
                  <v-layout
                    mt-3
                    mb-1
                    style="color:red"
                    justify-center
                    v-else-if="deals.length===0"
                  >Hiện chưa có ghi chép nào</v-layout>
                  <v-container
                    v-else
                    class="font-weight-medium"
                    v-for="(item,index) in deals"
                    :key="index"
                  >
                    <v-layout justify-space-between>
                      <div>
                        <v-list-tile-title :key="index">Khoảng chi {{item.categories}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{formatDate(item.date,'DMY')}}</v-list-tile-sub-title>
                      </div>
                      <div>
                        <br>
                        <v-list-tile-title
                          :style="item.type==='income' ? 'color:green' :'color:red'"
                          style="aligns-self:center"
                          :key="index"
                        >
                          <span v-if="item.type!=='income'">-</span>
                          <span v-else>+</span>
                          {{formatPrice(item.amount)}} đ
                        </v-list-tile-title>
                      </div>
                    </v-layout>
                    <v-divider class="mt-3"/>
                  </v-container>
                </v-list>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- <h3 class="mb-4">Tổng quan</h3>
    <v-layout>
      <v-card color class="dark--text">
        <v-card-title primary-title>
          <div>
            <div class="headline">Tài chính hiện tại</div>
            <v-divider/>
            <h3 class="headline blue--text">10.000.000 vnđ</h3>
          </div>
        </v-card-title>
      </v-card>
    </v-layout>-->
  </div>
</template>

<script>
const dummiesLimitData = [
  {
    type: 'ăn uống',
    startDate: '01/03',
    endDate: '30/03',
    spend: 1600000,
    total: 1800000
  },
  {
    type: 'mua sắm',
    startDate: '01/02',
    endDate: '28/02',
    spend: 30000,
    total: 6000000
  },
  {
    type: 'ăn chơi',
    startDate: '01/02',
    endDate: '28/02',
    spend: 200000,
    total: 1000000
  }
]
const dummiesDiary = [
  {
    type: 'mua sắm',
    date: '30/03/2019',
    total: '2000000',
    wallet: 'tiền mặt'
  },
  {
    type: 'mua sắm',
    date: '30/03/2019',
    total: '2000000',
    wallet: 'tiền mặt'
  }
]
import budgetItem from '@/components/limits/budgetItem.vue'
import categories from '@/common/categories.js'
import firebase from '@/services/fireinit.js'
import { mapMutations } from 'vuex'
import moment from 'moment'
export default {
  components: {
    'budget-item': budgetItem
  },
  data: function() {
    return {
      limits: dummiesLimitData,
      histories: dummiesDiary,
      budgets: null,
      deals: null,
      total: null,
      accountList: null
    }
  },
  mounted() {
    this.readAccountData()
    this.readBudgetData()
    this.readDealsData()
  },
  methods: {
    formatDate(date, type) {
      switch (type) {
        case 'TIME':
          return moment(date).format('HH:MM')
        case 'DM':
          return moment(date).format('DD/MM')
        case 'MY':
          return moment(date).format('MM-YYYY')
        case 'YMD':
          // code block
          return moment(date).format('YYYY-MM-DD')
        case 'DMY':
          // code block
          return moment(date).format('DD-MM-YYYY')
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
    async readDealsData() {
      let array = []
      const uid = await firebase.auth().currentUser.uid
      var ref = await firebase.database().ref(`${uid}/TotalDeals`)
      await ref
        .orderByValue()
        .limitToLast(5)
        .on('value', snapshot => {
          let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
          keys.map((item, index) => {
            array.push(snapshot.val()[item])
          })
          this.deals = array
          array = []
        })
    },
    async readBudgetData() {
      let array = []
      const uid = await firebase.auth().currentUser.uid
      var ref = await firebase.database().ref(`${uid}/Budget`)
      await ref.on('value', snapshot => {
        let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
        keys.map((item, index) => {
          array.push(snapshot.val()[item])
          // totalBalance = totalBalance + snapshot.val()[item].balance
        })
        this.budgets = array
        // totalBalance = 0
        array = []
      })
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    spendingProcess(total, spend) {
      return Number((spend * 100) / total)
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
    }
  },
  watch: {
    deals() {
    }
  }
}
</script>

<style>
</style>
