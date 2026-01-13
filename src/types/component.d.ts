import type ButtonComponent from '@/components/ButtonComponent.vue';
import type ContentElement from '@/components/ContentElement.vue';
import type IconComponent from '@/components/IconComponent.vue';

declare module 'vue' {
  export interface GlobalComponents {
    ButtonComponent: ButtonComponent;
    ContentElement: ContentElement;
    IconComponent: IconComponent;
  }
}
