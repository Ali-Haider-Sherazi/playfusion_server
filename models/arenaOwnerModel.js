const mongoose = require("mongoose");

const arenaOwnerSchema = new mongoose.Schema(
  {
    ownerID: {
      type: String,
      required: [true, "Enter Owner's ID"], 
    },
    arenas: {
      type: Array,
      required: [false, "Enter Arena's ID"],
       
    },
  },
  { timestamps: true }
 
);

module.exports = mongoose.model("ArenaOwner", arenaOwnerSchema);