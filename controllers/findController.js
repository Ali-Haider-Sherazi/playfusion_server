const findModel = require("../models/findplayerModel");
//FindPlayer
const findController = async (req, res) => {
    try {
    const { sport, players, arena, start, end, date, location, userId} = req.body;
    console.log("req.body is ",req.body);
    console.log(arena);

    //validation
    if  (!players) {
        return res.status(400).send({
        success: false,
        message: "Number of Players is required",
        });
    }
    else if  (!arena) {
        return res.status(400).send({
        success: false,
        message: "Arena Name is required",
        });
    }
    else if  (!start) {
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
    else if  (!date) {
        return res.status(400).send({
        success: false,
        message: "Date is required",
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
        message: "SellerId is required",
        });
    }
    else if  (!sport) {
        return res.status(400).send({
        success: false,
        message: "Sport is required",
        });
    }

    //save find player requirement
    const findPlayer = await findModel({
        players, arena, start, end, date, location, userId, sport
    }).save();

    return res.status(201).send({
        success: true,
        message: "Find Player Requirement Added Successfull.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
        success: false,
        message: "Error in Adding Find Player requirement API",
        error,
        });
    }
};


module.exports = {
    findController,
};

