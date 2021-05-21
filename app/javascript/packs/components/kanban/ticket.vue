<template>
  <div class="ticket">{{ ticket.name }}</div>
</template>

<script>
export default {
  name: "Ticket",
  props: {
    ticket: {
      type: Object,
      require: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.ticket {
  @apply bg-yellow-50 mx-2 mb-2 rounded-md px-2 py-2 font-thin text-sm shadow-sm;
}
</style>
