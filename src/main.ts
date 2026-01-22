import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {plugin as VueTippy} from 'vue-tippy';
import App from '@/App.vue';
import router from '@/router';
import createI18n from '@/i18n';
import {KEYS, CURRENT_MIGRATION_VERSION} from '@/utils/constants';
import {useDropdown} from '@/hooks/dropdown';
import {dateParser} from '@/utils/helpers';
import {runMigrations} from '@/utils/migrations';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ContentElement from '@/components/ui/ContentElement.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ModalDialog from '@/components/ui/ModalDialog.vue';

import '@fontsource/bungee-shade/latin-400.css';
import '@fontsource/nunito/latin-400.css';
import 'tippy.js/dist/tippy.css';
import '@/assets/main.css';

// Run migrations before initializing stores
const storedSettings = localStorage.getItem('veggies-settings');
if (storedSettings) {
  try {
    const settings = JSON.parse(storedSettings, dateParser);
    const currentVersion = settings.migrationVersion ?? 1;

    if (currentVersion < CURRENT_MIGRATION_VERSION) {
      runMigrations(currentVersion, CURRENT_MIGRATION_VERSION);
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

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
