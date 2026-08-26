<script lang="ts" setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useDateTime} from '@/hooks/dateTime';
import {PRIVACY_POLICY_UPDATED} from '@/utils/constants';

type PrivacyParagraph = {
  title?: string;
  text: string;
  link?: string;
  linkText?: string;
};

const {tm} = useI18n();
const {formatDate} = useDateTime();

const paragraphs = computed(() => tm('privacy.paragraphs') as PrivacyParagraph[]);
const formattedDate = computed(() => formatDate(PRIVACY_POLICY_UPDATED, true));
</script>
<template>
  <div class="flex flex-col gap-4 has-scroll">
    <p class="text-xs uppercase">{{ $t('privacy.lastUpdated', [formattedDate]) }}</p>
    <template v-for="(paragraph, index) in paragraphs" :key="index">
      <h2 v-if="paragraph.title" class="label-like">{{ paragraph.title }}</h2>
      <i18n-t :keypath="`privacy.paragraphs.${index}.text`" tag="p" scope="global">
        <a
          v-if="paragraph.link"
          :href="paragraph.link"
          target="_blank"
          rel="noopener noreferrer"
          class="text-link"
          >{{ paragraph.linkText }}</a
        >
      </i18n-t>
    </template>
  </div>
</template>
