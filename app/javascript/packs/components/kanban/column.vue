<template>
  <div class="column">
    <div class="column-name">{{ column.name }}</div>
    <div class="ticket-list">
      <column-ticket
        v-for="ticket in column.tickets"
        :key="ticket.id"
        :ticket="ticket"
      />
    </div>
  </div>
</template>

<script>
import ColumnTicket from "./ticket";

export default {
  name: "Column",
  components: {
    ColumnTicket,
  },
  props: {
    column: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.column {
  @apply bg-gray-100 mx-2 w-64 rounded;

  .column-name {
    @apply px-3 py-2 font-thin;
  }
}
</style>
