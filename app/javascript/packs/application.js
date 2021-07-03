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
// const images = require.context("../images", true);
// const imagePath = (name) => images(name, true);

import "../stylesheets/index.js";

// Vue
import TurbolinksAdapter from "vue-turbolinks";
import Vue from "vue/dist/vue.esm";
import store from "../store/index";
import BoardColumn from "./components/kanban/column";
import FlashMessage from "./components/flash/flashMessage"
import draggable from "vuedraggable";

Vue.use(TurbolinksAdapter);

document.addEventListener("turbolinks:load", () => {
  let el = document.querySelector("#column");
  let flashEl = document.querySelector('#flash')

  // ＦＬＡＳＨ  ＭＥＳＳＡＧＥ
  if (flashEl) {
    window.$store = store;
    const flashApp = new Vue({
      el: flashEl,
      store,
      components: {FlashMessage},
      created() {
        console.log('flash message')
      }
    })
  }

  // ＫＡＮＢＡＮ ＆ ＴＩＣＫＥＴ
  if (el) {
    window.$store = store;
    const column = new Vue({
      el,
      store,
      components: { BoardColumn, draggable },
      data() {
        return {
          kanban_id: el.dataset.kanbanid,
          newColumnName: "",
        };
      },
      beforeMount() {
        this.$store.dispatch("getColumns", this.kanban_id);
        this.$store.dispatch("setRoute", this.kanban_id);
      },
      methods: {
        dropColumn(event) {
          const kanbanId = event.moved.element.kanban_id;
          const columnId = event.moved.element.id;
          const newPosition = event.moved.newIndex + 1;
          // console.log("新的 column.position: ", newPosition);
          this.$store.dispatch("moveColumn", {
            kanbanId,
            columnId,
            newPosition,
          });
        },
        checkMove(event) {
          // console.log("checkMove event: ", event);
        },
        createColumn() {
          this.$store
            .dispatch("addColumn", {
              kanbanId: this.kanban_id,
              name: this.newColumnName,
            })
            .then((res) => {
              // console.log("res: ", res);
              this.newColumnName = "";
            });
        },
      },
      computed: {
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
