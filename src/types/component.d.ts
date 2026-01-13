import type ButtonComponent from '@/components/ui/ButtonComponent.vue';
import type ContentElement from '@/components/ui/ContentElement.vue';
import type IconComponent from '@/components/ui/IconComponent.vue';
import type ModalDialog from '@/components/ui/ModalDialog.vue';

declare module 'vue' {
  export interface GlobalComponents {
    ButtonComponent: ButtonComponent;
    ContentElement: ContentElement;
    IconComponent: IconComponent;
    ModalDialog: ModalDialog;
  }
}
