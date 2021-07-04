import consumer from "./consumer";
console.log("連線中...");

document.addEventListener('turbolinks:load', function () {
  consumer.subscriptions.create({
    channel: "ColumnChannel",
    kanban_id: Number(document.querySelector('#column').dataset['kanbanid']),
  }, {
    connected() {
      console.log("連線成功!");
    },
    disconnected() {
      console.log("已斷線");
    },
    received(data) {
      console.log("這裡是 column channel");
      console.log("data: ", data);
      if (data.commit) {
        console.log("data.commit: ", data.commit);
        window.$store.commit(data.commit, data.payload);
      }
    },
  });
});


// consumer.subscriptions.create({
//   channel: "ColumnChannel",
// }, {
//   connected() {
//     console.log("連線成功!");
//   },
//   disconnected() {
//     console.log("已斷線");
//   },
//   received(data) {
//     console.log("這裡是 column channel");
//     console.log("data: ", data);
//     if (data.commit) {
//       console.log("data.commit: ", data.commit);
//       window.$store.commit(data.commit, data.payload);
//     }
//   },
// });
