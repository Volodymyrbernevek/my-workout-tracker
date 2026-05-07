import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipPrettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  skipPrettier,
  {
    languageOptions: {
      globals: {
        // Додаємо console та інші глобальні змінні для браузера й тестів
        console: 'readonly',
        localStorage: 'readonly',
        Storage: 'readonly',
        window: 'readonly',
        document: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        vi: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off', // Дозволяємо використання console
      'vue/multi-word-component-names': 'off', // Дозволяємо прості назви компонентів
      'vue/no-mutating-props': 'off' // Вимикаємо помилку мутації пропсу form для простоти MVP
    }
  }
]