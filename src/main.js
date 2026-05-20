import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import * as Sentry from "@sentry/vue";
import posthog from 'posthog-js'
const app = createApp(App)

// Ініціалізація Sentry [cite: 1055]
Sentry.init({
  app, // Передаємо екземпляр Vue додатка [cite: 1057]
  dsn: "https://fef7affde085596860d6e690ce48d553@o4511422505943040.ingest.de.sentry.io/4511422521868368", // Твій DSN [cite: 1058]
  integrations: [
    Sentry.browserTracingIntegration(), // Моніторинг продуктивності [cite: 1061, 1063]
    Sentry.replayIntegration({
      unmask: ["#user-label"] // Дозволяємо відображення некритичних полів [cite: 1062]
    }),
  ],
  tracesSampleRate: 1.0, // Записуємо 100% транзакцій для тестування [cite: 1063, 1065]
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0, // 100% запис сесії у разі виникнення помилки
  environment: import.meta.env.MODE || "development", // Розділення середовищ [cite: 1066, 1067]
})

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

app.mount('#app')