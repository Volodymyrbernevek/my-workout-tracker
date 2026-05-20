import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import posthog from 'posthog-js'

posthog.init('phc_ARXkGMBPGeBmDuXMGMp5v8EokkQ85wgBTnR4MUth8q9c', {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || '/ingest',
  ui_host: 'https://app.posthog.com',
  person_profiles: 'always',
  disable_session_recording: false,
})

if (typeof window !== 'undefined') {
  window.posthog = posthog
}
window.posthog = posthog

createApp(App).mount('#app')