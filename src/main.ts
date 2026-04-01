import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import router from './router'
import App from './App.vue'
import { scrollRevealDirective } from './composables/useScrollReveal'

const app = createApp(App)
app.use(createPinia())
app.use(vuetify)
app.use(router)
app.directive('scroll-reveal', scrollRevealDirective)
app.mount('#app')
