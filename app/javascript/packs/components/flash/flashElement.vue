<template>
  <div
    class="mt-1 mb-4 mx-2 relative cursor-pointer"
    :class="notificationTypeClasss"
    @click="close"
  >
    <div class="text-gray-600 absolute top-2 right-2">
      x
    </div>
    {{ notification.message }}
  </div>
</template>

<script>
import { mapActions } from 'vuex';


export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  components: {
  },
  data() {
    return {
      timeout: null,
    };
  },
  mounted() {
    this.timeout = setTimeout(() => this.remove_notification(this.notification), 5000);
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapActions(['remove_notification']),
    close() {
      this.remove_notification(this.notification);
    },
  },
  computed: {
    notificationTypeClasss() {
      const expr = this.notification.type;
      switch (expr) {
        case 'error':
          return 'px-4 pr-8 py-2 rounded bg-white border-4 border-red-300 shadow-md';
        case 'success':
          return 'px-4 pr-8 py-2 rounded bg-white border-4 border-green-300 shadow-md';
        case 'warning':
          return 'px-4 pr-8 py-2 rounded bg-white border-4 border-yellow-300 shadow-md';
        default:
          return 'px-4 pr-8 py-2 rounded bg-white border-4 border-gray-300 shadow-md';
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
