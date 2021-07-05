<template>
  <div>
    <div class="flex items-center relative">
      <div v-if="isEditMenu" class="flex items-center">
        <div class="text-xs font-light absolute top-0 right-4 w-20 z-50">
          <span
            @click="toggleDeleteElement"
            class="p-1 border-2 border-gray-400 rounded hover:bg-gray-200 bg-white"
            >刪除</span
          >
          <span
            @click="toggleEditElement"
            class="p-1 border-2 border-gray-400 rounded hover:bg-gray-200 bg-white"
          >
            編輯
          </span>
        </div>
        <vertical-dots
          class="text-gray-300 hover:text-gray-500"
          v-on:click.native="toggleIsEdit"
        />
      </div>
      <vertical-dots
        class="text-gray-400 hover:text-gray-500"
        v-else
        v-on:click.native="toggleIsEdit"
      />
    </div>

    <section
      v-if="isEditElement"
      class="z-1000 cursor-auto main-modal fixed w-full inset-0 overflow-hidden flex justify-center items-center animated fadeIn faster"
      style="background: rgba(0,0,0,.4);"
    >
      <div
        class="border-4 border-warmGray-300 modal-container bg-white w-4/12 md:max-w-11/12 mx-auto rounded-lg shadow-lg z-50 overflow-y-auto"
      >
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-xl font-bold text-gray-500">編輯</p>
            <div
              class="cursor-pointer modal-close z-100"
              @click="toggleEditElement"
            >
              <svg
                class="fill-current text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                ></path>
              </svg>
            </div>
          </div>
          <!--Body-->
          <form
            id="add_caretaker_form"
            class="w-full"
            @submit.prevent="submitEdit"
          >
            <div class="my-5 mr-5 ml-5 flex justify-center">
              <div class="">
                <div class="">
                  <label for="names" class="text-md text-gray-600"
                    >{{ column ? "Column" : "Ticket" }} Name</label
                  >
                </div>
                <div class="">
                  <input
                    v-model="dynamicDraft.name"
                    type="text"
                    id="name"
                    autocomplete="off"
                    name="names"
                    class="h-4 px-3 py-5 w-full border-2 border-gray-300 mb-4 rounded-md tracking-wider"
                  />
                </div>
              </div>
            </div>
            <!--Footer-->
            <div class="flex justify-center">
              <button
                @click="toggleEditElement"
                class="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 font-normal text-sm"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-gray-300 ml-2 rounded text-gray-700 hover:bg-gray-400 font-normal text-sm"
              >
                送出
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <section
      v-if="isDeleteElement"
      class="cursor-auto main-modal fixed w-full inset-0 z-100 overflow-hidden flex justify-center items-center animated fadeIn faster"
      style="background: rgba(0,0,0,.4);"
    >
      <div
        class="border-4 border-warmGray-300 modal-container bg-white w-4/12 md:max-w-11/12 mx-auto rounded-lg shadow-lg z-50 overflow-y-auto"
      >
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-xl font-bold text-gray-500"></p>
            <div
              class="cursor-pointer modal-close z-100"
              @click="toggleDeleteElement"
            >
              <svg
                class="fill-current text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                ></path>
              </svg>
            </div>
          </div>
          <!--Body-->

          <div class="mt-2 mb-9 mr-5 ml-5 flex justify-center">
            <p class="font-medium text-lg">
              確定要刪除這個{{ column ? "Column" : "Ticket" }}？
            </p>
          </div>
          <!--Footer-->
          <div class="flex justify-center">
            <button
              @click="toggleDeleteElement"
              class="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 font-normal text-sm"
            >
              取消
            </button>
            <button
              @click="submitDelete"
              class="px-4 py-2 bg-red-300 ml-2 rounded text-gray-700 hover:bg-red-400 font-normal text-sm"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import VerticalDots from "../icons/VerticalDots";

export default {
  name: "EditMenu",
  components: { VerticalDots },
  props: {
    ticket: {
      type: Object,
      default: null,
    },
    column: {
      type: Object,
      default: null,
    },
    kanbanId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      isEditMenu: false,
      isEditElement: false,
      // isEditTicket: false,
      // isDeleteTicket: false,
      isDeleteElement: false,
      // ticketDraft: Object.assign({}, this.ticket),
      ticketDraft: Object.assign({}, this.ticket),
      columnDraft: Object.assign({}, this.column),
    };
  },
  methods: {
    submitDelete() {
      if (this.ticket) {
        return this.$store
          .dispatch("deleteTicket", {
            kanbanId: this.kanbanId,
            columnId: this.ticket.column_id,
            ticketId: this.ticket.id,
          })
          .then(() => {
            this.isDeleteElement = false;
          });
      }

      return this.$store
        .dispatch("deleteColumn", {
          kanbanId: this.kanbanId,
          columnId: this.column.id,
        })
        .then(() => {
          this.isDeleteElement = false;
        });
    },
    submitEdit(event) {
      if (this.ticket) {
        return this.$store
          .dispatch("editTicket", {
            kanbanId: this.kanbanId,
            ...this.ticketDraft,
          })
          .then(() => {
            this.isEditElement = false;
            // this.isEditTicket = false;
          });
      }
      return this.$store
        .dispatch("updateColumn", {
          kanbanId: this.kanbanId,
          ...this.columnDraft,
        })
        .then(() => {
          this.isEditElement = false;
          // this.isEditTicket = false;
        });
    },
    toggleDeleteElement() {
      this.isDeleteElement = !this.isDeleteElement;
      this.isEditMenu = false;
    },
    toggleEditElement() {
      // this.isEditTicket = !this.isEditTicket;
      this.isEditElement = !this.isEditElement;
      this.isEditMenu = false;
    },
    toggleIsEdit() {
      this.isEditMenu = !this.isEditMenu;
    },
  },
  computed: {
    dynamicDraft() {
      if (this.ticket) {
        return this.ticketDraft;
      } else {
        return this.columnDraft;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
