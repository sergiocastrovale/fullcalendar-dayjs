import Vue from 'vue'
import Vuex from 'vuex'
import Dayjs from 'vue-dayjs';

import store from './store'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Dayjs)
Vue.use(Vuex)

new Vue({
  store: new Vuex.Store(store),
  render: h => h(App)
}).$mount('#app')
