const preferenceModel = require("../models/preferenceModel");

const updatePreferenceController = async (req, res) => {
    try {
    const matchId = req.params.Id; // Assuming productId is passed as a route parameter

    // Find the match by ID
    const preference = await preferenceModel.findById(matchId);

    // Check if the product exists
    if (!preference) {
        return res.status(404).send({
        success: false,
        message: "Preference not found",
        });
    }

    // Update the product details
    preference.start = req.body.start;
    preference.end = req.body.end;
    preference.location = req.body.location;
    // Save the updated product
    const updatedProduct = await preference.save();

    return res.status(200).send({
        success: true,
        message: "Preference updated successfully",
        updatedProduct: updatedProduct,
    });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
        success: false,
        message: "Error in Update Preference API",
        error: error.message,
    });
    }
};

module.exports = {
    updatePreferenceController,
};
