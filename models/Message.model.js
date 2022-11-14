const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const messageSchema = new Schema(
  {
    author: {},
    content: {
      type: String,
      required: true,
      unique: true,
    },
    chatroom: {
      type: Schema.Types.ObjectId,
      ref: "Chatroom",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);

module.exports = User;
