import Vue from "vue/dist/vue.esm";
import Vuex from "vuex";
import axios from "axios-on-rails";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    columns: [],
  },
  mutations: {
    UPDATE_COLUMNS(state, columns) {
      console.log("UPDATE_COLUMNS: ", columns);
      console.log("this: ", this);
      console.log("state: ", state);
      state.columns = columns;
    },
  },
  actions: {
    get_columns(context, kanbanid) {
      console.log("get_columns action, kanbanid: ", kanbanid);
      axios
        .get(`/kanbans/${kanbanid}/columns.json`)
        .then((res) => {
          console.log("res: ", res);
          // this.columns = res.data;
          context.commit("UPDATE_COLUMNS", res.data);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    // set_column_position(context, columnObj) { }
  },
  getters: {
    columns: (state) => state.columns,
  },
  modules: {},
});
