<template>
  <div>
    <v-container grid-list-lg >
      <v-flex xs12>
        <h2 class="mb-4">Tổng quan</h2>
        <v-card color class="dark--text">
          <v-card-title primary-title>
            <div style="width:100%">
              <h4 class>Tài chính hiện tại</h4>
              <v-divider/>
              <h3 class="headline blue--text mt-2">10.000.000 đ</h3>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-layout justify-space-between row wrap>
        <v-flex xs12 sm12 md7 lg7 xl7>
          <v-card>
            <v-card-title primary-title>
              <div style="width:100%">
                <h4 class>Hạn mức chi tiêu</h4>
                <v-list>
                  <v-container
                    class="font-weight-medium"
                    v-for="(item,index) in limits"
                    :key="index"
                  >
                    <v-divider class="mb-2"/>
                    <v-layout justify-space-between>
                      <div>
                        <v-list-tile-title :key="index">Khoảng chi {{item.type}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{item.startDate}} - {{item.endDate}}</v-list-tile-sub-title>
                      </div>
                      <div>
                        <v-list-tile-title :key="index">{{item.total}}</v-list-tile-title>
                      </div>
                    </v-layout>
                    <v-progress-linear :value="spendingProcess(item.total,item.spend)"></v-progress-linear>
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
        <v-flex xs12 sm12 md5 lg5 style="width:100%">
          <v-card style="width:100%">
            <v-card-title primary-title>
              <div style="width:100%">
                <h4 class>Ghi chép gần đây</h4>
                <v-list>
                  <v-container
                    class="font-weight-medium"
                    v-for="(item,index) in histories"
                    :key="index"
                  >
                    <v-divider class="mb-2"/>
                    <v-layout justify-space-between>
                      <div>
                        <v-list-tile-title :key="index">Khoảng chi {{item.type}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{item.date}}</v-list-tile-sub-title>
                      </div>
                      <div>
                        <br>
                        <v-list-tile-title :key="index">{{item.total}}</v-list-tile-title>
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
export default {
  data: function() {
    return {
      limits: dummiesLimitData,
      histories: dummiesDiary
    }
  },
  methods: {
    spendingProcess(total, spend) {
      return Number((spend * 100) / total)
    }
  }
}
</script>

<style>
</style>
