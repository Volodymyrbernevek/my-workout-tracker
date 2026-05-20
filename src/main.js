import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import posthog from 'posthog-js'

window.posthog = posthog

posthog.init('phc_ARXkGMBPGeBmDuXMGMp5v8EokkQ85wgBTnR4MUth8q9c', {
  api_host: 'https://us.i.posthog.com', 
  
  // Додатково підказуємо системі, де знаходиться ваш веб-кабінет
  ui_host: 'https://app.posthog.com',
  
  person_profiles: 'always',
  
  // Примусово кажемо клієнту запускати запис
  disable_session_recording: false 
})

createApp(App).mount('#app')
