import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  window.posthog = posthog
}

posthog.init('phc_ARXkGMBPGeBmDuXMGMp5v8EokkQ85wgBTnR4MUth8q9c', {
  api_host: 'https://us.i.posthog.com', 
  
  // Додатково підказуємо системі, де знаходиться ваш веб-кабінет
  ui_host: 'https://app.posthog.com',
  
  person_profiles: 'always',
  
  disable_session_recording: false,
  session_recording: {
    recorderVersion: 'v2'
  } 
})

createApp(App).mount('#app')
