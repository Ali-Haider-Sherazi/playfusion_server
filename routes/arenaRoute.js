const express = require("express");
const { pendingArenaController } = require("../controllers/pendingArenaController");
const { addArenaController } = require("../controllers/arenaController");
const {updateArenaController} = require("../controllers/updateArenaController");
const {bookingController} = require("../controllers/bookingController");
const {addProductController} = require("../controllers/productController");
const {delproductController} = require("../controllers/delproductController");
const {updateProductController} = require("../controllers/updateProductController");
const {findController} = require("../controllers/findController");
const {preferenceController} = require("../controllers/preferenceController");
const {matchFindController} = require("../controllers/matchFindController");
const {updateMatchFindController} = require("../controllers/updateMatchFindController");
const {updatePreferenceController} = require("../controllers/updatePreferenceController");
const {delPreferenceController} = require("../controllers/deletePreferenceController");
const {delFindController} = require("../controllers/deleteFindController");
const {delMatchFindController} = require("../controllers/deleteMatchFindController");
//router object
const router = express.Router();

//routes
// REGISTER || POST
router.post("/addPendingArena", pendingArenaController);
router.post("/addArena", addArenaController);
router.post("/booking", bookingController);
router.post("/addProduct", addProductController);
router.post("/find", findController);
router.post("/preference", preferenceController);
router.post("/matchFind", matchFindController);

// DELETE || DELETE
router.delete("/deleteProduct/:productId", delproductController);
router.delete("/deletePreference/:Id", delPreferenceController);
router.delete("/deleteFind/:Id", delFindController);
router.delete("/deleteMatchFind/:Id", delMatchFindController);

// UPDATE || PUT
router.put("/updateProduct/:productId", updateProductController);
router.put("/updateMatchFind/:matchId", updateMatchFindController);
router.put("/updatePreference/:Id", updatePreferenceController);
router.put("/updateArena/:arenaId", updateArenaController);
//export
module.exports = router;




// LOGIN || POST
//router.post("/login", loginController);

//UPDATE || PUT
//router.put("/update-Arena", requireSingIn, updateArenaController);
