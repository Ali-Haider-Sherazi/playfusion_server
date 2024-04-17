const findModel = require("../models/findplayerModel");

const delFindController = async (req, res) => {
    try {
    const findId = req.params.Id; // Assuming productId is passed as a route parameter

    // Check if productId is provided
    if (!findId) {
        return res.status(400).send({
        success: false,
        message: "Preference ID is required",
        });
    }

    // Find the product by ID and delete it
    const deletedFind = await findModel.findByIdAndDelete(findId);

    // Check if the product exists
    if (!deletedFind) {
        return res.status(404).send({
        success: false,
        message: "Preference not found",
        });
    }

    return res.status(200).send({
        success: true,
        message: "Prefrence deleted successfully",
        deletedFind: deletedFind,
    });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
        success: false,
        message: "Error in Delete Find API",
        error: error.message,
    });
    }
};

module.exports = {
    delFindController,
};
