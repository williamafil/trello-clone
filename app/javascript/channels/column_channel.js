import consumer from "./consumer";
console.log("Connecting to Kanban Channel...");

document.addEventListener("turbolinks:load", function() {
  consumer.subscriptions.create(
    {
      channel: "ColumnChannel",
      // kanban_id: Number(document.querySelector("#column").dataset["kanbanid"]),
    },
    {
      connected() {
        console.log("Kanban Channel is connected!");
      },
      disconnected() {
        console.log("Kanban Channel is disconnected!");
      },
      received(data) {
        if (data.commit) {
          console.log("kanban channel.commit: ", data.commit);
          window.$store.commit(data.commit, data.payload);
        }
      },
    },
  );
});
