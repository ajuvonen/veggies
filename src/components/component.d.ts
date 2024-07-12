import ButtonComponent from '@/components/ButtonComponent.vue';
import IconComponent from '@/components/IconComponent.vue';

declare module 'vue' {
  export interface GlobalComponents {
    ButtonComponent: typeof ButtonComponent;
    IconComponent: typeof IconComponent;
  }
}

export {};
