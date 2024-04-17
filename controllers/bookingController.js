const bookingModel = require("../models/bookingModel");
//addArena
const bookingController = async (req, res) => {
  try {
    const { arenaID, userID, date, slots, price, status,image } = req.body;
    console.log("req.body is ", req.body);
    //console.log(name);

    //validation
    if (!arenaID) {
      return res.status(400).send({
        success: false,
        message: "Arena ID is missing",
      });
    }
    else if (!userID) {
      return res.status(400).send({
        success: false,
        message: "User ID is missing",
      });
    }
    else if (!date) {
      return res.status(400).send({
        success: false,
        message: "Kindly Select a date",
      });
    }
    else if (!slots) {
      return res.status(400).send({
        success: false,
        message: "Time or Court is missing. Select both of them",
      });
    }
    else if (!price) {
      return res.status(400).send({
        success: false,
        message: "price is not set",
      });
    }
    else if (!status) {
      return res.status(400).send({
        success: false,
        message: "Status is not set",
      });
    }
    else if (!image) {
      return res.status(400).send({
        success: false,
        message: "Image is not set",
      });
    }
    
    //save user
    const booking = await bookingModel({
      arenaID, userID, date, slots,price,status,image
    }).save();

    return res.status(201).send({
      success: true,
      message: "Booking Request Forwarded Successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Booking Request API",
      error,
    });
  }
};


module.exports = {
  bookingController,
};


