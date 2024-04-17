const preferenceModel = require("../models/preferenceModel");

const delPreferenceController = async (req, res) => {
    try {
    const preferenceId = req.params.Id; // Assuming productId is passed as a route parameter

    // Check if productId is provided
    if (!preferenceId) {
        return res.status(400).send({
        success: false,
        message: "Preference ID is required",
        });
    }

    // Find the product by ID and delete it
    const deletedPreference = await preferenceModel.findByIdAndDelete(preferenceId);

    // Check if the product exists
    if (!deletedPreference) {
        return res.status(404).send({
        success: false,
        message: "Preference not found",
        });
    }

    return res.status(200).send({
        success: true,
        message: "Prefrence deleted successfully",
        deletedPreference: deletedPreference,
    });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
        success: false,
        message: "Error in Delete Preference API",
        error: error.message,
    });
    }
};

module.exports = {
    delPreferenceController,
};
