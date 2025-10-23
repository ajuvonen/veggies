import type ButtonComponent from '@/components/ButtonComponent.vue';
import type IconComponent from '@/components/IconComponent.vue';
import type ContentElement from '@/components/ContentElement.vue';

declare module 'vue' {
  export interface GlobalComponents {
    ButtonComponent: ButtonComponent;
    IconComponent: IconComponent;
    ContentElement: ContentElement;
  }
}
