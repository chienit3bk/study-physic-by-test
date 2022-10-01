import { createI18n } from 'vue-i18n';
import { vi } from './vi';

const messages = {
  vi,
};

export const i18n = createI18n({
  locale: 'vi',
  messages,
  warnHtmlInMessage: 'off', // disable of the Detected HTML in message
})
