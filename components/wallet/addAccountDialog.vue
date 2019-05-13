<template>
  <v-dialog v-model="addAccountDialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Thêm tài khoản</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="addAccountForm">
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field label="Số dư ban đầu" type="number" v-model="balance" prefix="đ">balance</v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                prepend-icon="featured_play_list"
                v-model="name"
                label="Tên tài khoản"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                prepend-icon="help"
                label="Loại tài khoản"
                @click="accountTypeDialog=true"
                required
                v-model="accountType"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field prepend-icon="note" v-model="note" label="Ghi chú" persistent-hint></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="$emit('close-dialog')">Đóng</v-btn>
        <v-btn color="blue darken-1" flat @click="onPressAddAcount()">Lưu</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="accountTypeDialog" width="400px">
      <v-card>
        <v-card-title style="padding-bottom:0px">
          <span class="headline">Chọn loại tài khoản</span>
        </v-card-title>
        <v-layout mt-2 pl-2 pr-2 justify-space-around >
          <div  style="display:flex;flex-direction:column;align-items:center;text-align:center;width:70px;cusor:pointer"
                class="mt-2 ml-1 mr-1 mb-3"
                v-for="(item,index) in listAccountType"
                :key="index"
                xs4
                @click="onClickAccountType(item)">
            <img :src="item.icon" class="image" alt="item.icon" width="50px" height="50px">
            <span>{{item.name}}</span>
          </div>
        </v-layout>
      </v-card>
    </v-dialog>
    <v-dialog v-model="categoriesDialog" width="400px">
      <v-tabs v-model="active" slider-color="cyan">
        <v-tab v-for="type in categoriesType" :key="type" ripple>{{ type}}</v-tab>
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
                @click="onClickAccountType(item)"
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
                  @click="onClickAccountType(item)"
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
import firebase from '@/services/fireinit.js'
import categories from '@/common/categories.js'
import { mapMutations } from 'vuex'
import listAccountType from '@/common/accountType.js'
export default {
  data: function() {
    return {
      categories: categories,
      categoriesDialog: false,
      active: null,
      accountType: null,
      listAccountType: listAccountType,
      accountTypeDialog: false,
      balance: null,
      name: null,
      note: null,
      categoriesType: ['Tiền vào', 'Tiền ra', 'Ghi nợ']
    }
  },
  props: {
    addAccountDialog: {
      type: Boolean,
      required: true
    }
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    onClickAccountType(item) {
      this.accountType = item.name
      this.accountTypeDialog = false
    },
    async writeAccountData() {
      const uid = await firebase.auth().currentUser.uid
      var newAccountKey = firebase
        .database()
        .ref()
        .child(`${uid}/Account`)
        .push().key
      await firebase
        .database()
        .ref(`${uid}/Account/${newAccountKey}`)
        .set({
          balance: parseInt(this.balance),
          name: this.name,
          accountType: this.accountType,
          note: this.note,
          key: newAccountKey
        })
        .then(() => {
          this.setSnack({ msg: 'Đã tạo ví thành công', color: 'success' })
          this.$emit('close-dialog')
        })
        .catch(error => {
          this.setSnack({ msg: error, color: 'error' })
        })
    },
    onPressAddAcount() {
      const { balance, name, accountType, note, iconName } = this
      if (balance <= 0) {
        this.setSnack({ msg: 'Số dư của ví phải lớn hơn 0', color: 'error' })
      } else if (name == '') {
        this.setSnack({ msg: 'Tên của ví không được để trống', color: 'error' })
      } else if (accountType == '') {
        this.setSnack({ msg: 'Vui lòng chọn loại ví', color: 'error' })
      } else {
        this.writeAccountData()
        // this.props.navigation.goBack()
      }
    }
  },
  watch: {
    addAccountDialog() {
      if (this.addAccountDialog == false) this.$refs.addAccountForm.reset()
    }
  }
}
</script>

<style>
</style>
