<template>
  <div class="layout">
    <component :is="type">
      <slot></slot>
    </component>
  </div>
</template>
<script>
import Default from './Default.vue';
export default {
  components: {
    Default,
    Error: () => import('./Error.vue'),
  },
  computed: {
    type: function() {
      return this.$route.meta.layout || 'Default';
    },
  },
};
</script>
