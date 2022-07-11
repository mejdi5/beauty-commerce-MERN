const express = require('express')
const app = express()
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require('morgan')
const path = require('path')


dotenv.config();
//database connection
mongoose
    .connect(process.env.MONGO_URI) 
    .then(() => console.log("Database connected.."))
    .catch((error) => {
    console.log(error, "Database is not connected..");
});

app.use(cors())
app.use(express.json())
app.use(morgan("dev"));

app.use('/public', express.static('public'));
app.use("/api/product-images", require('./back-end/routes/productImage'));
app.use("/api/images", require('./back-end/routes/userImage'));
app.use("/api/auth", require("./back-end/routes/auth"));
app.use("/api/forgot-password", require("./back-end/routes/forgotPassword"));
app.use("/api/users", require("./back-end/routes/user"));
app.use("/api/products", require("./back-end/routes/product"));
app.use("/api/carts", require("./back-end/routes/cart"));
app.use("/api/orders", require("./back-end/routes/order"));
app.use("/api/checkout", require("./back-end/routes/stripe"));

//deploy
    app.use(express.static('front-end/build'));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'front-end', 'build', 'index.html'));
    });


app.listen(process.env.PORT || 5000, () => {
    console.log("server is running!!");
});