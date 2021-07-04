import consumer from "./consumer";
console.log("flash channel 連線中...");

consumer.subscriptions.create({
  channel: "FlashChannel",
}, {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("flash channel 連線成功!");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
    console.log("flash channel 已斷線");
  },

  received(flashData) {
    // Called when there's incoming data on the websocket for this channel
    console.log("這裡是 flash channel ");
    console.log("flashData: ", flashData);

    if (flashData.commit) {
      console.log("data.commit: ", flashData.commit);
      window.$store.commit(flashData.commit, flashData.payload);
    }
  },
});
