const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    arenaID: {
      type: String,
      required: [true, "Arena ID is empty. try again"], 
    },
    userID: {
      type: String,
      required: [true, "User ID is empty. try again"],
       
    },
    date: {
      type: String,
      required: [true, "Date is empty. try again"],
       
    },
    slots: {
        type: Array,
        required: [true, "Enter time and Court No is required."],
    },
    price: {
      type: String,
      required: [true, "Price is empty. try again"],
       
    },
    status: {
      type: String,
      required: [true, "Status is empty. try again"],
       
    },
    image: {
      type: String,
      required: [true, "Image is empty. try again"],
       
    },
    
  },
  { timestamps: true }
 
);
//lowe this and add 's' in the end
module.exports = mongoose.model("BookingDetail", bookingSchema);