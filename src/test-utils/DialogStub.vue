<template>
  <component :is="as" v-if="mountState" v-show="showState">
    <slot :open="open" />
  </component>
</template>

<script lang="ts">
import {type DefineComponent, defineComponent, computed, type PropType} from 'vue';

export default defineComponent({
  props: {
    open: {
      type: Boolean,
      default: undefined,
    },
    /** Functionality not implemented */
    initialFocus: {
      type: HTMLElement,
      default: null,
    },
    as: {
      type: [String, Object] as PropType<string | DefineComponent>,
      default: 'div',
    },
    static: {
      type: Boolean,
      default: false,
    },
    unmount: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const mountState = computed(() => {
      if (props.static || !props.unmount) return true;
      else return props.open;
    });

    const showState = computed(() => {
      if (props.static || props.unmount) return true;
      else return props.open;
    });

    return {mountState, showState};
  },
});
</script>
