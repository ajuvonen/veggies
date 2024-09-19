import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from '@/App.vue';
import router from '@/router';
import i18n from '@/i18n';

import '@fontsource/bungee-shade/latin-400.css';
import '@fontsource/nunito/latin-400.css';
import '@/assets/main.scss';

import IconComponent from '@/components/IconComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';

const app = createApp(App);
app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .component('IconComponent', IconComponent)
  .component('ButtonComponent', ButtonComponent)
  .mount('#app');
