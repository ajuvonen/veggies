import 'temporal-polyfill-lite/global';
import 'temporal-polyfill-lite/types/global';
import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {plugin as VueTippy} from 'vue-tippy';
import App from '@/App.vue';
import router from '@/router';
import createI18n from '@/i18n';
import {CURRENT_MIGRATION_VERSION, MINIMUM_MIGRATION_VERSION} from '@/utils/constants';
import {dateParser} from '@/utils/helpers';
import {runMigrations} from '@/utils/migrations';

import '@fontsource/bungee-shade/latin-400.css';
import '@fontsource/nunito/latin-400.css';
import 'tippy.js/dist/tippy.css';
import '@/assets/main.css';

// Run migrations before initializing stores
const storedSettings = localStorage.getItem('veggies-settings');
if (storedSettings) {
  try {
    const settings = JSON.parse(storedSettings, dateParser);
    const currentVersion = settings.migrationVersion || MINIMUM_MIGRATION_VERSION;
    await runMigrations(currentVersion, CURRENT_MIGRATION_VERSION);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

const app = createApp(App);
app
  .use(createPinia())
  .use(router)
  .use(createI18n())
  .use(VueTippy, {
    defaultProps: {
      hideOnClick: true,
    },
    aria: {
      content: null,
      expanded: false,
    },
  })
  .mount('#app');
