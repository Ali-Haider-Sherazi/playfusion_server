const matchFindModel = require("../models/matchFindModel");

const delMatchFindController = async (req, res) => {
    try {
    const matchFindId = req.params.Id; // Assuming productId is passed as a route parameter

    // Check if productId is provided
    if (!matchFindId) {
        return res.status(400).send({
        success: false,
        message: "Preference ID is required",
        });
    }

    // Find the product by ID and delete it
    const deletedMatchFind = await matchFindModel.findByIdAndDelete(matchFindId);

    // Check if the product exists
    if (!deletedMatchFind) {
        return res.status(404).send({
        success: false,
        message: "Match Find not found",
        });
    }

    return res.status(200).send({
        success: true,
        message: "Match deleted successfully",
        deletedMatchFind: deletedMatchFind,
    });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
        success: false,
        message: "Error in Delete Match Find API",
        error: error.message,
    });
    }
};

module.exports = {
    delMatchFindController,
};
