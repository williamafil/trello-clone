<template>
  <div>
    <div
      class="column w-64 cursor-move bg-gray-200 p-2 text-left shadow rounded hover:bg-trueGray-300 hover:shadow-lg"
    >
      <div class="flex justify-between items-center mb-2">
        <h2 class="ml-1 font-semibold tracking-wider">{{ column.name }} <span class="text-xs"></span></h2>
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
          ghost-class="ghost-class"
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
          placeholder="Enter 新增事項"
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
    },
    dropTicket(event) {

      const ticketItem = event.added || event.moved;
      if (ticketItem) {
        const [behavior] = Object.keys(event);
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
.ghost-class {
  @apply bg-orange-100 border-2 border-orange-200 shadow;
}
</style>
