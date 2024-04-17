const express = require("express");
const { ObjectId } = require('mongodb');

const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const bodyParser = require('body-parser');
// Import models
const Arena = require("./models/arenaModel");
const BookingDetail = require('./models/bookingModel');
const Product = require("./models/productModel");




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



//To show Booking slot available or not
app.get('/api/playfusion/slots', async (req, res) => {
  try {
    // Extracting query parameters from the request
    const { arenaID, date } = req.query;

    // Building the filter object based on provided parameters
    const filter = {};
    if (arenaID) filter.arenaID = arenaID;
    if (date) filter.date = date;

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