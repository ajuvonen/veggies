import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {plugin as VueTippy} from 'vue-tippy';
import App from '@/App.vue';
import router from '@/router';
import i18n from '@/i18n';

import '@fontsource/bungee-shade/latin-400.css';
import '@fontsource/nunito/latin-400.css';
import 'tippy.js/dist/tippy.css';
import '@/assets/main.css';

import IconComponent from '@/components/IconComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ContentElement from '@/components/ContentElement.vue';

const app = createApp(App);
app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(VueTippy, {
    defaultProps: {
      hideOnClick: true,
    },
  })
  .component('IconComponent', IconComponent)
  .component('ButtonComponent', ButtonComponent)
  .component('ContentElement', ContentElement)
  .mount('#app');
