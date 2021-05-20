<template>
  <div>
    <p>demo component, {{ name }}</p>
    <p>Props: {{ rootprop }}</p>
  </div>
</template>

<script>
export default {
  props: {
    rootprop: {
      type: String,
    },
  },
  data() {
    return {
      name: "Will",
    };
  },
};
</script>

<style lang="scss" scoped></style>
