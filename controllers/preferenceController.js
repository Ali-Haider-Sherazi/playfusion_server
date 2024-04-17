const preferenceModel = require("../models/preferenceModel");
//FindPlayer
const preferenceController = async (req, res) => {
    try {
    const { start, end, location, userId} = req.body;
    console.log("req.body is ",req.body);
    console.log(location);

    //validation
    if  (!start) {
        return res.status(400).send({
        success: false,
        message: "Start Time is required",
        });
    }
    else if  (!end) {
        return res.status(400).send({
        success: false,
        message: "End Time is required",
        });
    }
    else if  (!location) {
        return res.status(400).send({
        success: false,
        message: "Location is required",
        });
    }
    else if  (!userId) {
        return res.status(400).send({
        success: false,
        message: "User id is required",
        });
    }

    //save users preference
    const preference = await preferenceModel({
        start, end, location, userId
    }).save();

    return res.status(201).send({
        success: true,
        message: "user preference for find player Added Successfull.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
        success: false,
        message: "Error in Adding user preference for Find Player API",
        error,
        });
    }
};


module.exports = {
    preferenceController,
};

