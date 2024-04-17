
const arenaModel = require("../models/arenaModel");

const updateArenaController = async (req, res) => {
  try {
    const  arenaId  = req.params.arenaId; // Get the arenaId from the URL params
    
    // Find the product by ID
    const arena = await arenaModel.findById(arenaId);

    // Check if the product exists
    if (!arena) {
      return res.status(404).send({
        success: false,
        message: "Arena not found",
      });
    }
    
    // log("arenaId is ",arenaId);

    // Update the arena details

    arena._id = _id;
    arena.name = req.body.title;
    arena.vendorId = req.body.OwnerId;
    arena.city = req.body.location;
    arena.address = req.body.address;
    arena.description = req.body.description;
    arena.ameneties = req.body.facilities;
    arena.sports = req.body.sports;
    arena.price = req.body.price;
    arena.reviews = req.body.reviews;
    arena.orders = req.body.orders;
    arena.isActive = req.body.isActive;
    arena.titleImage = req.body.titleImage;
    arena.images = req.body.images;

    const updatedArena = await arena.save();

    return res.status(200).send({
      success: true,
      message: "Arena updated successfully",
      updatedArena: updatedArena,
    });
  } catch (error) {
    // console.log(error.response.data);
    return res.status(500).send({
      success: false,
      message: "Error in Update Arena API",
      error: error.message,
      data: error.message.data
    });
  }
};
//     console.log("req.body is ",req.body);
    
//     const filter = { _id: arenaId };
//     const update = updatedData;

// const updatedArena = await arenaModel.findOneAndUpdate(filter, {$set:{ name: req.body.name, vendorId: req.body.vendorId, city: req.body.city, address: req.body.address, description: req.body.description, ameneties: req.body.ameneties, sports: req.body.sports, price: req.body.price, reviews: req.body.reviews, orders: req.body.orders, isActive: req.body.isActive, titleImage: req.body.titleImage, images: req.body.images }}, { new: true });

//     if (!updatedArena) {
//       return res.status(404).send({
//         success: false,
//         message: "Arena not found",
//       });
//     }

//     return res.status(200).send({
//       success: true,
//       message: "Arena updated successfully",
//       updatedArena,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: 'Error in Update Arena API',
//       error,
//     });
//   }
// };

module.exports = {
  updateArenaController,
};
