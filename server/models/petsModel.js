const mongoose = require("mongoose");
const petSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    reportType: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
      required: true,
    },
    name: {
      type: String,
    },
    species: {
      type: String,
    },
    breed: {
      type: String,
    },
    color: {
      type: String,
    },
    location: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
      address: {
        type: String,
      },
    },
    info: {
      type: String,
    },
    img: {
      type: String,
    },
    favorite: {
      type: Array,
    },
    comments: [
      {
        text: {
          type: String,
        },
        avatar: {
          type: String,
        },
        username: {
          type: String,
        },
        userId: {
          type: String,
        },
      },
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Pet", petSchema);
//module.exports ={Pet}
