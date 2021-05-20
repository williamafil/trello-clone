import TurbolinksAdapter from "vue-turbolinks";
import Vue from "vue/dist/vue.esm";
import FooterComponent from "./components/footer";
import DemoComponent from "./components/demo.vue";

Vue.use(TurbolinksAdapter);

document.addEventListener("turbolinks:load", () => {
  const el = document.querySelector("#main-area");

  if (el) {
    const app = new Vue({
      el,
      data: () => {
        return {
          title: " 哈囉世界",
        };
      },
      methods: {
        greeting() {
          return "hey...";
        },
      },
      components: {
        FooterComponent,
        DemoComponent,
      },
    });
  }
});
