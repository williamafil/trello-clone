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
      state.columns = columns;
    },
    ADD_TICKET(state, { tickets, newTicket }) {
      tickets.push({
        column_id: newTicket.columnId,
        name: newTicket.name,
        id: newTicket.id,
        position: newTicket.position,
        created_at: newTicket.created_at,
        updated_at: newTicket.updated_at,
      });
    },
  },
  actions: {
    get_columns(context, kanbanid) {
      axios
        .get(`/kanbans/${kanbanid}/columns.json`)
        .then((res) => {
          context.commit("UPDATE_COLUMNS", res.data);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    add_ticket(context, ticketObj) {
      const tickets = context.getters.findColumn(ticketObj.columnId)[0].tickets;

      axios
        .post(`/kanbans/${ticketObj.kanbanId}/tickets`, {
          name: ticketObj.name,
          column_id: ticketObj.columnId,
        })
        .then((res) => {
          context.commit("ADD_TICKET", { tickets, newTicket: res.data });
        })
        .catch((error) => {
          console.log("新增 ticket 失敗: ", error.response);
        });
    },
  },
  getters: {
    columns: (state) => state.columns,
    findColumn: (state) => (id) => {
      return state.columns.filter((col) => {
        return col.id === id;
      });
    },
  },
  modules: {},
});
