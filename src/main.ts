// 外部依赖（external组） - 按字母顺序
import { createApp } from 'vue';
import 'element-plus/dist/index.css';
import '@/shared/assets/styles/index.scss';

import App from './App.vue';
import '@/shared/assets/styles/core/tailwind.css';

import language from './locales';
import { initRouter } from './router';
import { initStore } from './app/store';
import { VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);

app.use(VueQueryPlugin);
initStore(app);
initRouter(app);

app.use(language);

app.mount('#app');