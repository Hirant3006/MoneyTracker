import Vue from 'vue'

Vue.filter('currency', (amount, symbol) => {
    return `${amount.toFixed(0)} ${symbol}`
})
