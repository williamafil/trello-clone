<template>
  <div>
    <div class="flex items-center">
      <div v-if="isEditMenu" class="flex items-center">
        <div class="text-xs font-light">
          <span
            @click="toggleDeleteTicket"
            class="p-1 border rounded hover:bg-gray-100"
            >刪除</span
          >
          <span
            @click="toggleEditTicket"
            class="p-1 border rounded hover:bg-gray-100"
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
      v-if="isEditTicket"
      class="cursor-auto main-modal fixed w-full inset-0 z-100 overflow-hidden flex justify-center items-center animated fadeIn faster"
      style="background: rgba(0,0,0,.4);"
    >
      <div
        class="border border-blue-500 modal-container bg-white w-4/12 md:max-w-11/12 mx-auto rounded-xl shadow-lg z-50 overflow-y-auto"
      >
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-xl font-bold text-gray-500">編輯</p>
            <div
              class="cursor-pointer modal-close z-100"
              @click="toggleEditTicket"
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
                    >Ticket Name</label
                  >
                </div>
                <div class="">
                  <input
                    v-model="ticketDraft.name"
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
                @click="toggleEditTicket"
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
      v-if="isDeleteTicket"
      class="cursor-auto main-modal fixed w-full inset-0 z-100 overflow-hidden flex justify-center items-center animated fadeIn faster"
      style="background: rgba(0,0,0,.4);"
    >
      <div
        class="border border-blue-500 modal-container bg-white w-4/12 md:max-w-11/12 mx-auto rounded-xl shadow-lg z-50 overflow-y-auto"
      >
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-xl font-bold text-gray-500"></p>
            <div
              class="cursor-pointer modal-close z-100"
              @click="toggleDeleteTicket"
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
            <p class="font-medium text-lg">確定要刪除？</p>
          </div>
          <!--Footer-->
          <div class="flex justify-center">
            <button
              @click="toggleDeleteTicket"
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
  components: { VerticalDots },
  props: {
    ticket: {
      type: Object,
      require: true,
    },
    kanbanId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      isEditMenu: false,
      isEditTicket: false,
      isDeleteTicket: false,
      ticketDraft: Object.assign({}, this.ticket),
    };
  },
  methods: {
    submitDelete() {
      this.$store
        .dispatch("deleteTicket", {
          kanbanId: this.kanbanId,
          columnId: this.ticket.column_id,
          ticketId: this.ticket.id,
        })
        .then(() => {
          this.isDeleteTicket = false;
        });
    },
    submitEdit(event) {
      this.$store
        .dispatch("editTicket", {
          kanbanId: this.kanbanId,
          ...this.ticketDraft,
        })
        .then(() => {
          this.isEditTicket = false;
        });
    },
    toggleDeleteTicket() {
      this.isDeleteTicket = !this.isDeleteTicket;
      this.isEditMenu = false;
    },
    toggleEditTicket() {
      this.isEditTicket = !this.isEditTicket;
      this.isEditMenu = false;
    },
    toggleIsEdit() {
      this.isEditMenu = !this.isEditMenu;
    },
  },
};
</script>

<style lang="scss" scoped></style>
