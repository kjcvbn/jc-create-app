import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import aboutStore from './about';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isInit: false,
  },
  actions: {
    // context: { commit, dispatch, getters, rootGetters, rootState, state }
    init: ({ commit }) => {
      //Initialization process..
      commit('completeInit');
    },
    requestApi: async (context, param = {}) => {
      const option = Object.assign(
        {
          headers: { 'Content-Type': 'application/json' },
        },
        param,
      );

      try {
        const res = await axios(option);
        // custom process..
        return res;
      } catch (err) {
        // error process
        console.error(err);
      }
    },
  },
  mutations: {
    completeInit: state => (state.isInit = true),
  },
  getters: {
    isInit: state => state.isInit,
  },
  modules: {
    about: aboutStore,
  },
});
