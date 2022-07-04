const express = require('express')
const app = express()
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require('morgan')


dotenv.config();
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
app.use("/api/product-images", require('./routes/productImage'));
app.use("/api/images", require('./routes/userImage'));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/forgot-password", require("./routes/forgotPassword"));
app.use("/api/users", require("./routes/user"));
app.use("/api/products", require("./routes/product"));
app.use("/api/carts", require("./routes/cart"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/checkout", require("./routes/stripe"));


app.listen(process.env.PORT || 5000, () => {
    console.log("server is running!!");
});