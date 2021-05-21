<template>
  <div>
    <div
      class="column bg-gray-200 p-2 mr-4 text-left shadow rounded cursor-move"
    >
      <div class="flex items-center mb-2 font-bold">
        {{ column.name }} <span class="text-xs">(id: {{ column.id }})</span>
      </div>
      <div class="list-reset">
        <draggable
          class="ticket-list"
          v-model="column.tickets"
          group="column"
          @change="dropTicket"
        >
          <column-ticket
            class="
              task
              cursor-pointer
              flex
              items-center
              flex-wrap
              shadow
              mb-2
              py-2
              px-2
              rounded
              bg-white
              no-underline
            "
            v-for="ticket in column.tickets"
            :key="ticket.id"
            :ticket="ticket"
          />
        </draggable>
        <input
          type="text"
          class="block w-full rounded p-2 bg-gray-100"
          placeholder="add new task"
          @keyup.enter="createTicket"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ColumnTicket from "./ticket";
import draggable from "vuedraggable";
import axios from "axios-on-rails";

export default {
  name: "Column",
  components: {
    ColumnTicket,
    draggable,
  },
  props: {
    column: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tickets: this.column.tickets,
      kanban_id: this.column.kanban_id,
    };
  },
  methods: {
    dropTicket(event) {
      const ticketItem = event.added || event.moved;
      if (ticketItem) {
        const kanban_id = this.column.kanban_id;
        const column_id = this.column.id;
        const ticket_id = ticketItem.element.id;

        axios
          .put(`/kanbans/${kanban_id}/tickets/${ticket_id}/drag`, {
            column_id,
            position: ticketItem.newIndex + 1,
          })
          .then((res) => {})
          .catch((error) => {});
      }
    },
    createTicket(event) {
      this.$store
        .dispatch("add_ticket", {
          kanbanId: this.kanban_id,
          name: event.target.value,
          columnId: this.column.id,
        })
        .then(() => {
          event.target.value = "";
        });
    },
  },
};
</script>

<style lang="scss" scoped>
// .column {
//   @apply bg-gray-100 mx-2 w-64 rounded;

//   .column-name {
//     @apply font-thin px-3 py-2;
//   }
// }
</style>
