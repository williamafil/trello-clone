// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start();
require("turbolinks").start();
require("@rails/activestorage").start();
require("channels");

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
const images = require.context("../images", true);
const imagePath = (name) => images(name, true);

import "../stylesheets";

// Vue
import TurbolinksAdapter from "vue-turbolinks";
import Vue from "vue/dist/vue.esm";
import store from "../store/index";
import BoardColumn from "./components/kanban/column";
import draggable from "vuedraggable";
import axios from "axios-on-rails";
import { mapState } from "vuex";

// import Rails from "@rails/ujs";
// 裡面打ajax跟資料庫取得資料。
// 而在做這一步前，記得在開頭要引入ujs
// import Rails from '@rails/ujs'
// 這可以讓我們可以在不更動原有的controller的情況下，就能用Rails的慣例處理route與action。
// beforeMount(){
//   // 打API
//   Rails.ajax({
//     url: `/kanbans/${this.kanban_id}/columns.json`,
//     type: 'GET',
//     dataType: 'json',
//     success: result => {
//       // 把ajax回傳結果放進columns陣列
//       this.columns = result;
//     },
//     error: error => {
//       console.log(error);
//     }
//   });
// }

Vue.use(TurbolinksAdapter);

document.addEventListener("turbolinks:load", () => {
  let el = document.querySelector("#column");

  if (el) {
    new Vue({
      el,
      store,
      components: { BoardColumn, draggable },
      data() {
        return {
          kanban_id: el.dataset.kanbanid,
          newColumnName: "",
          // columns: [],
        };
      },
      beforeMount() {
        this.$store.dispatch("getColumns", this.kanban_id);
      },
      methods: {
        dropColumn(event) {
          const kanban_id = event.moved.element.kanban_id;
          const column_id = event.moved.element.id;
          axios
            .put(`/kanbans/${kanban_id}/columns/${column_id}/drag`, {
              position: event.moved.newIndex + 1,
            })
            .then((res) => {
              console.log("drag res: ", res);
            })
            .catch((error) => {
              console.log("無法移動 column: ", error.response);
            });
        },
        checkMove(event) {
          console.log("checkMove event: ", event);
        },
        createColumn() {
          // console.log("columnd id: ", this.columnd.id);
        },
      },
      computed: {
        // 當資料來源轉移到 vuex store 後，出現了錯誤訊息
        // [Vue warn]: Computed property "columns" was assigned to but it has no setter.
        // 因為在 columns/index.html.erb <draggable v-model="column.tickets"> 這個 v-model reactivity，
        // 而 mapState 裡面只有 getter, 沒有 setter 所以無法把資料反寫回去
        // https://stackoverflow.com/questions/46106037/vuex-computed-property-name-was-assigned-to-but-it-has-no-setter
        // If you're going to v-model a computed property, it needs a setter.
        // Whatever you want it to do with the updated value(probably write it to the $store,
        // considering that's what your getter pulls it from) you do in the setter.

        // ...mapState(["columns"]), // 改寫這一行
        columns: {
          get() {
            return this.$store.state.columns;
          },
          set(val) {
            this.$store.commit("UPDATE_COLUMNS", val);
          },
        },
      },
    });
  }
});
