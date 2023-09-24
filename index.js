require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
// import body parser
const bodyParser = require("body-parser");

// create express app
const app = express();

// setup the server port
const port = process.env.APP_PORT || 3000;

// parse request data content type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse request data content type application/x-www-form-urlencoded
app.use(bodyParser.json());
// console.log("body", bodyParser.json());

// For handling form-data (multipart/form-data)
const upload = multer();
app.use(upload.any());
// view qrcode image in browser
app.use(express.static(path.join(__dirname, 'src', 'public', 'authQrCodes')));


// define root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Import the scheduler file
require("./src/services/schedulers.js");

// import routes
const categoryRoutes = require("./src/routes/categoryRoute");
const userRoutes = require("./src/routes/userRoute");
const postRoutes = require("./src/routes/postRoute");

// create employee routes
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);

// listen the port
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
