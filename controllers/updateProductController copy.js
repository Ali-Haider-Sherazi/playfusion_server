const productModel = require("../models/productModel");

const updateProductController = async (req, res) => {
  try {
    const productId = req.params.productId; // Assuming productId is passed as a route parameter

    // Find the product by ID
    const product = await productModel.findById(productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Update the product details
    product.type = req.body.type;
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.condition = req.body.condition;
    product.location = req.body.location;
    product.img = req.body.img;
    product.delist = req.body.delist;

    // Save the updated product
    const updatedProduct = await product.save();

    return res.status(200).send({
      success: true,
      message: "Product updated successfully",
      updatedProduct: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Update Product API",
      error: error.message,
    });
  }
};

module.exports = {
  updateProductController,
};
