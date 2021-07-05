import consumer from "./consumer";
console.log("Connecting to Flash Channel...");

consumer.subscriptions.create(
  {
    channel: "FlashChannel",
  },
  {
    connected() {
      // Called when the subscription is ready for use on the server
      console.log("Flash Channel is connected!");
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
      console.log("Flash Channel is disconnected!");
    },

    received(flashData) {
      if (flashData.commit) {
        console.log("flash channel.commit: ", flashData.commit);
        window.$store.commit(flashData.commit, flashData.payload);
      }
    },
  },
);
