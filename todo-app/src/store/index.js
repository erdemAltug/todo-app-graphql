import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dialog: false,
    dialogDelete: false,
    dialogUpdate: false,
  },
  getters: {},
  mutations: {
    setModal(state, val) {
      state.dialog = val;
    },

    setDelete(state, val) {
      state.dialogDelete = val;
    },

    setUpdate(state, val) {
      state.dialogUpdate = val;
    },
  },
  actions: {
    setModal({ commit }, val) {
      commit("setModal", val);
    },
    setDelete({ commit }, val) {
      commit("setDelete", val);
    },
    setUpdate({ commit }, val) {
      commit("setUpdate", val);
    },
  },
  modules: {},
});
