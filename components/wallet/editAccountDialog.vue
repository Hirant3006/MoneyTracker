<template>
  <v-dialog v-model="editDialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Chỉnh sửa tài khoản</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="editForm" v-if="accountItem!==null">
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field label="Số dư" type="number" v-model="balance" prefix="đ"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                prepend-icon="featured_play_list"
                label="Tên tài khoản"
                v-model="name"
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
              <v-text-field prepend-icon="note" label="Ghi chú" v-model="note" persistent-hint></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="$emit('close-dialog')">Đóng</v-btn>
        <v-btn color="blue darken-1" flat @click="onPressEditAcount">Lưu</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="accountTypeDialog" width="400px">
      <v-card>
        <v-card-title style="padding-bottom:0px">
          <span class="headline">Chọn loại tài khoản</span>
        </v-card-title>
        <v-layout mt-2 pl-2 pr-2 justify-space-around>
          <div
            style="display:flex;flex-direction:column;align-items:center;text-align:center;width:70px;cusor:pointer"
            class="mt-2 ml-1 mr-1 mb-3"
            v-for="(item,index) in listAccountType"
            :key="index"
            xs4
            @click="onClickAccountType(item)"
          >
            <img :src="item.icon" class="image" alt="item.icon" width="50px" height="50px">
            <span>{{item.name}}</span>
          </div>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import listAccountType from '@/common/accountType.js'
import { mapMutations } from 'vuex'
import firebase from '@/services/fireinit.js'

export default {
  data: function() {
    return {
      accountType: null,
      accountTypeDialog: false,
      listAccountType: listAccountType,
      balance: null,
      note: null,
      name: null,
      uid: null
    }
  },
  props: {
    editDialog: {
      type: Boolean,
      required: true
    },
    accountItem: {
      required: true
    },
    accountList: {
      required: true
    }
  },
  methods: {
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    onClickAccountType(item) {
      this.accountType = item.name
      this.accountTypeDialog = false
    },
    async onPressEditAcount() {
      const { balance, name, accountType, note, key } = this
      if (balance <= 0) {
        alert('Số dư của ví phải lớn hơn 0')
      } else if (name == null) {
        alert('Tên của ví không được để trống')
      } else {
        const writeUserdata = await this.writeUserData(
          balance,
          name,
          accountType,
          note,
          key
        )
        this.setSnack({
          msg: 'Đã cập nhập thông tin ví thành công',
          color: 'success'
        })
        this.$emit('close-dialog')
      }
    },
    async writeUserData(balance, name, accountType, note, key) {
      const { uid } = this
      await firebase
        .database()
        .ref(`${uid}/Account/${key}`)
        .update({
          balance: parseInt(balance),
          name: name,
          accountType: accountType,
          note: note
        })
        .catch(error => {
          console.log('error ', error)
        })
    }
  },
  async mounted() {
    this.uid = await firebase.auth().currentUser.uid
  },
  watch: {
    accountItem() {
      console.log('Account item ', this.accountItem),
        (this.name = this.accountItem.name)
      this.balance = this.accountItem.balance
      this.accountType = this.accountItem.accountType
      this.note = this.accountItem.note
      this.key = this.accountItem.key
    },
    addAccountDialog() {
      if (this.addAccountDialog == false) this.$refs.addAccountForm.reset()
    }
  }
}
</script>

<style>
</style>
