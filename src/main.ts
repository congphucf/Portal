import { createApp } from 'vue';
import router from '@/router';
import PolarisVue from '@ownego/polaris-vue';
import '@ownego/polaris-vue/dist/style.css';
import createShopifyApp from '@shopify/app-bridge';

import App from './App.vue';
const account = { username: 'user123', role: 'admin' };

const app = createApp(App);
const appBridge = createShopifyApp({
  apiKey: '5d14bceb5e8726c98d1abc23aab12f3b',  
  host: new URLSearchParams(window.location.search).get('host'), 
  forceRedirect: true,
});

app.use(PolarisVue);
app.use(router);

app.provide('appBridge', appBridge);
app.provide('isPortal', true);
app.provide('isEmbed', true);
app.provide('account', account);

router.isReady().then(() => {
  app.mount('#app');
});
