<template>
  <span
    class="ticket cursor-move w-full flex-shrink-0 font-bold justify-between"
  >
    <div>{{ ticket.name }}</div>
    <edit-menu
      @click="toggleIsEdit"
      :ticket="ticket"
      :kanbanId="kanbanId"
      class="cursor-pointer"
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
      // console.log("toggle isEdit", isEdit);
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
