const moongoose = require("mongoose");

const chatModel = new moongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: moongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = moongoose.model("Chat",chatModel);