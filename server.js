const express = require("express");
const { ObjectId } = require('mongodb');

const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const bodyParser = require('body-parser');
const cron = require('node-cron');
const moment = require('moment');
const fetch = require('node-fetch');
const axios = require('axios');
// Import models
const PendingArena = require("./models/pendingArenaModel");
const Arena = require("./models/arenaModel");
const BookingDetail = require('./models/bookingModel');
const Product = require("./models/productModel");
const Find = require("./models/findplayerModel");
const Preference = require("./models/preferenceModel");
const Match = require("./models/matchFindModel");




//DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

//REST OBJECT
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));



//ROUTES
app.use("/api/playfusion", require("./routes/arenaRoute"));




// Update the function to handle the PATCH request
async function updateArenaBookings(req, res) {
  try {
    // Fetch the arena bookings
    const response = await fetch('https://playfusion-server.onrender.com/api/playfusion/activeBookings');
    const bookings = await response.json();

    // Get the current date
    const currentDate = moment().format('YYYY-MM-DD');

    // Loop through the bookings
    for (const booking of bookings) {
      if (booking.status === 'active') {
        // Check if the booking date has passed
        if (moment(booking.date, 'DD-MMM-YYYY').isBefore(currentDate)) {
          // Update the booking status to 'completed'
          await fetch(`https://playfusion-server.onrender.com/api/playfusion/setStatus/${booking._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
          });
          console.log(`Booking ${booking._id} completed.`);
        }
      }
    }

    console.log('Update completed.');
    
  } catch (error) {
    console.error('Error updating arena bookings:', error);
    
  }
}




// Calculate the cron schedule for running after 1 minute from now
var now = new Date();
var minutes = now.getMinutes() + 1;
var schedule = `${minutes} ${now.getHours()} ${now.getDate()} ${now.getMonth() + 1} *`;

// Schedule the function to run after 1 minute
cron.schedule('0 */1 * * *', () => {
  console.log('Running updateArenaBookings...');
  updateArenaBookings();
});

// Schedule a task to run every 5 minutes
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Find all pending bookings older than 48 hours
    const outdatedPendingBookings = await BookingDetail.find({
      status: 'pending',
      createdAt: { $lt: fortyEightHoursAgo },
    });

    // Update their status to 'cancelled'
    const updateResults = await BookingDetail.updateMany(
      { _id: { $in: outdatedPendingBookings.map(booking => booking._id) } },
      { $set: { status: 'rejected' } }
    );

    console.log(`Cancelled ${updateResults.modifiedCount} outdated pending bookings.`);
  } catch (error) {
    console.error('Error updating outdated pending bookings:', error);
  }
});

// Top 2 arenas based on reviews
app.get('/api/playfusion/topArenas', async (req, res) => {
  try {
    // Fetch the top 2 arenas based on reviews
    const topTwoArenas = await Arena.find({})
      .sort({ review: -1 }) // Sort in descending order based on review
      .limit(2); // Limit to the top 2 results

    // Respond with the top two arenas
    res.json(topTwoArenas);
  } catch (error) {
    console.error('Error fetching top arenas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Top Two Cricket
app.get('/api/playfusion/topCricketArenas', async (req, res) => {
  try {
    // Fetch the top 2 arenas with "Cricket" in the sports array
    const topCricketArenas = await Arena.find({
      sports: { $elemMatch: { $eq: "Cricket" } }
    })
      .sort({ review: -1 }) // Sort in descending order based on review
      .limit(2); // Limit to the top 2 results

    // Respond with the top two cricket arenas
    res.json(topCricketArenas);
  } catch (error) {
    console.error('Error fetching top cricket arenas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//All Cricket
app.get('/api/playfusion/Cricket', async (req, res) => {
  try {
    // Fetch the top 2 arenas with "Cricket" in the sports array
    const cricket = await Arena.find({
      sports: { $elemMatch: { $eq: "Cricket" } }
    })

    // Respond with the top two cricket arenas
    res.json(cricket);
  } catch (error) {
    console.error('Error fetching cricket arenas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//All Futsal
app.get('/api/playfusion/Futsal', async (req, res) => {
  try {
    // Fetch the top 2 arenas with "Cricket" in the sports array
    const Futsal = await Arena.find({
      sports: { $elemMatch: { $eq: "Futsal" } }
    })

    // Respond with the top two cricket arenas
    res.json(Futsal);
  } catch (error) {
    console.error('Error fetching  Futsal arenas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Gaming Futsal
app.get('/api/playfusion/Gaming', async (req, res) => {
  try {
    // Fetch the top 2 arenas with "Cricket" in the sports array
    const Futsal = await Arena.find({
      sports: { $elemMatch: { $eq: "Gaming Zone" } }
    })

    // Respond with the top two cricket arenas
    res.json(Futsal);
  } catch (error) {
    console.error('Error fetching  Gaming zone:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//All
app.get('/api/playfusion/all', async (req, res) => {
  try {
    // Fetch all arenas with "Gaming Zone" in the sports array
    const allArena = await Arena.find({})

    // Respond with all gaming zone arenas
    res.json(allArena);
  } catch (error) {
    console.error('Error fetching all Arena:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Pending Arenas
app.get('/api/playfusion/pendingArenas', async (req, res) => {
  try {
    // Fetch all arenas with "Gaming Zone" in the sports array
    const allArena = await PendingArena.find({})

    // Respond with all gaming zone arenas
    res.json(allArena);
  } catch (error) {
    console.error('Error fetching all  Pending Arenas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Delete Specific Pending Arena
app.delete('/api/playfusion/deletePendingArena/:arenaId', async (req, res) => {
  const { arenaId } = req.params;

  try {
    const result = await PendingArena.findOneAndDelete({ _id: arenaId });

    if (!result) {
      return res.status(404).send('Pending Arena not found');
    }

    res.send(`Pending Arena with id ${arenaId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting pending arena:', error); // Log the error for debugging
    res.status(500).send('Internal Server Error'); // Provide a more informative error message
  }
});

//Fetching single Arena Detail:
app.get('/api/playfusion/all/:arenaID', async (req, res) => {
  try {
    // Extract the arenaID from the request parameters
    const { arenaID } = req.params;

    // Check if arenaID is a valid ObjectId
    if (!ObjectId.isValid(arenaID)) {
      return res.status(400).json({ error: 'Invalid arena ID' });
    }

    // Convert arenaID to ObjectId
    const objectIdArenaID = new ObjectId(arenaID);

    // Fetch the arena with the provided arenaID
    const arena = await Arena.findOne({ _id: objectIdArenaID });

    // If arena is found, respond with the arena data
    if (arena) {
      console.log('Hit successfully')
      return res.json(arena);
    } else {
      // If no arena is found with the provided ID, respond with a 404 status
      return res.status(404).json({ error: 'Arena not found' });
    }
  } catch (error) {
    console.error('Error fetching arena by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


//get all arenas under a specific user id 
app.get('/api/playfusion/userArenas/:userID', async (req, res) => {
  try {
    const { userID } = req.params;

    // Find all arenas with vendorId equal to userID
    const arenas = await Arena.find({ vendorId: userID });

    // If no arenas are found, respond with a 404 status
    if (!arenas || arenas.length === 0) {
      return res.status(404).json({ error: 'No arenas found for this user' });
    }

    // Respond with the found arenas
    res.status(200).json({ success: true, data: arenas });
  } catch (error) {
    console.error('Error fetching arenas by vendorId:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//To show Booking slot available or not
app.get('/api/playfusion/slots', async (req, res) => {
  try {
    // Extracting query parameters from the request
    const { arenaID, date } = req.query;

    // Building the filter object based on provided parameters
    const filter = {};
    if (arenaID) filter.arenaID = arenaID;
    if (date) filter.date = date;
    // Add filter for status not equal to "rejected"
    filter.status = { $ne: 'rejected' };

    // Fetching bookings based on the filter
    const bookings = await BookingDetail.find(filter);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

//fetch those where status of slot is 1-booked 2-pending 
// Route to fetch slots based on userID and status
app.get('/api/playfusion/slots/:userID/:status', async (req, res) => {
  try {
    // Extracting parameters from the request
    const { userID, status } = req.params;

    // Building the filter object based on provided parameters
    const filter = {};
    if (userID) filter.userID = userID;
    if (status) filter.status = status;

    // Fetching slots based on the filter and sorting by createdAt timestamp
    const slots = await BookingDetail.find(filter).sort({ 'createdAt': -1 });

    res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});



// Endpoint to filter arenas
// Endpoint to filter arenas
app.get('/api/playfusion/arenas', async (req, res) => {
  try {
    let query = {};

   if (req.query.sportType && req.query.sportType !== 'all') {
      query.sports = req.query.sportType;
    }
    // Filter by location
    if (req.query.location) {
      query.city = req.query.location;
    }

    // Filter by price range
    if (req.query.minPrice && req.query.maxPrice) {
      const minPrice = parseInt(req.query.minPrice);
      const maxPrice = parseInt(req.query.maxPrice);
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    app.get('/api/playfusion/arenas', async (req, res) => {
  try {
    let query = {};

    // Filter by sportType
    if (req.query.sportType) {
      query.sports = req.query.sportType;
    }

    // Filter by location
    if (req.query.location) {
      query.city = req.query.location;
    }

    // Filter by price range
    if (req.query.minPrice && req.query.maxPrice) {
      const minPrice = parseInt(req.query.minPrice);
      const maxPrice = parseInt(req.query.maxPrice);
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (req.query.reviews) {
      // Fetch all documents from the database
      const docs = await Arena.find(query);
      console.log('docs is ',docs)
      

      // Extract review ratings from all documents
      const reviewRatings = docs.reduce((acc, doc) => {
        return acc.concat(doc.reviews.map(review => review.rating));
      }, []);
      console.log('reviewRatings is ',reviewRatings)

      // Calculate the average rating
      const averageRating = reviewRatings.reduce((acc, rating) => acc + rating, 0) / reviewRatings.length;
      console.log('averageRating is ',averageRating)

      // Determine the range based on the average rating
      if (averageRating >= 4) {
        query['reviews.rating'] = { $gte: 4, $lte: 5 };
      } else if (averageRating >= 3) {
        query['reviews.rating'] = { $gte: 3, $lt: 4 };
      } else {
        query['reviews.rating'] = { $gte: 0, $lt: 3 };
      }
    }

    const arenas = await Arena.find(query);
    res.json(arenas);
  } catch (error) {
    console.error('Error fetching arenas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


    const arenas = await Arena.find(query);
    res.json(arenas);
  } catch (error) {
    console.error('Error fetching arenas:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Update Arena
app.patch('/api/playfusion/updateArena/:arenaId', async (req, res) => {
  try {
    console.log('You are going to hit it...')
    const { arenaId } = req.params;
    let newid = arenaId;
    newid = new ObjectId(newid);
    const updatedData = req.body;

    // Find the arena by ID and update it
    const updatedArena = await Arena.findByIdAndUpdate({ _id: newid }, {courts: req.body.courts, isActive: req.body.isActive, price: req.body.price, sports: req.body.sports, ameneties: req.body.facilites,description: req.body.description, address: req.body.address, city:req.body.location,vendorId: req.body.ownerID, name: req.body.title ,titleImage: req.body.titleImage, images: req.body.images, paymentInfo: req.body.paymentInfo}, { new: true });
    console.log('price at server is ',req.body.price)
    // If no arena is found with the provided ID, respond with a 404 status
    if (!updatedArena) {
      return res.status(404).json({ error: 'Arena not found' });
    }

    // Respond with the updated arena
    res.status(200).json({
      success: true,
      updatedArena,
    });
  } catch (error) {

    console.error('Error updating arena:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});


// Update Arena Images
app.patch('/api/playfusion/updateArenaImages/:arenaId', async (req, res) => {
  try {
    const { arenaId } = req.params;
    let newid = arenaId;
    newid = new ObjectId(newid);
    const updatedData = req.body;

    // Find the arena by ID and update it
    const updatedArena = await Arena.findByIdAndUpdate({ _id: newid }, {titleImage: req.body.titleImage, images: req.body.images}, { new: true });

    // If no arena is found with the provided ID, respond with a 404 status
    if (!updatedArena) {
      return res.status(404).json({ error: 'Arena not found' });
    }

    // Respond with the updated arena
    res.status(200).json({
      success: true,
      updatedArena,
    });
  } catch (error) {
    console.error('Error updating arena:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

// Update Pending Arena Images
app.patch('/api/playfusion/updatePendingArenaImages/:arenaId', async (req, res) => {
  try {
    const { arenaId } = req.params;
    let newid = arenaId;
    newid = new ObjectId(newid);
    const updatedData = req.body;

    // Find the arena by ID and update it
    const updatedArena = await PendingArena.findByIdAndUpdate({ _id: newid }, {titleImage: req.body.titleImage, images: req.body.images}, { new: true });

    // If no arena is found with the provided ID, respond with a 404 status
    if (!updatedArena) {
      return res.status(404).json({ error: 'Pending Arena not found' });
    }

    // Respond with the updated arena
    res.status(200).json({
      success: true,
      updatedArena,
    });
  } catch (error) {
    console.error('Error updating pending arena images:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});


//Check Booking Status for Reviews
app.get('/api/playfusion/checkBookingStatus/:arenaId/:userId', async (req, res) => {
  try {
    const { arenaId, userId } = req.params;

    // Find a booking with the provided arenaId, userId, and status="completed"
    const booking = await BookingDetail.findOne({
      arenaID: arenaId,
      userID: userId,
      status: 'completed'
    });

    if (booking) {
      return res.status(200).json({ success: true, message: 'Completed Booking Exists' });
    } else {
      return res.status(404).json({ success: false, message: 'Booking not found or not completed' });
    }
  } catch (error) {
    console.error('Error checking booking status:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// Add Review
app.post('/api/playfusion/addReview/:arenaId', async (req, res) => {
  try {
    const { arenaId } = req.params;
    const { rating, comment, username } = req.body;

    // Find the arena by ID
    const arena = await Arena.findById(arenaId);

    // If the arena is not found, return a 404 status
    if (!arena) {
      return res.status(404).json({ error: 'Arena not found' });
    }

    // Add the review to the arena's reviews array
    arena.reviews.push({
      rating,
      comment,
      username
    });

    // Save the updated arena
    await arena.save();

    // Respond with a success message
    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all completed bookings
app.get('/api/playfusion/completedBookings', async (req, res) => {
  try {
    // Fetch all bookings with status="completed"
    const completedBookings = await BookingDetail.find({ status: 'completed' });

    // Respond with the completed bookings
    res.json(completedBookings);
  } catch (error) {
    console.error('Error fetching completed bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all pending bookings
app.get('/api/playfusion/pendingBookings', async (req, res) => {
  try {
    // Fetch all bookings with status="pending"
    const pendingBookings = await BookingDetail.find({ status: 'pending' });

    // Respond with the pending bookings
    res.json(pendingBookings);
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all active bookings
app.get('/api/playfusion/activeBookings', async (req, res) => {
  try {
    // Fetch all bookings with status="active"
    const activeBookings = await BookingDetail.find({ status: 'active' });

    // Respond with the active bookings
    res.json(activeBookings);
  } catch (error) {
    console.error('Error fetching active bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all active bookings
app.get('/api/playfusion/cancelBookings', async (req, res) => {
  try {
    // Fetch all bookings with status="active"
    const activeBookings = await BookingDetail.find({ status: 'cancelled' });

    // Respond with the active bookings
    res.json(cancelledByUserBookings);
  } catch (error) {
    console.error('Error fetching user cancelled bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Find Product by ID 
app.get('/api/playfusion/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Fetch product by ID
    const product = await Product.findById(productId);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Respond with the product
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//All Products
app.get('/api/playfusion/allproduct', async (req, res) => {
  try {
    // Fetch all products
    const allProduct = await Product.find({})

    // Respond with all products
    res.json(allProduct);
  } catch (error) {
    console.error('Error fetching all Arena:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// All Products minus delisted products
app.get('/api/playfusion/allproductdelisted', async (req, res) => {
  try {
    // Fetch all products excluding delisted ones
    const allProduct = await Product.find({ delist: { $ne: true } });

    // Respond with filtered products
    res.json(allProduct);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for filtering products
app.post('/api/playfusion/filterproduct', async (req, res) => {
  try {
    console.log('Request Body:', req.body);
  // Extract filter criteria from request body
  const { condition, location, type, minPrice, maxPrice } = req.body;

  // Your database query logic here
  let query = {}; // Initial query object

  if (type && type !== 'All') {
    query.type = type;
  }

  // If condition is provided, add it to the query
  if (condition && condition !== '') {
    query.condition = condition;
  }

  // If location is provided, add it to the query
  if (location && location !== '') {
    query.location = location;
  }

  // Add price range to the query if both minPrice and maxPrice are provided
  if (minPrice !== undefined && maxPrice !== undefined) {
    query.price = { $gte: minPrice, $lte: maxPrice };
  }

  // Perform the database query using the constructed query object
  const filteredProducts = await Product.find(query);
  // Once you have the filtered products, send the response
  res.json({ message: 'Filtered products', filteredProducts });
} catch (error) {
  console.error('Error fetching all filtered products:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
});



//All Find Player
app.get('/api/playfusion/allfindplayer', async (req, res) => {
  try {
    // Fetch all find players
    const allFindPlayer = await Find.find({})

    // Respond with all find players request
    res.json(allFindPlayer);
  } catch (error) {
    console.error('Error fetching all Find Player in server:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//All Find Player to check if user is already send request or not
app.get('/api/playfusion/allfindplayer/:id', async (req, res) => {
  Id = req.params.id;
  try {
    // Fetch all find players
    const selectedFind = await Find.find({
      userId: Id
    })

    // Respond with all find players request
    res.json(selectedFind);
  } catch (error) {
    console.error('Error fetching all Find Player in server:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//All Preference
app.get('/api/playfusion/allpreference', async (req, res) => {
  try {
    // Fetch all preference
    const allPreference = await Preference.find({})

    // Respond with all user preference for find player
    res.json(allPreference);
  } catch (error) {
    console.error('Error fetching all Preference in server:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Selected Preference
app.get('/api/playfusion/allpreference/:id', async (req, res) => {
  Id = req.params.id;
  try {
    // Fetch all preference
    const allPreference = await Preference.find({
      userId: Id
    })

    // Respond with all user preference for find player
    res.json(allPreference);
  } catch (error) {
    console.error('Error fetching all Preference in server:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//All Matched user for find player
app.get('/api/playfusion/allmatchfind', async (req, res) => {
  try {
    // Fetch all preference
    const allMatchFind = await Match.find({})

    // Respond with all user preference for find player
    res.json(allMatchFind);
  } catch (error) {
    console.error('Error fetching all match find in server:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//To give matches (matched user) for find player where user user preference is matched with find
app.get('/api/playfusion/allmatchfind/:id', async (req, res) => {
  const Id = req.params.id;

  try {
      // Find matched find player documents where the matchUserId array contains the given user ID
      const topCricketArenas = await Match.find({
        matchUserId: { $elemMatch: { $eq: Id } }
      })
      // Send the matched users as a response
      res.json({ topCricketArenas });
  } catch (error) {
      // Handle errors
      console.error('Error fetching matched find requests:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//To give matches  of matched user to original user who send the request
app.get('/api/playfusion/allmatchuser/:id', async (req, res) => {
  const Id = req.params.id;

  try {
      // Find matched find player documents where the UserId array contains the given user ID
      const topCricketArenas = await Match.find({
        userId: Id
      })
      // Send the matched users as a response
      res.json({ topCricketArenas });
  } catch (error) {
      // Handle errors
      console.error('Error fetching matched find requests:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Fetch all pending bookings
app.get('/api/playfusion/pendingBookings', async (req, res) => {
  try {
    // Fetch all bookings with status="pending"
    const pendingBookings = await BookingDetail.find({ status: 'pending' });

    // Respond with the pending bookings
    res.json(pendingBookings);
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all active bookings
app.get('/api/playfusion/activeBookings', async (req, res) => {
  try {
    // Fetch all bookings with status="active"
    const activeBookings = await BookingDetail.find({ status: 'active' });

    // Respond with the active bookings
    res.json(activeBookings);
  } catch (error) {
    console.error('Error fetching active bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Fetch all active bookings
app.get('/api/playfusion/rejectedBookings', async (req, res) => {
  try {
    // Fetch all bookings with status="active"
    const rejectedBookings = await BookingDetail.find({ status: 'rejected' });

    // Respond with the active bookings
    res.json(rejectedBookings);
  } catch (error) {
    console.error('Error fetching rejected bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update booking status
app.patch('/api/playfusion/setStatus/:bookingId', async (req, res) => {
  try {
    // Extract the status and booking ID from the request body
    const { status } = req.body;
    const { bookingId } = req.params;

    // Check if the booking ID is a valid ObjectId
    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    // Find the booking by ID and update its status
    const updatedBooking = await BookingDetail.findByIdAndUpdate(
      { _id: bookingId },
      { status },
      { new: true }
    );
 // If no booking is found with the provided ID, respond with a 404 status
    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Respond with the updated booking
    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      updatedBooking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

//Push Notification for find player
app.post('/api/playfusion/notifications', async (req, res) => {
  const { token, title, body, data } = req.body;

  try {
    const message = {
      to: token,
      sound: 'default',
      title: title || 'Notification',
      body: body || 'You have a new notification.',
      data: data || {},
    };

    const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
    });

    console.log('Expo push notification response:', response.data);

    res.status(200).send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending push notification:', error);
    res.status(500).send('Error sending push notification');
  }
});









app.use(bodyParser.json({ limit: '10mb' }));


//PORT
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello from the root!");
});

// Increase payload size limit (adjust the limit as needed)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


//listen
app.listen(PORT, () => {
  console.log(`Server Runnning ${PORT}`.bgGreen.white);
});
