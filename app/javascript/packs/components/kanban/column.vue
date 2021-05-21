<template>
  <div class="column bg-gray-100 mx-2 w-64 rounded">
    <div class="column-name font-thin px-3 py-2">
      {{ column.name }} (id: {{ column.id }})
    </div>
    <draggable
      class="ticket-list"
      v-model="column.tickets"
      group="column"
      @change="dropTicket"
    >
      <column-ticket
        v-for="ticket in column.tickets"
        :key="ticket.id"
        :ticket="ticket"
      />
    </draggable>
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
      console.log("drop ticket event: ", event);
      const ticketItem = event.added || event.moved;
      if (ticketItem) {
        const kanban_id = this.column.kanban_id;
        const column_id = this.column.id;
        const ticket_id = ticketItem.element.id;
        // console.log("column_id: ", column_id);
        console.log("ticket_id: ", ticket_id);
        console.log("this: ", this);
        console.log("current column id:", this.column.id);

        axios
          .put(`/kanbans/${kanban_id}/tickets/${ticket_id}/drag`, {
            column_id,
            position: ticketItem.newIndex + 1,
          })
          .then((res) => {
            console.log("drag res: ", res);
          })
          .catch((error) => {
            console.log("無法移動 column: ", error.response);
          });
      }
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
