const productModel = require("../models/productModel");
//addProduct
const addProductController = async (req, res) => {
  try {
    const { type, name, price, description, condition, location, sellerId, img, delist} = req.body;
    console.log("req.body is ",req.body);
    console.log(name);

    //validation
    if  (!type) {
      return res.status(400).send({
        success: false,
        message: "Product Type is required",
      });
    }
    else if  (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    else if  (!price) {
      return res.status(400).send({
        success: false,
        message: "Price is required",
      });
    }
    else if  (!description) {
      return res.status(400).send({
        success: false,
        message: "Description is required",
      });
    }
    else if  (!condition) {
      return res.status(400).send({
        success: false,
        message: "Condition is required",
      });
    }
    else if  (!location) {
        return res.status(400).send({
          success: false,
          message: "Location is required",
        });
    }
    else if  (!sellerId) {
        return res.status(400).send({
          success: false,
          message: "SellerId is required",
        });
    }
    else if  (!img) {
        return res.status(400).send({
          success: false,
          message: "Image is required",
        });
    }
  //   else if  (!delist) {
  //     return res.status(400).send({
  //       success: false,
  //       message: "delist is required",
  //     });
  // }


    //save product
    const product = await productModel({
        type, name, price, description, condition, location, sellerId, img, delist
    }).save();

    return res.status(201).send({
      success: true,
      message: "Product Added Successfull.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Add Product API",
      error,
    });
  }
};


module.exports = {
  addProductController,
};

