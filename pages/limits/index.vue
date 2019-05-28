<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-container grid-list-lg>
        <v-layout justify-space-between row wrap>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-card>
              <v-card-title primary-title>
                <div style="width:100%">
                  <v-layout pl-1 pr-1 justify-space-between>
                    <h4 style="align-self:center">Hạn mức chi</h4>
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
                    >Hiện chưa có hạn mức chi nào</v-layout>
                    <v-container
                      class="font-weight-medium"
                      v-for="(item,index) in budgets"
                      :key="index"
                    >
                      <v-divider class="mb-2"/>
                      <v-layout justify-space-between>
                        <div>
                          <v-list-tile-title :key="index">{{item.nameBudget}}</v-list-tile-title>
                          <v-list-tile-sub-title>{{formatDate(item.startDate,'DM')}} - {{formatDate(item.endDate,'DM')}}</v-list-tile-sub-title>
                        </div>
                        <div style="align-self:flex-end">
                          <v-list-tile-title :key="index">{{item.amount}}</v-list-tile-title>
                        </div>
                      </v-layout>
                      <v-progress-linear
                        :value="listpercentbudgets[index]"
                        :color="listpercentbudgets[index]>100 ? 'red' : 'blue'"
                      ></v-progress-linear>
                      <v-layout justify-space-between>
                        <div>
                          <v-list-tile-title>Còn 10 ngày</v-list-tile-title>
                        </div>
                        <div>
                          <v-list-tile-title>{{item.spend}}</v-list-tile-title>
                        </div>
                      </v-layout>
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

export default {
  data: function() {
    return {
      budgets: [],
      listpercentbudgets: []
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
    }
  },
  mounted() {
    this.readBudgetData()
  },
  watch: {
    async budgets() {
      console.log('budget ', this.budgets)
      this.listpercentbudgets = []
      const listaccount = await this.readAccountData()
      console.log('listaccount ', listaccount)
      this.budgets.forEach(async (item, index) => {
        let spent = 0
        if (item.accountKey) {
          const dealdata = await this.readDealDatabyAccount(item.accountKey)
          dealdata.forEach(element => {
            if (
              moment(element.date).diff(moment(item.startDate)) > 0 &&
              moment(element.date).diff(moment(item.endDate)) < 0 &&
              element.categories === item.categories
            ) {
              spent += element.amount
            }
          })
          this.listpercentbudgets.push(Number((spent * 100) / item.amount))
          // this.listpercentbudgets.reverse()
        } else {
          listaccount.forEach(async accountitem => {
            const dealdata = await this.readDealDatabyAccount(accountitem.key)
            dealdata.forEach((element, index) => {
              // console.log('Deal data',element);
              // console.log([moment(element.date).diff(moment(item.startDate)),moment(element.date).diff(moment(item.endDate))])
              // console.log(element.categories===item.categories)
              if (
                moment(element.date).diff(moment(item.startDate)) > 0 &&
                moment(element.date).diff(moment(item.endDate)) < 0 &&
                element.categories === item.categories
              ) {
                spent += element.amount
                console.log('wadwadwadwa', [dealdata.length, index])

                if (dealdata.length - 1 === index) {
                  console.log('spent ', spent)
                  this.listpercentbudgets.push(
                    Number((spent * 100) / item.amount)
                  )
                }
              }
            })
          })
        }
      })
    },
    listpercentbudgets() {
      console.log(this.listpercentbudgets)
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
