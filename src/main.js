import Vue from 'vue'
import App from './App'
import uView from '@/uni_modules/uview-ui'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.use(uView)
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
