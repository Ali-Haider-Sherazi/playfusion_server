const arenaModel = require("../models/arenaOwnerModel");
//addArena
const addArenaOwnerController = async (req, res) => {
  try {
    const {ownerID, arenas} = req.body;
    console.log("req.body is ",req.body);
    console.log(name);

    //validation
    if  (!ownerID) {
      return res.status(400).send({
        success: false,
        message: "Owner ID is required",
      });
    }

    //save arena
    const arenaOwner = await arenaOwnerModel({
        ownerID: ownerID,
        arenas: arenas,
    }).save();

    return res.status(201).send({
      success: true,
      message: "Arena Added Successfull.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Add Arena API",
      error,
    });
  }
};


module.exports = {
  addArenaOwnerController,
};


/*
    "vendorId": '1234',
    address: 'Block B SingPura, Lahore' ,
    description: 'This a arena which have alot of facilites and provide the best price. Book Your Slot now, we are waiting to serve you the best place to play',
    ameneties: {'wc','sport-equipment'},
    sports:{'cricket','football'},
    price: '700'
*/ 

//login -> find arena and its detail
// const loginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     //validation
//     else if  (!email || !password) {
//       return res.status(500).send({
//         success: false,
//         message: "Please Provide Email Or Password",
//       });
//     }
//     // find user
//     const user = await userModel.findOne({ email });
//     else if  (!user) {
//       return res.status(500).send({
//         success: false,
//         message: "User Not Found",
//       });
//     }
//     //match password
//     const match = await comparePassword(password, user.password);
//     else if  (!match) {
//       return res.status(500).send({
//         success: false,
//         message: "Invalid usrname or password",
//       });
//     }
//     //TOKEN JWT
//     const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // undeinfed password
//     user.password = undefined;
//     res.status(200).send({
//       success: true,
//       message: "login successfully",
//       token,
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "error in login api",
//       error,
//     });
//   }
// };

//update user->update Arena

// const updateUserController = async (req, res) => {
//   try {
//     const { name, password, email } = req.body;
//     //user find
//     const user = await userModel.findOne({ email });
//     //password validate
//     else if  (password && password.length < 6) {
//       return res.status(400).send({
//         success: false,
//         message: "Password is required and should be 6 character long",
//       });
//     }
//     const hashedPassword = password ? await hashPassword(password) : undefined;
//     //updated useer
//     const updatedUser = await userModel.findOneAndUpdate(
//       { email },
//       {
//         name: name || user.name,
//         password: hashedPassword || user.password,
//       },
//       { new: true }
//     );
//     updatedUser.password = undefined;
//     res.status(200).send({
//       success: true,
//       message: "Profile Updated Please Login",
//       updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error In User Update Api",
//       error,
//     });
//   }
// };