import Vue from 'vue'
import App from './App'
import api from 'common/api/api.js'
Vue.prototype.$apis=api

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
