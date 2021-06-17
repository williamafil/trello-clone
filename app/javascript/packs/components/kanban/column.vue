<template>
  <div>
    <div
      class="column cursor-move bg-gray-200 p-2 mr-4 text-left shadow rounded"
    >
      <div class="flex justify-between items-center mb-2 font-bold">
        <h2 class="ml-1">
          {{ column.name }} <span class="text-xs">(id: {{ column.id }})</span>
        </h2>
        <div>
          <edit-menu
            @click="toggleIsEdit"
            :column="column"
            :kanbanId="column.kanban_id"
            class="mr-2 cursor-pointer"
          />
        </div>
      </div>
      <div class="list-reset">
        <draggable
          class="ticket-list"
          v-model="column.tickets"
          group="column"
          @change="dropTicket"
        >
          <column-ticket
            class="flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white no-underline
            "
            v-for="ticket in column.tickets"
            :key="ticket.id"
            :ticket="ticket"
            :kanbanId="column.kanban_id"
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
import EditMenu from "./EdDelMenu";

export default {
  name: "Column",
  components: {
    ColumnTicket,
    draggable,
    EditMenu,
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
      isEdit: false,
    };
  },
  methods: {
    toggleIsEdit() {
      this.isEdit != this.isEdit;
      // console.log("toggle isEdit", isEdit);
    },
    dropTicket(event) {
      // console.log("dropTicket event: ", event);

      const ticketItem = event.added || event.moved;
      if (ticketItem) {
        const [behavior] = Object.keys(event);
        // console.log("behavior：", behavior);
        const kanbanId = this.column.kanban_id;
        const columnId = this.column.id;
        const ticketId = ticketItem.element.id;
        const newPosition = ticketItem.newIndex + 1;

        this.$store.dispatch("moveTicket", {
          behavior,
          kanbanId,
          columnId,
          ticketId,
          newPosition,
        });
      }
    },
    createTicket(event) {
      this.$store
        .dispatch("addTicket", {
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
