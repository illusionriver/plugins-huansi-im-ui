import Vue from 'vue'
import App from './App.vue'
import router from './router'
import LemonIMUI from 'lemon-imui';
import 'lemon-imui/dist/index.css';

Vue.config.productionTip = false
Vue.use(LemonIMUI);

import {
    HIM
} from "../packages/index";

Vue.use(HIM);

sessionStorage.setItem(
    'IM_TOKEN',
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFCQzIzNkNFNUZDRkY2ODBGQjdFRTcwNjNGQzAxQUY3IiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NDQ1NjEwNTAsImV4cCI6MTY0NDU2NDY1MCwiaXNzIjoiaHR0cHM6Ly90ZXN0LWhhbmd6aG91Lm9hdXRoLnNhYXMuaHVhbnNpLm5ldCIsImF1ZCI6WyJVc2VyUmlnaHQiLCJodHRwczovL3Rlc3QtaGFuZ3pob3Uub2F1dGguc2Fhcy5odWFuc2kubmV0L3Jlc291cmNlcyJdLCJjbGllbnRfaWQiOiJ3ZWItY29tbW9uLWxvY2FsaG9zdCBjbGllbnQiLCJzdWIiOiIxNDgxODE5OTU5Njk0ODA3MDQxIiwiYXV0aF90aW1lIjoxNjQ0NTYxMDQ5LCJpZHAiOiJsb2NhbCIsInByZWZlcnJlZF91c2VybmFtZSI6IjE4NjE2OTM4ODI0IiwibmFtZSI6Indtd3giLCJ0ZW5hbnRfaWQiOiIxNDc2Nzg3Njg2MTY4NzI3NTUyIiwidGVuYW50X2NvZGUiOiJjc3p3aHp3aGR0ZCIsImlzX2FkbWluIjpmYWxzZSwic2lkIjoiNzE4NjVGQzBFRUZERDUzRjkyNzdGQzk4REUyQTc4M0QiLCJpYXQiOjE2NDQ1NjEwNTAsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJVc2VyUmlnaHQiXSwiYW1yIjpbInB3ZCJdfQ.iM6_o1U7boJ_odOyw6LJ_qdQp4vbyTsxtZo6Zk53X6dO3ShqjR9z2nOke5q4RYjPUWrMcxCONtHKAQfgc7MzJmSTPAVt313e6U4fBakIGsW003DNyQ3gf8VxjCN8KqsRsPGpS6bcqFNpjWp2FBq3vBbbS8wRfQamWPa_PdB279_Uhdz_Ra6o-Q7BtAYGv8xSntUfVbi9veo8mfPsilPGodjkIxL4SY_-WKQim3aKucbqGEQ0qw_yc96C6vVqHI9IaMblB3iMHmnkS7lorE_y1gIaO1hyIctxwmapFP1QT-hc_WDvQpzhxXfN6shvxHMyLwK3zGU3yDK2vF7BcXKd3g'
)

sessionStorage.setItem('IM_API_URL', 'http://im-service.test.huansi.net')
sessionStorage.setItem('IM_BROKER_URL', 'ws://ws.dev.huansi.net/mqtt')

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
