<template>
  <div class="column">
    <div class="column-name">{{ column.name }}</div>
  </div>
</template>

<script>
export default {
  name: "Column",
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
