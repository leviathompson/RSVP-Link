const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    contactMethods: {
      emails: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
          },
          address: {
            type: String,
            required: false,
            unique: false,
          },
        },
      ],
      phones: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
          },
          number: {
            type: String,
            required: false,
            unique: false,
          },
        },
      ],
    },
  },
  { strictQuery: false }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
