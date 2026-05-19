import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')


import posthog from 'posthog-js'

posthog.init('phc_ARXkGMBPGeBmDuXMGMp5v8EokkQ85wgBTnR4MUth8q9c', {
  api_host: 'https://app.posthog.com',
  person_profiles: 'identified_only',
  
})