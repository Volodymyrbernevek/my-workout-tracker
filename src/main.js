import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import posthog from 'posthog-js'

posthog.init('phc_ARXkGMBPGeBnDuXMGMP5v8EokkQ85wgBTnR4MUth8q9c', {
  api_host: window.location.origin + '/ingest',
  ui_host: 'https://us.posthog.com',
  
  person_profiles: 'always'
})

createApp(App).mount('#app')
