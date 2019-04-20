<template>
  <v-container grid-list-lg>
    <v-flex xs12>
      <h2 class="mb-4">Tài khoản</h2>
      <v-card color class="dark--text">
        <v-card-title primary-title>
          <div style="width:100%">
            <h4 class>Tổng tiền</h4>
            <v-divider/>
            <h3 class="headline blue--text mt-2">10.000.000 vnđ</h3>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>

    <v-layout justify-space-between row wrap>
      <v-flex xs12 sm12 md7 lg7 xl7>
        <v-card>
          <v-card-title primary-title>
            <div style="width:100%">
              <h4 class>Tài khoản</h4>
              <v-list>
                <v-container
                  class="font-weight-medium"
                  v-for="(item,index) in account"
                  :key="index"
                >
                  <v-divider class="mb-2"/>
                  <v-layout justify-space-between mt-4>
                    <v-layout>
                      <v-avatar>hình</v-avatar>
                      <div>
                        <span>{{item.name}}</span>
                        <br>
                        <span>{{item.total}} đ</span>
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
                          v-for="(item, index) in items"
                          :key="index"
                          @click="onClickAccount"
                          :value="item.title"
                        >
                          <v-icon style="margin-right: 20px;" class>{{item.icon}}</v-icon>
                          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
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
    }
  }
}
</script>
<style>
</style>
