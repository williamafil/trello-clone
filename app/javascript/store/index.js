import Vue from "vue/dist/vue.esm";
import Vuex from "vuex";
import axios from "axios-on-rails";

Vue.use(Vuex);

function compare(a, b) {
  if (a.position < b.position) {
    return -1;
  }
  if (a.position > b.position) {
    return 1;
  }
  return 0;
}

let nextId = 0;

export default new Vuex.Store({
  state: {
    notifications: [],
    columns: [],
    route: null,
  },
  mutations: {
    PUSH_NOTICE(state, notification) {
      state.notifications.push({
        ...notification,
        id: Date.now(),
        // id: (nextId += 1),
      });
    },
    DELETE_NOTICE(state, notificationToRemove) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== notificationToRemove.id,
      );
    },
    SET_ROUTE(state, route) {
      state.route = route;
    },
    ADD_COLUMN(state, column) {
      // console.log("state.route: ", parseInt(state.route));
      // console.log("kanban_id: ", column.kanban_id);
      if (parseInt(state.route) === column.kanban_id) {
        column.tickets = [];
        state.columns.push(column);
      }
    },
    UPDATE_COLUMNS(state, columns) {
      state.columns = columns;
    },
    UPDATE_COLUMN(state, columnObj) {
      // console.log("UPDATE_COLUMN --column obj: ", columnObj);
      const origColumnIdx = state.columns.findIndex(
        (column) => column.id === columnObj.id,
      );

      if (origColumnIdx !== -1) {
        state.columns[origColumnIdx].name = columnObj.name;
      }
    },
    DELETE_COLUMN(state, columnObj) {
      // console.log("DELETE_COLUMN --column obj: ", columnObj);
      const origColumnIdx = state.columns.findIndex(
        (column) => column.id === columnObj.id,
      );
      if (origColumnIdx !== -1) {
        state.columns.splice(origColumnIdx, 1);
      }
    },
    REPOSITION_COLUMN(state, columns) {
      // DESC: matching state.columns position with columns payload
      if (parseInt(state.route) === columns[0].kanban_id) {
        columns.forEach((col) => {
          const [stateColumn] = state.columns.filter(
            (item) => item.id === col.id,
          );
          stateColumn.position = col.position;
        });
        state.columns.sort(compare);
      }
    },
    ADD_TICKET(state, newTicket) {
      const origColumnIdx = state.columns.findIndex(
        (column) => column.id === newTicket.column_id,
      );
      if (origColumnIdx !== -1) {
        state.columns[origColumnIdx].tickets.push({
          column_id: newTicket.columnId,
          name: newTicket.name,
          id: newTicket.id,
          position: newTicket.position,
          created_at: newTicket.created_at,
          updated_at: newTicket.updated_at,
        });
      }
    },
    REORDER_TICKET(state, ticketObj) {
      if (parseInt(state.route) === ticketObj.kanbanId) {
        const origColumnIdx = state.columns.findIndex(
          (column) => column.id === ticketObj.ticket.column_id,
        );
        state.columns[origColumnIdx].tickets.forEach((ticket) => {
          const [newObj] = ticketObj.newTickets.filter(
            (newTicket) => newTicket.id === ticket.id,
          );
          ticket.position = newObj.position;
        });

        state.columns[origColumnIdx].tickets.sort(compare);
      }
    },
    TRANSFER_TICKET(state, ticketObj) {
      // DESC: LOOKUP OLD TICKET ID FROM OLD COLUMN, REMOVE IT IF EXIST
      if (parseInt(state.route) === ticketObj.kanbanId) {
        const origColumnIdx = state.columns.findIndex(
          (column) => column.id === ticketObj.old_column_id,
        );
        const origTicketIdx = state.columns[origColumnIdx].tickets.findIndex(
          (ticket) => ticket.id === ticketObj.ticket.id,
        );
        if (origTicketIdx === -1) {
          return;
        } else {
          state.columns[origColumnIdx].tickets.splice(origTicketIdx, 1);
        }
        // DESC: RE-ASSIGN POSITION TO TICKETS IN OLD COLUMN AND RE-ORDER THEM ASC BY POSITION
        state.columns[origColumnIdx].tickets.forEach((ticket) => {
          const [oldObj] = ticketObj.oldTickets.filter(
            (oldTicket) => oldTicket.id === ticket.id,
          );
          ticket.position = oldObj.position;
        });
        state.columns[origColumnIdx].tickets.sort(compare);

        // DESC: INSERT NEW TICKET OBJ TO NEW COLUMN TICKETS ARRAY
        const newColumnIdx = state.columns.findIndex(
          (column) => column.id === ticketObj.ticket.column_id,
        );
        state.columns[newColumnIdx].tickets.push(ticketObj.ticket);

        // DESC: RE-ASSIGN POSITION TO TICKETS IN NEW COLUMN AND RE-ORDER THEM ASC BY POSITION
        state.columns[newColumnIdx].tickets.forEach((ticket) => {
          const [newObj] = ticketObj.newTickets.filter(
            (newTicket) => newTicket.id === ticket.id,
          );
          ticket.position = newObj.position;
        });
        state.columns[newColumnIdx].tickets.sort(compare);
      }
    },

    EDIT_TICKET(state, ticketObj) {
      const origColumnIdx = state.columns.findIndex(
        (column) => column.id === ticketObj.column_id,
      );
      if (origColumnIdx !== -1) {
        const [ticket] = state.columns[origColumnIdx].tickets.filter(
          (ticket) => ticket.id === ticketObj.id,
        );
        ticket.name = ticketObj.name;
      }
    },
    DELETE_TICKET(state, ticketObj) {
      // DESC: LOOKUP OLD TICKET ID FROM OLD COLUMN, REMOVE IT IF EXIST
      const origColumnIdx = state.columns.findIndex(
        (column) => column.id === ticketObj.column_id,
      );
      if (origColumnIdx !== -1) {
        const origTicketIdx = state.columns[origColumnIdx].tickets.findIndex(
          (ticket) => ticket.id === ticketObj.id,
        );
        if (origTicketIdx !== -1) {
          state.columns[origColumnIdx].tickets.splice(origTicketIdx, 1);
        }
      }
    },
  },
  actions: {
    add_notification(context, notification) {
      context.commit("PUSH_NOTICE", notification);
    },
    remove_notification(context, notificationToRemove) {
      context.commit("DELETE_NOTICE", notificationToRemove);
    },
    setRoute(context, route) {
      context.commit("SET_ROUTE", route);
    },
    addColumn(context, columnObj) {
      axios
        .post(`/kanbans/${columnObj.kanbanId}/columns`, {
          name: columnObj.name,
          kanban_id: columnObj.kanbanId,
        })
        .then((res) => console.log("create column res: ", res))
        .catch((error) => {
          // console.log("???????????? column: ", error.response);
        });
    },
    getColumns(context, kanbanid) {
      axios
        .get(`/kanbans/${kanbanid}/columns.json`)
        .then((res) => {
          context.commit("UPDATE_COLUMNS", res.data);
        })
        .catch((error) => {
          // console.log(error.response);
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
          // console.log("moveColumn res: ", res.data);
          // context.commit("REPOSITION_COLUMN", res.data);
          return;
        })
        .catch((error) => {
          // console.log("???????????? column: ", error.response);
        });
    },
    updateColumn(context, columnObj) {
      // console.log("updateColumn columnObj: ", columnObj);

      axios
        .put(`/kanbans/${columnObj.kanbanId}/columns/${columnObj.id}`, {
          name: columnObj.name,
        })
        .then((res) => {
          // console.log("updated column: ", res.data);
        });
    },
    deleteColumn(context, columnObj) {
      axios
        .delete(`/kanbans/${columnObj.kanbanId}/columns/${columnObj.columnId}`)
        .then((res) => {
          // console.log("???????????? column: ", res);
        })
        .catch((error) => {
          console.log("?????? column ??????: ", error.response);
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
          // context.commit("ADD_TICKET", { tickets, newTicket: res.data });
        })
        .catch((error) => {
          console.log("?????? ticket ??????: ", error.response);
        });
    },
    editTicket(context, ticketObj) {
      // const tickets = context.getters.findColumn(ticketObj.column_id)[0]
      //   .tickets;

      axios
        .put(`/kanbans/${ticketObj.kanbanId}/tickets/${ticketObj.id}`, {
          name: ticketObj.name,
        })
        .then((res) => {
          // console.log("updated ticket: ", res.data);
          // context.commit("EDIT_TICKET", { tickets, updatedTicket: res.data });
        })
        .catch((error) => {
          console.log("?????? ticket ??????: ", error.response);
        });
    },
    moveTicket(context, ticketObj) {
      axios
        .put(
          `/kanbans/${ticketObj.kanbanId}/tickets/${ticketObj.ticketId}/drag`,
          {
            behavior: ticketObj.behavior,
            column_id: ticketObj.columnId,
            position: ticketObj.newPosition,
          },
        )
        .then((res) => {
          // console.log("new ticket position: ", res.data);
        })
        .catch((error) => {
          console.log("?????? ticket ??????: ", error.response);
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
          // context.commit("DELETE_TICKET", {
          //   tickets,
          //   ticketId: ticketIndex,
          // });
        })
        .catch((error) => {
          console.log("?????? ticket ??????: ", error.response);
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
