import Vue from 'vue'

Vue.filter('reverse', value => {
    return value.slice().reverse();
})
