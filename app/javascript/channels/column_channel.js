import consumer from "./consumer";
console.log("連線中...");

consumer.subscriptions.create("ColumnChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("連線成功!");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
    console.log("已斷線");
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    console.log("這裡是 column channel");
    console.log("data: ", data);

    if (data.commit) {
      console.log("data.commit: ", data.commit);
      window.$store.commit(data.commit, data.payload);
    }
  },
});
