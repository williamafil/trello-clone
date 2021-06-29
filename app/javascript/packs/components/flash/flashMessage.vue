<template>
  <div class="msg z-1000">
    <!-- <p>{{message}}</p> -->
    <!-- <div v-for="item in messages" key="item">{{ item.type }} - {{item.message}}</div>-->
    <flash-element v-for="(notice, index) in notifications" :key="notice.id" :notification="notice"></flash-element>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import flashElement from './flashElement.vue'
export default {
  name: "flash-message",
  // props: {
  //   message: {
  //     type: [Object, Array]
  //   }
  // },
  components: {
    flashElement
  },
  data: function() {
    return {
      // messages: [this.message[0]]
      // messages: [this.message]
    };
  },
      computed: {
        ...mapState(['notifications'])
        // messages() {
        //     return this.$store.state.notifications;
        // },
      },
};
</script>

<style scoped>

</style>
