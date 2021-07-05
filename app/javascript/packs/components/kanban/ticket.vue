<template>
  <span
    class="relative ticket cursor-move w-full flex-shrink-0 justify-between hover:bg-orange-50"
  >
    <h3 class=" font-medium text-sm tracking-wide w-11/12 overflow-hidden">{{ ticket.name }}</h3>
    <edit-menu
      @click="toggleIsEdit"
      :ticket="ticket"
      :kanbanId="kanbanId"
      class="absolute top-3 right-2 cursor-pointer"
    />
  </span>
</template>

<script>
import EditMenu from "./EdDelMenu";

export default {
  name: "Ticket",
  components: { EditMenu },
  props: {
    ticket: {
      type: Object,
      require: true,
    },
    kanbanId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      isEdit: false,
    };
  },
  methods: {
    toggleIsEdit() {
      this.isEdit != this.isEdit;
    },
  },
};
</script>

<style lang="scss" scoped>
// .ticket {
//   @apply bg-yellow-50 mx-2 mb-2 rounded-md px-2 py-2 font-thin text-sm shadow-sm;
// }
// .ticket {
//   @apply cursor-pointer w-full flex-shrink-0 font-bold justify-between;
// }
</style>
