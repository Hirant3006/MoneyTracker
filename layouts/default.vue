<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app v-if="user">
      <v-list>
        <v-list-tile router nuxt exact v-for="(item, i) in items" :key="i" :to="item.to">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-btn v-if="user" icon @click.native.stop="drawer = !drawer">
        <v-icon>menu</v-icon>
      </v-btn>

      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user" id="user" class="text-xs-center">
        <v-menu offset-x :close-on-content-click="false" :nudge-top="200">
          <v-btn icon slot="activator">
            <v-icon medium>settings</v-icon>
          </v-btn>
          <v-card>
            <v-list>
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="$store.state.user.photoURL" alt="John">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-if="user.displayName">{{user.displayName}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>

              <v-list-tile>
                <v-spacer></v-spacer>
                <v-list-tile-action>
                  <v-btn primary class="mt-2" color="primary" @click.native="logout">Logout</v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <nuxt/>
        <v-card-text style="height: 100px; position: relative">
          <v-fab-transition>
            <v-btn
              v-if="user"
              color="pink"
              dark
              fixed
              bottom
              @click="onToggleAddDealDialog"
              fab
              style="bottom:50px;right:50px"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-card-text>
      </v-container>
    </v-content>
    <v-dialog v-model="addDealDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline pb-1">Thêm giao dịch</span>
        </v-card-title>
        <v-card-text style="padding-top:0">
          <v-form ref="forgetAccountForm">
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-select
                  prepend-icon="help"
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Chọn hạng mục"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field prepend-icon="note" label="Ghi chú" persistent-hint></v-text-field>
              </v-flex>
              <v-layout justify-space-between>
                <v-flex xs9 sm9 md9>
                  <v-text-field prepend-icon="calendar_today" label="Ngày" required></v-text-field>
                </v-flex>
                <v-flex xs3 sm3 md3>
                  <v-text-field prepend-icon="access_time" label="Giờ" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-flex xs12 sm12 md12>
                <v-text-field prepend-icon="featured_play_list" label="Chọn tài khoản" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="() => addDealDialog=false">Thêm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-footer app :fixed="fixed" class="justify-center px-4">
      <!-- <span>&copy; 2017</span> -->
    </v-footer>
    <snackbar/>
  </v-app>
</template>

<script>
import routerItems from '../common/router.js'
import snackbar from '../components/common/Snackbar'

export default {
  data() {
    return {
      drawer: null,
      fixed: false,
      items: routerItems,
      title: 'Money tracker',
      menu: false,
      addDealDialog: false
    }
  },
  components: {
    snackbar
  },
  computed: {
    user() {
      return this.$store.getters.activeUser
    }
  },
  methods: {
    onToggleAddDealDialog() {
      this.addDealDialog = true
    },
    logout() {
      this.$store.dispatch('user/signOut').then(() => {
        alert('logged out!')
        this.$router.push('/')
      })
    }
  }
}
</script>

<style>
.v-navigation-drawer > .list:not(.list--dense) .list__tile {
  font-size: 17px;
}
.avatar {
  max-width: 75px;
}

/* .list__tile--active.list__tile.list__tile--link {

} */

a.nuxt-link-exact-active.list__tile--active.list__tile.list__tile--link {
  font-weight: 900 !important;
  color: #3f51b5 !important;
}
.v-list__tile--link {
  border-left: 10px solid transparent;
}
.v-list__tile--link.v-list__tile--active {
  color: rgba(0, 0, 0, 0.87);
  border-left: 10px solid gray;
}
</style>
