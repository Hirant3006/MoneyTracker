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
                <h3 class="headline blue--text mt-2">10.000.000 vnđ</h3>
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
                    <v-container
                      class="font-weight-medium"
                      v-for="(item,index) in account"
                      :key="index"
                    >
                      <v-divider class="mb-2"/>
                      <v-layout justify-space-between mt-4>
                        <v-layout>
                          <v-avatar :size="40" color=" lighten-4">
                            <img
                              src="https://vuetifyjs.com/apple-touch-icon-180x180.png"
                              alt="avatar"
                            >
                          </v-avatar>
                          <div class="ml-3" style="align-self:center">
                            <span>{{item.name}}</span>
                            <br>
                            <span>{{item.total}}</span>
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
                    </v-container>
                  </v-list>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <!-- Add account -->
    <v-dialog v-model="addAccountDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Thêm tài khoản</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="addAccountForm">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="Số dư ban đầu" value="10.00" prefix="$"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field prepend-icon="featured_play_list" label="Tên tài khoản" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-select
                    prepend-icon="help"
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Loại tài khoản*"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm12 md412>
                  <v-select
                    prepend-icon="attach_money"
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Đơn vị tiền tệ*"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field prepend-icon="note" label="Ghi chú" persistent-hint></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="addAccountDialog = false">Đóng</v-btn>
          <v-btn color="blue darken-1" flat @click="addAccountDialog = false">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editTotalDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Điều chỉnh số dư</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editTotalForm">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field prepend-icon="featured_play_list" label="Chọn tài khoản" required></v-text-field>
                </v-flex>
                <v-flex xs9 sm9 md9>
                  <v-text-field prepend-icon="person" label="Ngày" required></v-text-field>
                </v-flex>
                <v-flex xs3 sm3 md3>
                  <v-text-field label="Giờ" required></v-text-field>
                </v-flex>
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
                <!-- <v-layout justify-space-between ml-1 mr-1 mt-1>
                  <h4>Số dư trên tài khoản</h4>
                  <h4>5.000.000đ</h4>
                </v-layout>-->
                <!-- <v-flex xs3 sm3 md3>
                  <v-text-field  label="Giờ" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-select
                    prepend-icon="help"
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Loại tài khoản*"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm12 md412>
                  <v-select
                    prepend-icon="attach_money"
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Đơn vị tiền tệ*"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field prepend-icon="note" label="Ghi chú" persistent-hint></v-text-field>
                </v-flex>-->
              </v-layout>
            </v-container>
            <!-- <small>*indicates required field</small> -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="editTotalDialog = false">Đóng</v-btn>
          <v-btn color="blue darken-1" flat @click="editTotalDialog = false">Lưu</v-btn>
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
export default {
  data: function() {
    return {
      addAccountDialog: false,
      editTotalDialog: true,
      account: dummieAccount,
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
  methods: {
    onClickAccount(e) {
      // if (e.target.textContent==="Chuyển khoản")
    },
    toggleModalAddAccount() {
      this.addAccountDialog = true
    },
    onToggleMore(info, item) {
      console.log({ info }, { item })
      if (info.title === 'Điều chỉnh số dư') this.editTotalDialog = true
    }
  },
  watch: {
    addAccountDialog() {
      if (this.addAccountDialog == false) this.$refs.addAccountForm.reset()
    },
    editTotalDialog() {
      if (this.editTotalDialog == false) this.$refs.editTotalForm.reset()
    }
  }
}
</script>
<style>
</style>
