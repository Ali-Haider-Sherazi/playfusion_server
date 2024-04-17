const matchModel = require("../models/matchFindModel");

const updateMatchFindController = async (req, res) => {
  try {
    const matchId = req.params.matchId; // Assuming productId is passed as a route parameter

    // Find the match by ID
    const match = await matchModel.findById(matchId);

    // Check if the product exists
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Match not found",
      });
    }

    // Update the product details
    match.acceptedUserId = req.body.acceptedUserId;
    // Save the updated product
    const updatedProduct = await match.save();

    return res.status(200).send({
      success: true,
      message: "Match Find updated successfully",
      updatedProduct: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Update Match Find API",
      error: error.message,
    });
  }
};

module.exports = {
  updateMatchFindController,
};
