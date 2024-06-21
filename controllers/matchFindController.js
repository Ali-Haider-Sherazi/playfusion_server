const matchModel = require("../models/matchFindModel");
//Matched users for find player
const matchFindController = async (req, res) => {
    try {
    const { players, arena, start, end, date, location, userId, matchUserId, completeStatus, acceptedUserId, sport} = req.body;
    console.log("req.body is ",req.body);
    //console.log(arena);

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
    else if  (!matchUserId) {
        return res.status(400).send({
        success: false,
        message: "Matched User Id is required",
        });
    }
    else if (!completeStatus) {
        return res.status(400).send({
        success: false,
        message: "Complete Status is required",
        });
    }
    else if (!acceptedUserId) {
        return res.status(400).send({
        success: false,
        message: "Accepted User Id is required",
        });
    }
    else if  (!sport) {
        return res.status(400).send({
        success: false,
        message: "Sport is required",
        });
    }

    //save find player requirement
    const matchFind = await matchModel({
        players, arena, start, end, date, location, userId, matchUserId, completeStatus, acceptedUserId, sport
    }).save();

    return res.status(201).send({
        success: true,
        message: "Matched user find player requirements Added Successfull.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
        success: false,
        message: "Error in Adding matched user Find Player requirement API",
        error,
        });
    }
};


module.exports = {
    matchFindController,
};

