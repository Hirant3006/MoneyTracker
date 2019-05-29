<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-container grid-list-lg>
        <v-layout justify-space-between row wrap>
          <h2 class="mb-4">Hạn mức chi</h2>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-card>
              <v-card-title primary-title>
                <div style="width:100%">
                  <v-layout pl-1 pr-1 justify-space-between>
                    <h4 class="ml-3" style="align-self:center">Hạn mức chi</h4>
                    <v-btn icon>
                      <v-icon @click="toggleModalAddLimit">add</v-icon>
                    </v-btn>
                  </v-layout>
                  <v-list>
                    <v-layout
                      mt-1
                      mb-1
                      style="color:red"
                      justify-center
                      v-if="budgets.length===0"
                    >Hiện chưa có hạn mức chi nào</v-layout>
                    <v-container
                      class="font-weight-medium"
                      style="padding-top:0px"
                      v-for="(item,index) in budgets"
                      :key="index"
                      v-else
                    >
                      <budget-item :budgetItem="item"/>
                    </v-container>
                  </v-list>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'
import moment from 'moment'
import firebase from '@/services/fireinit.js'
import budgetItem from '@/components/limits/budgetItem.vue'

export default {
  components: {
    'budget-item': budgetItem
  },
  data: function() {
    return {
      budgets: [],
      listpercentbudgets: [],
      listDealDataByAccount: []
    }
  },
  methods: {
    formatDate(date, type) {
      switch (type) {
        case 'DM':
          return moment(date).format('DD/MM')
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
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    toggleModalAddLimit() {},
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
    async readAccountData() {
      let array = []
      const uid = await firebase.auth().currentUser.uid
      var ref = await firebase
        .database()
        .ref(`${uid}/Account`)
        .once('value', snapshot => {
          let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
          keys.map((item, index) => {
            array.push(snapshot.val()[item])
          })
        })
      return array
    },
    async readDealDatabyAccount(accountKey) {
      let array = []
      const uid = await firebase.auth().currentUser.uid
      await firebase
        .database()
        .ref(`${uid}/Deals/${accountKey}`)
        .once('value', snapshot => {
          let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
          keys.map((item, index) => {
            array.push(snapshot.val()[item])
          })
        })
      return array
    },
    countdownDay(endDate) {
      let milisecondTime = moment(endDate).diff(moment(new Date()))
      const day = Math.floor(milisecondTime / 1000 / 60 / 60 / 24),
        hour = Math.floor(
          (milisecondTime / 1000 / 60 / 60 / 24 -
            Math.floor(milisecondTime / 1000 / 60 / 60 / 24)) *
            24
        )

      return `${day} ngày ${hour} giờ`

      // return (`Còn ${Number(milisecondTime/1000/60/60/24)} ngày ${Number((milisecondTime/1000/60/60/24-Number(milisecondTime/1000/60/60/24))*24)} giờ`)
    }
  },
  mounted() {
    this.readBudgetData()
  },
  watch: {
    listpercentbudgets() {
      // console.log(this.listpercentbudgets)
    }
  }
}
</script>

<style>
.avatar {
  max-width: 100px;
}
.avatar img {
  max-width: 100%;
}
</style>
