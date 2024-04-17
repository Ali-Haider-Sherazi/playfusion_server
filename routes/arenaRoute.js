const express = require("express");
const { addArenaController } = require("../controllers/arenaController");
const {bookingController} = require("../controllers/bookingController");
const {addProductController} = require("../controllers/productController");
const {delproductController} = require("../controllers/delproductController");
const {updateProductController} = require("../controllers/updateProductController");
//router object
const router = express.Router();

//routes
// REGISTER || POST
router.post("/addArena", addArenaController);
router.post("/booking", bookingController);
router.post("/addProduct", addProductController);

// DELETE || DELETE
router.delete("/deleteProduct/:productId", delproductController);

// UPDATE || PUT
router.put("/updateProduct/:productId", updateProductController);

//export
module.exports = router;




// LOGIN || POST
//router.post("/login", loginController);

//UPDATE || PUT
//router.put("/update-Arena", requireSingIn, updateArenaController);
