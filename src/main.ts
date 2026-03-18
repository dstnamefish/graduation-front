
import { createApp } from 'vue';
import 'element-plus/dist/index.css';
import '@/assets/styles/index.scss';

import App from './App.vue';
import '@/assets/styles/core/tailwind.css';

import language from './locales';
import { initRouter } from './router';
import { initStore } from './store';
import { VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);

app.use(VueQueryPlugin);
initStore(app);
initRouter(app);

app.use(language);

app.mount('#app');
