const productModel = require("../models/productModel");

const delproductController = async (req, res) => {
  try {
    const productId = req.params.productId; // Assuming productId is passed as a route parameter

    // Check if productId is provided
    if (!productId) {
      return res.status(400).send({
        success: false,
        message: "Product ID is required",
      });
    }

    // Find the product by ID and delete it
    const deletedProduct = await productModel.findByIdAndDelete(productId);

    // Check if the product exists
    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      deletedProduct: deletedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Delete Product API",
      error: error.message,
    });
  }
};

module.exports = {
  delproductController,
};
