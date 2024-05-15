const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const paymentInfoSchema = new mongoose.Schema({
  accountTitle: {
    type: String,
    required: [true, "Enter Account Title"],
  },
  accountNumber: {
    type: String,
    required: [true, "Enter Account Number"],
  },
  bankName: {
    type: String,
    required: [true, "Enter Bank Name"],
  },
});

const arenaSchema = new mongoose.Schema(
  {
    titleImage: {
      type: String,
      required: [true, "Enter Arena's Title Image"], 
    },
    images: {
      type: Array,
      required: [true, "Enter Arena's Images (Atleast 3)"],
       
    },
    name: {
      type: String,
      required: [true, "Enter Arena's Name"],
       
    },
    vendorId: {
      type: String,
      required: [true, "Enter Vendor ID"],       
    },
    city:{
      type: String,
      required: [true, "Enter Arena's City"],
    },
    address: {
      type: String,
      required: [true, "Enter Arena's Address"],
    },
    description: {
      type: String,
      required: [true, "Enter Arena's Description"],
    },
    ameneties: {
      type: Array,
      required: [true, "Enter Arena's Ameneties"],
    },
    sports: {
      type: Array,
      required: [true, "Whats game play in the Arena"],
    },
    price: {
      type: Number,
      required: [true, "What is the hourly charge"],
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    orders: {
      type: Array,
      required: [false, "Default Orders 0"],
    },
    isActive: {
      type: Boolean,
      required: [true, "Is Arena Active"],
    },
    courts: {
      type: Number,
      required: [true, "Enter Number of Courts"],
    },
    paymentInfo: {
      type: paymentInfoSchema,
      required: [true, "Enter Payment Information"],
    },
  },
  { timestamps: true }
 
);

module.exports = mongoose.model("Arena", arenaSchema);