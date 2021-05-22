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
    EDIT_TICKET(state, { tickets, updatedTicket }) {
      const selectedTicket = tickets.filter(
        (ticket) => ticket.id === updatedTicket.id,
      )[0];
      console.log("selectedTicket: ", selectedTicket);
      selectedTicket.name = updatedTicket.name;
    },
    DELETE_TICKET(state, { tickets, ticketId }) {
      tickets.splice(ticketId, 1);
    },
  },
  actions: {
    getColumns(context, kanbanid) {
      axios
        .get(`/kanbans/${kanbanid}/columns.json`)
        .then((res) => {
          context.commit("UPDATE_COLUMNS", res.data);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    addTicket(context, ticketObj) {
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
    editTicket(context, ticketObj) {
      const tickets = context.getters.findColumn(ticketObj.column_id)[0]
        .tickets;

      axios
        .put(`/kanbans/${ticketObj.kanbanId}/tickets/${ticketObj.id}`, {
          name: ticketObj.name,
        })
        .then((res) => {
          // console.log("update ticket: ", res);
          context.commit("EDIT_TICKET", { tickets, updatedTicket: res.data });
        })
        .catch((error) => {
          console.log("更新 ticket 失敗: ", error.response);
        });
    },
    deleteTicket(context, ticketObj) {
      const tickets = context.getters.findColumn(ticketObj.columnId)[0].tickets;
      const ticketIndex = tickets.findIndex(
        (ticket) => ticket.id === ticketObj.ticketId,
      );
      // console.log("tickets: ", tickets);
      // console.log("ticketIndex: ", ticketIndex);
      // console.log("deleteTicket ACTION: ", ticketObj);
      axios
        .delete(`/kanbans/${ticketObj.kanbanId}/tickets/${ticketObj.ticketId}`)
        .then((res) => {
          // console.log("delete: ", res);
          context.commit("DELETE_TICKET", {
            tickets,
            ticketId: ticketIndex,
          });
        })
        .catch((error) => {
          console.log("刪除 ticket 失敗: ", error.response);
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
