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
              <v-text-field label="Số dư ban đầu" value="10.00" prefix="$"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field prepend-icon="featured_play_list" label="Tên tài khoản" required></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                prepend-icon="help"
                label="Loại tài khoản"
                @click="categoriesDialog=true"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field prepend-icon="note" label="Ghi chú" persistent-hint></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="$emit('close-dialog')">Đóng</v-btn>
        <v-btn color="blue darken-1" flat @click="$emit('add-account')">Lưu</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog  v-model="categoriesDialog" max-width="300px" >
      <v-tabs scrollable v-model="active" slider-color="cyan" >
        <v-tab v-for="type in categoriesType" :key="type" ripple>{{ type}}</v-tab>
        <v-tab-item v-for="(cateType,index) in categories" :key="index" style="height:120px">
          <v-card flat>
            <!-- {{cateType}} -->
            <template v-if="index!=='dataExpense'">
              <v-layout ml-2 mr-2 wrap>
                <div
                  style="display:flex;flex-direction:column;align-items:center"
                  class="mt-2 ml-1 mr-1 mb-2"
                  v-for="(item,index) in cateType"
                  :key="index"
                  xs4
                >
                  <img :src="item.icon" class="image" alt="item.icon" width="50px" height="50px">
                  <span>{{item.name}}</span>
                </div>
              </v-layout>
            </template>
            <template v-else>
              <div class="ml-2 pt-2" v-for="(item,index) in cateType" :key="index">
                <b>{{item.title}}</b>
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
                >
                  <img :src="item.icon" class="image" alt="item.icon" width="50px" height="50px">
                  <span>{{item.name}}</span>
                </div>
                </v-layout>
              </div>
            </template>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-dialog>
  </v-dialog>
</template>

<script>
import categories from '@/common/categories.js'

export default {
  data: function() {
    return {
      categories: categories,
      categoriesDialog: false,
      active: null,
      categoriesType: ['Tiền vào', 'Tiền ra', 'Ghi nợ']
    }
  },
  props: {
    addAccountDialog: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    console.log('Hello dialog')
  },
  method: {
    onScroll(e) {
      this.offsetTop = e.target.scrollTop
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
