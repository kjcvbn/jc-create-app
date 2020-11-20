<template>
  <div id="app">
    <Layout v-if="isInit">
      <router-view></router-view>
    </Layout>
  </div>
</template>

<script>
import Layout from '@/layouts/Layout.vue';
export default {
  name: 'App',
  components: {
    Layout,
  },
  async beforeCreate() {
    this.$store.dispatch('about/fatchSample');
    await this.$store.dispatch('init');
  },
  computed: {
    isInit: function() {
      return this.$store.getters.isInit;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
