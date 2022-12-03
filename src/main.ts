import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PolarisVue from '@ownego/polaris-vue';
import '@ownego/polaris-vue/dist/style.css';
import { i18n } from './lang/i18n';
import axios from '@/bootstrap/api-interceptor';
import router from './router';
import App from '@/App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(PolarisVue);
app.use(router);
app.use(i18n);

app.provide('axios', axios);

router.isReady().then(() => {
  app.mount('#app');
});
