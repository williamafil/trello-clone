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
import BoardColumn from "./components/kanban/column";
import axios from "axios-on-rails";

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
      components: { BoardColumn },
      data() {
        return {
          kanban_id: el.dataset.kanbanid,
          columns: [],
        };
      },
      beforeMount() {
        axios
          .get(`/kanbans/${this.kanban_id}/columns.json`)
          .then((res) => {
            console.log("res: ", res);
            this.columns = res.data;
          })
          .catch((error) => {
            console.log(error.response);
          });
      },
    });
  }
});
