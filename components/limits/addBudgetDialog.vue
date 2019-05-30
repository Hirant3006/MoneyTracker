<template>
  <v-dialog v-model="addBudgetDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline pb-1">Thêm hạn mức</span>
      </v-card-title>
      <v-card-text style="padding-top:0">
        <v-form ref="forgetAccountForm">
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field label="Số tiền" type="number" v-model="amount" prefix="đ"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                prepend-icon="assignment"
                v-model="name"
                label="Tên hạn mức"
                persistent-hint
              ></v-text-field>
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
            <v-layout justify-space-between>
              <v-dialog ref="dialog" v-model="modaldate1" persistent lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date1"
                    label="Ngày bắt đầu"
                    prepend-icon="calendar_today"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date1" scrollable></v-date-picker>
              </v-dialog>
              <v-flex xs3 sm3 md3>
                <v-dialog
                  ref="dialog"
                  v-model="modaltime1"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="time1"
                      label="Giờ"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-if="modaltime1" v-model="time1" full-width>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="modaltime1 = false">OK</v-btn>
                    <!-- <v-btn flat color="primary" @click="$refs.dialog.save(time1)">OK</v-btn> -->
                  </v-time-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout justify-space-between>
              <v-dialog ref="dialog" v-model="modaldate2" persistent lazy full-width width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date2"
                    label="Ngày kết thúc"
                    prepend-icon="calendar_today"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date2" scrollable></v-date-picker>
              </v-dialog>
              <v-flex xs3 sm3 md3>
                <v-dialog
                  ref="dialog"
                  v-model="modaltime2"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="time2"
                      label="Giờ"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-if="modaltime2" v-model="time2" full-width>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="modaltime2 = false">OK</v-btn>
                    <!-- <v-btn flat color="primary" @click="$refs.dialog.save(time2)">OK</v-btn> -->
                  </v-time-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat>Thêm</v-btn>
      </v-card-actions>
    </v-card>
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
  </v-dialog>
</template>

<script>
import categories from '@/common/categories.js'
import firebase from '@/services/fireinit.js'

export default {
  data: function() {
    return {
      amount: 0,
      date1: new Date().toISOString().substr(0, 10),
      modaltime1: false,
      modaldate1: false,
      time1: '00:00',
      date2: new Date().toISOString().substr(0, 10),
      modaltime2: false,
      modaldate2: false,
      time2: '00:00',
      active: null,
      listCategoriesType: ['Tiền vào', 'Tiền ra', 'Ghi nợ'],
      categories: categories,
      name: '',
      categoriesType: '',
      selectAccount: null,
      accountList: [],
      categoriesDialog: false
    }
  },
  props: {
    addBudgetDialog: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onClickCategoryType(item) {
      this.categoriesType = item.name
      this.selectCategory = item
      this.categoriesDialog = false
    },
    async readAccountData() {
      let array = []
      const uid = await firebase.auth().currentUser.uid
      var ref = await firebase.database().ref(`${uid}/Account`)

      await ref.on('value', snapshot => {
        this.accountLoading = true
        const allAccount = {
          key: '',
          name: 'Tất cả tài khoản'
        }
        array.push(allAccount)
        let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
        keys.map((item, index) => {
          console.log('item ', snapshot.val()[item])
          array.push(snapshot.val()[item])
        })
        this.accountList = array
        array = []
      })
    }
  },
  mounted() {
    this.readAccountData()
  },
  watch: {
    selectAccount() {
      console.log(this.selectAccount)
    },
    date1() {
      this.modaldate1 = false
    },
    date2() {
      this.modaldate2 = false
    },
    time1() {
      console.log(this.time1)
    },
    time2() {
      console.log(this.time2)
    }
  }
}
</script>

<style>
</style>
