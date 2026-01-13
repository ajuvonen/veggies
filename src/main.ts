import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {plugin as VueTippy} from 'vue-tippy';
import App from '@/App.vue';
import router from '@/router';
import createI18n from '@/i18n';
import {KEYS} from '@/utils/constants';
import {useDropdown} from '@/hooks/dropdown';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ContentElement from '@/components/ui/ContentElement.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ModalDialog from '@/components/ui/ModalDialog.vue';

import '@fontsource/bungee-shade/latin-400.css';
import '@fontsource/nunito/latin-400.css';
import 'tippy.js/dist/tippy.css';
import '@/assets/main.css';

const app = createApp(App);
const {getDropdownStyles} = useDropdown();
app
  .use(createPinia())
  .use(router)
  .use(createI18n())
  .use(VueTippy, {
    defaultProps: {
      hideOnClick: true,
    },
  })
  .provide(KEYS.dropdownStyles, getDropdownStyles)
  .component('ButtonComponent', ButtonComponent)
  .component('ContentElement', ContentElement)
  .component('IconComponent', IconComponent)
  .component('ModalDialog', ModalDialog)
  .mount('#app');
