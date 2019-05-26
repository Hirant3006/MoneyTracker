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
                    <!-- <div
                      class="font-weight-medium"
                      v-for="(item,index) in account"
                      :key="index"
                      style="padding:0"
                    >
                      <v-divider class="mb-2"/>
                      <v-layout justify-space-between mt-4 mb-2 align-center>
                        <v-layout class="ml-2">
                          <v-avatar :size="40" color=" lighten-4">
                            <img :src="accountIcon(item)" alt="avatar">
                          </v-avatar>
                          <div class="ml-3">
                            <span>{{item.name}}</span>
                            <br>
                            <span>{{formatPrice(item.balance)}} đ</span>
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
                    </div> -->
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
export default {
  data: function() {
    return {

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
