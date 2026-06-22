import { createI18n } from 'vue-i18n';
import { vi } from './vi';

const messages = {
  vi,
};

export const i18n = createI18n({
  legacy: false,
  globalInjection: true, // keep $t() available in templates
  locale: 'vi',
  fallbackLocale: 'vi',
  messages,
  warnHtmlInMessage: 'off',
});

export default i18n;
