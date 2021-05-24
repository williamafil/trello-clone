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
    REPOSITION_COLUMN(state, columns) {
      // matching state.columns position with columns payload
      columns.forEach((col) => {
        const stateColumn = state.columns.filter(
          (item) => item.id === col.id,
        )[0];
        stateColumn.position = col.position;
      });

      function compare(a, b) {
        if (a.position < b.position) {
          return -1;
        }
        if (a.position > b.position) {
          return 1;
        }
        return 0;
      }

      // sort by position
      state.columns.sort(compare);
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
    EDIT_TICKET(state, updatedTicket) {
      console.log("::: EDIT_TICKET :::");
      console.log("updatedTicket: ", updatedTicket);
      const column = state.columns.filter(
        (col) => col.id === updatedTicket.column_id,
      )[0];
      const selectedTicket = column.tickets.filter(
        (ticket) => ticket.id === updatedTicket.id,
      )[0];
      console.log("selectedTicket: ", selectedTicket);
      Object.keys(selectedTicket).forEach((key) => {
        selectedTicket[key] = updatedTicket[key];
      });
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
    moveColumn(context, kanbanObj) {
      axios
        .put(
          `/kanbans/${kanbanObj.kanbanId}/columns/${kanbanObj.columnId}/drag`,
          {
            position: kanbanObj.newPosition,
          },
        )
        .then((res) => {
          console.log("moveColumn res: ", res.data);
          // context.commit("REPOSITION_COLUMN", res.data);
          return;
        });
      // .catch((error) => {
      //   console.log("無法移動 column: ", error.response);
      // });
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
          console.log("updated ticket: ", res.data);
          // context.commit("EDIT_TICKET", { tickets, updatedTicket: res.data });
        })
        .catch((error) => {
          console.log("更新 ticket 失敗: ", error.response);
        });
    },
    moveTicket(context, ticketObj) {
      axios
        .put(
          `/kanbans/${ticketObj.kanbanId}/tickets/${ticketObj.ticketId}/drag`,
          {
            column_id: ticketObj.columnId,
            position: ticketObj.newPosition,
          },
        )
        .then((res) => {
          console.log("new ticket position: ", res.data);
        })
        .catch((error) => {
          console.log("移動 ticket 失敗: ", error.response);
        });
    },
    deleteTicket(context, ticketObj) {
      const tickets = context.getters.findColumn(ticketObj.columnId)[0].tickets;
      const ticketIndex = tickets.findIndex(
        (ticket) => ticket.id === ticketObj.ticketId,
      );

      axios
        .delete(`/kanbans/${ticketObj.kanbanId}/tickets/${ticketObj.ticketId}`)
        .then((res) => {
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
